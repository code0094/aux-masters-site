from aiogram.types import (
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    ReplyKeyboardMarkup,
    KeyboardButton,
    WebAppInfo,
)


def admin_webapp_kb(url: str) -> InlineKeyboardMarkup:
    """Inline button that opens the Mini App admin panel."""
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(
            text="🔧 Открыть админку",
            web_app=WebAppInfo(url=url),
        )]
    ])


def admin_reply_kb(url: str) -> ReplyKeyboardMarkup:
    """Persistent reply keyboard with Mini App button."""
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(
                text="🔧 Админка",
                web_app=WebAppInfo(url=url),
            )],
        ],
        resize_keyboard=True,
    )


def confirm_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="Да", callback_data="confirm_yes"),
            InlineKeyboardButton(text="Отмена", callback_data="confirm_no"),
        ]
    ])


def artist_list_keyboard(artists: list) -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton(text=a.name, callback_data=f"artist:{a.slug}")]
        for a in artists
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def event_list_keyboard(events: list) -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton(
            text=f"{e.title} ({e.date})",
            callback_data=f"event:{e.id}",
        )]
        for e in events
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def event_status_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="upcoming", callback_data="status:upcoming"),
            InlineKeyboardButton(text="past", callback_data="status:past"),
        ]
    ])


def mix_list_keyboard(mixes: list) -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton(
            text=f"{m.title} — {m.artist.name}",
            callback_data=f"mix:{m.id}",
        )]
        for m in mixes
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)
