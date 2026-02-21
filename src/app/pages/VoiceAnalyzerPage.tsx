import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Mic, MicOff, PlayCircle, FileText, Brain } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { analyzeVoice, type VoiceAnalysisResult } from "../api/voice";

export function VoiceAnalyzerPage() {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setRecordError(null);
    setAnalysisError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };
      mediaRecorder.start();
      setIsRecording(true);
      setAnalysisResult(null);
    } catch (err) {
      console.error("Microphone access failed", err);
      setRecordError("Microphone access denied or unavailable. Please allow microphone access and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setHasRecording(true);
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleAnalyze = async () => {
    if (!audioBlob) return;
    setAnalysisError(null);
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeVoice(audioBlob);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis failed", err);
      setAnalysisError("Analysis failed. Please check your connection and try again, or record again.");
    } finally {
      setAnalyzing(false);
    }
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
            {t("voice.aiVoiceAnalysis")}
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4">{t("voice.voiceSymptomAnalyzer")}</h1>
          <p className="text-xl text-slate-600">{t("voice.voiceSymptomDesc")}</p>
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

              {recordError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {recordError}
                </div>
              )}
              {/* Status Text */}
              <div className="text-center mb-8">
                {isRecording ? (
                  <>
                    <p className="text-2xl font-bold text-red-600 mb-2">{t("voice.recording")}</p>
                    <p className="text-slate-600">{t("voice.clickToStop")}</p>
                  </>
                ) : hasRecording ? (
                  <>
                    <p className="text-2xl font-bold text-emerald-600 mb-2">{t("voice.recordingComplete")}</p>
                    <p className="text-slate-600">{t("voice.clickAnalyze")}</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-slate-800 mb-2">{t("voice.readyToRecord")}</p>
                    <p className="text-slate-600">{t("voice.clickAndDescribe")}</p>
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
                      onClick={() => { setHasRecording(false); setAudioBlob(null); setAnalysisResult(null); }}
                    >
                      <PlayCircle className="size-5 mr-2" />
                      {t("voice.playRecording")}
                    </Button>
                    <Button
                      disabled={analyzing}
                      onClick={handleAnalyze}
                      className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
                    >
                      <Brain className="size-5 mr-2" />
                      {analyzing ? "..." : t("voice.analyzeSymptoms")}
                    </Button>
                  </>
                )}
              </div>
              {analysisError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {analysisError}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results from API */}
        {analysisResult && (
          <Card className="border-2 border-blue-100 shadow-xl bg-gradient-to-br from-white to-sky-50">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-4 rounded-xl">
                  <FileText className="size-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">{t("voice.analysisResults")}</h2>
                  <p className="text-slate-600">{t("voice.aiGeneratedInsights")}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{t("voice.detectedSymptoms")}</h3>
                  <div className="flex flex-wrap gap-3">
                    {analysisResult.symptoms.map((symptom, index) => (
                      <span key={index} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">{symptom}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{t("voice.possibleConditions")}</h3>
                  <div className="space-y-3">
                    {analysisResult.possibleConditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span className="text-slate-700 font-medium">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{t("voice.aiRecommendations")}</h3>
                  <div className="space-y-3">
                    {analysisResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-blue-100">
                        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">{index + 1}</div>
                        <span className="text-slate-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
                  <p className="text-sm text-amber-800"><strong>Important:</strong> {t("voice.disclaimer")}</p>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">{t("voice.saveToDashboard")}</Button>
                  <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">{t("voice.shareWithDoctor")}</Button>
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => { setAnalysisResult(null); setHasRecording(false); setAudioBlob(null); }}>{t("voice.newAnalysis")}</Button>
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
