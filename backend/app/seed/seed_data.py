"""
Seed database with data from the existing JS frontend files.

Run: cd backend && python -m app.seed.seed_data
"""
import asyncio

from app.database import async_session
from app.services import artist_service, event_service, mix_service, gallery_service

# ============================================================
# Data from src/data/djs.js
# ============================================================
ARTISTS = [
    {
        "slug": "stress303", "name": "STRESS303", "type": "dj",
        "role": "HEADLINERS & CEO",
        "short_desc": "Диджейское дуо karma и zabolotniy. Мастера мультижанровой селекции.",
        "full_desc": "Проект диджейского дуо karma и zabolotniy, хэдлайнеры и CEO тусовки. Мастера мультижанровой селекции, имеющие особое эстетическое восприятие музыки. Они виртуозно соединяют танцпол и селект в единое целое. Каждый их сет — это путешествие через жанры и эпохи, где границы стираются, а музыка становится единым потоком энергии.",
        "symbol": "◈", "photo_url": "/images/artists/stress303.jpg",
        "soundcloud_url": "", "instagram_url": "", "telegram_url": "https://t.me/stress303",
        "sort_order": 0, "genres": ["Multigenre", "Select", "Dancefloor"],
    },
    {
        "slug": "karma", "name": "KARMA", "type": "dj",
        "role": "CO-FOUNDER / STRESS303",
        "short_desc": "Одна половина дуэта STRESS303. Визионер с безупречным чувством ритма.",
        "full_desc": "Одна половина легендарного дуэта STRESS303. Karma — это визионер с безупречным чувством ритма и глубоким пониманием танцпола. Его подход к музыке — это постоянный поиск идеального грува, который заставляет двигаться. В сольных сетах раскрывается как мастер атмосферного звучания, способный провести слушателя через самые неожиданные музыкальные ландшафты.",
        "symbol": "◐", "photo_url": "/images/artists/karma.jpg",
        "soundcloud_url": "", "instagram_url": "", "telegram_url": "",
        "sort_order": 1, "genres": ["Multigenre", "Groove", "Atmospheric"],
    },
    {
        "slug": "zabolotniy", "name": "ZABOLOTNIY", "type": "dj",
        "role": "CO-FOUNDER / STRESS303",
        "short_desc": "Вторая половина дуэта STRESS303. Архитектор звуковых пространств.",
        "full_desc": "Вторая половина дуэта STRESS303. Zabolotniy — архитектор звуковых пространств, чья селекция всегда отличается глубиной и продуманностью. Его музыкальный вкус формировался на стыке различных культур и стилей, что позволяет создавать уникальные сеты, где каждый трек — это часть большой истории. Мастер неожиданных переходов и смелых сочетаний.",
        "symbol": "◑", "photo_url": "/images/artists/zabolotniy.jpg",
        "soundcloud_url": "", "instagram_url": "", "telegram_url": "",
        "sort_order": 2, "genres": ["Multigenre", "Eclectic", "Deep"],
    },
    {
        "slug": "multypool", "name": "MULTYPOOL", "type": "dj",
        "role": "SONIC SHAPESHIFTER",
        "short_desc": "Мастер жанровых метаморфоз. Каждый сет — новая вселенная.",
        "full_desc": "MULTYPOOL — диджей, для которого не существует жанровых границ. Его название говорит само за себя: это бассейн возможностей, где сливаются воедино самые разные музыкальные течения. От глубокого хауса до экспериментальной электроники, от UK garage до техно — каждый сет MULTYPOOL это путешествие без карты, где пункт назначения известен только ему.",
        "symbol": "◎", "photo_url": "/images/artists/multypool.jpg",
        "soundcloud_url": "", "instagram_url": "", "telegram_url": "",
        "sort_order": 3, "genres": ["House", "UK Garage", "Experimental"],
    },
    {
        "slug": "kris-wiseboy", "name": "DJ KRIS WISEBOY", "type": "dj",
        "role": "GROOVE ARCHITECT",
        "short_desc": "Тонкое чувство грува и глубокое понимание саунд-дизайна.",
        "full_desc": "Диджей с тонким чувством грува и глубоким пониманием саунд-дизайна. Его сеты — это путешествие через слои атмосферного звучания, где каждый трек раскрывается в нужный момент. Талантливый начинающий продюсер, исследующий границы электронной музыки и создающий собственное уникальное звучание.",
        "symbol": "◇", "photo_url": "/images/artists/kris-wiseboy.jpg",
        "soundcloud_url": "", "instagram_url": "", "telegram_url": "https://t.me/kw_family",
        "sort_order": 4, "genres": ["Deep", "Atmospheric", "Groove"],
    },
    {
        "slug": "aftermee", "name": "AFTERMEE", "type": "dj",
        "role": "UK SPECIALIST",
        "short_desc": "За её спиной — часы сетов и множество проектов.",
        "full_desc": "За её спиной — часы сетов и множество проектов. Начиная от серии UK вечеринок в найсе, заканчивая Чайным Рейвом. Исключительные диджейские навыки и отличный музыкальный вкус делают её мастером своего дела. Её сеты — это энергия британского андерграунда, перенесённая на локальные танцполы.",
        "symbol": "◆", "photo_url": "/images/artists/aftermee.jpg",
        "soundcloud_url": "", "instagram_url": "", "telegram_url": "https://t.me/officenefor",
        "sort_order": 5, "genres": ["UK Garage", "Bass", "Breaks"],
    },
    {
        "slug": "pozhalusta", "name": "DJ POZHALUSTA", "type": "dj",
        "role": "TECHNO ARCHITECT",
        "short_desc": "Атмосферное звучание и внимание к настроению зала.",
        "full_desc": "Диджей, работающий в жанрах техно и электронной музыки. В сетах — атмосферное звучание и внимание к настроению зала. Держит танцпол в движении, выстраивая цельное и насыщенное звучание. Каждый его сет — это продуманная архитектура звука, где каждый элемент на своём месте.",
        "symbol": "◊", "photo_url": "/images/artists/pozhalusta.jpg",
        "soundcloud_url": "", "instagram_url": "", "telegram_url": "https://t.me/kartushex",
        "sort_order": 6, "genres": ["Techno", "Electronic", "Atmospheric"],
    },
    {
        "slug": "fdnk", "name": "FDNK", "type": "dj",
        "role": "MULTIGENRE EXPLORER",
        "short_desc": "Уникальный подход к музыке и собственный стиль.",
        "full_desc": "Мультижанровый диджей с уникальным подходом к музыке. Опыт и годы самосовершенствования позволили выработать собственный стиль, с которым Женя успел покорить не один танцпол. Его селекция — это неожиданные повороты и смелые сочетания, которые держат аудиторию в напряжении от первого до последнего трека.",
        "symbol": "○", "photo_url": "/images/artists/fdnk.jpg",
        "soundcloud_url": "", "instagram_url": "", "telegram_url": "https://t.me/fndkey",
        "sort_order": 7, "genres": ["Multigenre", "Eclectic", "Experimental"],
    },
    {
        "slug": "leeloo", "name": "LEELOO", "type": "dj",
        "role": "HEAVY SOUND DEALER",
        "short_desc": "Специализируется на тяжёлом звучании. Чистая энергия.",
        "full_desc": "Диджей, который специализируется на тяжёлом звучании. Звуки её техно и электропанка — это чистая энергия, которая превращает танцпол в единый поток. Её сеты — это бескомпромиссный напор и интенсивность, после которых невозможно остаться равнодушным.",
        "symbol": "●", "photo_url": "/images/artists/leeloo.jpg",
        "soundcloud_url": "", "instagram_url": "", "telegram_url": "https://t.me/leelooes",
        "sort_order": 8, "genres": ["Techno", "Electropunk", "Industrial"],
    },
    {
        "slug": "ismael-kireev", "name": "ИСМАЭЛЬ КИРЕЕВ", "type": "staff",
        "role": "ФОТОГРАФ",
        "short_desc": "Ловит моменты, которые остаются навсегда.",
        "full_desc": "Фотограф команды AUX MASTERS. Исмаэль умеет поймать те самые моменты, которые передают атмосферу вечеринки лучше любых слов. Его работы — это не просто фотографии, а визуальные истории о людях, музыке и эмоциях на танцполе.",
        "symbol": "\U0001f4f7", "photo_url": "/images/staff/ismael-kireev.jpg",
        "soundcloud_url": "", "instagram_url": "https://instagram.com/ismael_kireev", "telegram_url": "",
        "sort_order": 9, "genres": [],
    },
    {
        "slug": "ekaterina-pivovarova", "name": "ЕКАТЕРИНА ПИВОВАРОВА", "type": "staff",
        "role": "ФОТОГРАФ",
        "short_desc": "Создаёт визуальную летопись наших событий.",
        "full_desc": "Фотограф, чей взгляд на события AUX MASTERS всегда уникален. Екатерина создаёт визуальную летопись наших вечеринок, сохраняя энергию и эмоции каждого момента. Её фотографии — это окно в мир андерграундной культуры.",
        "symbol": "\U0001f4f7", "photo_url": "/images/staff/ekaterina-pivovarova.jpg",
        "soundcloud_url": "", "instagram_url": "", "telegram_url": "https://t.me/pivobeerk",
        "sort_order": 10, "genres": [],
    },
]

