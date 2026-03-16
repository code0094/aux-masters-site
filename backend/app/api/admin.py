"""Admin CRUD API — protected by Telegram WebApp auth."""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.api.deps import get_db
from app.api.auth import get_current_admin
from app.models.bot_admin import BotAdmin
from app.services import (
    artist_service,
    event_service,
    mix_service,
    gallery_service,
    contact_service,
    bot_admin_service,
)

router = APIRouter(dependencies=[Depends(get_current_admin)])


# ── Schemas ──────────────────────────────────────────────

class ArtistIn(BaseModel):
    slug: str
    name: str
    type: str = "dj"
    role: str = ""
    short_desc: str = ""
    full_desc: str = ""
    symbol: str = ""
    photo_url: str = ""
    soundcloud_url: str = ""
    instagram_url: str = ""
    telegram_url: str = ""
    genres: list[str] = []


class EventIn(BaseModel):
    title: str
    date: str  # YYYY-MM-DD
    time: str = ""
    venue: str = ""
    city: str = ""
    description: str = ""
    status: str = "upcoming"
    ticket_link: str = ""
    poster_url: str = ""
    lineup: list[str] = []


class MixIn(BaseModel):
    artist_slug: str
    title: str
    date: str = ""
    duration: str = ""
    soundcloud_url: str = ""
    description: str = ""
    genres: list[str] = []


# ── Stats ────────────────────────────────────────────────

@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    artists = await artist_service.get_all_artists(db)
    events = await event_service.get_all_events(db)
    images = await gallery_service.get_all_images(db)
    mixes = await mix_service.get_all_mixes(db)
    messages = await contact_service.get_unread_messages(db)
    return {
        "artists": len(artists),
        "events": len(events),
        "photos": len(images),
        "mixes": len(mixes),
        "unread": len(messages),
    }


# ── Artists ──────────────────────────────────────────────

def _artist_out(a):
    return {
        "id": a.slug,
        "slug": a.slug,
        "name": a.name,
        "type": a.type,
        "role": a.role,
        "shortDesc": a.short_desc,
        "fullDesc": a.full_desc,
        "symbol": a.symbol,
        "photo": a.photo_url,
        "soundcloud": a.soundcloud_url,
        "instagram": a.instagram_url,
        "telegram": a.telegram_url,
        "genres": [ag.genre.name for ag in a.genres],
    }


@router.get("/artists")
async def list_artists(db: AsyncSession = Depends(get_db)):
    artists = await artist_service.get_all_artists(db)
    return [_artist_out(a) for a in artists]


@router.post("/artists")
async def create_artist(data: ArtistIn, db: AsyncSession = Depends(get_db)):
    artist = await artist_service.create_artist(
        db,
        slug=data.slug,
        name=data.name,
        type_=data.type,
        role=data.role,
        short_desc=data.short_desc,
        full_desc=data.full_desc,
        symbol=data.symbol,
        photo_url=data.photo_url,
        soundcloud_url=data.soundcloud_url,
        instagram_url=data.instagram_url,
        telegram_url=data.telegram_url,
        genres=data.genres,
    )
    return _artist_out(artist)


@router.put("/artists/{slug}")
async def update_artist(slug: str, data: ArtistIn, db: AsyncSession = Depends(get_db)):
    artist = await artist_service.update_artist(
        db,
        slug,
        name=data.name,
        type_=data.type,
        role=data.role,
        short_desc=data.short_desc,
        full_desc=data.full_desc,
        symbol=data.symbol,
        photo_url=data.photo_url,
        soundcloud_url=data.soundcloud_url,
        instagram_url=data.instagram_url,
        telegram_url=data.telegram_url,
        genres=data.genres,
    )
    if not artist:
        raise HTTPException(404, "Artist not found")
    return _artist_out(artist)


@router.delete("/artists/{slug}")
async def delete_artist(slug: str, db: AsyncSession = Depends(get_db)):
    ok = await artist_service.delete_artist(db, slug)
    if not ok:
        raise HTTPException(404, "Artist not found")
    return {"ok": True}


# ── Events ───────────────────────────────────────────────

def _event_out(e):
    return {
        "id": e.id,
        "title": e.title,
        "date": e.date.isoformat(),
        "time": e.time,
        "venue": e.venue,
        "city": e.city,
        "lineup": [li.display_name for li in e.lineup],
        "description": e.description,
        "status": e.status,
        "ticketLink": e.ticket_link,
        "poster": e.poster_url,
    }


@router.get("/events")
async def list_events(db: AsyncSession = Depends(get_db)):
    events = await event_service.get_all_events(db)
    return [_event_out(e) for e in events]


@router.post("/events")
async def create_event(data: EventIn, db: AsyncSession = Depends(get_db)):
    try:
        event = await event_service.create_event(
            db,
            title=data.title,
            event_date=data.date,
            time=data.time,
            venue=data.venue,
            city=data.city,
            description=data.description,
            status=data.status,
            ticket_link=data.ticket_link,
            poster_url=data.poster_url,
            lineup=data.lineup,
        )
    except ValueError as e:
        raise HTTPException(400, str(e))
    return _event_out(event)


@router.put("/events/{event_id}")
async def update_event(event_id: int, data: EventIn, db: AsyncSession = Depends(get_db)):
    try:
        event = await event_service.update_event(
            db,
            event_id,
            title=data.title,
            event_date=data.date,
            time=data.time,
            venue=data.venue,
            city=data.city,
            description=data.description,
            status=data.status,
            ticket_link=data.ticket_link,
            poster_url=data.poster_url,
            lineup=data.lineup,
        )
    except ValueError as e:
        raise HTTPException(400, str(e))
    if not event:
        raise HTTPException(404, "Event not found")
    return _event_out(event)


