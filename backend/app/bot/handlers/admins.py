from aiogram import Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import Message
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import bot_admin_service

router = Router()


@router.message(Command("admins"))
async def cmd_admins(message: Message, db: AsyncSession):
    admins = await bot_admin_service.get_all_admins(db)
    if not admins:
        await message.answer("Админов нет.")
        return
    lines = [
        f"{i+1}. <b>{a.username or 'N/A'}</b> (ID: {a.telegram_id}) — {a.role}"
        for i, a in enumerate(admins)
    ]
    await message.answer(
        f"<b>Админы ({len(admins)}):</b>\n\n" + "\n".join(lines),
        parse_mode="HTML",
    )


# ---- Add Admin ----

class AddAdmin(StatesGroup):
    telegram_id = State()


@router.message(Command("add_admin"))
async def cmd_add_admin(message: Message, state: FSMContext, db: AsyncSession):
    if not await bot_admin_service.is_owner(db, message.from_user.id):
        await message.answer("Только owner может добавлять админов.")
        return
    await state.set_state(AddAdmin.telegram_id)
    await message.answer("Введите Telegram ID нового админа:")


@router.message(AddAdmin.telegram_id)
async def add_admin_id(message: Message, state: FSMContext, db: AsyncSession):
    try:
        tg_id = int(message.text.strip())
    except ValueError:
        await message.answer("ID должен быть числом.")
        return

    if await bot_admin_service.is_admin(db, tg_id):
        await state.clear()
        await message.answer("Этот пользователь уже админ.")
        return

    admin = await bot_admin_service.add_admin(db, tg_id, username="", role="admin")
    await state.clear()
    await message.answer(f"Админ с ID {admin.telegram_id} добавлен.")


# ---- Remove Admin ----

class RemoveAdmin(StatesGroup):
    telegram_id = State()


@router.message(Command("remove_admin"))
async def cmd_remove_admin(message: Message, state: FSMContext, db: AsyncSession):
    if not await bot_admin_service.is_owner(db, message.from_user.id):
        await message.answer("Только owner может удалять админов.")
        return
    await state.set_state(RemoveAdmin.telegram_id)
    await message.answer("Введите Telegram ID админа для удаления:")


@router.message(RemoveAdmin.telegram_id)
async def remove_admin_id(message: Message, state: FSMContext, db: AsyncSession):
    try:
        tg_id = int(message.text.strip())
    except ValueError:
        await message.answer("ID должен быть числом.")
        return

    removed = await bot_admin_service.remove_admin(db, tg_id)
    await state.clear()
    if removed:
        await message.answer(f"Админ {tg_id} удалён.")
    else:
        await message.answer("Админ не найден.")
