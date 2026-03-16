from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.mix import MixOut
from app.services import mix_service

router = APIRouter()


def _to_out(mix) -> dict:
    return {
        "id": mix.id,
        "title": mix.title,
        "artist": mix.artist.name,
        "date": mix.date,
        "duration": mix.duration,
        "genres": [mg.genre.name for mg in mix.genres],
        "soundcloudUrl": mix.soundcloud_url,
        "description": mix.description,
    }


@router.get("/", response_model=list[MixOut])
async def list_mixes(db: AsyncSession = Depends(get_db)):
    mixes = await mix_service.get_all_mixes(db)
    return [_to_out(m) for m in mixes]
