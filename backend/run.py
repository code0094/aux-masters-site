"""
Single entry point: runs FastAPI (uvicorn) + Telegram bot in one asyncio loop.
"""
import asyncio
import logging

import uvicorn

from app.config import settings
from app.bot.main import start_bot

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


async def main() -> None:
    config = uvicorn.Config(
        "app.main:create_app",
        factory=True,
        host="0.0.0.0",
        port=8000,
        log_level="info",
    )
    server = uvicorn.Server(config)

    # Run API server and bot concurrently
    await asyncio.gather(
        server.serve(),
        start_bot(),
    )


if __name__ == "__main__":
    asyncio.run(main())
