from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.event import EventOut
from app.services import event_service

router = APIRouter()


def _to_out(event) -> dict:
    return {
        "id": event.id,
        "title": event.title,
        "date": event.date.isoformat(),
        "time": event.time,
        "venue": event.venue,
        "city": event.city,
        "lineup": [li.display_name for li in event.lineup],
        "description": event.description,
        "status": event.status,
        "ticketLink": event.ticket_link,
        "poster": event.poster_url,
    }


@router.get("/", response_model=list[EventOut])
async def list_events(
    status: str | None = None, db: AsyncSession = Depends(get_db)
):
    events = await event_service.get_all_events(db, status=status)
    return [_to_out(e) for e in events]


@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: int, db: AsyncSession = Depends(get_db)):
    event = await event_service.get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return _to_out(event)
