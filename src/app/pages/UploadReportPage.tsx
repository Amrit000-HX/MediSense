import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Shield,
  Activity,
  HeartPulse,
  CalendarClock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  extractTextFromFile,
  validateFile,
  isAcceptedFile,
} from "../lib/reportParser";
import { analyzeReportText, type AnalysisResult } from "../lib/reportAnalysis";
import { cn } from "../components/ui/utils";

type Step = "idle" | "uploading" | "analyzing" | "done" | "error";

export function UploadReportPage() {
  const [step, setStep] = useState<Step>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const reset = useCallback(() => {
    setStep("idle");
    setFile(null);
    setError(null);
    setResult(null);
  }, []);

  const handleFile = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile) return;
    setError(null);
    setFile(selectedFile);
    const validation = validateFile(selectedFile);
    if (!validation.ok) {
      setError(validation.error ?? "Invalid file");
      setStep("error");
      return;
    }
    setStep("uploading");
    try {
      const text = await extractTextFromFile(selectedFile);
      if (!text || text.length < 10) {
        setError("We couldn't extract enough text from this file. For images, ensure the photo is clear and contains readable text.");
        setStep("error");
        return;
      }
      setStep("analyzing");
      const analysis = await analyzeReportText(text);
      setResult(analysis);
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
      setStep("error");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f && isAcceptedFile(f)) handleFile(f);
      else if (f) setError("Please upload a PDF, Word document (.pdf, .doc, .docx), or image (.png, .jpg).");
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Upload New Report
          </h1>
          <p className="text-slate-600 text-lg">
            Upload a PDF, Word document, or image (PNG/JPG). We'll analyze it using OCR and AI to give you a clear summary and recommendations.
          </p>
        </div>

        {step === "idle" && (
          <Card
            className={cn(
              "border-2 border-dashed transition-colors cursor-pointer",
              dragOver ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-emerald-300"
            )}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <CardContent className="p-12">
              <label
                htmlFor="report-file-input"
                className="flex flex-col items-center gap-4 cursor-pointer"
              >
                <div className="rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 p-5">
                  <Upload className="size-12 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-800">
                    Drag and drop your report here, or click to browse
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    PDF, Word (.pdf, .doc, .docx), or image (.png, .jpg) — max 10 MB
                  </p>
                </div>
                <Button
                  type="button"
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white pointer-events-none"
                  tabIndex={-1}
                >
                  Choose file
                </Button>
              </label>
              <input
                id="report-file-input"
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,image/jpg"
                onChange={onInputChange}
                className="hidden"
                aria-label="Choose report file"
              />
            </CardContent>
          </Card>
        )}

        {(step === "uploading" || step === "analyzing") && (
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-12 flex flex-col items-center gap-6">
              <Loader2 className="size-14 text-emerald-600 animate-spin" />
              <div className="text-center">
                <p className="text-xl font-semibold text-slate-800">
                  {step === "uploading" ? "Reading your report…" : "Analyzing with AI…"}
                </p>
                <p className="text-slate-600 mt-1">
                  {file?.name}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "error" && (
          <Card className="border-2 border-red-200 bg-red-50/50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="size-10 text-red-600 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800">Something went wrong</h3>
                  <p className="text-slate-700 mt-1">{error}</p>
                  <Button className="mt-4" variant="outline" onClick={reset}>
                    Try another file
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "done" && result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="size-6" />
                <span className="font-semibold">Analysis complete</span>
              </div>
              <Button variant="outline" size="sm" onClick={reset}>
                Upload another
              </Button>
            </div>

            <Card className="border-2 border-emerald-100">
              <CardHeader>
                <CardTitle className="text-slate-800">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">{result.summary}</p>
              </CardContent>
            </Card>

            {result.findings.length > 0 && (
              <Card className="border-2 border-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <FileText className="size-5" />
                    Key findings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.findings.map((f, i) => (
                      <li
                        key={i}
                        className={cn(
                          "flex flex-wrap items-start gap-2 rounded-lg p-3 border",
                          f.status === "critical" && "border-red-200 bg-red-50/50",
                          f.status === "attention" && "border-amber-200 bg-amber-50/50",
                          f.status === "normal" && "border-emerald-100 bg-emerald-50/30"
                        )}
                      >
                        <span className="font-medium text-slate-800">{f.label}</span>
                        <span className="text-slate-600">{f.value}</span>
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            f.status === "critical" && "bg-red-200 text-red-800",
                            f.status === "attention" && "bg-amber-200 text-amber-800",
                            f.status === "normal" && "bg-emerald-200 text-emerald-800"
                          )}
                        >
                          {f.status}
                        </span>
                        {f.note && (
                          <p className="w-full text-sm text-slate-600 mt-1">{f.note}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.symptoms && result.symptoms.length > 0 && (
              <Card className="border-2 border-amber-100">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Activity className="size-5" />
                    Possible symptoms to monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.symptoms.map((symptom, i) => (
                      <li key={i} className="flex gap-2 text-slate-700">
                        <span className="text-amber-600 font-bold">•</span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.prevention && result.prevention.length > 0 && (
              <Card className="border-2 border-emerald-100">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <HeartPulse className="size-5" />
                    Prevention & lifestyle tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.prevention.map((item, i) => (
                      <li key={i} className="flex gap-2 text-slate-700">
                        <span className="text-emerald-600 font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.futureSuggestions && result.futureSuggestions.length > 0 && (
              <Card className="border-2 border-sky-100">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <CalendarClock className="size-5" />
                    Future monitoring & follow-up
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.futureSuggestions.map((item, i) => (
                      <li key={i} className="flex gap-2 text-slate-700">
                        <span className="text-sky-600 font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.recommendations.length > 0 && (
              <Card className="border-2 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Lightbulb className="size-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2 text-slate-700">
                        <span className="text-emerald-600 font-bold">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="border border-slate-200 bg-slate-50">
              <CardContent className="p-4 flex gap-3">
                <Shield className="size-5 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">{result.disclaimer}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
