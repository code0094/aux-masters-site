"""Telegram WebApp initData validation."""

import hashlib
import hmac
import json
from urllib.parse import parse_qs

from fastapi import Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.api.deps import get_db
from app.services import bot_admin_service
from app.models.bot_admin import BotAdmin


def validate_init_data(init_data: str, bot_token: str) -> dict:
    """Validate Telegram WebApp initData and return parsed data."""
    parsed = parse_qs(init_data, keep_blank_values=True)

    # Extract hash
    received_hash = parsed.get("hash", [None])[0]
    if not received_hash:
        raise ValueError("Missing hash")

    # Build check string (sorted key=value pairs, excluding hash)
    data_pairs = []
    for key, values in parsed.items():
        if key == "hash":
            continue
        data_pairs.append(f"{key}={values[0]}")
    data_pairs.sort()
    check_string = "\n".join(data_pairs)

    # HMAC-SHA256: secret = HMAC("WebAppData", bot_token)
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    computed_hash = hmac.new(secret_key, check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(computed_hash, received_hash):
        raise ValueError("Invalid hash")

    # Parse user JSON
    user_json = parsed.get("user", [None])[0]
    if not user_json:
        raise ValueError("Missing user")

    return json.loads(user_json)


async def get_current_admin(
    x_telegram_init_data: str = Header(default=""),
    db: AsyncSession = Depends(get_db),
) -> BotAdmin:
    """Dependency: validate initData and return admin from DB."""

    # Dev mode: skip auth if no token configured or DEBUG with special header
    if settings.DEBUG and x_telegram_init_data == "dev":
        # In dev mode, return the owner
        from sqlalchemy import select
        result = await db.execute(
            select(BotAdmin).where(BotAdmin.role == "owner").limit(1)
        )
        admin = result.scalar_one_or_none()
        if admin:
            return admin
        raise HTTPException(status_code=403, detail="No owner in DB")

    if not x_telegram_init_data:
        raise HTTPException(status_code=401, detail="Missing init data")

    try:
        user_data = validate_init_data(x_telegram_init_data, settings.BOT_TOKEN)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    telegram_id = user_data.get("id")
    if not telegram_id:
        raise HTTPException(status_code=401, detail="No user ID")

    # Check admin in DB
    from sqlalchemy import select
    result = await db.execute(
        select(BotAdmin).where(BotAdmin.telegram_id == telegram_id)
    )
    admin = result.scalar_one_or_none()
    if not admin:
        raise HTTPException(status_code=403, detail="Not an admin")

    # Update username if changed
    username = user_data.get("username", "")
    if username and admin.username != username:
        admin.username = username
        await db.commit()

    return admin
