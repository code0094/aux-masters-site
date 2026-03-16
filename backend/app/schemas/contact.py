from pydantic import BaseModel
from datetime import datetime


class ContactMessageCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
