from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import contact_service

router = Router()


@router.message(Command("messages"))
async def cmd_messages(message: Message, db: AsyncSession):
    messages_list = await contact_service.get_unread_messages(db)
    if not messages_list:
        await message.answer("Нет непрочитанных сообщений.")
        return

    for msg in messages_list[:10]:
        text = (
            f"<b>#{msg.id}</b> от {msg.name} ({msg.email})\n"
            f"<b>Тема:</b> {msg.subject}\n"
            f"{msg.message[:300]}\n\n"
            f"/mark_read_{msg.id}"
        )
        await message.answer(text, parse_mode="HTML")

    if len(messages_list) > 10:
        await message.answer(f"... и ещё {len(messages_list) - 10} сообщений")


@router.message(Command("mark_read"))
async def cmd_mark_read(message: Message, db: AsyncSession):
    parts = message.text.split()
    if len(parts) < 2:
        await message.answer("Использование: /mark_read ID")
        return
    try:
        msg_id = int(parts[1])
    except ValueError:
        await message.answer("ID должен быть числом.")
        return

    done = await contact_service.mark_as_read(db, msg_id)
    if done:
        await message.answer(f"Сообщение #{msg_id} отмечено как прочитанное.")
    else:
        await message.answer("Сообщение не найдено.")
