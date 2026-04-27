# Aman OS — Production Repository

## Stack
- Next.js 14 (App Router)
- TypeScript strict
- Tailwind CSS
- next-intl (AR/EN, RTL)
- next-auth (JWT, credentials)
- SWR (data fetching)
- Recharts (charts)
- Zod (validation)
- Zustand (state)

## Setup

```bash
cp .env.local.example .env.local
# Fill in secrets

npm install
npm run dev
```

## Demo Login
All accounts: password `Aman@2024!`

| Email | Role |
|-------|------|
| ceo@aman.sa | CEO |
| cto@aman.sa | CTO |
| coo@aman.sa | COO |
| bd1@aman.sa | BD |
| admin@aman.sa | ADMIN |

## Google Analytics
Set `GOOGLE_ANALYTICS_PROPERTY_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` in `.env.local`.
Falls back to mock data if unset.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/nextauth/route.ts
│   │   ├── kpi/route.ts
│   │   ├── ai/analyst/route.ts
│   │   ├── ai/forecast/route.ts
│   │   ├── ai/coach/route.ts
│   │   ├── team/route.ts
│   │   ├── analytics/route.ts
│   │   ├── experiments/route.ts
│   │   └── week/route.ts
│   ├── dashboard/
│   │   ├── layout.tsx       (auth guard + sidebar)
│   │   ├── page.tsx         (command center)
│   │   ├── ai/page.tsx      (AI analyst)
│   │   ├── forecast/page.tsx
│   │   ├── coach/page.tsx
│   │   ├── team/page.tsx
│   │   ├── week/page.tsx
│   │   ├── experiments/page.tsx
│   │   └── analytics/page.tsx
│   ├── login/page.tsx
│   └── page.tsx             (root redirect)
├── components/
│   ├── charts/kpi-charts.tsx
│   ├── layout/sidebar.tsx
│   ├── layout/topbar.tsx
│   ├── providers/session-provider.tsx
│   └── ui/
│       ├── ai-brain.tsx
│       ├── alert-banner.tsx
│       └── kpi-card.tsx
├── hooks/use-kpi-data.ts
├── lib/
│   ├── ai/analyst-engine.ts
│   ├── ai/forecast-engine.ts
│   ├── ai/coach-engine.ts
│   ├── auth/auth-options.ts
│   ├── auth/permissions.ts
│   ├── db/mock-data.ts
│   ├── store/app-store.ts
│   └── utils/index.ts
├── locales/en.json
├── locales/ar.json
├── services/google-analytics.ts
├── types/index.ts
├── i18n.ts
└── middleware.ts
```
