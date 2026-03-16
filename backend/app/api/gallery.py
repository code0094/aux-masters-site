from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.gallery import GalleryImageOut
from app.services import gallery_service

router = APIRouter()


@router.get("/", response_model=list[GalleryImageOut])
async def list_gallery(db: AsyncSession = Depends(get_db)):
    images = await gallery_service.get_all_images(db)
    return [
        {
            "id": img.id,
            "src": img.image_url,
            "alt": img.alt_text,
            "event": img.event.title if img.event else "AUX MASTERS",
        }
        for img in images
    ]
