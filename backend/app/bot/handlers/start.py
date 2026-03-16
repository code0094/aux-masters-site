from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

from app.config import settings
from app.bot.keyboards import admin_webapp_kb, admin_reply_kb

router = Router()


@router.message(Command("start"))
async def cmd_start(message: Message, is_admin: bool = False):
    if not is_admin:
        await message.answer(
            "AUX MASTERS Admin Bot\n\n"
            "У вас нет доступа. Обратитесь к администратору."
        )
        return

    text = (
        "<b>AUX MASTERS Admin Bot</b>\n\n"
        "Добро пожаловать! Используйте /help для списка команд."
    )

    # If WEBAPP_URL configured, show Mini App button
    if settings.WEBAPP_URL:
        text += "\n\nИли откройте полную админку по кнопке ниже 👇"
        await message.answer(
            text,
            parse_mode="HTML",
            reply_markup=admin_webapp_kb(settings.WEBAPP_URL),
        )
        # Also set persistent reply keyboard
        await message.answer(
            "Кнопка «Админка» теперь всегда доступна внизу ⬇️",
            reply_markup=admin_reply_kb(settings.WEBAPP_URL),
        )
    else:
        await message.answer(text, parse_mode="HTML")


@router.message(Command("help"))
async def cmd_help(message: Message):
    await message.answer(
        "<b>Команды:</b>\n\n"
        "<b>Артисты:</b>\n"
        "/artists — список артистов\n"
        "/add_artist — добавить артиста\n"
        "/delete_artist — удалить артиста\n\n"
        "<b>Ивенты:</b>\n"
        "/events — список ивентов\n"
        "/add_event — добавить ивент\n"
        "/delete_event — удалить ивент\n\n"
        "<b>Галерея:</b>\n"
        "/gallery — статистика галереи\n"
        "/upload_photo — загрузить фото\n"
        "/delete_photo — удалить фото\n\n"
        "<b>Миксы:</b>\n"
        "/mixes — список миксов\n"
        "/add_mix — добавить микс\n"
        "/delete_mix — удалить микс\n\n"
        "<b>Сообщения:</b>\n"
        "/messages — непрочитанные сообщения\n\n"
        "<b>Админы:</b>\n"
        "/admins — список админов\n"
        "/add_admin — добавить админа\n"
        "/remove_admin — удалить админа",
        parse_mode="HTML",
    )
