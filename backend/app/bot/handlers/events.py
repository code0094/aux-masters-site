from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import Message, CallbackQuery
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import event_service
from app.bot.keyboards import event_list_keyboard

router = Router()


# ---- List ----

@router.message(Command("events"))
async def cmd_events(message: Message, db: AsyncSession):
    events = await event_service.get_all_events(db)
    if not events:
        await message.answer("Ивентов пока нет.")
        return
    lines = [
        f"{i+1}. <b>{e.title}</b> ({e.date}) — {e.status}"
        for i, e in enumerate(events)
    ]
    await message.answer(
        f"<b>Ивенты ({len(events)}):</b>\n\n" + "\n".join(lines),
        parse_mode="HTML",
    )


# ---- Add ----

class AddEvent(StatesGroup):
    title = State()
    date = State()
    time = State()
    venue = State()
    city = State()
    description = State()
    status = State()


@router.message(Command("add_event"))
async def cmd_add_event(message: Message, state: FSMContext):
    await state.set_state(AddEvent.title)
    await message.answer("Название ивента:")


@router.message(AddEvent.title)
async def add_title(message: Message, state: FSMContext):
    await state.update_data(title=message.text.strip())
    await state.set_state(AddEvent.date)
    await message.answer("Дата (YYYY-MM-DD):")


@router.message(AddEvent.date)
async def add_date(message: Message, state: FSMContext):
    await state.update_data(event_date=message.text.strip())
    await state.set_state(AddEvent.time)
    await message.answer("Время (например 23:00):")


@router.message(AddEvent.time)
async def add_time(message: Message, state: FSMContext):
    await state.update_data(time=message.text.strip())
    await state.set_state(AddEvent.venue)
    await message.answer("Площадка:")


@router.message(AddEvent.venue)
async def add_venue(message: Message, state: FSMContext):
    await state.update_data(venue=message.text.strip())
    await state.set_state(AddEvent.city)
    await message.answer("Город:")


@router.message(AddEvent.city)
async def add_city(message: Message, state: FSMContext):
    await state.update_data(city=message.text.strip())
    await state.set_state(AddEvent.description)
    await message.answer("Описание:")


@router.message(AddEvent.description)
async def add_desc(message: Message, state: FSMContext):
    await state.update_data(description=message.text.strip())
    await state.set_state(AddEvent.status)
    await message.answer("Статус? (upcoming / past):")


@router.message(AddEvent.status)
async def add_status(message: Message, state: FSMContext, db: AsyncSession):
    status = message.text.strip().lower()
    if status not in ("upcoming", "past"):
        await message.answer("Введите upcoming или past:")
        return

    data = await state.get_data()
    data["status"] = status
    await state.clear()

    event = await event_service.create_event(db, **data)
    await message.answer(
        f"Ивент <b>{event.title}</b> ({event.date}) создан!",
        parse_mode="HTML",
    )


# ---- Delete ----

class DeleteEvent(StatesGroup):
    choosing = State()


@router.message(Command("delete_event"))
async def cmd_delete_event(message: Message, state: FSMContext, db: AsyncSession):
    events = await event_service.get_all_events(db)
    if not events:
        await message.answer("Ивентов нет.")
        return
    await state.set_state(DeleteEvent.choosing)
    await message.answer(
        "Выберите ивент для удаления:",
        reply_markup=event_list_keyboard(events),
    )


@router.callback_query(DeleteEvent.choosing, F.data.startswith("event:"))
async def delete_event_chosen(callback: CallbackQuery, state: FSMContext, db: AsyncSession):
    event_id = int(callback.data.split(":", 1)[1])
    deleted = await event_service.delete_event(db, event_id)
    await state.clear()
    if deleted:
        await callback.message.edit_text("Ивент удалён.")
    else:
        await callback.message.edit_text("Ивент не найден.")
    await callback.answer()
