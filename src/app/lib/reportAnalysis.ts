export interface AnalysisResult {
  summary: string;
  findings: {
    label: string;
    value: string;
    status: "normal" | "attention" | "critical";
    note?: string;
  }[];
  symptoms: string[];
  prevention: string[];
  futureSuggestions: string[];
  recommendations: string[];
  disclaimer: string;
}

const MEDICAL_TERMS = [
  "glucose", "HbA1c", "cholesterol", "LDL", "HDL", "triglycerides", "creatinine", "eGFR",
  "hemoglobin", "RBC", "WBC", "platelet", "TSH", "T3", "T4", "blood pressure", "BMI",
  "bilirubin", "ALT", "AST", "ALP", "urea", "BUN", "sodium", "potassium", "calcium",
  "vitamin D", "vitamin B12", "ferritin", "ESR", "CRP", "Hb", "RBC count", "platelets",
  "hematocrit", "MCV", "MCH", "MCHC", "RDW", "neutrophils", "lymphocytes", "monocytes",
  "eosinophils", "basophils", "immature granulocytes", "absolute neutrophils", "uric acid",
  "phosphorus", "magnesium", "chloride", "total protein", "albumin", "globulin", "A/G ratio",
  "iron", "TIBC", "transferrin", "ferritin", "folate", "homocysteine", "lipase", "amylase",
  "CK", "LDH", "GGT", "urine specific gravity", "urine pH", "urine protein", "urine glucose",
  "urine ketones", "urine blood", "urine leukocytes", "urine nitrite", "urine bilirubin",
  "urine urobilinogen", "microalbumin", "creatinine clearance", "BUN/creatinine ratio"
];

// Enhanced reference ranges for better analysis
const REFERENCE_RANGES: Record<string, { min: number; max: number; unit: string }> = {
  "glucose": { min: 70, max: 99, unit: "mg/dL" },
  "HbA1c": { min: 4.0, max: 5.6, unit: "%" },
  "cholesterol": { min: 0, max: 200, unit: "mg/dL" },
  "LDL": { min: 0, max: 100, unit: "mg/dL" },
  "HDL": { min: 40, max: 60, unit: "mg/dL" },
  "triglycerides": { min: 0, max: 150, unit: "mg/dL" },
  "hemoglobin": { min: 12, max: 16, unit: "g/dL" },
  "RBC": { min: 4.2, max: 5.4, unit: "M/µL" },
  "WBC": { min: 4.5, max: 11.0, unit: "K/µL" },
  "platelet": { min: 150, max: 450, unit: "K/µL" },
  "TSH": { min: 0.4, max: 4.0, unit: "mIU/L" },
  "systolic": { min: 90, max: 120, unit: "mmHg" },
  "diastolic": { min: 60, max: 80, unit: "mmHg" },
};

function pickFromReport(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const term of terms) {
    if (lower.includes(term.toLowerCase())) found.push(term);
  }
  return found.length ? found : ["General health markers"];
}

function extractMedicalValues(text: string): Array<{label: string, value: string, status: "normal" | "attention" | "critical", note?: string}> {
  const findings: Array<{label: string, value: string, status: "normal" | "attention" | "critical", note?: string}> = [];
  
  // Enhanced regex patterns for value extraction
  const patterns = [
    { regex: /glucose\s*[:=]?\s*(\d+\.?\d*)\s*(mg\/dl|mmol\/L)?/gi, label: "glucose" },
    { regex: /HbA1c\s*[:=]?\s*(\d+\.?\d*)\s*%?/gi, label: "HbA1c" },
    { regex: /cholesterol\s*[:=]?\s*(\d+\.?\d*)\s*(mg\/dl|mmol\/L)?/gi, label: "cholesterol" },
    { regex: /LDL\s*[:=]?\s*(\d+\.?\d*)\s*(mg\/dl|mmol\/L)?/gi, label: "LDL" },
    { regex: /HDL\s*[:=]?\s*(\d+\.?\d*)\s*(mg\/dl|mmol\/L)?/gi, label: "HDL" },
    { regex: /hemoglobin\s*[:=]?\s*(\d+\.?\d*)\s*(g\/dl|g\/L)?/gi, label: "hemoglobin" },
    { regex: /WBC\s*[:=]?\s*(\d+\.?\d*)\s*(k\/µl|×10⁹\/L)?/gi, label: "WBC" },
    { regex: /platelet\s*[:=]?\s*(\d+\.?\d*)\s*(k\/µl|×10⁹\/L)?/gi, label: "platelet" },
    { regex: /TSH\s*[:=]?\s*(\d+\.?\d*)\s*(mIU\/L|µIU\/mL)?/gi, label: "TSH" },
  ];
  
  patterns.forEach(({ regex, label }) => {
    const matches = [...text.matchAll(regex)];
    matches.forEach(match => {
      const value = parseFloat(match[1]);
      const unit = match[2] || "";
      
      if (REFERENCE_RANGES[label]) {
        const range = REFERENCE_RANGES[label];
        let status: "normal" | "attention" | "critical" = "normal";
        let note = `Reference: ${range.min}-${range.max} ${range.unit}`;
        
        if (value < range.min * 0.8 || value > range.max * 1.5) {
          status = "critical";
          note += " - Significantly abnormal";
        } else if (value < range.min || value > range.max) {
          status = "attention";
          note += " - Outside reference range";
        }
        
        findings.push({
          label,
          value: `${value} ${unit}`,
          status,
          note
        });
      }
    });
  });
  
  return findings;
}

