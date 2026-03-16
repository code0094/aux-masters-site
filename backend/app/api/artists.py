from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.artist import ArtistOut
from app.services import artist_service

router = APIRouter()


def _to_out(artist) -> dict:
    return {
        "id": artist.slug,
        "name": artist.name,
        "type": artist.type,
        "role": artist.role,
        "shortDesc": artist.short_desc,
        "fullDesc": artist.full_desc,
        "genres": [ag.genre.name for ag in artist.genres],
        "symbol": artist.symbol,
        "photo": artist.photo_url,
        "soundcloud": artist.soundcloud_url,
        "instagram": artist.instagram_url,
        "telegram": artist.telegram_url,
    }


@router.get("/", response_model=list[ArtistOut])
async def list_artists(db: AsyncSession = Depends(get_db)):
    artists = await artist_service.get_all_artists(db)
    return [_to_out(a) for a in artists]


@router.get("/{slug}", response_model=ArtistOut)
async def get_artist(slug: str, db: AsyncSession = Depends(get_db)):
    artist = await artist_service.get_artist_by_slug(db, slug)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return _to_out(artist)
