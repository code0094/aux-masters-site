from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.artist import Artist
from app.models.mix import Mix, MixGenre
from app.services.artist_service import _get_or_create_genre

# Shared eager-load options for Mix queries
_MIX_LOAD_OPTIONS = (
    selectinload(Mix.artist),
    selectinload(Mix.genres).selectinload(MixGenre.genre),
)


async def _resolve_artist(session: AsyncSession, slug: str) -> Artist:
    """Look up artist by slug, raise ValueError if not found."""
    result = await session.execute(select(Artist).where(Artist.slug == slug))
    artist = result.scalar_one_or_none()
    if not artist:
        raise ValueError(f"Artist with slug '{slug}' not found")
    return artist


async def _set_mix_genres(session: AsyncSession, mix_id: int, genres: list[str], *, clear_existing: bool = False) -> None:
    """Set genres for a mix. If clear_existing, removes old associations first."""
    if clear_existing:
        await session.execute(delete(MixGenre).where(MixGenre.mix_id == mix_id))
        await session.flush()
    for name in genres:
        genre = await _get_or_create_genre(session, name)
        session.add(MixGenre(mix_id=mix_id, genre_id=genre.id))


async def get_all_mixes(session: AsyncSession) -> list[Mix]:
    result = await session.execute(
        select(Mix).options(*_MIX_LOAD_OPTIONS).order_by(Mix.sort_order, Mix.id)
    )
    return list(result.scalars().all())


async def get_mix_by_id(session: AsyncSession, mix_id: int) -> Mix | None:
    result = await session.execute(
        select(Mix).where(Mix.id == mix_id).options(*_MIX_LOAD_OPTIONS)
    )
    return result.scalar_one_or_none()


async def create_mix(
    session: AsyncSession,
    *,
    artist_slug: str,
    title: str,
    date: str,
    duration: str = "",
    soundcloud_url: str = "",
    description: str = "",
    sort_order: int = 0,
    genres: list[str] | None = None,
) -> Mix:
    artist = await _resolve_artist(session, artist_slug)
    mix = Mix(
        artist_id=artist.id, title=title, date=date, duration=duration,
        soundcloud_url=soundcloud_url, description=description, sort_order=sort_order,
    )
    session.add(mix)
    await session.flush()
    if genres:
        await _set_mix_genres(session, mix.id, genres)
    await session.commit()
    return await get_mix_by_id(session, mix.id)


async def update_mix(
    session: AsyncSession,
    mix_id: int,
    **kwargs,
) -> Mix | None:
    mix = await get_mix_by_id(session, mix_id)
    if not mix:
        return None

    genres = kwargs.pop("genres", None)
    artist_slug = kwargs.pop("artist_slug", None)

    if artist_slug:
        artist = await _resolve_artist(session, artist_slug)
        mix.artist_id = artist.id

    for key, value in kwargs.items():
        if value is not None and hasattr(mix, key):
            setattr(mix, key, value)

    if genres is not None:
        await _set_mix_genres(session, mix.id, genres, clear_existing=True)

    await session.commit()
    session.expire_all()
    return await get_mix_by_id(session, mix_id)


async def delete_mix(session: AsyncSession, mix_id: int) -> bool:
    mix = await get_mix_by_id(session, mix_id)
    if not mix:
        return False
    await session.delete(mix)
    await session.commit()
    return True
