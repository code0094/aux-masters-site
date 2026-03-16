from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact import ContactMessage


async def create_message(
    session: AsyncSession,
    *,
    name: str,
    email: str,
    subject: str,
    message: str,
) -> ContactMessage:
    msg = ContactMessage(
        name=name,
        email=email,
        subject=subject,
        message=message,
    )
    session.add(msg)
    await session.commit()
    await session.refresh(msg)
    return msg


async def get_unread_messages(session: AsyncSession) -> list[ContactMessage]:
    result = await session.execute(
        select(ContactMessage)
        .where(ContactMessage.is_read == False)  # noqa: E712
        .order_by(ContactMessage.created_at.desc())
    )
    return list(result.scalars().all())


async def get_all_messages(
    session: AsyncSession, limit: int = 50
) -> list[ContactMessage]:
    result = await session.execute(
        select(ContactMessage)
        .order_by(ContactMessage.created_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())


async def mark_as_read(session: AsyncSession, message_id: int) -> bool:
    result = await session.execute(
        select(ContactMessage).where(ContactMessage.id == message_id)
    )
    msg = result.scalar_one_or_none()
    if not msg:
        return False
    msg.is_read = True
    await session.commit()
    return True
