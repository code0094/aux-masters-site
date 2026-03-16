from aiogram import Bot

from app.config import settings
from app.database import async_session
from app.services.bot_admin_service import get_all_admins


async def notify_admins(text: str) -> None:
    if not settings.BOT_TOKEN:
        return
    bot = Bot(token=settings.BOT_TOKEN)
    async with async_session() as session:
        admins = await get_all_admins(session)
    for admin in admins:
        try:
            await bot.send_message(admin.telegram_id, text, parse_mode="HTML")
        except Exception:
            pass
    await bot.session.close()


async def notify_new_contact_message(
    name: str, email: str, subject: str, message: str
) -> None:
    text = (
        f"<b>Новое сообщение с сайта!</b>\n\n"
        f"<b>От:</b> {name} ({email})\n"
        f"<b>Тема:</b> {subject}\n"
        f"<b>Сообщение:</b>\n{message[:500]}"
    )
    await notify_admins(text)
