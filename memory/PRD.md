# ManaLife Calendar — Product Requirements Document

## Vision
Offline-first Telugu Panchang & Hindu devotional calendar mobile app with a premium blue-and-gold visual language. Modern, fast, lightweight, and future-updateable without redesign.

## Platform
- Expo SDK 54 (React Native + Expo Router file-based routing)
- Targets Android/iOS; web preview supported for QA.

## Design System
- Personality: Glass / Luxe with editorial typography (serif display + sans body)
- Dark theme primary (deep navy `#060B19` + antique gold `#D4AF37`), full light mode
- BlurView-backed tab bar, gradient scrims over hero images
- Design guidelines at `/app/design_guidelines.json`

## Screens (bottom-tab navigation)
1. **Home** — Cinematic hero with today's date + Tithi/Paksha/Masa; 2x2 grid (Nakshatra, Yoga, Karana, Vara); Sunrise/Sunset/Location strip; Rahukalam / Yamagandam / Gulika Kalam list; Next-festival card; Daily devotional quote + Sloka.
2. **Calendar** — 7-column month grid with festival dots, month arrow controls, selected-date detail card (Tithi, Nakshatra, Yoga, Vara, Masa) + festival info if any.
3. **Festivals** — Hero (temple gopuram), horizontal filter chips (All / Festival / Vratham), items grouped by month with date box + name + description.
4. **Devotion** — Krishna hero with daily sloka; deity chip filter (Ganesha, Krishna, Rama, Shiva, Devi, Vishnu, Hanuman); Sloka cards with Sanskrit + meaning.
5. **Settings** — Dark mode toggle, Language (English/Telugu), Daily Notifications toggle, Location picker (8 preset cities), About.

## Data
- **Panchang computation** — Local astronomical algorithms (Meeus-based sun/moon longitudes, Lahiri ayanamsa) at `/app/frontend/src/data/panchang.ts`. Outputs Tithi, Nakshatra, Yoga, Karana, Vara, Masa, Ritu, Ayana, Samvatsara + end-times.
- **Sunrise/Sunset** — NOAA-style solar computation from lat/lon; formatted with `Asia/Kolkata`.
- **Rahu/Yama/Gulika** — Day divided into 8 parts sunrise→sunset; standard vara-indexed sequences.
- **Festivals 2026** — Curated dataset (18 items) in `/app/frontend/src/data/festivals.ts` (Ugadi, Sankranti, Sri Rama Navami, Varalakshmi Vratham, Krishnashtami, Vinayaka Chavithi, Dasara, Deepavali, Karthika Pournami, Vaikunta Ekadashi, etc.).
- **Slokas & Quotes** — 7 curated Sanskrit slokas with Telugu + English meanings; 7 Gita/devotional quotes. Deterministic day-of-year rotation.

## State & Persistence
- Theme mode (`@manalife/theme-mode`), Language (`@manalife/lang`), Location (`@manalife/location`), Notifications-enabled (`@manalife/notifications-enabled`) via AsyncStorage.

## Notifications
- `expo-notifications` scheduled daily calendar trigger at 6:30 AM with today's Panchang. Requests permissions on toggle. No-ops silently in Expo Go / web (works in prod builds).

## i18n
- Full Telugu + English string map at `/app/frontend/src/i18n/strings.ts`; ~40 keys. Live language switching persists across restarts. Panchang element names have Telugu variants baked in.

## Backend
- None required for MVP. Existing FastAPI `/api/status` scaffold retained but unused.

## Testing
- Frontend E2E via `testing_agent` — 8/8 acceptance scenarios pass (iteration_1.json).
