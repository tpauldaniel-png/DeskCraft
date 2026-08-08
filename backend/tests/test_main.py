from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app

client = TestClient(app)


def test_root_endpoint() -> None:
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == settings.app_name
    assert data["version"] == settings.app_version
    assert data["environment"] == settings.environment
    assert data["message"] == "DeskCraft API is running"


def test_health_endpoint() -> None:

    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert data["service"] == settings.app_name


def test_version_endpoint() -> None:

    response = client.get("/version")

    assert response.status_code == 200

    data = response.json()

    assert data["service"] == settings.app_name
    assert data["version"] == settings.app_version


def test_unknown_endpoint_returns_standard_404() -> None:

    response = client.get("/does-not-exist")

    assert response.status_code == 404

    assert response.json() == {
        "error": {
            "code": "HTTP_404",
            "message": "Not Found",
        }
    }
