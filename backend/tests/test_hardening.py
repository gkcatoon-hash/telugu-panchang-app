"""Regression tests for P3 security hardening:
- Explicit CORS allow-list (no wildcard, no credentials).
- Removal of demo /api/status endpoints.
- Heartbeat endpoint /api/ still responds.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://telugu-panchang-app.preview.emergentagent.com").rstrip("/")
ALLOWED_ORIGIN = "https://telugu-panchang-app.preview.emergentagent.com"
EVIL_ORIGIN = "https://evil.example.com"


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Heartbeat endpoint ---

class TestHeartbeat:
    def test_root_returns_ok(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get("status") == "ok", f"status field mismatch: {data}"
        assert data.get("service") == "manalife-calendar", f"service field mismatch: {data}"


# --- /api/status endpoints removed ---

class TestStatusEndpointsRemoved:
    def test_get_status_removed(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/status")
        assert r.status_code == 404, f"GET /api/status should be 404, got {r.status_code}"

    def test_post_status_removed(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/status", json={"client_name": "TEST_probe"})
        assert r.status_code == 404, f"POST /api/status should be 404, got {r.status_code}"


# --- CORS allow-list ---

class TestCORS:
    def test_allowed_origin_echoed(self, api_client):
        # Preflight
        r = api_client.options(
            f"{BASE_URL}/api/",
            headers={
                "Origin": ALLOWED_ORIGIN,
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Content-Type",
            },
        )
        acao = r.headers.get("access-control-allow-origin")
        assert acao == ALLOWED_ORIGIN, f"Expected ACAO={ALLOWED_ORIGIN}, got {acao!r}. Headers: {dict(r.headers)}"

    def test_allowed_origin_simple_get(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", headers={"Origin": ALLOWED_ORIGIN})
        assert r.status_code == 200
        acao = r.headers.get("access-control-allow-origin")
        assert acao == ALLOWED_ORIGIN, f"Expected ACAO={ALLOWED_ORIGIN}, got {acao!r}"

    def test_disallowed_origin_no_acao(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", headers={"Origin": EVIL_ORIGIN})
        # Request itself should still succeed at HTTP level; but no CORS header for evil origin
        acao = r.headers.get("access-control-allow-origin")
        assert acao != EVIL_ORIGIN, f"Evil origin should NOT be echoed, got ACAO={acao!r}"
        assert acao != "*", f"Wildcard CORS not allowed, got ACAO={acao!r}"

    def test_disallowed_origin_preflight(self, api_client):
        r = api_client.options(
            f"{BASE_URL}/api/",
            headers={
                "Origin": EVIL_ORIGIN,
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Content-Type",
            },
        )
        acao = r.headers.get("access-control-allow-origin")
        assert acao != EVIL_ORIGIN, f"Evil origin preflight should NOT echo, got ACAO={acao!r}"
        assert acao != "*", f"Wildcard CORS not allowed, got ACAO={acao!r}"

    def test_no_allow_credentials_true(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", headers={"Origin": ALLOWED_ORIGIN})
        # allow_credentials=False in server config; header should be absent or 'false'
        acac = r.headers.get("access-control-allow-credentials")
        assert acac in (None, "false"), f"allow-credentials must be false, got {acac!r}"
