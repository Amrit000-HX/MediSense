# MediSense

Healthcare intelligence app: upload medical reports (PDF, Word, or images) and get AI-powered analysis with symptoms, prevention tips, and follow-up suggestions.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 (or the port shown in the terminal).

## Build

```bash
npm run build
```

## Tech

- React, TypeScript, Vite
- Tailwind CSS
- PDF/Word/Image upload with OCR (Tesseract.js, pdfjs-dist, mammoth)
- Optional OpenAI analysis: set `VITE_OPENAI_API_KEY` in `.env`
