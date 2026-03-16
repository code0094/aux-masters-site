# AUX MASTERS — Underground DJ Collective

Многостраничный сайт для промо диджей-команды AUX MASTERS.

## 🚀 Быстрый старт

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск в режиме разработки
npm run dev

# 3. Открыть в браузере
# http://localhost:5173
```

## 📁 Структура проекта

```
aux-masters-site/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # Переиспользуемые компоненты
│   │   ├── Header.jsx       # Навигация
│   │   ├── Footer.jsx       # Подвал
│   │   ├── Layout.jsx       # Обёртка страниц
│   │   ├── DjCard.jsx       # Карточка диджея
│   │   ├── EventCard.jsx    # Карточка события
│   │   ├── MixCard.jsx      # Карточка микса
│   │   └── SectionHeader.jsx
│   ├── pages/               # Страницы
│   │   ├── Home.jsx         # Главная
│   │   ├── About.jsx        # О нас
│   │   ├── Artists.jsx      # Список артистов
│   │   ├── ArtistDetail.jsx # Профиль артиста
│   │   ├── Events.jsx       # События
│   │   ├── Gallery.jsx      # Галерея
│   │   ├── Mixes.jsx        # Миксы
│   │   └── Contact.jsx      # Контакты
│   ├── data/                # Данные
│   │   ├── djs.js           # Артисты
│   │   ├── events.js        # События
│   │   ├── gallery.js       # Фото
│   │   └── mixes.js         # Миксы
│   ├── styles/
│   │   └── global.css       # Глобальные стили
│   ├── App.jsx              # Роутинг
│   └── main.jsx             # Точка входа
├── index.html
├── package.json
└── vite.config.js
```

## 🛠 Кастомизация

### Добавление диджея

Откройте `src/data/djs.js` и добавьте объект:

```javascript
{
  id: "nickname",           // URL-friendly ID
  name: "DJ NAME",          // Имя
  role: "ROLE",             // Роль в команде
  shortDesc: "Краткое...",  // Для карточки
  fullDesc: "Полное...",    // Для страницы профиля
  genres: ["Genre1", "Genre2"],
  symbol: "◈",              // Символ
  soundcloud: "https://...", // Ссылки (опционально)
  instagram: "",
  telegram: ""
}
```

### Добавление события

Откройте `src/data/events.js`:

```javascript
{
  id: 1,
  title: "EVENT NAME",
  date: "2025-02-15",
  time: "23:00",
  venue: "Club Name",
  city: "Город",
  lineup: ["DJ1", "DJ2"],
  description: "Описание...",
  status: "upcoming", // или "past"
  ticketLink: "https://..."
}
```

### Добавление микса с SoundCloud

Откройте `src/data/mixes.js`:

```javascript
{
  id: 1,
  title: "MIX NAME",
  artist: "DJ NAME",        // Должно совпадать с name в djs.js
  date: "2025-01",
  duration: "1:30:00",
  genres: ["Genre1"],
  soundcloudUrl: "https://soundcloud.com/user/track", // URL трека
  description: "Описание..."
}
```

### Добавление фото в галерею

Откройте `src/data/gallery.js`:

```javascript
{
  id: 1,
  src: "https://..." или "/images/photo.jpg",
  alt: "Описание",
  event: "Название события"
}
```

### Изменение цветов

В `src/styles/global.css`:

```css
:root {
  --black: #0a0a0a;
  --accent: #ff3d00;    /* Основной акцент */
  --white: #f0f0f0;
}
```

## 📦 Сборка для продакшена

```bash
npm run build
```

Готовые файлы появятся в папке `dist/`.

## 🌐 Деплой

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
Перетащите папку `dist/` в Netlify Drop.

### GitHub Pages
Добавьте `base: '/repo-name/'` в `vite.config.js`.

## 📄 Лицензия

MIT

---

**AUX MASTERS** © 2025 | Underground DJ Collective
