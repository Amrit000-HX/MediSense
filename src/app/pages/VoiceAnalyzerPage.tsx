import { useState } from "react";
import { Mic, MicOff, PlayCircle, StopCircle, FileText, Brain } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useTranslation } from "../context/LanguageContext";

export function VoiceAnalyzerPage() {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setIsRecording(true);
    }
  };

  const sampleAnalysis = {
    symptoms: ["Headache", "Fatigue", "Mild fever"],
    possibleConditions: ["Common Cold", "Stress-related headache", "Dehydration"],
    recommendations: [
      "Rest and hydrate well",
      "Monitor temperature",
      "Consult a doctor if symptoms persist beyond 3 days"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
            {t("voiceAnalyzer.badge")}
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4">{t("voiceAnalyzer.title")}</h1>
          <p className="text-xl text-slate-600">{t("voiceAnalyzer.subtitle")}</p>
        </div>

        {/* Recording Interface */}
        <Card className="border-2 border-emerald-100 shadow-2xl mb-12">
          <CardContent className="p-12">
            <div className="flex flex-col items-center">
              {/* Microphone Button */}
              <button
                onClick={toggleRecording}
                className={`relative mb-8 transition-all duration-300 ${
                  isRecording ? 'animate-pulse' : ''
                }`}
              >
                <div className={`absolute inset-0 rounded-full blur-2xl transition-all ${
                  isRecording 
                    ? 'bg-red-300 opacity-75 scale-125' 
                    : 'bg-gradient-to-r from-blue-300 to-emerald-300 opacity-50'
                }`}></div>
                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-gradient-to-r from-red-500 to-rose-600'
                    : 'bg-gradient-to-r from-blue-600 to-emerald-600'
                } shadow-2xl hover:scale-110`}>
                  {isRecording ? (
                    <MicOff className="size-16 text-white" />
                  ) : (
                    <Mic className="size-16 text-white" />
                  )}
                </div>
              </button>

              {/* Status Text */}
              <div className="text-center mb-8">
                {isRecording ? (
                  <>
                    <p className="text-2xl font-bold text-red-600 mb-2">Recording...</p>
                    <p className="text-slate-600">Click the microphone to stop</p>
                  </>
                ) : hasRecording ? (
                  <>
                    <p className="text-2xl font-bold text-emerald-600 mb-2">Recording Complete</p>
                    <p className="text-slate-600">Click analyze to get your results</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-slate-800 mb-2">Ready to Record</p>
                    <p className="text-slate-600">Click the microphone and describe your symptoms</p>
                  </>
                )}
              </div>

              {/* Wave Animation */}
              {isRecording && (
                <div className="flex items-center gap-2 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-gradient-to-t from-blue-600 to-emerald-600 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 40 + 20}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {hasRecording && !isRecording && (
                  <>
                    <Button
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                      onClick={() => setHasRecording(false)}
                    >
                      <PlayCircle className="size-5 mr-2" />
                      Play Recording
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                      <Brain className="size-5 mr-2" />
                      Analyze Symptoms
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example Analysis Results (shown for demonstration) */}
        {hasRecording && (
          <Card className="border-2 border-blue-100 shadow-xl bg-gradient-to-br from-white to-sky-50">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-4 rounded-xl">
                  <FileText className="size-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Analysis Results</h2>
                  <p className="text-slate-600">AI-generated health insights based on your description</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Detected Symptoms */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Detected Symptoms</h3>
                  <div className="flex flex-wrap gap-3">
                    {sampleAnalysis.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Possible Conditions */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Possible Conditions</h3>
                  <div className="space-y-3">
                    {sampleAnalysis.possibleConditions.map((condition, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                      >
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span className="text-slate-700 font-medium">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">AI Recommendations</h3>
                  <div className="space-y-3">
                    {sampleAnalysis.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-blue-100"
                      >
                        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                          {index + 1}
                        </div>
                        <span className="text-slate-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
                  <p className="text-sm text-amber-800">
                    <strong>Important:</strong> This is an AI-generated analysis and should not replace professional medical advice. 
                    Please consult with a healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                    Save to Dashboard
                  </Button>
                  <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    Share with Doctor
                  </Button>
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                    New Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* How It Works */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { step: 1, title: "Record", desc: "Click the microphone and describe your symptoms naturally" },
            { step: 2, title: "Process", desc: "Our AI analyzes your voice and extracts key health information" },
            { step: 3, title: "Insights", desc: "Receive personalized health insights and recommendations" }
          ].map((item, index) => (
            <Card key={index} className="border border-emerald-100 hover:border-emerald-300 transition-all shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
