# AUX MASTERS — Сайт андерграунд DJ-коллектива

## Обзор

Публичный сайт + админ-панель через Telegram Mini App для DJ-коллектива AUX MASTERS. Монорепо: React-фронтенд и FastAPI-бэкенд в одном проекте.

## Стек технологий

| Слой | Технология |
|------|-----------|
| **Frontend** | React 18.2 + React Router 6.20 + Vite 5 |
| **Backend** | FastAPI + uvicorn (async) |
| **ORM** | SQLAlchemy 2.0 (async, Mapped columns) |
| **Миграции** | Alembic |
| **Telegram бот** | aiogram 3.15+ |
| **БД** | SQLite (dev: `backend/auxmasters.db`) / PostgreSQL (prod) |
| **Стилизация** | Чистый CSS, тёмная тема, CRT/VHS эстетика |
| **Авторизация** | Telegram WebApp HMAC-SHA256 initData |

## Структура проекта

```
aux-masters-site/
├── CLAUDE.md
├── index.html                 # HTML entry point
├── package.json               # React 18 + Vite 5 + React Router 6
├── vite.config.js             # Proxy /api → localhost:8000
│
├── src/                       # React фронтенд
│   ├── App.jsx                # Роутинг: публичный сайт + lazy-loaded админка
│   ├── main.jsx               # React entry point
│   ├── pages/                 # 10 публичных страниц
│   │   ├── Home.jsx           # Герой, featured DJs, ближайший ивент
│   │   ├── About.jsx
│   │   ├── Artists.jsx        # Грид артистов, фильтр по жанрам
│   │   ├── ArtistDetail.jsx   # /artists/:id — профиль артиста
│   │   ├── Events.jsx         # Список ивентов (upcoming/past)
│   │   ├── EventDetail.jsx    # /events/:id — детали ивента
│   │   ├── Gallery.jsx        # Фотогалерея
│   │   ├── Mixes.jsx          # SoundCloud-эмбеды
│   │   ├── Merch.jsx
│   │   └── Contact.jsx        # Форма обратной связи
│   ├── components/            # Переиспользуемые компоненты
│   │   ├── Layout.jsx         # Header + Footer обёртка
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── DjCard.jsx
│   │   ├── EventCard.jsx
│   │   ├── MixCard.jsx
│   │   └── SectionHeader.jsx
│   ├── admin/                 # Telegram Mini App — админ-панель
│   │   ├── AdminApp.jsx       # Инициализация TG WebApp, роутинг, toast
│   │   ├── api.js             # API-клиент (X-Telegram-Init-Data header)
│   │   ├── Admin.css
│   │   ├── components/        # AdminNav, Confirm, FormField
│   │   └── pages/             # Dashboard, CRUD для всех сущностей
│   │       ├── Dashboard.jsx
│   │       ├── ArtistsList.jsx / ArtistForm.jsx
│   │       ├── EventsList.jsx / EventForm.jsx
│   │       ├── GalleryManager.jsx
│   │       ├── MixesList.jsx / MixForm.jsx
│   │       ├── Messages.jsx
│   │       └── Admins.jsx
│   ├── api/
│   │   └── client.js          # Публичный API-клиент
│   ├── data/                  # Статичные данные (legacy, заменяются API)
│   │   ├── djs.js             # 8 DJ + 2 staff
│   │   ├── events.js
│   │   ├── gallery.js
│   │   └── mixes.js
│   └── styles/
│       └── global.css         # Тёмная тема, CRT-эффекты, адаптив
│
├── backend/                   # FastAPI бэкенд
│   ├── run.py                 # Entry point: FastAPI + бот в asyncio.gather
│   ├── requirements.txt
│   ├── .env / .env.example
│   ├── alembic.ini
│   ├── auxmasters.db          # SQLite файл (dev)
│   ├── alembic/               # Миграции (1 initial migration)
│   └── app/
│       ├── __init__.py
│       ├── main.py            # create_app() фабрика FastAPI
│       ├── config.py          # Pydantic Settings (.env)
│       ├── database.py        # SQLAlchemy async engine + session
│       ├── api/               # Эндпоинты
│       │   ├── router.py      # Подключение всех sub-routers
│       │   ├── auth.py        # Telegram initData HMAC-SHA256 валидация
│       │   ├── deps.py        # get_db() dependency
│       │   ├── artists.py     # GET /api/artists/, GET /api/artists/{slug}
│       │   ├── events.py      # GET /api/events/?status=, GET /api/events/{id}
│       │   ├── mixes.py       # GET /api/mixes/
│       │   ├── gallery.py     # GET /api/gallery/
│       │   ├── contact.py     # POST /api/contact/
│       │   └── admin.py       # Защищённый CRUD: /api/admin/*
│       ├── models/            # SQLAlchemy ORM (10 таблиц)
│       │   ├── artist.py      # Artist, Genre, ArtistGenre
│       │   ├── event.py       # Event, EventLineup
│       │   ├── mix.py         # Mix, MixGenre
│       │   ├── gallery.py     # GalleryImage
│       │   ├── contact.py     # ContactMessage
│       │   └── bot_admin.py   # BotAdmin
│       ├── schemas/           # Pydantic (request/response)
│       ├── services/          # Бизнес-логика (async функции)
│       │   ├── artist_service.py
│       │   ├── event_service.py
│       │   ├── mix_service.py
│       │   ├── gallery_service.py
│       │   ├── contact_service.py
│       │   └── bot_admin_service.py
│       ├── bot/               # Telegram бот (aiogram)
│       │   ├── main.py        # start_bot(), dispatcher setup
│       │   ├── keyboards.py   # Inline + reply keyboards
│       │   ├── middlewares.py  # DB session + admin check
│       │   └── handlers/      # /start, /artists, /events, etc.
│       └── seed/              # Сидирование БД
│
├── public/                    # Статика (images, favicon)
└── dist/                      # Build output (npm run build)
```

