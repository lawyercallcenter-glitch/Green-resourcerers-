"""
MCP server for The Green Resourcerers LLC.

Exposes the backend REST API as MCP tools so AI assistants can manage
service requests, technicians, and jobs.
"""

import os

import httpx
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

load_dotenv()

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")

mcp = FastMCP("Green Resourcerers")

_client = httpx.Client(base_url=API_BASE_URL, timeout=30)


# ---------------------------------------------------------------------------
# Service Requests
# ---------------------------------------------------------------------------


@mcp.tool()
def create_service_request(
    homeowner_name: str,
    address: str,
    phone: str,
    email: str,
    description: str = "",
) -> dict:
    """Create a new satellite-dish removal service request from a homeowner."""
    payload = {
        "homeowner_name": homeowner_name,
        "address": address,
        "phone": phone,
        "email": email,
    }
    if description:
        payload["description"] = description
    response = _client.post("/requests/", json=payload)
    response.raise_for_status()
    return response.json()


@mcp.tool()
def list_service_requests(skip: int = 0, limit: int = 100) -> list:
    """List all service requests, with optional pagination."""
    response = _client.get("/requests/", params={"skip": skip, "limit": limit})
    response.raise_for_status()
    return response.json()


@mcp.tool()
def get_service_request(request_id: int) -> dict:
    """Get a single service request by its ID."""
    response = _client.get(f"/requests/{request_id}")
    response.raise_for_status()
    return response.json()


@mcp.tool()
def update_service_request(
    request_id: int,
    status: str = "",
    description: str = "",
) -> dict:
    """Update a service request's status or description.

    Valid status values: pending, approved, in_progress, completed.
    Only provide the fields you want to change.
    """
    payload: dict = {}
    if status:
        payload["status"] = status
    if description:
        payload["description"] = description
    response = _client.patch(f"/requests/{request_id}", json=payload)
    response.raise_for_status()
    return response.json()


# ---------------------------------------------------------------------------
# Technicians
# ---------------------------------------------------------------------------


@mcp.tool()
def create_technician(name: str, phone: str, email: str) -> dict:
    """Register a new field technician."""
    payload = {"name": name, "phone": phone, "email": email}
    response = _client.post("/technicians/", json=payload)
    response.raise_for_status()
    return response.json()


@mcp.tool()
def list_technicians(skip: int = 0, limit: int = 100) -> list:
    """List all technicians, with optional pagination."""
    response = _client.get("/technicians/", params={"skip": skip, "limit": limit})
    response.raise_for_status()
    return response.json()


@mcp.tool()
def get_technician(technician_id: int) -> dict:
    """Get a single technician by their ID."""
    response = _client.get(f"/technicians/{technician_id}")
    response.raise_for_status()
    return response.json()


@mcp.tool()
def update_technician(
    technician_id: int,
    name: str = "",
    phone: str = "",
    email: str = "",
    is_active: bool | None = None,
) -> dict:
    """Update a technician's details.

    Only provide the fields you want to change.
    """
    payload: dict = {}
    if name:
        payload["name"] = name
    if phone:
        payload["phone"] = phone
    if email:
        payload["email"] = email
    if is_active is not None:
        payload["is_active"] = is_active
    response = _client.patch(f"/technicians/{technician_id}", json=payload)
    response.raise_for_status()
    return response.json()


# ---------------------------------------------------------------------------
# Jobs
# ---------------------------------------------------------------------------


@mcp.tool()
def create_job(
    request_id: int,
    technician_id: int,
    scheduled_date: str = "",
    notes: str = "",
) -> dict:
    """Assign a service request to a technician, creating a job.

    scheduled_date should be an ISO-8601 datetime string, e.g.
    "2025-06-15T09:00:00Z". Leave blank to leave it unscheduled.
    """
    payload: dict = {"request_id": request_id, "technician_id": technician_id}
    if scheduled_date:
        payload["scheduled_date"] = scheduled_date
    if notes:
        payload["notes"] = notes
    response = _client.post("/jobs/", json=payload)
    response.raise_for_status()
    return response.json()


@mcp.tool()
def list_jobs(skip: int = 0, limit: int = 100) -> list:
    """List all jobs, with optional pagination."""
    response = _client.get("/jobs/", params={"skip": skip, "limit": limit})
    response.raise_for_status()
    return response.json()


@mcp.tool()
def get_job(job_id: int) -> dict:
    """Get a single job by its ID."""
    response = _client.get(f"/jobs/{job_id}")
    response.raise_for_status()
    return response.json()


@mcp.tool()
def update_job(
    job_id: int,
    status: str = "",
    notes: str = "",
    scheduled_date: str = "",
) -> dict:
    """Update a job's status, notes, or scheduled date.

    Valid status values: assigned, in_progress, completed.
    Only provide the fields you want to change.
    """
    payload: dict = {}
    if status:
        payload["status"] = status
    if notes:
        payload["notes"] = notes
    if scheduled_date:
        payload["scheduled_date"] = scheduled_date
    response = _client.patch(f"/jobs/{job_id}", json=payload)
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    mcp.run()
