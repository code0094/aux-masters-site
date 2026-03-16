import logging

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

from app.config import settings
from app.database import async_session
from app.services.bot_admin_service import ensure_owner_exists
from app.bot.middlewares import DbSessionMiddleware, AdminCheckMiddleware
from app.bot.handlers import start, artists, events, gallery, mixes, contacts, admins

logger = logging.getLogger(__name__)


def _create_dispatcher() -> Dispatcher:
    dp = Dispatcher()

    # Middlewares: DB session first, then admin check
    dp.message.middleware(DbSessionMiddleware())
    dp.callback_query.middleware(DbSessionMiddleware())
    dp.message.middleware(AdminCheckMiddleware())
    dp.callback_query.middleware(AdminCheckMiddleware())

    # Routers
    dp.include_router(start.router)
    dp.include_router(artists.router)
    dp.include_router(events.router)
    dp.include_router(gallery.router)
    dp.include_router(mixes.router)
    dp.include_router(contacts.router)
    dp.include_router(admins.router)

    return dp


async def start_bot() -> None:
    if not settings.BOT_TOKEN:
        logger.warning("BOT_TOKEN not set — bot will not start")
        return

    try:
        bot = Bot(
            token=settings.BOT_TOKEN,
            default=DefaultBotProperties(parse_mode=ParseMode.HTML),
        )
    except Exception as e:
        logger.warning("Invalid BOT_TOKEN — bot will not start: %s", e)
        return

    # Ensure owner exists in DB
    if settings.OWNER_TELEGRAM_ID:
        async with async_session() as session:
            await ensure_owner_exists(session, settings.OWNER_TELEGRAM_ID)

    dp = _create_dispatcher()

    logger.info("Bot starting polling...")
    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()
