from pydantic import BaseModel


class EventOut(BaseModel):
    id: int
    title: str
    date: str
    time: str
    venue: str
    city: str
    lineup: list[str]
    description: str
    status: str
    ticketLink: str
    poster: str


class EventCreate(BaseModel):
    title: str
    date: str
    time: str
    venue: str
    city: str
    description: str = ""
    status: str = "upcoming"
    ticket_link: str = ""
    poster_url: str = ""
    lineup: list[str] = []


class EventUpdate(BaseModel):
    title: str | None = None
    date: str | None = None
    time: str | None = None
    venue: str | None = None
    city: str | None = None
    description: str | None = None
    status: str | None = None
    ticket_link: str | None = None
    poster_url: str | None = None
    lineup: list[str] | None = None
