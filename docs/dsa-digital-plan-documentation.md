# DSA Digital Plan — Technical Documentation

> `dsa-digital-plan.html`  
> Internal stakeholder document for **Domaine Sidi Abdallah**  
> Single-file HTML — no build tools, no dependencies, no server required

---

## Table of Contents

1. [Overview](#1-overview)
2. [File Architecture](#2-file-architecture)
3. [External Dependencies](#3-external-dependencies)
4. [Design System — Material Design 3](#4-design-system--material-design-3)
5. [The Three Color Palettes](#5-the-three-color-palettes)
6. [CSS Architecture](#6-css-architecture)
7. [Page Structure & Sections](#7-page-structure--sections)
8. [Interactive Features](#8-interactive-features)
9. [Data Layer (JavaScript)](#9-data-layer-javascript)
10. [Persistence — localStorage](#10-persistence--localstorage)
11. [Rendering Strategy](#11-rendering-strategy)
12. [Responsive Design](#12-responsive-design)
13. [Deploying on GitHub Pages](#13-deploying-on-github-pages)
14. [Extending the Document](#14-extending-the-document)

---

## 1. Overview

`dsa-digital-plan.html` is a **self-contained, single-file HTML document** that serves as an interactive digital roadmap for the Domaine Sidi Abdallah project. It is designed to be shared with stakeholders (Elyssa, Lilia) via a GitHub Pages URL.

**Key characteristics:**

- **Zero dependencies** — no npm, no bundler, no backend. One file is the entire app.
- **Zero server required** — works as a static file on any hosting (GitHub Pages, Netlify, a USB stick).
- **Persistent state** — user interactions (checked todos, calendar edits, decision notes) are saved to the browser's `localStorage` and survive page refreshes.
- **Three switchable color palettes** — users can change the visual theme without reloading the page.
- **Fully interactive** — four sections have distinct interactive behaviours (editable calendar, checkable todos, inline notes, palette switching).

---

## 2. File Architecture

The file is divided into three logical blocks inside a single `.html` file:

```
dsa-digital-plan.html
│
├── <head>
│   ├── Google Fonts (Cormorant Garamond + DM Sans)
│   ├── Material Symbols Outlined (icon font)
│   └── <style> — all CSS (palettes + layout + components)
│
├── <body>
│   ├── .palette-bar          — sticky palette switcher (top)
│   ├── <header.hero>         — title + eyebrow
│   ├── <main.page-wrap>
│   │   ├── Section 1         — Les 6 Blocs Digitaux (static HTML)
│   │   ├── Section 2         — Calendrier (JS-rendered, editable)
│   │   ├── Section 3         — Décisions Ouvertes (JS-rendered, with notes)
│   │   └── Section 4         — Critères de Succès (JS-rendered, todo checkboxes)
│   ├── <footer>
│   └── .toast                — global notification element
│
└── <script>
    ├── Default data constants (DECISIONS, METRICS, DEFAULT_PHASES)
    ├── State variables (phases, todoState, noteState)
    ├── Load / Save helpers (localStorage wrappers)
    ├── renderCalendar()
    ├── renderDecisions()
    ├── renderMetrics()
    └── Utility functions (setPalette, showToast, escHtml…)
```

---

## 3. External Dependencies

All dependencies are loaded from CDN via `<link>` tags in `<head>`. There are **no JavaScript library dependencies** — only CSS font files.

| Resource | Provider | Purpose |
|---|---|---|
| `Cormorant Garamond` (400, 500, 600) | Google Fonts | Display / heading typeface |
| `DM Sans` (300, 400, 500, 600) | Google Fonts | Body / UI typeface |
| `Material Symbols Outlined` | Google Fonts | All icons throughout the document |

**Icon usage** — Every icon in the document is rendered using the `Material Symbols Outlined` icon font. Icons are inserted as plain text content inside a `<span class="ms">` element, for example:

```html
<span class="ms">rocket_launch</span>
```

The `.ms` CSS class applies the correct font-family, rendering settings, and `vertical-align: middle` for inline alignment.

---

## 4. Design System — Material Design 3

The visual language follows **Material Design 3 (MD3)** conventions. Rather than importing an MD3 library, the token system is replicated manually using **CSS custom properties** (CSS variables).

### Token naming convention

All design tokens follow the MD3 naming pattern:

```css
--md-primary             /* main brand color */
--md-on-primary          /* text/icon color on top of primary */
--md-primary-container   /* lighter tinted surface */
--md-on-primary-container /* text on top of container */
```

The full set of tokens defined per palette:

| Token | Role |
|---|---|
| `--md-primary` | Primary action color (buttons, active states) |
| `--md-primary-container` | Tinted surfaces, highlighted chips |
| `--md-secondary` | Accent color (timestamps, delete actions) |
| `--md-secondary-container` | Accent tinted surfaces |
| `--md-tertiary` | Third accent (progress bars, success states) |
| `--md-tertiary-container` | Tertiary tinted surfaces |
| `--md-surface` | Main page background |
| `--md-surface-variant` | Slightly elevated surfaces (chip backgrounds) |
| `--md-surface-container` | Card / container backgrounds |
| `--md-on-surface` | Primary text |
| `--md-on-surface-variant` | Secondary / muted text |
| `--md-outline` | Borders on hover |
| `--md-outline-variant` | Default subtle borders |
| `--md-error` | Error state color |

### Additional non-MD3 tokens (per palette)

These extend the system for DSA-specific components:

```css
--hero-a, --hero-b     /* hero gradient start/end colors */
--hero-tint            /* subtle overlay on hero */
--blk1-bg … --blk6-bg /* background for each of the 6 block card headers */
--blk1-ic … --blk6-ic /* icon background color per block */
--dot-p0 … --dot-p3   /* timeline dot colors per phase */
--b-p0-bg/tx … --b-p3-bg/tx /* phase badge background + text per phase */
--mc1-bg/tx … --mc3-bg/tx   /* metric card header per phase */
--chk1, --chk2, --chk3      /* checkbox fill color per metric card */
--dec-when             /* timestamp accent color on decisions */
--sn-bg, --sn-tx       /* section number bubble color */
--sw-active-bg/tx      /* active palette button */
--edit-ring            /* glow ring on cards in edit mode */
--toast-bg, --toast-tx /* toast notification colors */
```

---

## 5. The Three Color Palettes

Palettes are applied by setting a `data-palette` attribute on the `<html>` element. All CSS custom properties are scoped to these attribute selectors:

```css
[data-palette="citrus"]        { --md-primary: #7B5E2A; … }
[data-palette="mediterranean"] { --md-primary: #1B5E78; … }
[data-palette="noir"]          { --md-primary: #C9A96E; … }
```

Switching palette is a single JavaScript call:

```js
document.documentElement.setAttribute('data-palette', 'mediterranean');
```

All `transition: … .4s` declarations on elements ensure the switch animates smoothly.

### Palette summary

| Palette | Primary | Secondary | Tertiary | Surface | Mood |
|---|---|---|---|---|---|
| **Citrus & Terre** | Olive `#7B5E2A` | Terracotta `#C4622D` | Forest `#4A7C59` | Warm ivory `#FFF8F2` | Warm, grounded, Tunisian |
| **Méditerranée** | Teal `#1B5E78` | Gold `#B07D3A` | Violet `#5B4E8C` | Cool white `#F4F9FC` | Coastal, sophisticated |
| **Noir & Sable** | Gold `#C9A96E` | Sienna `#E8A87C` | Sage `#8EC99A` | Near-black `#141210` | Editorial, dark mode |

---

## 6. CSS Architecture

All CSS lives in a single `<style>` block in `<head>`. It is organized in sections separated by comments:

```
/* palette token blocks (3 × [data-palette] selectors) */
/* global reset + base typography */
/* palette bar */
/* hero */
/* section headers */
/* block cards (Section 1) */
/* timeline (Section 2) */
/* calendar edit mode */
/* decisions + notes (Section 3) */
/* metrics / todo (Section 4) */
/* toast */
/* footer */
/* responsive (max-width: 640px) */
/* entrance animations */
```

### Typography scale

| Element | Font | Size | Weight |
|---|---|---|---|
| `h1` | Cormorant Garamond | `clamp(2rem, 5vw, 2.7rem)` | 600 |
| `h2` | Cormorant Garamond | `clamp(1.4rem, 3vw, 1.9rem)` | 600 |
| `h3` | DM Sans | `0.9rem` | 600 |
| Body | DM Sans | `14px` | 400 |
| `.body-sm` | DM Sans | `13px` | 400 |
| Chips / badges | DM Sans | `11–12px` | 500–700 |

### Entrance animation

Each `.section` fades up on page load using a staggered CSS animation:

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.section { animation: fadeUp .45s ease both; }
.section:nth-child(1) { animation-delay: .05s; }
.section:nth-child(2) { animation-delay: .10s; }
/* … */
```

---

## 7. Page Structure & Sections

### Palette Bar (sticky header)

A `position: sticky; top: 0` bar containing three palette buttons. Each button holds three `.swatch` colour circles as visual previews. Clicking calls `setPalette(name, btn)`.

### Hero

A `<header>` with a two-stop linear gradient using `--hero-a` / `--hero-b`. An eyebrow pill badge, an `h1` title, and a subtitle paragraph. A `::before` pseudo-element adds a subtle colour tint overlay.

### Section 1 — Les 6 Blocs Digitaux (static)

Six cards rendered in pure HTML. Each `.block-card` contains:
- A coloured header (`.block-header`) with an MD3 icon and block number
- Phase tags (`.phase-tag.pt-N`) colour-coded by deployment phase
- A feature list (`.feature-list`) with inline MD3 icons

This section does **not** have JavaScript interactivity — it is read-only.

### Section 2 — Calendrier (JS-rendered, editable)

Fully JavaScript-rendered via `renderCalendar()`. Composed of five `.phase-row` elements in a 3-column CSS grid:

```
[period label] | [vertical timeline line + dot] | [phase card]
```

See [Interactive Features → Calendar Edit Mode](#calendar-edit-mode) for the editing system.

### Section 3 — Décisions Ouvertes (JS-rendered, with notes)

Rendered via `renderDecisions()`. Each `.decision-card` displays the decision metadata and a collapsible notes area below it. See [Interactive Features → Decision Notes](#decision-notes).

### Section 4 — Critères de Succès (JS-rendered, checkable)

Rendered via `renderMetrics()`. Each `.metric-card` has a coloured header, a live progress bar, and a list of `.todo-item` elements. See [Interactive Features → Todo Checkboxes](#todo-checkboxes).

---

## 8. Interactive Features

### Calendar Edit Mode

**Trigger:** "Modifier" button in Section 2 header.

**Mechanism:** Toggling `editMode = true` adds the class `editing-mode` to `<body>`. CSS rules scoped to `body.editing-mode` then:

- Show `.chip-delete` buttons (× icon) on every task chip
- Show `.add-task-row` input fields at the bottom of each phase card
- Show the `.hl-hint` tooltip
- Apply a coloured `box-shadow` ring to each `.phase-card` using `--edit-ring`

**Edit actions available:**

| Action | How |
|---|---|
| **Add task** | Type in the input + press Enter or click the + button |
| **Delete task** | Click the × button on a chip (fires `deleteTask`) |
| **Highlight task** | Click any chip to toggle the `.hl` class (fires `toggleHl`) |
| **Save** | Click "Terminer" — calls `save(KEYS.cal, phases)` and exits edit mode |
| **Reset** | Click "Réinitialiser" — restores `DEFAULT_PHASES` and clears `localStorage` |

### Decision Notes

**Trigger:** Clicking "Ajouter une note…" button or an existing note bubble.

**Mechanism:** A module-level variable `openNoteEditor` holds the `id` of the decision currently being edited (or `null`). `renderDecisions()` is called after every state change — it renders different HTML depending on whether `openNoteEditor === d.id`:

- `null` + no note → shows dashed "add note" button
- `null` + has note → shows a `.note-bubble` with the note text
- `openNoteEditor === d.id` → shows the `.note-textarea` editor with Save / Cancel / Delete buttons

**Keyboard shortcuts in the editor:**
- `Ctrl + Enter` → save
- `Escape` → cancel

**Save:** Trims the textarea value. If non-empty, stores in `noteState[id]`. If empty, deletes the key. Always calls `save(KEYS.notes, noteState)`.

### Todo Checkboxes

**Trigger:** Clicking any `.todo-item` in Section 4.

**Mechanism:** `toggleTodo(mcId, idx)` flips `todoState['mc1-2']` (composite key = card id + item index), saves immediately, then calls `renderMetrics()` to re-render.

The progress bar width is recalculated on every render:

```js
const done = mc.items.filter((_, i) => !!todoState[`${mc.id}-${i}`]).length;
const pct  = Math.round(done / total * 100);
// → applied as style="width:${pct}%"
```

When a phase reaches 100%, the header icon switches to `task_alt` and a toast fires.

### Toast Notification

A fixed `.toast` element at the bottom of the screen. `showToast(icon, msg)` adds the class `.show` (which transitions `opacity` and `translateY`), then removes it after 2.8 seconds via `setTimeout`.

---

## 9. Data Layer (JavaScript)

All data is defined as plain JavaScript constants at the top of the `<script>` block.

### `DEFAULT_PHASES` (array of objects)

Defines the 5 calendar phases. Each phase object:

```js
{
  id: 'p1',
  period: 'Avr – Mai<br>2026',  // HTML allowed (line break)
  sub: 'Phase 1',
  dotVar: '--dot-p1',            // CSS variable name for dot colour
  badgeClass: 'pt-1',           // CSS class for the phase badge
  badgeIcon: 'rocket_launch',   // Material Symbol name
  badgeLabel: 'Lancement du site',
  tasks: [
    { label: 'Site vitrine en ligne', icon: 'language', hl: true },
    // …
  ]
}
```

`tasks` is the mutable part — it is read from `localStorage` if a saved version exists.

### `DECISIONS` (array of objects)

Static data for the 6 decisions. IDs (`d1`–`d6`) are used as keys in `noteState`.

```js
{
  id: 'd1', num: 1,
  title: 'Nom de domaine',
  desc: '…',
  when: 'Maintenant', whenIcon: 'schedule',
  who: 'Rached + Elyssa', whoIcon: 'group'
}
```

### `METRICS` (array of objects)

Static data for the 3 success phases. IDs (`mc1`–`mc3`) combined with item index produce the `todoState` key.

```js
{
  id: 'mc1', cls: 'mc1',
  icon: 'rocket_launch',
  phase: 'Phase 1 — Lancement Site', sub: 'Mai 2026',
  items: ['Site en ligne …', '…']
}
```

---

## 10. Persistence — localStorage

Three separate `localStorage` keys are used to avoid coupling between features:

| Key | Type | Contents |
|---|---|---|
| `dsa_calendar_v2` | JSON array | Full `phases` array (mutated by edit mode) |
| `dsa_todos_v1` | JSON object | `{ "mc1-0": true, "mc2-3": true, … }` |
| `dsa_notes_v1` | JSON object | `{ "d1": "note text…", "d4": "…" }` |

All read/write goes through two wrapper functions that silently swallow errors (relevant for private browsing where `localStorage` may be unavailable):

```js
function load(key, def) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : (typeof def === 'function' ? def() : def);
  } catch(e) { return typeof def === 'function' ? def() : def; }
}

function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}
```

**Important:** `localStorage` is **browser-local and device-local**. If Elyssa opens the document on a different browser or device, she starts with the default data. Changes do not sync between users.

---

## 11. Rendering Strategy

Sections 2, 3, and 4 are rendered by JavaScript rather than written in static HTML. This allows the UI to reflect live state (checked items, open editors, custom tasks) without a framework.

The pattern used throughout is **full subtree re-render on state change**:

```js
function toggleTodo(mcId, idx) {
  todoState[`${mcId}-${idx}`] = !todoState[`${mcId}-${idx}`];
  save(KEYS.todos, todoState);
  renderMetrics(); // re-renders the entire metrics section
}
```

This is intentionally simple — no virtual DOM, no diffing. For the data sizes involved (< 50 items per section), full re-render is instant and avoids stale-reference bugs.

The **one exception** to full re-render is the calendar highlight toggle (`toggleHl`), which directly mutates a class on the existing DOM node for smoother feedback:

```js
const chip = document.getElementById(`chip-${pi}-${ti}`);
chip.classList.toggle('hl', phases[pi].tasks[ti].hl);
```

---

## 12. Responsive Design

A single breakpoint at `max-width: 640px` handles mobile layout:

| Element | Desktop | Mobile |
|---|---|---|
| `.phase-row` grid | `110px 24px 1fr` | `80px 20px 1fr` |
| `.decision-top` grid | `36px 1fr auto` | `36px 1fr` (meta wraps below) |
| `.palette-label` | Visible | Hidden |
| `.palette-btn` | Full padding + font-size | Compact |
| Block cards grid | `auto-fill minmax(320px, 1fr)` | Single column |
| Metrics grid | `auto-fill minmax(310px, 1fr)` | Single column |

Typography uses `clamp()` for fluid scaling between viewport sizes without breakpoints.

---

## 13. Deploying on GitHub Pages

Because the document is a single `.html` file with no build step, deployment is trivial.

**Steps:**

1. Create a GitHub repository (public or private with Pages enabled)
2. Upload `dsa-digital-plan.html` to the repository root **or** rename it `index.html`
3. Go to **Settings → Pages**
4. Set source: **Deploy from a branch → main → / (root)**
5. GitHub assigns a URL: `https://your-username.github.io/repo-name/dsa-digital-plan.html`

**Notes on localStorage with GitHub Pages:**
- `localStorage` is scoped to the domain (`your-username.github.io`). Data persists correctly across visits.
- If the file is renamed or moved, `localStorage` keys remain on the old path. Use the Reset button to clear stale data.

**Custom domain:** If a custom domain (e.g. `plan.domainesidiabdallah.tn`) is configured on GitHub Pages, localStorage data will be scoped to that domain automatically.

---

## 14. Extending the Document

### Adding a new calendar phase

In the `DEFAULT_PHASES` constant, append a new object following the existing schema. Use one of the existing `dotVar` CSS variable names (`--dot-p0` through `--dot-p3`) or add a new one to all three palette blocks in `<style>`.

### Adding a new decision

In the `DECISIONS` array, add a new object with a unique `id` (`d7`, etc.). No CSS changes needed.

### Adding a new metric card

In the `METRICS` array, add a new object. Also add a new CSS block for the card's colour class:

```css
.mc4 .metric-header    { background: var(--mc4-bg); color: var(--mc4-tx); }
.mc4 .metric-progress-fill { background: var(--chk4); }
.mc4 .metric-progress-text { color: var(--chk4); }
.mc4 .todo-item.done .todo-box { background: var(--chk4); border-color: var(--chk4); }
```

And define `--mc4-bg`, `--mc4-tx`, `--chk4` in all three palette blocks.

### Adding a fourth palette

1. Create a new `[data-palette="name"]` block in `<style>` with all required tokens
2. Add a new `<button class="palette-btn">` in the `.palette-bar` HTML
3. No JavaScript changes required

### Changing default content

All default text, task labels, decision descriptions, and metric items live in the JavaScript constants (`DEFAULT_PHASES`, `DECISIONS`, `METRICS`). Editing these constants changes the default state that appears on first load (or after a reset). Saved localStorage data always takes precedence over defaults.

---

*Document generated February 2026 — Domaine Sidi Abdallah*
