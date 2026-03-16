from pydantic import BaseModel


class ArtistOut(BaseModel):
    id: str
    name: str
    type: str
    role: str
    shortDesc: str
    fullDesc: str
    genres: list[str]
    symbol: str
    photo: str
    soundcloud: str
    instagram: str
    telegram: str


class ArtistCreate(BaseModel):
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
    sort_order: int = 0
    genres: list[str] = []


class ArtistUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    role: str | None = None
    short_desc: str | None = None
    full_desc: str | None = None
    symbol: str | None = None
    photo_url: str | None = None
    soundcloud_url: str | None = None
    instagram_url: str | None = None
    telegram_url: str | None = None
    sort_order: int | None = None
    genres: list[str] | None = None
