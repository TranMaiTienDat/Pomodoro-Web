Pomodoro web app built with [Next.js](https://nextjs.org) (App Router) and TypeScript.

## Features

- Pomodoro timer with phases: Work, Short Break, Long Break
- Auto transition and optional auto-start next phase
- Custom durations and cycles before a long break
- LocalStorage persistence for settings, timer state, tasks, inbox, stats
- Browser notifications and end-of-session alert sound (customizable)
- i18n with routes: Vietnamese and English (`/vi`, `/en`)
- Task List: add/select/complete/delete; auto-complete active task at end of work session
- Inbox (distraction capture): quick add via I hotkey; shown only during breaks
- Achievements & Stats: no-pause streak, early tasks, minutes and “km flown” metric
- Review: simple 28-day heatmap of focused minutes
- Ambient sound: brown noise, toggle and volume, plays during work (requires user gesture)
- Journey/Flight visualization: a fun plane progress bar and optional gallery/video

## Screens and panels

- PomodoroTimer (`src/components/PomodoroTimer.tsx`): core timer, settings, alerts
- TaskList (`src/components/TaskList.tsx`): manage tasks, set active task
- FocusBoard (`src/components/FocusBoard.tsx`): composes timer + panels
- InboxPanel (`src/components/InboxPanel.tsx`): distraction inbox (I hotkey)
- AchievementsPanel (`src/components/AchievementsPanel.tsx`): badges + distance
- ReviewPanel (`src/components/ReviewPanel.tsx`): 28-day heatmap
- AmbientSound (`src/components/AmbientSound.tsx`): brown noise control
- FlightProgress (`src/components/FlightProgress.tsx`): journey media and plane

## i18n

- Dictionaries at `src/i18n/dictionaries.ts`
- Provider and hook at `src/i18n/I18nProvider.tsx`
- Locale routes in `src/app/[lang]/page.tsx` (`/vi` default)

## Settings (Timer)

- Work/Short/Long durations, cycles before long break
- Auto-start next phase toggle
- Alerts: enable/disable, sound type (Beep/Ding/Chime/Pop), volume, and Test button

## Optional media (Journey panel)

- Images: place any of `.jpg/.jpeg/.png/.webp/.gif` into `public/journey/`
- Video: add `public/flight.mp4`
- The app lists available media via `/api/journey` and renders only what exists (no 404 spam)

## Development

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000 and navigate to `/vi` or `/en`.

Edit components in `src/components/*`; the page will hot-reload.

Notes:
- Some browser features (Notifications, Web Audio, Vibrate) require user interaction and/or permission.
- If the alert sound doesn’t play, click Start once to unlock audio.

## Build

```bash
npm run build
npm run start
```

## Deploy

- Works well on Vercel. Any Node host that supports Next.js App Router is fine.

## License

MIT (see LICENSE if added). Contributions welcome.