# ============================================================
# Data from src/data/events.js
# ============================================================
EVENTS = [
    {
        "title": "BAD AUX", "event_date": "2025-02-27", "time": "23:00",
        "venue": "Кабинет101", "city": "Нижний Новгород",
        "description": "Андерграундная тусовка от коллектива AUX MASTERS. Бескомпромиссный саунд, нишевые жанры, настоящая клубная культура.",
        "status": "upcoming", "ticket_link": "https://t.me/auxmasters", "poster_url": "",
        "lineup": ["AUX MASTERS CREW"],
    },
    {
        "title": "UNKNOWN PROJECT BY AUX MASTERS", "event_date": "2025-04-11", "time": "23:59",
        "venue": "Клуб Ressource", "city": "Нижний Новгород",
        "description": "Если вы хоть раз задавались вопросом «когда уже у нас в Нижнем будет нормальная техно туса?» — это знак для вас! Эти ребята способны расшевелить толпу и погрузить вас в анабиоз бешеных ритмов, ярких эмоций и взрывной энергетики. Вас ждёт ночь электро, техно и всех производных от них жанров.",
        "status": "past", "ticket_link": "", "poster_url": "/images/events/unknown-project.png",
        "lineup": ["AFTERME", "KARMA", "MULTYPOOL", "ZABOLOTNIY", "WISEBOY", "FNDK", "DJPRIME"],
    },
    {
        "title": "AUX & FRIENDS", "event_date": "2025-01-03", "time": "21:00",
        "venue": "НАЙС", "city": "Нижний Новгород, ул. Кожевенная 1А",
        "description": "Новогодняя вечеринка от AUX MASTERS! Встречаем новый год вместе с друзьями и любимой музыкой. Вход бесплатный.",
        "status": "past", "ticket_link": "", "poster_url": "/images/events/aux-friends.jpg",
        "lineup": ["DJ POZHALUSTA", "DJ PRIME", "AFTERMEE", "KRIS WISEBOY", "FNDK", "STRESS303"],
    },
    {
        "title": "AUX MASTERS x TAGO MAGO", "event_date": "2024-10-12", "time": "23:00",
        "venue": "TAGO MAGO", "city": "Нижний Новгород",
        "description": "Врываемся в депрессивную ветренную осень с новой музыкальной программой! Мы согреем вас старым добрым хаусом, разгорячим драм-н-бэйсом и отправим прямиком в нирвану миксом урбанистики и электронной музыки. А ребята из 'таги' отогреют вас изнутри своими напитками.",
        "status": "past", "ticket_link": "", "poster_url": "/images/events/aux-tago-mago.png",
        "lineup": [
            "23:00-00:00 — AFTERME (Progressive House)",
            "00:00-01:00 — KRIS WISEBOY (Tech House)",
            "01:00-02:00 — KARMA x ZABOLOTNIY (DNB)",
            "02:00-03:00 — VODOVOROT (UK Garage)",
        ],
    },
]

