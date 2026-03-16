from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.event import Event, EventLineup


async def get_all_events(
    session: AsyncSession, status: str | None = None
) -> list[Event]:
    stmt = select(Event).options(selectinload(Event.lineup))
    if status:
        stmt = stmt.where(Event.status == status)
    stmt = stmt.order_by(Event.date.desc())
    result = await session.execute(stmt)
    return list(result.scalars().all())


async def get_event_by_id(session: AsyncSession, event_id: int) -> Event | None:
    result = await session.execute(
        select(Event)
        .where(Event.id == event_id)
        .options(selectinload(Event.lineup))
    )
    return result.scalar_one_or_none()


async def create_event(
    session: AsyncSession,
    *,
    title: str,
    event_date: str,
    time: str,
    venue: str,
    city: str,
    description: str = "",
    status: str = "upcoming",
    ticket_link: str = "",
    poster_url: str = "",
    lineup: list[str] | None = None,
) -> Event:
    try:
        parsed_date = date.fromisoformat(event_date)
    except ValueError:
        raise ValueError(f"Invalid date format: '{event_date}', expected YYYY-MM-DD")

    event = Event(
        title=title,
        date=parsed_date,
        time=time,
        venue=venue,
        city=city,
        description=description,
        status=status,
        ticket_link=ticket_link,
        poster_url=poster_url,
    )
    session.add(event)
    await session.flush()

    if lineup:
        for i, display_name in enumerate(lineup):
            session.add(
                EventLineup(
                    event_id=event.id,
                    display_name=display_name,
                    sort_order=i,
                )
            )

    await session.commit()
    return await get_event_by_id(session, event.id)


async def update_event(
    session: AsyncSession,
    event_id: int,
    **kwargs,
) -> Event | None:
    event = await get_event_by_id(session, event_id)
    if not event:
        return None

    lineup = kwargs.pop("lineup", None)
    event_date = kwargs.pop("event_date", None)

    if event_date is not None:
        try:
            event.date = date.fromisoformat(event_date)
        except ValueError:
            raise ValueError(f"Invalid date format: '{event_date}', expected YYYY-MM-DD")

    for key, value in kwargs.items():
        if value is not None and hasattr(event, key):
            setattr(event, key, value)

    if lineup is not None:
        for li in list(event.lineup):
            await session.delete(li)
        await session.flush()
        for i, display_name in enumerate(lineup):
            session.add(
                EventLineup(
                    event_id=event.id,
                    display_name=display_name,
                    sort_order=i,
                )
            )

    await session.commit()
    return await get_event_by_id(session, event_id)


async def delete_event(session: AsyncSession, event_id: int) -> bool:
    event = await get_event_by_id(session, event_id)
    if not event:
        return False
    await session.delete(event)
    await session.commit()
    return True
