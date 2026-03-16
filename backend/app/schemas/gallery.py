from pydantic import BaseModel


class GalleryImageOut(BaseModel):
    id: int
    src: str
    alt: str
    event: str
