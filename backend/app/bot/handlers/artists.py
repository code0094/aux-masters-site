from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import Message, CallbackQuery
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import artist_service
from app.bot.keyboards import artist_list_keyboard, confirm_keyboard

router = Router()


# ---- List ----

@router.message(Command("artists"))
async def cmd_artists(message: Message, db: AsyncSession):
    artists = await artist_service.get_all_artists(db)
    if not artists:
        await message.answer("Артистов пока нет.")
        return
    lines = [f"{i+1}. <b>{a.name}</b> ({a.slug}) — {a.type}" for i, a in enumerate(artists)]
    await message.answer(
        f"<b>Артисты ({len(artists)}):</b>\n\n" + "\n".join(lines),
        parse_mode="HTML",
    )


# ---- Add ----

class AddArtist(StatesGroup):
    name = State()
    slug = State()
    type = State()
    role = State()
    short_desc = State()


@router.message(Command("add_artist"))
async def cmd_add_artist(message: Message, state: FSMContext):
    await state.set_state(AddArtist.name)
    await message.answer("Введите имя артиста:")


@router.message(AddArtist.name)
async def add_name(message: Message, state: FSMContext):
    await state.update_data(name=message.text.strip())
    await state.set_state(AddArtist.slug)
    await message.answer("Введите slug (URL-ID, например stress303):")


@router.message(AddArtist.slug)
async def add_slug(message: Message, state: FSMContext):
    await state.update_data(slug=message.text.strip().lower().replace(" ", "-"))
    await state.set_state(AddArtist.type)
    await message.answer("Тип? (dj / staff):")


@router.message(AddArtist.type)
async def add_type(message: Message, state: FSMContext):
    t = message.text.strip().lower()
    if t not in ("dj", "staff"):
        await message.answer("Введите dj или staff:")
        return
    await state.update_data(type=t)
    await state.set_state(AddArtist.role)
    await message.answer("Роль (например HEADLINER, ФОТОГРАФ):")


@router.message(AddArtist.role)
async def add_role(message: Message, state: FSMContext):
    await state.update_data(role=message.text.strip())
    await state.set_state(AddArtist.short_desc)
    await message.answer("Короткое описание (1-2 предложения):")


@router.message(AddArtist.short_desc)
async def add_short_desc(message: Message, state: FSMContext, db: AsyncSession):
    await state.update_data(short_desc=message.text.strip())
    data = await state.get_data()
    await state.clear()

    artist = await artist_service.create_artist(db, **data)
    await message.answer(
        f"Артист <b>{artist.name}</b> ({artist.slug}) создан!",
        parse_mode="HTML",
    )


# ---- Delete ----

class DeleteArtist(StatesGroup):
    choosing = State()


@router.message(Command("delete_artist"))
async def cmd_delete_artist(message: Message, state: FSMContext, db: AsyncSession):
    artists = await artist_service.get_all_artists(db)
    if not artists:
        await message.answer("Артистов нет.")
        return
    await state.set_state(DeleteArtist.choosing)
    await message.answer(
        "Выберите артиста для удаления:",
        reply_markup=artist_list_keyboard(artists),
    )


@router.callback_query(DeleteArtist.choosing, F.data.startswith("artist:"))
async def delete_artist_chosen(callback: CallbackQuery, state: FSMContext, db: AsyncSession):
    slug = callback.data.split(":", 1)[1]
    deleted = await artist_service.delete_artist(db, slug)
    await state.clear()
    if deleted:
        await callback.message.edit_text(f"Артист {slug} удалён.")
    else:
        await callback.message.edit_text("Артист не найден.")
    await callback.answer()
