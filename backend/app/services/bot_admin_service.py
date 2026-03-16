from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.bot_admin import BotAdmin


async def is_admin(session: AsyncSession, telegram_id: int) -> bool:
    result = await session.execute(
        select(BotAdmin).where(BotAdmin.telegram_id == telegram_id)
    )
    return result.scalar_one_or_none() is not None


async def is_owner(session: AsyncSession, telegram_id: int) -> bool:
    result = await session.execute(
        select(BotAdmin).where(
            BotAdmin.telegram_id == telegram_id, BotAdmin.role == "owner"
        )
    )
    return result.scalar_one_or_none() is not None


async def add_admin(
    session: AsyncSession,
    telegram_id: int,
    username: str = "",
    role: str = "admin",
) -> BotAdmin:
    admin = BotAdmin(telegram_id=telegram_id, username=username, role=role)
    session.add(admin)
    await session.commit()
    await session.refresh(admin)
    return admin


async def remove_admin(session: AsyncSession, telegram_id: int) -> bool:
    result = await session.execute(
        select(BotAdmin).where(BotAdmin.telegram_id == telegram_id)
    )
    admin = result.scalar_one_or_none()
    if not admin:
        return False
    await session.delete(admin)
    await session.commit()
    return True


async def get_all_admins(session: AsyncSession) -> list[BotAdmin]:
    result = await session.execute(
        select(BotAdmin).order_by(BotAdmin.created_at)
    )
    return list(result.scalars().all())


async def ensure_owner_exists(session: AsyncSession, owner_tg_id: int) -> None:
    if owner_tg_id == 0:
        return
    result = await session.execute(
        select(BotAdmin).where(BotAdmin.telegram_id == owner_tg_id)
    )
    if result.scalar_one_or_none() is None:
        session.add(BotAdmin(telegram_id=owner_tg_id, role="owner"))
        await session.commit()
