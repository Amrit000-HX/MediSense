import * as pdfjsLib from "pdfjs-dist";
// @ts-expect-error - Vite resolves worker via ?url
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "image/png",
  "image/jpeg",
  "image/jpg",
];
const ACCEPTED_EXT = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
const MAX_SIZE_MB = 10;

export function isAcceptedFile(file: File): boolean {
  const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
  return (
    ACCEPTED_TYPES.includes(file.type) ||
    ACCEPTED_EXT.some((e) => ext === e)
  );
}

export function validateFile(file: File): { ok: boolean; error?: string } {
  if (!isAcceptedFile(file)) {
    return { ok: false, error: "Please upload a PDF, Word document (.pdf, .doc, .docx), or image (.png, .jpg)." };
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { ok: false, error: `File must be under ${MAX_SIZE_MB} MB.` };
  }
  return { ok: true };
}

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  if (ext === "pdf") {
    return extractTextFromPdf(file);
  }
  if (ext === "doc" || ext === "docx") {
    return extractTextFromWord(file);
  }
  if (ext === "png" || ext === "jpg" || ext === "jpeg") {
    return extractTextFromImage(file);
  }
  throw new Error("Unsupported file type. Use PDF, Word (.doc, .docx), or image (.png, .jpg).");
}

async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const parts: string[] = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    parts.push(text);
  }
  return parts.join("\n\n").trim() || "(No text could be extracted from the PDF.)";
}

async function extractTextFromWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return (result.value || "").trim() || "(No text could be extracted from the document.)";
}

async function extractTextFromImage(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  try {
    const {
      data: { text },
    } = await worker.recognize(file);
    return (text || "").trim() || "(No text could be extracted from the image.)";
  } finally {
    await worker.terminate();
  }
}
