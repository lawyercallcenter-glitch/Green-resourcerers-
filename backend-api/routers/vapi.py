"""Vapi.ai webhook router.

Receives call lifecycle events from Vapi.ai and automatically creates
ServiceRequest records from completed calls so dispatchers can follow up.

Webhook events handled
----------------------
assistant-request  – return the assistant configuration for inbound calls.
end-of-call-report – extract caller details from the summary and persist a
                     new ServiceRequest when enough information is present.
call-started       – logged for visibility.
call-ended         – logged for visibility.

Webhook secret
--------------
Set VAPI_WEBHOOK_SECRET in your environment to validate the
x-vapi-secret header that Vapi.ai attaches to every outbound request.
Leave it unset (or empty) during local development to skip verification.
"""

import logging
import os
from typing import Any

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session

from database import get_db
from models import ServiceRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/vapi", tags=["Vapi.ai"])

_WEBHOOK_SECRET = os.getenv("VAPI_WEBHOOK_SECRET", "")


def _verify_secret(x_vapi_secret: str | None = Header(default=None)) -> None:
    """Reject requests whose secret header does not match."""
    if _WEBHOOK_SECRET and x_vapi_secret != _WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Vapi webhook secret.",
        )


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def vapi_webhook(
    request: Request,
    db: Session = Depends(get_db),
    _: None = Depends(_verify_secret),
) -> dict[str, Any]:
    """Handle inbound Vapi.ai webhook events."""
    body: dict[str, Any] = await request.json()
    message: dict[str, Any] = body.get("message", body)
    event_type: str = message.get("type", "")

    logger.info("Vapi webhook received: type=%s", event_type)

    if event_type == "assistant-request":
        return _handle_assistant_request(message)

    if event_type == "call-started":
        call_id = message.get("call", {}).get("id", "unknown")
        logger.info("Vapi call started: call_id=%s", call_id)
        return {"status": "ok"}

    if event_type == "call-ended":
        call_id = message.get("call", {}).get("id", "unknown")
        logger.info("Vapi call ended: call_id=%s", call_id)
        return {"status": "ok"}

    if event_type == "end-of-call-report":
        return _handle_end_of_call_report(message, db)

    # Silently acknowledge any other event types.
    return {"status": "ok"}


def _handle_assistant_request(message: dict[str, Any]) -> dict[str, Any]:
    """Return the assistant configuration for inbound calls.

    Override the assistant ID via the VAPI_ASSISTANT_ID environment variable.
    If no assistant ID is configured, return an inline assistant definition so
    Vapi.ai can still connect the call.
    """
    assistant_id = os.getenv("VAPI_ASSISTANT_ID", "")
    if assistant_id:
        return {"assistantId": assistant_id}

    return {
        "assistant": {
            "name": "Green Resourcerers Intake",
            "firstMessage": (
                "Hi, thank you for calling The Green Resourcerers! "
                "I can help schedule your satellite dish removal. "
                "Could I start with your name?"
            ),
            "model": {
                "provider": "openai",
                "model": "gpt-4o-mini",
                "systemPrompt": (
                    "You are a friendly intake agent for The Green Resourcerers LLC, "
                    "a satellite-dish removal and recycling service. "
                    "Collect the caller's full name, property address, phone number, "
                    "and a brief description of the equipment they need removed. "
                    "Be concise and polite. Once you have all four pieces of information, "
                    "confirm the details back to the caller and let them know a team "
                    "member will follow up to schedule the appointment."
                ),
            },
            "voice": {"provider": "playht", "voiceId": "jennifer"},
        }
    }


def _handle_end_of_call_report(
    message: dict[str, Any], db: Session
) -> dict[str, Any]:
    """Parse the end-of-call report and create a ServiceRequest when possible."""
    summary: str = message.get("summary", "")
    transcript: str = message.get("transcript", "")
    call: dict[str, Any] = message.get("call", {})
    customer: dict[str, Any] = call.get("customer", {})

    caller_number: str = customer.get("number", "")

    # Structured data filled in by the assistant via tool calls, if configured.
    structured: dict[str, Any] = message.get("analysis", {}).get("structuredData", {})

    homeowner_name: str = structured.get("name", "").strip()
    address: str = structured.get("address", "").strip()
    phone: str = structured.get("phone", caller_number).strip()
    email: str = structured.get("email", "").strip()
    description: str = structured.get("equipmentDescription", "").strip()

    if not description and summary:
        description = summary

    if not description and transcript:
        description = f"Transcript:\n{transcript}"

    if not (homeowner_name and address):
        logger.info(
            "end-of-call-report missing name/address — skipping ServiceRequest creation."
        )
        return {"status": "ok", "serviceRequestCreated": False}

    service_request = ServiceRequest(
        homeowner_name=homeowner_name,
        address=address,
        phone=phone or caller_number,
        email=email,
        description=description or None,
    )
    db.add(service_request)
    db.commit()
    db.refresh(service_request)

    logger.info(
        "ServiceRequest #%d created from Vapi call for %s.",
        service_request.id,
        homeowner_name,
    )
    return {"status": "ok", "serviceRequestCreated": True, "requestId": service_request.id}
