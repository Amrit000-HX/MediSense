import { request, getBaseUrl, isBackendConfigured } from "./client";

export interface VoiceAnalysisResult {
  symptoms: string[];
  possibleConditions: string[];
  recommendations: string[];
}

const MOCK_RESULT: VoiceAnalysisResult = {
  symptoms: ["Headache", "Fatigue", "Mild fever"],
  possibleConditions: ["Common Cold", "Stress-related headache", "Dehydration"],
  recommendations: [
    "Rest and hydrate well",
    "Monitor temperature",
    "Consult a doctor if symptoms persist beyond 3 days",
  ],
};

export async function analyzeVoice(audioBlob: Blob): Promise<VoiceAnalysisResult> {
  if (!isBackendConfigured()) {
    return Promise.resolve(MOCK_RESULT);
  }
  const token = typeof window !== "undefined" ? localStorage.getItem("medisense_token") : null;
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  const url = getBaseUrl() + "/api/voice/analyze";
  const res = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: "Bearer " + token } : {},
    body: formData,
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}

export async function saveVoiceToDashboard(analysisId: string): Promise<{ success: boolean }> {
  if (!isBackendConfigured()) return Promise.resolve({ success: true });
  return request("/api/voice/save", { method: "POST", body: { analysisId } });
}
