from fastapi import APIRouter

from app.api import artists, events, mixes, gallery, contact, admin

api_router = APIRouter()
api_router.include_router(artists.router, prefix="/artists", tags=["artists"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(mixes.router, prefix="/mixes", tags=["mixes"])
api_router.include_router(gallery.router, prefix="/gallery", tags=["gallery"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