@router.delete("/events/{event_id}")
async def delete_event(event_id: int, db: AsyncSession = Depends(get_db)):
    ok = await event_service.delete_event(db, event_id)
    if not ok:
        raise HTTPException(404, "Event not found")
    return {"ok": True}


# ── Mixes ────────────────────────────────────────────────

def _mix_out(m):
    return {
        "id": m.id,
        "title": m.title,
        "artist": m.artist.name if m.artist else "",
        "artistSlug": m.artist.slug if m.artist else "",
        "date": m.date,
        "duration": m.duration,
        "genres": [mg.genre.name for mg in m.genres],
        "soundcloudUrl": m.soundcloud_url,
        "description": m.description,
    }


@router.get("/mixes")
async def list_mixes(db: AsyncSession = Depends(get_db)):
    mixes = await mix_service.get_all_mixes(db)
    return [_mix_out(m) for m in mixes]


@router.post("/mixes")
async def create_mix(data: MixIn, db: AsyncSession = Depends(get_db)):
    mix = await mix_service.create_mix(
        db,
        artist_slug=data.artist_slug,
        title=data.title,
        date=data.date,
        duration=data.duration,
        soundcloud_url=data.soundcloud_url,
        description=data.description,
        genres=data.genres,
    )
    return _mix_out(mix)


@router.put("/mixes/{mix_id}")
async def update_mix(mix_id: int, data: MixIn, db: AsyncSession = Depends(get_db)):
    mix = await mix_service.update_mix(
        db,
        mix_id,
        artist_slug=data.artist_slug,
        title=data.title,
        date=data.date,
        duration=data.duration,
        soundcloud_url=data.soundcloud_url,
        description=data.description,
        genres=data.genres,
    )
    if not mix:
        raise HTTPException(404, "Mix not found")
    return _mix_out(mix)


@router.delete("/mixes/{mix_id}")
async def delete_mix(mix_id: int, db: AsyncSession = Depends(get_db)):
    ok = await mix_service.delete_mix(db, mix_id)
    if not ok:
        raise HTTPException(404, "Mix not found")
    return {"ok": True}


# ── Gallery ──────────────────────────────────────────────

@router.get("/gallery")
async def list_gallery(db: AsyncSession = Depends(get_db)):
    images = await gallery_service.get_all_images(db)
    return [
        {
            "id": img.id,
            "src": img.image_url,
            "alt": img.alt_text,
            "event": img.event.title if img.event else "AUX MASTERS",
        }
        for img in images
    ]


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}


@router.post("/gallery")
async def upload_photo(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    import os
    import uuid

    from app.config import settings

    # Validate MIME type
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(400, f"Unsupported file type: {file.content_type}")

    content = await file.read()

    # Validate file size
    max_bytes = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(400, f"File too large (max {settings.MAX_IMAGE_SIZE_MB}MB)")

    upload_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "public", "images", "gallery"))
    os.makedirs(upload_dir, exist_ok=True)

    ext = os.path.splitext(file.filename or "photo.jpg")[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(upload_dir, filename)

    try:
        with open(filepath, "wb") as f:
            f.write(content)
    except OSError as e:
        raise HTTPException(500, f"Failed to save file: {e}")

    image_url = f"/images/gallery/{filename}"
    img = await gallery_service.add_image(db, image_url=image_url, alt_text="AUX MASTERS")
    return {"id": img.id, "src": img.image_url, "alt": img.alt_text}


@router.delete("/gallery/{image_id}")
async def delete_photo(image_id: int, db: AsyncSession = Depends(get_db)):
    ok = await gallery_service.delete_image(db, image_id)
    if not ok:
        raise HTTPException(404, "Image not found")
    return {"ok": True}


# ── Messages ─────────────────────────────────────────────

@router.get("/messages")
async def list_messages(db: AsyncSession = Depends(get_db)):
    messages = await contact_service.get_all_messages(db, limit=100)
    return [
        {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "subject": m.subject,
            "message": m.message,
            "isRead": m.is_read,
            "createdAt": m.created_at.isoformat() if m.created_at else "",
        }
        for m in messages
    ]


@router.patch("/messages/{msg_id}/read")
async def mark_message_read(msg_id: int, db: AsyncSession = Depends(get_db)):
    ok = await contact_service.mark_as_read(db, msg_id)
    if not ok:
        raise HTTPException(404, "Message not found")
    return {"ok": True}


# ── Admins ───────────────────────────────────────────────

@router.get("/admins")
async def list_admins(
    db: AsyncSession = Depends(get_db),
    admin: BotAdmin = Depends(get_current_admin),
):
    admins = await bot_admin_service.get_all_admins(db)
    return [
        {
            "id": a.id,
            "telegramId": a.telegram_id,
            "username": a.username,
            "role": a.role,
        }
        for a in admins
    ]


class AddAdminIn(BaseModel):
    telegramId: int


@router.post("/admins")
async def add_admin(
    data: AddAdminIn,
    db: AsyncSession = Depends(get_db),
    admin: BotAdmin = Depends(get_current_admin),
):
    if admin.role != "owner":
        raise HTTPException(403, "Only owner can manage admins")
    new_admin = await bot_admin_service.add_admin(db, data.telegramId)
    return {"id": new_admin.id, "telegramId": new_admin.telegram_id, "role": new_admin.role}


@router.delete("/admins/{telegram_id}")
async def remove_admin(
    telegram_id: int,
    db: AsyncSession = Depends(get_db),
    admin: BotAdmin = Depends(get_current_admin),
):
    if admin.role != "owner":
        raise HTTPException(403, "Only owner can manage admins")
    ok = await bot_admin_service.remove_admin(db, telegram_id)
    if not ok:
        raise HTTPException(404, "Admin not found")
    return {"ok": True}
