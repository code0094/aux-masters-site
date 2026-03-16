from pydantic import BaseModel


class MixOut(BaseModel):
    id: int
    title: str
    artist: str
    date: str
    duration: str
    genres: list[str]
    soundcloudUrl: str
    description: str


class MixCreate(BaseModel):
    artist_slug: str
    title: str
    date: str
    duration: str = ""
    soundcloud_url: str = ""
    description: str = ""
    sort_order: int = 0
    genres: list[str] = []


class MixUpdate(BaseModel):
    title: str | None = None
    date: str | None = None
    duration: str | None = None
    soundcloud_url: str | None = None
    description: str | None = None
    sort_order: int | None = None
    genres: list[str] | None = None