## Архитектура

```
Пользователь ──→ React SPA (Vite :5173)
                      │
              /api proxy (vite.config.js)
                      │
                      ▼
               FastAPI (:8000) ←─── Telegram Bot (aiogram, polling)
               /api/artists/           │
               /api/events/            │ FSM-диалоги
               /api/admin/*            │ inline-кнопки
                      │                │
                      ▼                ▼
               SQLAlchemy 2.0 (async)
                      │
               SQLite / PostgreSQL
```

**Два интерфейса в одном процессе**: `run.py` запускает FastAPI и Telegram бот параллельно через `asyncio.gather()`.

**Telegram Mini App**: Админка (`/admin/*`) — React SPA, lazy-loaded. При открытии через Telegram вызывает `tg.ready()`, `tg.expand()`, применяет тему Telegram.

## API маршруты

### Публичные (без авторизации)

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/artists/` | Список артистов |
| GET | `/api/artists/{slug}` | Профиль артиста по slug |
| GET | `/api/events/?status=upcoming\|past` | Ивенты с фильтром |
| GET | `/api/events/{id}` | Детали ивента |
| GET | `/api/mixes/` | Список миксов |
| GET | `/api/gallery/` | Фотогалерея |
| POST | `/api/contact/` | Отправка сообщения (name, email, subject, message) |

### Защищённые (Telegram initData → header `X-Telegram-Init-Data`)

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/admin/stats` | Статистика дашборда |
| GET/POST/PUT/DELETE | `/api/admin/artists` | CRUD артистов |
| GET/POST/PUT/DELETE | `/api/admin/events` | CRUD ивентов |
| GET/POST/DELETE | `/api/admin/mixes` | Управление миксами |
| GET/POST/DELETE | `/api/admin/gallery` | Галерея + загрузка файлов |
| GET/PATCH | `/api/admin/messages` | Сообщения + пометка прочитано |
| GET/POST/DELETE | `/api/admin/admins` | Управление админами (owner only) |

