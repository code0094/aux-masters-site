from datetime import datetime, timezone

from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Genre(Base):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)


class Artist(Base):
    __tablename__ = "artists"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False, default="dj")
    role: Mapped[str] = mapped_column(String(200), default="")
    short_desc: Mapped[str] = mapped_column(Text, default="")
    full_desc: Mapped[str] = mapped_column(Text, default="")
    symbol: Mapped[str] = mapped_column(String(10), default="")
    photo_url: Mapped[str] = mapped_column(String(500), default="")
    soundcloud_url: Mapped[str] = mapped_column(String(500), default="")
    instagram_url: Mapped[str] = mapped_column(String(500), default="")
    telegram_url: Mapped[str] = mapped_column(String(500), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    genres: Mapped[list["ArtistGenre"]] = relationship(
        back_populates="artist", cascade="all, delete-orphan"
    )
    event_lineups: Mapped[list["EventLineup"]] = relationship(back_populates="artist")
    mixes: Mapped[list["Mix"]] = relationship(back_populates="artist")


class ArtistGenre(Base):
    __tablename__ = "artist_genres"
    __table_args__ = (UniqueConstraint("artist_id", "genre_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id", ondelete="CASCADE"))
    genre_id: Mapped[int] = mapped_column(ForeignKey("genres.id", ondelete="CASCADE"))

    artist: Mapped["Artist"] = relationship(back_populates="genres")
    genre: Mapped["Genre"] = relationship()
