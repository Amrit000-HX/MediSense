# MediSense

**MediSense** is an AI-powered health companion web application that helps patients understand medical reports, analyze symptoms via voice, and manage their health data in one place. It combines client-side document processing (PDF.js, Tesseract.js) with advanced analysis pipelines—RAG grounding, structured extraction, personalization, confidence scoring, and optional doctor review.

> **Disclaimer:** MediSense is for informational and educational purposes only. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Pages & Routes](#pages--routes)
- [API Endpoints](#api-endpoints)
- [Advanced Analysis Features](#advanced-analysis-features)
- [Medical Report Scanner](#medical-report-scanner)
- [Supported Languages](#supported-languages)
- [Privacy & Security](#privacy--security)
- [Additional Documentation](#additional-documentation)
- [Attributions](#attributions)
- [License](#license)

---

## Features

### Core capabilities

| Feature | Description |
|--------|-------------|
| **Medical Report Upload & Analysis** | Upload PDF medical reports; extract text and lab values; classify results (normal, high, low, borderline). |
| **Medical Report Scanner** | Specialized detection that accepts only medical documents and rejects non-medical files with clear guidance. |
| **Voice Symptom Analyzer** | Record symptoms via microphone; transcribe with Web Speech API; map symptoms to possible conditions. |
| **Health Dashboard** | View metrics, appointments, report history, and saved analyses. |
| **GPS Clinic Finder** | Locate nearby clinics and doctors using browser geolocation. |
| **Multi-language UI** | 20+ languages with i18next and script-specific fonts (Noto Sans family). |
| **User Authentication** | Sign up, log in, and persist sessions with bearer tokens. |
| **Contact Form** | Submit inquiries to the backend API. |

### Advanced analysis (5 integrated layers)

1. **Retrieval-Augmented Generation (RAG)** — Summaries grounded in WHO, CDC, NIH, AHA, Mayo Clinic, and similar sources with credibility scores.
2. **Structured Information Extraction** — Key findings, trends, status classification, and context per metric.
3. **Personalization Layer** — Age group, literacy level, and condition-aware explanations with visual recommendations.
4. **Confidence & Uncertainty Indicators** — Overall and per-value confidence; known vs. unknown vs. unclear markers.
5. **Human-in-the-Loop Review** — Doctor verification workflow for findings, corrections, and recommendations.

### Supported health focus areas

Diabetes, hypertension, cardiovascular health, thyroid, respiratory conditions, anemia, kidney and liver function, cancer screening, cholesterol, vitamins, arthritis, osteoporosis, mental health, allergies, autoimmune conditions, and more (explorable from the home page disease library).

---

## Tech Stack

### Frontend

- **React 18** + **TypeScript**
- **Vite 6** — dev server and production build
- **React Router 7** — client-side routing
- **Tailwind CSS 4** — styling
- **Radix UI** + **shadcn/ui** — accessible UI components
- **MUI Icons** + **Lucide React** — icons
- **Recharts** — charts and visualizations
- **i18next** — internationalization
- **Motion / Framer Motion** — animations

### Document & voice processing (client-side)

- **pdfjs-dist** — PDF text extraction
- **tesseract.js** — OCR for image-based reports
- **mammoth** — Word document support (where used)
- **Web Speech API** — real-time voice transcription

### Backend

- **Node.js** + **Express 4**
- **Multer** — file uploads (reports, audio)
- **CORS** — cross-origin API access
- In-memory stores for users, tokens, reports, and contacts (demo/dev setup)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                        │
│  Pages: Home, Features, How It Works, Upload, Voice, Dashboard  │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Client Services │ │  Express API    │ │  Browser APIs   │
│ (PDF, Voice,    │ │  localhost:3000 │ │  Speech, GPS,   │
│  RAG, etc.)     │ │                 │ │  Geolocation    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

**Analysis flow (report upload):**

1. Validate file type and size (PDF-focused for medical scanner).
2. Detect whether the document is a medical report.
3. Extract text (PDF.js / OCR fallback).
4. Parse medical values (BP, cholesterol, glucose, thyroid, etc.).
5. Run advanced pipeline: RAG → extraction → personalization → confidence → optional doctor review.
6. Display results on the Upload Report page and optionally save to the dashboard.

---

## Project Structure

```
MediSense-main/
├── public/                 # Static assets
├── server/
│   └── index.js            # Express API (auth, reports, voice, dashboard)
├── src/
│   ├── app/
│   │   ├── api/            # API client (auth, reports, voice, dashboard, gps)
│   │   ├── components/     # Layout, Header, Footer, UI (shadcn)
│   │   ├── context/        # Language context
│   │   ├── lib/            # Report parsing and analysis helpers
│   │   ├── pages/          # Route pages
│   │   ├── services/       # PDF, voice, RAG, extraction, personalization, etc.
│   │   ├── translations/   # Legacy translation modules
│   │   ├── App.tsx
│   │   └── routes.ts
│   ├── i18n/               # i18next config and locale JSON files
│   └── main.tsx
├── docs/                   # Supplementary documentation
├── ADVANCED_FEATURES.md    # Deep dive on RAG, personalization, confidence, review
├── MEDICAL_REPORT_SCANNER.md
├── WORKING_FEATURES_TEST.md
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: LTS)
- **npm** (or pnpm/yarn)

### Installation

```bash
# Clone or download the project, then:
cd MediSense-main

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:3000
```

### Run development

**Option A — Frontend only**

```bash
npm run dev
```

Opens the Vite dev server (default: `http://localhost:5173`). Backend-dependent features require `VITE_API_URL`.

**Option B — Frontend + API (recommended)**

```bash
npm run dev:all
```

Runs Express API on port **3000** and Vite on port **5173** concurrently.

### Production build

```bash
npm run build
```

Output is written to `dist/`. Serve with any static host; point `VITE_API_URL` to your deployed API.

---

## Environment Variables

Create a `.env` file from `.env.example`:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes (for full app) | Backend base URL, e.g. `http://localhost:3000` |
| `VITE_OPENAI_API_KEY` | No | Optional OpenAI key for enhanced report analysis (GPT-4o-mini). Falls back to built-in/mock analysis when empty. |
| `PORT` | No | API server port (default: `3000`) |

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Vite frontend dev server |
| `server` | `npm run server` | Start Express API only |
| `dev:all` | `npm run dev:all` | Start API + frontend together |
| `build` | `npm run build` | Production build |

---

## Pages & Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Landing, disease library, age-based health sections |
| `/features` | Features | Product feature overview |
| `/how-it-works` | How It Works | Step-by-step analysis workflow |
| `/upload-report` | Upload Report | PDF upload and medical analysis |
| `/voice-analyzer` | Voice Analyzer | Symptom recording and analysis |
| `/dashboard` | Dashboard | Metrics, reports, appointments, GPS finder |
| `/contact` | Contact | Contact form |
| `/login` | Login | User sign-in |
| `/signup` | Sign Up | User registration |

---

## API Endpoints

Base URL: `VITE_API_URL` (default `http://localhost:3000`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | No | Register new user |
| `POST` | `/api/auth/login` | No | Login; returns bearer token |
| `GET` | `/api/user` | Bearer | Current user profile |
| `POST` | `/api/contact` | No | Submit contact message |
| `POST` | `/api/reports/upload` | Optional | Upload report file |
| `POST` | `/api/reports/analyze` | No | Full analysis response (RAG, structured data, personalization, confidence, doctor review) |
| `GET` | `/api/reports` | Optional | List user reports (demo defaults if anonymous) |
| `POST` | `/api/voice/analyze` | No | Analyze uploaded audio |
| `POST` | `/api/voice/save` | Bearer | Save voice analysis to dashboard |
| `GET` | `/api/dashboard/metrics` | No | Health metrics for dashboard |
| `GET` | `/api/dashboard/appointments` | No | Upcoming appointments |

Authenticated requests use header: `Authorization: Bearer <token>` (stored in `localStorage` as `medisense_token`).

---

## Advanced Analysis Features

MediSense v2 analysis returns a combined payload including:

- `groundedSummary` and `sources` (RAG)
- `structuredData` — `keyFindings`, `trends`, `summary`, `metadata`
- `personalization` — simplified/detailed explanations, visual recommendations, age insights
- `confidenceAnalysis` — overall and value-specific scores, uncertainty markers, recommendations
- `doctorReview` — review ID, status, whether human review is required

See [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) for implementation details and example responses.

---

## Medical Report Scanner

The dedicated scanner (`medicalReportScanner` service) ensures:

- **Accepted:** Blood tests, lipid panels, diabetes/HbA1c, thyroid, liver/kidney function, cardiac tests, urinalysis, general clinical reports (PDF).
- **Rejected:** Financial, legal, academic, and other non-medical documents with actionable error messages.
- **Extracted metrics:** 20+ values (e.g. BP, cholesterol, glucose, TSH) with units and status.
- **Limits:** PDF-focused; max file size ~10 MB; client-side processing for privacy.

Full specification: [MEDICAL_REPORT_SCANNER.md](./MEDICAL_REPORT_SCANNER.md)

---

## Supported Languages

UI and content support includes (among others):

English, Hindi, Odia, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Arabic, German, Spanish, French, Italian, Japanese, Korean, Dutch, Portuguese, Russian, Turkish, Vietnamese, Thai, Chinese.

Language preference is stored in `localStorage` (`medisense_lang`). Fonts are loaded per script via Google Fonts (Noto Sans family).

---

## Privacy & Security

- **Client-side processing:** PDF text extraction and much of the analysis run in the browser where implemented.
- **No persistent file storage** in the demo API; uploads are processed in memory.
- **Bearer token auth** for user-specific dashboard data.
- **Demo backend:** Uses in-memory user/report stores—not suitable for production without a real database, encryption, and HIPAA/GDPR compliance review.

---

## Additional Documentation

| Document | Contents |
|----------|----------|
| [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) | RAG, extraction, personalization, confidence, doctor review |
| [MEDICAL_REPORT_SCANNER.md](./MEDICAL_REPORT_SCANNER.md) | Medical-only PDF detection and value extraction |
| [WORKING_FEATURES_TEST.md](./WORKING_FEATURES_TEST.md) | How to test voice, PDF, and advanced features |

### Quick test checklist

1. Run `npm run dev:all`
2. **Voice:** `/voice-analyzer` → record symptoms → verify transcription and conditions
3. **PDF:** `/upload-report` → upload a medical PDF → verify extracted values and advanced sections
4. **Dashboard:** `/dashboard` → metrics, reports, GPS clinic finder

---

## Attributions

- UI components from [shadcn/ui](https://ui.shadcn.com/) (MIT)
- Stock imagery from [Unsplash](https://unsplash.com)
- Original design reference: [Figma — Website](https://www.figma.com/design/4JisR7XY3MkepNIaRRSyPv/Website)

See [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for details.

---

## License

This project is provided as a hackathon/educational codebase. Refer to repository or organization policies for licensing terms before commercial or clinical deployment.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes with clear messages
4. Open a pull request describing changes and test steps

---

## Support

For questions or issues, use the in-app **Contact** page (`/contact`) or open an issue in the project repository.

**Built with care for clearer, more accessible health information.**
