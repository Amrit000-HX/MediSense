# MediSense Architecture

## System overview

MediSense is a **single-page application (SPA)** with a **Node.js REST API**. Most document intelligence runs in the browser; the API handles auth, uploads, aggregated analysis responses, and dashboard data.

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser (Client)                       │
│  React + Vite │ i18next │ PDF.js │ Tesseract │ Web Speech API │
└─────────────────────────────┬────────────────────────────────┘
                              │ HTTP (JSON, multipart)
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                   Express API (server/index.js)               │
│  Auth │ OTP │ Reports │ Voice │ Dashboard │ Contact          │
└─────────────────────────────┬────────────────────────────────┘
                              │ optional
                              ▼
                    MongoDB (Mongoose) — see MONGODB_SETUP.md
```

## Frontend layers

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Pages** | `src/app/pages/` | Route-level UI (Home, Upload, Voice, Dashboard, Auth) |
| **Components** | `src/app/components/` | Reusable UI (Header, Footer, shadcn primitives) |
| **API clients** | `src/app/api/` | Typed fetch wrappers, auth token injection |
| **Services** | `src/app/services/` | PDF/voice analysis, RAG, extraction, personalization |
| **i18n** | `src/i18n/` | Locale JSON + i18next configuration |

## Backend endpoints (logical groups)

- **Authentication** — signup, login, bearer tokens, OTP via EmailJS
- **Reports** — multipart upload, analyze (returns structured + RAG + confidence payload)
- **Voice** — audio/transcript analysis
- **Dashboard** — metrics, appointments (demo data + user-scoped reports when authenticated)

## Analysis pipeline (reports)

1. **Validation** — file type, size, medical-document detection
2. **Extraction** — PDF.js text layer; OCR fallback for images
3. **Parsing** — regex/pattern-based medical values (BP, lipids, glucose, thyroid, etc.)
4. **Enrichment** — RAG grounding, personalization, confidence scoring
5. **Presentation** — React UI with charts, status badges, and uncertainty callouts
6. **Optional review** — doctor-in-the-loop workflow flags low-confidence results

## State & auth

- JWT-style opaque tokens stored in `localStorage` as `medisense_token`
- Language preference: `medisense_lang`
- API base URL from `VITE_API_URL`

## Deployment considerations

| Component | Suggested hosting |
|-----------|-------------------|
| SPA (`dist/`) | Vercel, Netlify, Cloudflare Pages |
| API | Railway, Render, Fly.io |
| MongoDB | Atlas |
| Secrets | Platform env vars only — never in repo |

## Extension points

- Swap mock analysis in `server/index.js` with OpenAI or clinical APIs
- Persist users/reports via Mongoose models
- Add Playwright E2E tests against `dev:all`
- Feature-flag OTP and GPS for regions without browser support
