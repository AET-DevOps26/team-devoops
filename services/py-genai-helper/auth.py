import os
from functools import wraps

import jwt
import requests
from flask import request

_jwks_cache: dict | None = None

KEYCLOAK_ISSUER_URL = os.environ.get(
    "KEYCLOAK_ISSUER_URL",
    "http://keycloak:8080/auth/realms/devops",
)
# Separate JWKS URL allows using the internal service name for fetching
# while the issuer URL matches the public hostname in the token's `iss` claim.
_JWKS_URL = os.environ.get(
    "KEYCLOAK_JWKS_URL",
    f"{KEYCLOAK_ISSUER_URL}/protocol/openid-connect/certs",
)


def _fetch_jwks() -> dict:
    response = requests.get(_JWKS_URL, timeout=5)
    response.raise_for_status()
    return response.json()


def _get_signing_key(token: str) -> jwt.PyJWK:
    global _jwks_cache
    if _jwks_cache is None:
        _jwks_cache = _fetch_jwks()
    try:
        return jwt.PyJWKClient(_JWKS_URL, jwks_data=_jwks_cache).get_signing_key_from_jwt(token)
    except jwt.exceptions.PyJWKClientError:
        # Key not found in cache — Keycloak may have rotated keys; refresh once.
        _jwks_cache = _fetch_jwks()
        return jwt.PyJWKClient(_JWKS_URL, jwks_data=_jwks_cache).get_signing_key_from_jwt(token)


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return {"error": "Missing or invalid Authorization header"}, 401

        token = auth_header[len("Bearer ") :]
        try:
            signing_key = _get_signing_key(token)
            jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                options={"verify_aud": False},
                issuer=KEYCLOAK_ISSUER_URL,
            )
        except jwt.ExpiredSignatureError:
            return {"error": "Token has expired"}, 401
        except Exception:
            return {"error": "Invalid token"}, 401

        return f(*args, **kwargs)

    return decorated