## База данных (10 таблиц)

```
artists (PK: id, UNIQUE: slug)
├── artist_genres (FK: artist_id, genre_id) ──→ genres (PK: id, UNIQUE: name)
├── event_lineup (FK: artist_id, event_id)  ──→ events (PK: id)
│                                                  └── gallery_images (FK: event_id)
└── mixes (FK: artist_id)
    └── mix_genres (FK: mix_id, genre_id) ──→ genres

contact_messages (PK: id) — входящие сообщения
bot_admins (PK: id, UNIQUE: telegram_id) — Telegram-админы (admin/owner)
```

## Авторизация

**Telegram WebApp initData** (HMAC-SHA256):
1. Клиент отправляет `X-Telegram-Init-Data` header
2. Сервер проверяет HMAC подпись через bot token
3. Извлекает `user.id`, проверяет в таблице `bot_admins`
4. Dev mode: header `dev` → возвращает owner из БД (только при `DEBUG=true`)

**Роли**: `owner` (полный доступ + управление админами), `admin` (CRUD контента)

## Telegram бот (aiogram)

Команды: `/start`, `/help`, `/artists`, `/add_artist`, `/delete_artist`, `/events`, `/add_event`, `/delete_event`, `/gallery`, `/upload_photo`, `/delete_photo`, `/mixes`, `/add_mix`, `/delete_mix`, `/messages`, `/mark_read {id}`, `/admins`, `/add_admin`, `/remove_admin`

Middleware: `DbSessionMiddleware` (async session), `AdminCheckMiddleware` (проверка прав, `/start` доступен всем).

## Дизайн (CSS)

- **Тёмная тема**: `#0a0a0a` фон, `#ff3d00` оранжевый акцент
- **CRT/VHS эстетика**: scanlines, glitch-анимации, noise overlay
- **Шрифты**: Bebas Neue (заголовки), VT323 (моноширинный), JetBrains Mono, Space Mono
- **Брейкпоинты**: 968px / 768px / 480px

## Конфигурация (.env)

```env
DATABASE_URL=sqlite+aiosqlite:///./auxmasters.db    # или postgresql+asyncpg://...
BOT_TOKEN=<telegram_bot_token>
OWNER_TELEGRAM_ID=<telegram_user_id>
DEBUG=true
CORS_ORIGINS=["http://localhost:5173"]
WEBAPP_URL=https://your-domain.com/admin             # URL для Telegram Mini App
```

## Запуск

```bash
# Терминал 1 — фронтенд
npm run dev                    # → http://localhost:5173

# Терминал 2 — бэкенд + бот
cd backend
pip install -r requirements.txt
alembic upgrade head           # применить миграции
python run.py                  # → http://localhost:8000 (API + бот)
```

Vite проксирует `/api/*` на `localhost:8000` (vite.config.js).

## Данные

- `src/data/` — статичные JS-модули (legacy), используются как fallback
- `src/api/client.js` — публичный API-клиент (fetch → `/api/...`)
- `src/admin/api.js` — админский API-клиент (fetch + `X-Telegram-Init-Data` header)
- `backend/seed/` — сидирование БД начальными данными

## Известные особенности

- **Два процесса в одном**: FastAPI и aiogram бот работают в одном asyncio loop (`run.py`)
- **Lazy-loaded админка**: `React.lazy(() => import('./admin/AdminApp'))` — не грузится пока не откроешь `/admin`
- **Dev auth bypass**: header `X-Telegram-Init-Data: dev` при `DEBUG=true` пропускает валидацию
- **datetime.utcnow**: используется в моделях (deprecated в Python 3.12+, но работает)
- **Загрузка файлов**: сохраняются в `public/images/`, лимит `MAX_IMAGE_SIZE_MB=10`
- **Cloudflare tunnel**: использовался для тестирования Mini App, может давать 502 если бэкенд не запущен
