from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import UUID

import jwt
from jwt.exceptions import InvalidTokenError

from app.core.config import settings

SECRET_KEY = settings.jwt_secret_key
ALGORITHM = settings.jwt_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes


def create_access_token(
    user_id: UUID,
    role: str,
    expires_delta: timedelta | None = None,
) -> str:

    issued_at = datetime.now(UTC)

    payload = {
        "sub": str(user_id),
        "role": role,
        "type": "access",
        "iat": issued_at,
        "exp": issued_at + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }

    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    except InvalidTokenError:
        return None

    if payload.get("type") != "access":
        return None

    subject = payload.get("sub")

    if not isinstance(subject, str) or not subject:
        return None

    return payload