# ============================================================
# Data from src/data/mixes.js
# ============================================================
MIXES = [
    {
        "artist_slug": "stress303", "title": "AUX MASTERS PODCAST #001",
        "date": "2025-01", "duration": "1:30:00",
        "soundcloud_url": "", "description": "Первый подкаст коллектива. Путешествие через жанры от дуо karma & zabolotniy.",
        "sort_order": 0, "genres": ["Multigenre", "Select"],
    },
    {
        "artist_slug": "aftermee", "title": "UK SESSIONS VOL.1",
        "date": "2024-12", "duration": "1:15:00",
        "soundcloud_url": "", "description": "Подборка лучших UK треков от AFTERMEE. Энергия британского андерграунда.",
        "sort_order": 1, "genres": ["UK Garage", "Bass"],
    },
    {
        "artist_slug": "leeloo", "title": "INDUSTRIAL THERAPY",
        "date": "2024-12", "duration": "1:45:00",
        "soundcloud_url": "", "description": "Тяжёлый техно сет. Бескомпромиссный звук для настоящих ценителей.",
        "sort_order": 2, "genres": ["Techno", "Industrial"],
    },
    {
        "artist_slug": "pozhalusta", "title": "ATMOSPHERIC JOURNEY",
        "date": "2024-11", "duration": "2:00:00",
        "soundcloud_url": "", "description": "Двухчасовое погружение в атмосферное техно. Для глубокого прослушивания.",
        "sort_order": 3, "genres": ["Techno", "Atmospheric"],
    },
    {
        "artist_slug": "fdnk", "title": "ECLECTIC MIX",
        "date": "2024-11", "duration": "1:20:00",
        "soundcloud_url": "", "description": "Мультижанровый микс от FDNK. Ожидайте неожиданного.",
        "sort_order": 4, "genres": ["Multigenre", "Experimental"],
    },
    {
        "artist_slug": "kris-wiseboy", "title": "DEEP GROOVES",
        "date": "2024-10", "duration": "1:00:00",
        "soundcloud_url": "", "description": "Глубокий грув и атмосферные текстуры. Идеально для вечернего прослушивания.",
        "sort_order": 5, "genres": ["Deep", "Groove"],
    },
]

