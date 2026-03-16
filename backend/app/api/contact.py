from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.contact import ContactMessageCreate
from app.services import contact_service

router = APIRouter()


@router.post("/", status_code=201)
async def submit_contact(
    data: ContactMessageCreate, db: AsyncSession = Depends(get_db)
):
    await contact_service.create_message(
        db,
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message,
    )
    return {"ok": True, "message": "Message received"}
