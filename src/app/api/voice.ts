import { request, getBaseUrl, isBackendConfigured } from "./client";

export interface VoiceAnalysisResult {
  symptoms: string[];
  possibleConditions: string[];
  recommendations: string[];
  transcript?: string;
  detectedLanguage?: string;
  confidence?: number;
}

const MOCK_RESULT: VoiceAnalysisResult = {
  symptoms: ["Headache", "Fatigue", "Mild fever"],
  possibleConditions: ["Common Cold", "Stress-related headache", "Dehydration"],
  recommendations: [
    "Rest and hydrate well",
    "Monitor temperature",
    "Consult a doctor if symptoms persist beyond 3 days",
  ],
  transcript: "I have been experiencing a severe headache for the past two days, along with fatigue and mild fever. I feel tired and have some body aches.",
  detectedLanguage: "en",
  confidence: 0.95,
};

// Enhanced mock results for different languages
const MOCK_RESULTS_BY_LANG: Record<string, VoiceAnalysisResult> = {
  en: {
    symptoms: ["Headache", "Fatigue", "Mild fever"],
    possibleConditions: ["Common Cold", "Stress-related headache", "Dehydration"],
    recommendations: ["Rest and hydrate well", "Monitor temperature", "Consult doctor if persists"],
    transcript: "I have been experiencing a severe headache for the past two days, along with fatigue and mild fever.",
    detectedLanguage: "en",
    confidence: 0.95,
  },
  es: {
    symptoms: ["Dolor de cabeza", "Fiebre", "Cansancio"],
    possibleConditions: ["Resfriado común", "Dolor de cabeza por estrés", "Deshidratación"],
    recommendations: ["Descanse e hidrátese bien", "Monitoree la temperatura", "Consulte al médico si persiste"],
    transcript: "He tenido un dolor de cabeza fuerte durante los últimos dos días, junto con cansancio y fiebre leve.",
    detectedLanguage: "es",
    confidence: 0.92,
  },
  fr: {
    symptoms: ["Mal de tête", "Fatigue", "Fièvre légère"],
    possibleConditions: ["Rhume", "Mal de tête lié au stress", "Déshydratation"],
    recommendations: ["Reposez-vous et hydratez-vous bien", "Surveillez la température", "Consultez un médecin si ça persiste"],
    transcript: "J'ai eu un mal de tête sévère depuis deux jours, avec de la fatigue et une légère fièvre.",
    detectedLanguage: "fr",
    confidence: 0.90,
  },
};

export async function analyzeVoice(audioBlob: Blob, language?: string): Promise<VoiceAnalysisResult> {
  if (!isBackendConfigured()) {
    // Return mock result based on language or default to English
    if (language && MOCK_RESULTS_BY_LANG[language]) {
      return MOCK_RESULTS_BY_LANG[language];
    }
    return MOCK_RESULT;
  }
  
  const token = typeof window !== "undefined" ? localStorage.getItem("medisense_token") : null;
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  if (language) {
    formData.append("language", language);
  }
  
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
  return request<{ success: boolean }>("/api/voice/save", { 
    method: "POST", 
    body: JSON.stringify({ analysisId }),
    headers: { 'Content-Type': 'application/json' }
  });
}
