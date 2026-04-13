"""Tests for the Green Resourcerers backend API."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db
from main import app

# In-memory SQLite for tests
TEST_DATABASE_URL = "sqlite:///./test_green_resourcerers.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)

SAMPLE_REQUEST = {
    "first_name": "Jane",
    "last_name": "Homeowner",
    "email": "jane@example.com",
    "phone": "555-555-0001",
    "address": "123 Elm St",
    "city": "Springfield",
    "state": "IL",
    "zip_code": "62701",
    "dish_count": 2,
    "dish_location": "Roof",
    "notes": "Two old DirecTV dishes",
}

SAMPLE_TECH = {
    "name": "Bob Technician",
    "email": "bob@greenresourcerers.com",
    "phone": "555-555-0002",
    "certification_number": "CERT-001",
}


class TestHealth:
    def test_root(self):
        r = client.get("/")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"

    def test_health(self):
        r = client.get("/health")
        assert r.status_code == 200


class TestHomeownerRequests:
    def test_submit_request(self):
        r = client.post("/requests/", json=SAMPLE_REQUEST)
        assert r.status_code == 201
        data = r.json()
        assert data["email"] == SAMPLE_REQUEST["email"]
        assert data["status"] == "pending"
        assert data["id"] is not None

    def test_list_requests(self):
        client.post("/requests/", json=SAMPLE_REQUEST)
        r = client.get("/requests/")
        assert r.status_code == 200
        assert len(r.json()) >= 1

    def test_get_request(self):
        created = client.post("/requests/", json=SAMPLE_REQUEST).json()
        r = client.get(f"/requests/{created['id']}")
        assert r.status_code == 200
        assert r.json()["id"] == created["id"]

    def test_get_request_not_found(self):
        r = client.get("/requests/99999")
        assert r.status_code == 404

    def test_update_request_status(self):
        created = client.post("/requests/", json=SAMPLE_REQUEST).json()
        r = client.patch(f"/requests/{created['id']}", json={"status": "approved"})
        assert r.status_code == 200
        assert r.json()["status"] == "approved"

    def test_delete_request(self):
        created = client.post("/requests/", json=SAMPLE_REQUEST).json()
        r = client.delete(f"/requests/{created['id']}")
        assert r.status_code == 204
        assert client.get(f"/requests/{created['id']}").status_code == 404


class TestTechnicians:
    def test_create_technician(self):
        r = client.post("/technicians/", json=SAMPLE_TECH)
        assert r.status_code == 201
        assert r.json()["email"] == SAMPLE_TECH["email"]

    def test_list_technicians(self):
        client.post("/technicians/", json=SAMPLE_TECH)
        r = client.get("/technicians/")
        assert r.status_code == 200
        assert len(r.json()) >= 1

    def test_get_technician(self):
        created = client.post("/technicians/", json=SAMPLE_TECH).json()
        r = client.get(f"/technicians/{created['id']}")
        assert r.status_code == 200

    def test_get_technician_not_found(self):
        r = client.get("/technicians/99999")
        assert r.status_code == 404


class TestJobs:
    def _create_request_and_tech(self):
        req = client.post("/requests/", json=SAMPLE_REQUEST).json()
        tech = client.post("/technicians/", json=SAMPLE_TECH).json()
        return req, tech

    def test_create_job(self):
        req, tech = self._create_request_and_tech()
        r = client.post("/jobs/", json={"request_id": req["id"], "technician_id": tech["id"]})
        assert r.status_code == 201
        assert r.json()["status"] == "open"

    def test_list_jobs(self):
        req, tech = self._create_request_and_tech()
        client.post("/jobs/", json={"request_id": req["id"], "technician_id": tech["id"]})
        r = client.get("/jobs/")
        assert r.status_code == 200
        assert len(r.json()) >= 1

    def test_get_job(self):
        req, tech = self._create_request_and_tech()
        job = client.post("/jobs/", json={"request_id": req["id"], "technician_id": tech["id"]}).json()
        r = client.get(f"/jobs/{job['id']}")
        assert r.status_code == 200

    def test_admin_update_job(self):
        req, tech = self._create_request_and_tech()
        job = client.post("/jobs/", json={"request_id": req["id"], "technician_id": tech["id"]}).json()
        r = client.patch(f"/jobs/{job['id']}", json={"status": "in_progress"})
        assert r.status_code == 200
        assert r.json()["status"] == "in_progress"

    def test_technician_field_update(self):
        req, tech = self._create_request_and_tech()
        job = client.post("/jobs/", json={"request_id": req["id"], "technician_id": tech["id"]}).json()
        r = client.patch(
            f"/technicians/{tech['id']}/jobs/{job['id']}",
            json={
                "status": "completed",
                "dishes_removed": 2,
                "materials_weight_lbs": 45.5,
                "technician_notes": "Both dishes removed without issue.",
            },
        )
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "completed"
        assert data["dishes_removed"] == 2
        assert data["completed_at"] is not None

    def test_technician_cannot_update_others_job(self):
        req, tech = self._create_request_and_tech()
        other_tech = client.post(
            "/technicians/",
            json={**SAMPLE_TECH, "email": "other@greenresourcerers.com"},
        ).json()
        job = client.post("/jobs/", json={"request_id": req["id"], "technician_id": tech["id"]}).json()
        r = client.patch(
            f"/technicians/{other_tech['id']}/jobs/{job['id']}",
            json={"status": "in_progress"},
        )
        assert r.status_code == 403
