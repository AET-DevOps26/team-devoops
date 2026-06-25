import os
from functools import wraps

import jwt
from flask import request

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

# PyJWKClient handles caching internally (cache_jwk_set=True, lifespan=300s).
_jwks_client = jwt.PyJWKClient(_JWKS_URL, cache_jwk_set=True, lifespan=300)


def _get_signing_key(token: str) -> jwt.PyJWK:
    return _jwks_client.get_signing_key_from_jwt(token)


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