/** Enhanced mock analysis with better value extraction */
export async function analyzeReportText(text: string): Promise<AnalysisResult> {
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY as string | undefined;
  if (apiKey && text.length > 50) {
    try {
      return await analyzeWithOpenAI(text, apiKey);
    } catch (e) {
      console.warn("OpenAI analysis failed, using built-in analysis:", e);
    }
  }
  return enhancedMockAnalyze(text);
}

async function analyzeWithOpenAI(text: string, apiKey: string): Promise<AnalysisResult> {
  const truncated = text.slice(0, 12000);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a medical report analyst. Given raw text from a medical/lab report, respond with a JSON object only (no markdown, no code block) with this exact structure:
{
  "summary": "2-4 sentence plain-language summary of the report and overall health indication",
  "findings": [{"label": "Finding name", "value": "value or range", "status": "normal" or "attention" or "critical", "note": "optional brief note"}],
  "symptoms": ["possible symptom 1", "possible symptom 2", ...],
  "prevention": ["preventive or lifestyle step 1", "step 2", ...],
  "futureSuggestions": ["follow-up or monitoring suggestion 1", "suggestion 2", ...],
  "recommendations": ["immediate or short-term recommendation 1", "recommendation 2", ...],
  "disclaimer": "Short disclaimer that this is not medical advice and the user should consult a doctor."
}
Status: use "normal" for within range, "attention" for borderline, "critical" for out of range or concerning. Do NOT add any fields beyond the ones specified above.`,
        },
        {
          role: "user",
          content: `Analyze this medical report text:\n\n${truncated}`,
        },
      ],
      max_tokens: 1500,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty response from OpenAI");
  const parsed = JSON.parse(content) as AnalysisResult;
  if (!parsed.summary || !Array.isArray(parsed.findings) || !Array.isArray(parsed.recommendations)) {
    throw new Error("Invalid structure from OpenAI");
  }
  parsed.symptoms = Array.isArray(parsed.symptoms) ? parsed.symptoms : [];
  parsed.prevention = Array.isArray(parsed.prevention) ? parsed.prevention : [];
  parsed.futureSuggestions = Array.isArray(parsed.futureSuggestions)
    ? parsed.futureSuggestions
    : [];
  parsed.disclaimer = parsed.disclaimer || "This is not medical advice. Please consult a healthcare provider.";
  return parsed;
}

function enhancedMockAnalyze(text: string): AnalysisResult {
  const extractedValues = extractMedicalValues(text);
  const termsFound = pickFromReport(text, MEDICAL_TERMS);
  const hasNumbers = /\d+\.?\d*/.test(text);
  
  const summary = hasNumbers
    ? `Your medical report contains ${extractedValues.length} measurable values and references to: ${termsFound.slice(0, 5).join(", ")}. ${extractedValues.filter(v => v.status === "critical").length > 0 ? "Some values require immediate attention." : "Most values appear within normal ranges."} Please review the detailed analysis below and consult your healthcare provider.`
    : "We've processed your medical document. The analysis below provides a structured overview of the findings. For precise interpretation of values and clinical significance, please share with your healthcare provider.";

  const findings = extractedValues.length > 0 ? extractedValues : termsFound.slice(0, 6).map((label, i) => ({
    label,
    value: "See report",
    status: (["normal", "attention", "normal"] as const)[i % 3],
    note: "Value and range should be verified with your doctor.",
  }));

  // Enhanced symptom suggestions based on findings
  const symptoms: string[] = [];
  if (extractedValues.some(v => v.label === "glucose" && v.status !== "normal")) {
    symptoms.push("Increased thirst or frequent urination", "Fatigue or blurred vision");
  }
  if (extractedValues.some(v => v.label === "hemoglobin" && v.status !== "normal")) {
    symptoms.push("Fatigue or weakness", "Shortness of breath", "Pale skin");
  }
  if (extractedValues.some(v => v.label === "TSH" && v.status !== "normal")) {
    symptoms.push("Unexplained weight changes", "Mood changes or fatigue", "Temperature sensitivity");
  }
  if (symptoms.length === 0) {
    symptoms.push("Monitor for any new or unusual symptoms", "Maintain regular health check-ups");
  }

  const prevention: string[] = [
    "Maintain a balanced diet rich in fruits, vegetables, whole grains, and lean protein.",
    "Limit processed foods, added sugars, and saturated fats.",
    "Engage in at least 150 minutes of moderate physical activity per week.",
    "Stay hydrated with adequate water intake throughout the day.",
    "Ensure 7-9 hours of quality sleep per night.",
    "Avoid smoking and limit alcohol consumption.",
    "Manage stress through relaxation techniques or mindfulness practices.",
  ];

  const futureSuggestions: string[] = [
    "Schedule follow-up tests as recommended by your healthcare provider.",
    "Keep a personal health log of lab results, medications, and symptoms.",
    "Share this report with all your healthcare providers for coordinated care.",
    "Consider discussing lifestyle modifications based on these results.",
    "Maintain regular health screenings even when feeling well.",
  ];

  const recommendations = [
    "Discuss these results with your healthcare provider for personalized interpretation.",
    "Keep a copy of this report for your personal health records.",
    extractedValues.some(v => v.status === "critical") 
      ? "Schedule an appointment with your healthcare provider soon to discuss critical values."
      : "Follow up on any abnormal values as recommended by your doctor.",
    "Inform your doctor of any new symptoms or health concerns.",
    "Consider bringing a list of questions to your next medical appointment.",
  ];

  return {
    summary,
    findings,
    symptoms,
    prevention,
    futureSuggestions,
    recommendations,
    disclaimer: "This AI-generated analysis is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider with any questions about your medical condition or test results.",
  };
}