# ============================================================
# Gallery images from src/data/gallery.js
# ============================================================
GALLERY = [
    *[{"image_url": f"/images/gallery/{i+1}.JPG", "alt_text": f"AUX MASTERS {i+1}", "sort_order": i}
      for i in range(28)],
]


async def seed():
    async with async_session() as session:
        # Check if already seeded
        from app.services.artist_service import get_all_artists
        existing = await get_all_artists(session)
        if existing:
            print("Database already has data. Skipping seed.")
            return

    # Seed artists
    for data in ARTISTS:
        async with async_session() as session:
            await artist_service.create_artist(session, **data)
    print(f"Seeded {len(ARTISTS)} artists")

    # Seed events
    for data in EVENTS:
        async with async_session() as session:
            await event_service.create_event(session, **data)
    print(f"Seeded {len(EVENTS)} events")

    # Seed mixes
    for data in MIXES:
        async with async_session() as session:
            await mix_service.create_mix(session, **data)
    print(f"Seeded {len(MIXES)} mixes")

    # Seed gallery
    for data in GALLERY:
        async with async_session() as session:
            await gallery_service.add_image(session, **data)
    print(f"Seeded {len(GALLERY)} gallery images")

    print("Seed completed!")


if __name__ == "__main__":
    asyncio.run(seed())
