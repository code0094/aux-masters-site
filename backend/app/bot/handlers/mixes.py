from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import Message, CallbackQuery
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import mix_service
from app.bot.keyboards import mix_list_keyboard

router = Router()


@router.message(Command("mixes"))
async def cmd_mixes(message: Message, db: AsyncSession):
    mixes = await mix_service.get_all_mixes(db)
    if not mixes:
        await message.answer("Миксов пока нет.")
        return
    lines = [
        f"{i+1}. <b>{m.title}</b> — {m.artist.name} ({m.date})"
        for i, m in enumerate(mixes)
    ]
    await message.answer(
        f"<b>Миксы ({len(mixes)}):</b>\n\n" + "\n".join(lines),
        parse_mode="HTML",
    )


# ---- Add ----

class AddMix(StatesGroup):
    artist_slug = State()
    title = State()
    date = State()
    duration = State()


@router.message(Command("add_mix"))
async def cmd_add_mix(message: Message, state: FSMContext):
    await state.set_state(AddMix.artist_slug)
    await message.answer("Slug артиста (например stress303):")


@router.message(AddMix.artist_slug)
async def add_slug(message: Message, state: FSMContext):
    await state.update_data(artist_slug=message.text.strip().lower())
    await state.set_state(AddMix.title)
    await message.answer("Название микса:")


@router.message(AddMix.title)
async def add_title(message: Message, state: FSMContext):
    await state.update_data(title=message.text.strip())
    await state.set_state(AddMix.date)
    await message.answer("Дата (YYYY-MM):")


@router.message(AddMix.date)
async def add_date(message: Message, state: FSMContext):
    await state.update_data(date=message.text.strip())
    await state.set_state(AddMix.duration)
    await message.answer("Длительность (например 1:30:00):")


@router.message(AddMix.duration)
async def add_duration(message: Message, state: FSMContext, db: AsyncSession):
    data = await state.get_data()
    data["duration"] = message.text.strip()
    await state.clear()

    try:
        mix = await mix_service.create_mix(db, **data)
        await message.answer(
            f"Микс <b>{mix.title}</b> создан!",
            parse_mode="HTML",
        )
    except ValueError as e:
        await message.answer(f"Ошибка: {e}")


# ---- Delete ----

class DeleteMix(StatesGroup):
    choosing = State()


@router.message(Command("delete_mix"))
async def cmd_delete_mix(message: Message, state: FSMContext, db: AsyncSession):
    mixes = await mix_service.get_all_mixes(db)
    if not mixes:
        await message.answer("Миксов нет.")
        return
    await state.set_state(DeleteMix.choosing)
    await message.answer(
        "Выберите микс для удаления:",
        reply_markup=mix_list_keyboard(mixes),
    )


@router.callback_query(DeleteMix.choosing, F.data.startswith("mix:"))
async def delete_mix_chosen(callback: CallbackQuery, state: FSMContext, db: AsyncSession):
    mix_id = int(callback.data.split(":", 1)[1])
    deleted = await mix_service.delete_mix(db, mix_id)
    await state.clear()
    if deleted:
        await callback.message.edit_text("Микс удалён.")
    else:
        await callback.message.edit_text("Микс не найден.")
    await callback.answer()
