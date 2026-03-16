from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.gallery import GalleryImage


async def get_all_images(session: AsyncSession) -> list[GalleryImage]:
    result = await session.execute(
        select(GalleryImage)
        .options(selectinload(GalleryImage.event))
        .order_by(GalleryImage.sort_order, GalleryImage.id)
    )
    return list(result.scalars().all())


async def add_image(
    session: AsyncSession,
    *,
    image_url: str,
    event_id: int | None = None,
    alt_text: str = "",
    sort_order: int = 0,
) -> GalleryImage:
    image = GalleryImage(
        image_url=image_url,
        event_id=event_id,
        alt_text=alt_text,
        sort_order=sort_order,
    )
    session.add(image)
    await session.commit()
    await session.refresh(image)
    return image


async def delete_image(session: AsyncSession, image_id: int) -> bool:
    result = await session.execute(
        select(GalleryImage).where(GalleryImage.id == image_id)
    )
    image = result.scalar_one_or_none()
    if not image:
        return False
    await session.delete(image)
    await session.commit()
    return True
