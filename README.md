# Your Energy

Fitness exercises web application built with Vite.

**[Українська версія нижче](#your-energy-ua)**

---

## Table of Contents

- [About](#about)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Git Workflow](#git-workflow)
- [CSS Variables](#css-variables)
- [API Reference](#api-reference)

---

## About

Your Energy is a fitness application that allows users to:
- Browse exercises by filters (Muscles, Body parts, Equipment)
- Search exercises by keyword
- View exercise details with video demonstrations
- Save favorite exercises to localStorage
- Subscribe to newsletter for new exercises

**Tech Stack:** Vite, Vanilla JavaScript, Axios, HTML/CSS

---

## Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/final-advanced-js-2.git
cd final-advanced-js-2
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open in browser: http://localhost:5173

### Build for Production

```bash
npm run build
```

Build files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```
final-advanced-js-2/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages auto-deploy
├── src/
│   ├── partials/             # HTML components (injected via vite-plugin-html-inject)
│   │   ├── header.html
│   │   ├── footer.html
│   │   ├── hero.html
│   │   ├── filters.html
│   │   ├── exercises.html
│   │   ├── quote.html
│   │   └── modals/
│   │       ├── exercise-modal.html
│   │       └── rating-modal.html
│   ├── css/
│   │   ├── variables.css     # CSS variables (colors, fonts, spacing)
│   │   └── index.css         # Main stylesheet
│   ├── js/
│   │   ├── api.js            # API service (all backend requests)
│   │   ├── exercises-test.js # Test script for API endpoints
│   │   └── main.js           # Entry point
│   ├── img/                  # Images and icons
│   ├── index.html            # Home page
│   └── favorites.html        # Favorites page
├── package.json
├── vite.config.js
└── README.md
```

### Key Files

| File | Description |
|------|-------------|
| `src/js/api.js` | All API functions - import and use in your JS files |
| `src/css/variables.css` | CSS variables - edit colors/fonts from Figma here |
| `src/partials/*.html` | HTML components - each dev works on assigned partial |

---

## Git Workflow

### Branch Naming Convention

```
feature/{ticket-number}-meaningful-description
```

**Examples:**
- `feature/001-header-component`
- `feature/002-filters-api-integration`
- `feature/003-exercise-modal`

### Workflow Steps

1. **Switch to main and pull latest changes:**
```bash
git checkout main
git pull origin main
```

2. **Create a new feature branch:**
```bash
git checkout -b feature/001-header-component
```

3. **Make your changes and commit:**
```bash
git add .
git commit -m "Add header component with burger menu"
```

4. **Push branch to remote:**
```bash
git push -u origin feature/001-header-component
```

5. **Create Pull Request (PR):**
   - Go to GitHub repository
   - Click "Compare & pull request"
   - Add description of changes
   - Request review from team members
   - Wait for approval and merge

### Commit Message Guidelines

- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference ticket number if applicable

**Examples:**
- `Add header component with mobile burger menu`
- `Fix filter button active state styling`
- `Implement exercises pagination`

---

## CSS Variables

Edit `src/css/variables.css` to customize the design. Update values from Figma.

### Colors

```css
:root {
  --color-primary: #242424;           /* Primary dark color */
  --color-secondary: #f4f4f4;         /* Light/white color */
  --color-accent: #e6533c;            /* Accent/brand color (orange-red) */
  --color-text: #ffffff;              /* Main text color */
  --color-text-secondary: rgba(244, 244, 244, 0.5);  /* Muted text */
  --color-background: #040404;        /* Page background */
  --color-card-bg: rgba(28, 28, 28, 0.5);  /* Card backgrounds */
  --color-border: rgba(244, 244, 244, 0.2); /* Border color */
  --color-success: #3cbf61;           /* Success state */
  --color-error: #d80027;             /* Error state */
  --color-rating: #eea10c;            /* Rating stars color */
}
```

### Typography

```css
:root {
  --font-family: 'Roboto', sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 48px;
  --font-size-hero: 66px;
}
```

### Spacing & Layout

```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 50%;
}
```

### Breakpoints

Use mobile-first approach:

```css
/* Mobile: 320px - 767px (default styles) */

@media screen and (min-width: 768px) {
  /* Tablet styles */
}

@media screen and (min-width: 1440px) {
  /* Desktop styles */
}
```

---

## API Reference

Import functions from `src/js/api.js`:

```javascript
import { getFilterCategories, searchExercises } from './api.js';
```

### Available Methods

| Method | Description |
|--------|-------------|
| `getFilterCategories(filter, page, limit)` | Get categories for filter type |
| `getExercisesByMuscle(muscle, page, limit)` | Get exercises by muscle |
| `getExercisesByBodyPart(bodypart, page, limit)` | Get exercises by body part |
| `getExercisesByEquipment(equipment, page, limit)` | Get exercises by equipment |
| `searchExercises({ filter, category, keyword, page, limit })` | Search with filters |
| `getExerciseById(id)` | Get exercise details |
| `getQuote()` | Get quote of the day |
| `subscribe(email)` | Subscribe to newsletter |
| `addExerciseRating(id, { rate, email, review })` | Add exercise rating |

### Usage Examples

```javascript
// Get muscle categories
const { data } = await getFilterCategories('Muscles', 1, 12);

// Get exercises by muscle
const { data } = await getExercisesByMuscle('lats', 1, 10);

// Search exercises with filter context
const { data } = await searchExercises({
  filter: 'muscles',
  category: 'lats',
  keyword: 'pull',
  page: 1,
  limit: 10
});
```

---

---

# Your Energy (UA)

Веб-застосунок для фітнес-вправ, створений на Vite.

---

## Зміст

- [Про проект](#про-проект)
- [Встановлення](#встановлення)
- [Структура проекту](#структура-проекту)
- [Git Workflow](#git-workflow-ua)
- [CSS Змінні](#css-змінні)
- [API Довідник](#api-довідник)

---

## Про проект

Your Energy — це фітнес-застосунок, який дозволяє користувачам:
- Переглядати вправи за фільтрами (М'язи, Частини тіла, Обладнання)
- Шукати вправи за ключовим словом
- Переглядати деталі вправи з відео-демонстрацією
- Зберігати улюблені вправи в localStorage
- Підписуватися на розсилку нових вправ

**Технології:** Vite, Vanilla JavaScript, Axios, HTML/CSS

---

## Встановлення

### Передумови

- Node.js (рекомендується LTS версія)
- npm або yarn

### Інсталяція

1. Клонувати репозиторій:
```bash
git clone https://github.com/your-username/final-advanced-js-2.git
cd final-advanced-js-2
```

2. Встановити залежності:
```bash
npm install
```

3. Запустити сервер розробки:
```bash
npm run dev
```

4. Відкрити в браузері: http://localhost:5173

### Збірка для продакшену

```bash
npm run build
```

Файли збірки будуть у папці `dist`.

### Попередній перегляд збірки

```bash
npm run preview
```

---

## Структура проекту

```
final-advanced-js-2/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Автодеплой на GitHub Pages
├── src/
│   ├── partials/             # HTML компоненти (інжектуються через vite-plugin-html-inject)
│   │   ├── header.html
│   │   ├── footer.html
│   │   ├── hero.html
│   │   ├── filters.html
│   │   ├── exercises.html
│   │   ├── quote.html
│   │   └── modals/
│   │       ├── exercise-modal.html
│   │       └── rating-modal.html
│   ├── css/
│   │   ├── variables.css     # CSS змінні (кольори, шрифти, відступи)
│   │   └── index.css         # Головний файл стилів
│   ├── js/
│   │   ├── api.js            # API сервіс (всі запити до бекенду)
│   │   ├── exercises-test.js # Тестовий скрипт для API ендпоінтів
│   │   └── main.js           # Точка входу
│   ├── img/                  # Зображення та іконки
│   ├── index.html            # Головна сторінка
│   └── favorites.html        # Сторінка улюблених
├── package.json
├── vite.config.js
└── README.md
```

### Ключові файли

| Файл | Опис |
|------|------|
| `src/js/api.js` | Всі API функції — імпортуйте та використовуйте у своїх JS файлах |
| `src/css/variables.css` | CSS змінні — редагуйте кольори/шрифти з Figma тут |
| `src/partials/*.html` | HTML компоненти — кожен розробник працює над призначеним partial |

---

## Git Workflow (UA)

### Конвенція найменування гілок

```
feature/{номер-тікета}-змістовний-опис
```

**Приклади:**
- `feature/001-header-component`
- `feature/002-filters-api-integration`
- `feature/003-exercise-modal`

### Кроки робочого процесу

1. **Перейти на main та отримати останні зміни:**
```bash
git checkout main
git pull origin main
```

2. **Створити нову feature гілку:**
```bash
git checkout -b feature/001-header-component
```

3. **Внести зміни та закомітити:**
```bash
git add .
git commit -m "Add header component with burger menu"
```

4. **Запушити гілку в репозиторій:**
```bash
git push -u origin feature/001-header-component
```

5. **Створити Pull Request (PR):**
   - Перейти на GitHub репозиторій
   - Натиснути "Compare & pull request"
   - Додати опис змін
   - Запросити рев'ю у членів команди
   - Дочекатися схвалення та змерджити

### Рекомендації до коміт-повідомлень

- Використовуйте теперішній час: "Add feature", а не "Added feature"
- Будьте описовими, але лаконічними
- Вказуйте номер тікета, якщо є

**Приклади:**
- `Add header component with mobile burger menu`
- `Fix filter button active state styling`
- `Implement exercises pagination`

---

## CSS Змінні

Редагуйте `src/css/variables.css` для кастомізації дизайну. Оновлюйте значення з Figma.

### Кольори

```css
:root {
  --color-primary: #242424;           /* Основний темний колір */
  --color-secondary: #f4f4f4;         /* Світлий/білий колір */
  --color-accent: #e6533c;            /* Акцентний/брендовий колір (оранжево-червоний) */
  --color-text: #ffffff;              /* Основний колір тексту */
  --color-text-secondary: rgba(244, 244, 244, 0.5);  /* Приглушений текст */
  --color-background: #040404;        /* Фон сторінки */
  --color-card-bg: rgba(28, 28, 28, 0.5);  /* Фон карток */
  --color-border: rgba(244, 244, 244, 0.2); /* Колір рамок */
  --color-success: #3cbf61;           /* Стан успіху */
  --color-error: #d80027;             /* Стан помилки */
  --color-rating: #eea10c;            /* Колір зірок рейтингу */
}
```

### Типографіка

```css
:root {
  --font-family: 'Roboto', sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 48px;
  --font-size-hero: 66px;
}
```

### Відступи та розмітка

```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 50%;
}
```

### Брейкпоінти

Використовуйте mobile-first підхід:

```css
/* Mobile: 320px - 767px (стилі за замовчуванням) */

@media screen and (min-width: 768px) {
  /* Стилі для планшета */
}

@media screen and (min-width: 1440px) {
  /* Стилі для десктопу */
}
```

---

## API Довідник

Імпортуйте функції з `src/js/api.js`:

```javascript
import { getFilterCategories, searchExercises } from './api.js';
```

### Доступні методи

| Метод | Опис |
|-------|------|
| `getFilterCategories(filter, page, limit)` | Отримати категорії для типу фільтра |
| `getExercisesByMuscle(muscle, page, limit)` | Отримати вправи за м'язом |
| `getExercisesByBodyPart(bodypart, page, limit)` | Отримати вправи за частиною тіла |
| `getExercisesByEquipment(equipment, page, limit)` | Отримати вправи за обладнанням |
| `searchExercises({ filter, category, keyword, page, limit })` | Пошук з фільтрами |
| `getExerciseById(id)` | Отримати деталі вправи |
| `getQuote()` | Отримати цитату дня |
| `subscribe(email)` | Підписатися на розсилку |
| `addExerciseRating(id, { rate, email, review })` | Додати рейтинг вправі |

### Приклади використання

```javascript
// Отримати категорії м'язів
const { data } = await getFilterCategories('Muscles', 1, 12);

// Отримати вправи за м'язом
const { data } = await getExercisesByMuscle('lats', 1, 10);

// Пошук вправ з контекстом фільтра
const { data } = await searchExercises({
  filter: 'muscles',
  category: 'lats',
  keyword: 'pull',
  page: 1,
  limit: 10
});
```

---

## Автори / Authors

Team project for GoIT Advanced JavaScript course.
