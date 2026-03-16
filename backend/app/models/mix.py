from datetime import datetime, timezone

from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Mix(Base):
    __tablename__ = "mixes"

    id: Mapped[int] = mapped_column(primary_key=True)
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    date: Mapped[str] = mapped_column(String(20), nullable=False)
    duration: Mapped[str] = mapped_column(String(20), default="")
    soundcloud_url: Mapped[str] = mapped_column(String(500), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    artist: Mapped["Artist"] = relationship(back_populates="mixes")
    genres: Mapped[list["MixGenre"]] = relationship(
        back_populates="mix", cascade="all, delete-orphan"
    )


class MixGenre(Base):
    __tablename__ = "mix_genres"
    __table_args__ = (UniqueConstraint("mix_id", "genre_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    mix_id: Mapped[int] = mapped_column(ForeignKey("mixes.id", ondelete="CASCADE"))
    genre_id: Mapped[int] = mapped_column(ForeignKey("genres.id", ondelete="CASCADE"))

    mix: Mapped["Mix"] = relationship(back_populates="genres")
    genre: Mapped["Genre"] = relationship()
