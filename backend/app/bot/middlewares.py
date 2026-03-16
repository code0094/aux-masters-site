from typing import Any, Awaitable, Callable

from aiogram import BaseMiddleware
from aiogram.types import Message, CallbackQuery, TelegramObject

from app.database import async_session
from app.services import bot_admin_service


class DbSessionMiddleware(BaseMiddleware):
    async def __call__(
        self,
        handler: Callable[[TelegramObject, dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: dict[str, Any],
    ) -> Any:
        async with async_session() as session:
            data["db"] = session
            return await handler(event, data)


class AdminCheckMiddleware(BaseMiddleware):
    async def __call__(
        self,
        handler: Callable[[TelegramObject, dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: dict[str, Any],
    ) -> Any:
        user = None
        if isinstance(event, Message):
            user = event.from_user
        elif isinstance(event, CallbackQuery):
            user = event.from_user

        if not user:
            return await handler(event, data)

        db = data.get("db")
        if not db:
            return

        is_admin = await bot_admin_service.is_admin(db, user.id)

        # Allow /start for anyone
        if isinstance(event, Message) and event.text and event.text.startswith("/start"):
            data["is_admin"] = is_admin
            return await handler(event, data)

        if not is_admin:
            if isinstance(event, Message):
                await event.answer("Доступ запрещён. Вы не администратор.")
            elif isinstance(event, CallbackQuery):
                await event.answer("Доступ запрещён.", show_alert=True)
            return

        data["is_admin"] = True
        return await handler(event, data)
