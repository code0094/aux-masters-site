from datetime import datetime, date, timezone

from sqlalchemy import String, Text, Integer, DateTime, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    time: Mapped[str] = mapped_column(String(10), nullable=False)
    venue: Mapped[str] = mapped_column(String(200), nullable=False)
    city: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(20), default="upcoming")
    ticket_link: Mapped[str] = mapped_column(String(500), default="")
    poster_url: Mapped[str] = mapped_column(String(500), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    lineup: Mapped[list["EventLineup"]] = relationship(
        back_populates="event",
        cascade="all, delete-orphan",
        order_by="EventLineup.sort_order",
    )
    gallery_images: Mapped[list["GalleryImage"]] = relationship(back_populates="event")


class EventLineup(Base):
    __tablename__ = "event_lineup"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id", ondelete="CASCADE"))
    artist_id: Mapped[int | None] = mapped_column(
        ForeignKey("artists.id", ondelete="SET NULL"), nullable=True
    )
    display_name: Mapped[str] = mapped_column(String(300), nullable=False)
    time_slot: Mapped[str] = mapped_column(String(100), default="")
    genre_label: Mapped[str] = mapped_column(String(100), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    event: Mapped["Event"] = relationship(back_populates="lineup")
    artist: Mapped["Artist | None"] = relationship(back_populates="event_lineups")
