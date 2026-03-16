from pathlib import Path

from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import Message
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.services import gallery_service

router = Router()


@router.message(Command("gallery"))
async def cmd_gallery(message: Message, db: AsyncSession):
    images = await gallery_service.get_all_images(db)
    await message.answer(f"В галерее <b>{len(images)}</b> фото.", parse_mode="HTML")


# ---- Upload ----

class UploadPhoto(StatesGroup):
    waiting = State()


@router.message(Command("upload_photo"))
async def cmd_upload(message: Message, state: FSMContext):
    await state.set_state(UploadPhoto.waiting)
    await message.answer(
        "Отправьте фото (можно несколько). Когда закончите — /done"
    )


@router.message(UploadPhoto.waiting, F.photo)
async def handle_photo(message: Message, db: AsyncSession):
    photo = message.photo[-1]
    file = await message.bot.get_file(photo.file_id)

    gallery_dir = Path(settings.UPLOAD_DIR) / "gallery"
    gallery_dir.mkdir(parents=True, exist_ok=True)

    filename = f"tg_{photo.file_unique_id}.jpg"
    save_path = gallery_dir / filename
    await message.bot.download_file(file.file_path, destination=str(save_path))

    image_url = f"/images/gallery/{filename}"
    img = await gallery_service.add_image(db, image_url=image_url, alt_text="AUX MASTERS")
    await message.answer(f"Фото загружено! ID: {img.id}")


@router.message(UploadPhoto.waiting, Command("done"))
async def upload_done(message: Message, state: FSMContext):
    await state.clear()
    await message.answer("Загрузка завершена.")


@router.message(UploadPhoto.waiting)
async def upload_not_photo(message: Message):
    await message.answer("Отправьте фото или /done для завершения.")


# ---- Delete ----

class DeletePhoto(StatesGroup):
    waiting_id = State()


@router.message(Command("delete_photo"))
async def cmd_delete_photo(message: Message, state: FSMContext):
    await state.set_state(DeletePhoto.waiting_id)
    await message.answer("Введите ID фото для удаления:")


@router.message(DeletePhoto.waiting_id)
async def delete_photo_id(message: Message, state: FSMContext, db: AsyncSession):
    try:
        image_id = int(message.text.strip())
    except ValueError:
        await message.answer("Введите числовой ID.")
        return

    deleted = await gallery_service.delete_image(db, image_id)
    await state.clear()
    if deleted:
        await message.answer(f"Фото #{image_id} удалено.")
    else:
        await message.answer("Фото не найдено.")
