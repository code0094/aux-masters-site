from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./auxmasters.db"

    BOT_TOKEN: str = ""
    OWNER_TELEGRAM_ID: int = 0

    UPLOAD_DIR: str = "../public/images"
    MAX_IMAGE_SIZE_MB: int = 10

    API_PREFIX: str = "/api"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    WEBAPP_URL: str = ""  # Telegram Mini App URL, e.g. https://yoursite.com/admin

    DEBUG: bool = True

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
