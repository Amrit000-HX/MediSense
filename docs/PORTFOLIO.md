# MediSense — Portfolio & Interview Guide

Use this document when presenting MediSense to recruiters, hiring managers, or in technical interviews.

## Elevator pitch (30 seconds)

> MediSense is a full-stack health-tech web app I built to help users understand medical reports and voice-described symptoms. It combines React, TypeScript, and Express with client-side PDF intelligence, 20+ languages, and a five-layer analysis pipeline—including RAG-style medical grounding and confidence indicators. It showcases how I design accessible, production-minded features beyond a simple CRUD demo.

## Problem → solution → impact

| | |
|---|---|
| **Problem** | Lab reports use medical jargon; non-native speakers and low health literacy struggle to act on results. |
| **Solution** | Upload PDFs or speak symptoms → structured metrics, plain-language summaries, source citations, and dashboard tracking. |
| **Impact** | Demonstrates end-to-end product thinking: UX, i18n, API design, and responsible AI patterns (uncertainty, disclaimers). |

## Technical highlights to mention

### 1. Full-stack ownership

- Built SPA routing, forms, dashboard, and REST API
- Designed multipart uploads and bearer-token auth flow
- Documented setup for EmailJS OTP and optional MongoDB

### 2. Document & voice intelligence

- **PDF.js** for text extraction; **Tesseract** for OCR paths
- Medical-only document gate with user-friendly rejection messages
- **Web Speech API** for real-time transcription with server-side symptom analysis

### 3. “AI pipeline” (portfolio framing)

Even without a paid LLM, the architecture shows how you’d ship clinical-adjacent features:

- Retrieval-augmented summaries with source credibility
- Structured extraction (values, units, status, trends)
- Personalization by age and literacy
- Confidence / known-vs-unknown UX
- Human-in-the-loop review hooks

*Talking point:* “I separated extraction, grounding, and presentation so we can swap mock analysis for OpenAI or a clinical API behind one interface.”

### 4. Internationalization at scale

- 20+ locales with i18next
- Script-specific fonts (Devanagari, Arabic, CJK, etc.)
- Voice analyzer respects browser language where supported

### 5. Product & UX

- Disease library, age-based sections, GPS clinic finder
- shadcn/Radix for accessible components
- Clear medical disclaimer and demo-backend limitations (shows maturity)

## Suggested interview stories (STAR format)

### Story A — Medical PDF pipeline

- **Situation:** Users upload mixed PDFs; non-medical files caused confusion.
- **Task:** Only analyze real lab reports and explain errors clearly.
- **Action:** Built detection patterns, PDF extraction, value parsing, status classification.
- **Result:** Reliable demo flow; extensible service layer for future ML APIs.

### Story B — Voice analyzer accuracy

- **Situation:** Early demo returned static “common cold” results.
- **Task:** Reflect what the user actually said.
- **Action:** Web Speech API transcript → server analyzes real text for symptoms/conditions.
- **Result:** Multilingual, transcript-driven insights ([IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)).

### Story C — OTP login

- **Situation:** Need lightweight 2FA-style login without a paid SMS provider.
- **Action:** EmailJS OTP flow integrated into login page and API.
- **Result:** Documented setup path for evaluators ([EMAILJS_SETUP.md](../EMAILJS_SETUP.md)).

## Skills matrix (map to job descriptions)

| Job requirement | Evidence in repo |
|-----------------|------------------|
| React / TypeScript | `src/app/pages`, components, services |
| Node / Express | `server/index.js`, API clients |
| REST API design | Auth, reports, voice, dashboard routes |
| UI/UX | Tailwind, responsive pages, dashboard |
| i18n | `src/i18n/locales/*` |
| AI / ML interest | RAG, extraction, confidence services |
| Documentation | README, ARCHITECTURE, setup guides |
| CI | `.github/workflows/ci.yml` |

## Live demo checklist (before sharing with recruiters)

1. Add screenshots to `docs/screenshots/` (see README).
2. Deploy frontend + API; add **Live Demo** link to README.
3. Pin repository on GitHub profile.
4. Set repo **About** description and topics: `react`, `typescript`, `healthcare`, `ai`, `fullstack`, `vite`, `express`, `i18n`.
5. Record a 60–90s Loom walkthrough (upload PDF → show results).

## Honest limitations (shows integrity)

- Demo backend uses in-memory storage; passwords not production-hardened.
- Not HIPAA-compliant; educational use only.
- Some analysis paths use mock/enriched responses suitable for demos.

## Links

- Repository: https://github.com/Amrit000-HX/MediSense
- Maintainer: https://github.com/Amrit000-HX
