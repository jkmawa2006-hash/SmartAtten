# SmartAtten

A cinematic AI-powered attendance management system with real-time analytics, smart recommendations, and immersive experience.

## Features

- **Teacher Dashboard** — Overview with weekly pulse, quick actions, AI assistant
- **Admin Dashboard** — Teacher activity feed, workload cards, department performance
- **Principal Dashboard** — Secret-key-gated institutional overview with directory, stats, and quick actions (type `admin` on login page to reveal link)
- **Attendance Marking** — Manual roll-call, simulated auto-detection, QR scan
- **Absenteeism Analytics** — Charts, streaks, top absent students
- **Fee Management** — Payment recording, receipts, overdue tracking (BDT)
- **Leave Management** — Apply, approve, reject leaves
- **Reports & AI Recommendations** — Trends, risk analysis, decline detection, predictive insights
- **Student Directory** — Grid/table views, filters, pagination, bulk actions
- **Timetable** — Weekly schedule with live "Now" indicator
- **Settings** — Profile, security, theme, notifications, data export/reset
- **Dark/Light Theme** — Persistent with system preference detection
- **Command Palette** — `Ctrl+K` to search pages, students, and actions

## Roles

| Role | Login | Access |
|------|-------|--------|
| Admin | `admin@institrack.ai` / `admin123` | `admin-dashboard.html` |
| Teacher | `teacher@institrack.ai` / `teacher123` | `dashboard.html` |
| Principal | Secret key: `PRINCIPAL2026` | `principal-dashboard.html` |

## Tech Stack

- **HTML5** — 12 semantic pages
- **CSS3** — Custom properties, glassmorphism, responsive
- **Vanilla JS** — No frameworks
- **Chart.js** — Analytics charts
- **Font Awesome 6** — Icons
- **localStorage** — All data persistence

## File Structure

```
SmartAtten/
├── index.html               # Login / registration
├── dashboard.html           # Teacher dashboard
├── admin-dashboard.html     # Admin dashboard
├── principal-dashboard.html # Principal dashboard (key-gated)
├── attendance.html          # Mark attendance
├── absenteeism.html         # Absenteeism analytics
├── fees.html                # Fee management
├── leaves.html              # Leave management
├── reports.html             # Reports & AI recommendations
├── students.html            # Student directory
├── timetable.html           # Weekly timetable
├── settings.html            # Profile & preferences
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css        # Global styles (808 lines)
│   ├── img/
│   │   └── logo.svg         # App logo
│   └── js/
│       ├── data.js          # Data layer, UserStore, AppData, seed data
│       ├── main.js          # App shell, session, theme, shortcuts, toasts
│       ├── attendance.js    # Attendance marking logic
│       └── ai-recommend.js  # AI analytics engine
└── data/                    # (optional data exports)
```

## Run

Open **`index.html`** in a modern browser. No server required.

## Departments

CSE, ECE, EEE, MECH, CIVIL, IT, AIDS

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+K` | Command palette |
| `M` | Toggle theme |
| `Ctrl+Shift+A` | Open principal panel |
| `?` | Show shortcuts |

---

© 2026 SmartAtten. JKN LTD. All rights reserved.
