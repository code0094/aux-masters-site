from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.artist import Artist, Genre, ArtistGenre


async def _get_or_create_genre(session: AsyncSession, name: str) -> Genre:
    result = await session.execute(select(Genre).where(Genre.name == name))
    genre = result.scalar_one_or_none()
    if not genre:
        genre = Genre(name=name)
        session.add(genre)
        await session.flush()
    return genre


async def get_all_artists(session: AsyncSession) -> list[Artist]:
    result = await session.execute(
        select(Artist)
        .options(selectinload(Artist.genres).selectinload(ArtistGenre.genre))
        .order_by(Artist.sort_order, Artist.id)
    )
    return list(result.scalars().all())


async def get_artists_by_type(session: AsyncSession, type_: str) -> list[Artist]:
    result = await session.execute(
        select(Artist)
        .where(Artist.type == type_)
        .options(selectinload(Artist.genres).selectinload(ArtistGenre.genre))
        .order_by(Artist.sort_order, Artist.id)
    )
    return list(result.scalars().all())


async def get_artist_by_slug(session: AsyncSession, slug: str) -> Artist | None:
    result = await session.execute(
        select(Artist)
        .where(Artist.slug == slug)
        .options(selectinload(Artist.genres).selectinload(ArtistGenre.genre))
    )
    return result.scalar_one_or_none()


async def create_artist(
    session: AsyncSession,
    *,
    slug: str,
    name: str,
    type: str = "dj",
    role: str = "",
    short_desc: str = "",
    full_desc: str = "",
    symbol: str = "",
    photo_url: str = "",
    soundcloud_url: str = "",
    instagram_url: str = "",
    telegram_url: str = "",
    sort_order: int = 0,
    genres: list[str] | None = None,
) -> Artist:
    artist = Artist(
        slug=slug,
        name=name,
        type=type,
        role=role,
        short_desc=short_desc,
        full_desc=full_desc,
        symbol=symbol,
        photo_url=photo_url,
        soundcloud_url=soundcloud_url,
        instagram_url=instagram_url,
        telegram_url=telegram_url,
        sort_order=sort_order,
    )
    session.add(artist)
    await session.flush()

    if genres:
        for genre_name in genres:
            genre = await _get_or_create_genre(session, genre_name)
            session.add(ArtistGenre(artist_id=artist.id, genre_id=genre.id))

    await session.commit()
    return await get_artist_by_slug(session, slug)


async def update_artist(
    session: AsyncSession,
    slug: str,
    **kwargs,
) -> Artist | None:
    artist = await get_artist_by_slug(session, slug)
    if not artist:
        return None

    genres = kwargs.pop("genres", None)

    for key, value in kwargs.items():
        if value is not None and hasattr(artist, key):
            setattr(artist, key, value)

    if genres is not None:
        # Replace all genre associations
        for ag in list(artist.genres):
            await session.delete(ag)
        await session.flush()
        for genre_name in genres:
            genre = await _get_or_create_genre(session, genre_name)
            session.add(ArtistGenre(artist_id=artist.id, genre_id=genre.id))

    await session.commit()
    return await get_artist_by_slug(session, slug)


async def delete_artist(session: AsyncSession, slug: str) -> bool:
    artist = await get_artist_by_slug(session, slug)
    if not artist:
        return False
    await session.delete(artist)
    await session.commit()
    return True
