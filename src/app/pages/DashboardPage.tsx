import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Activity,
  FileText,
  TrendingUp,
  Calendar,
  Upload,
  Mic,
  BarChart3,
  Heart,
  Brain,
  Clock,
  Pencil,
  Phone,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import { getStoredUser } from "../api/auth";
import { getReports, uploadReport, analyzeReport, type ReportItem, type ReportAnalysisResult } from "../api/reports";
import {
  getHealthMetrics,
  getAppointments,
  getSavedHealthMetrics,
  saveHealthMetrics,
  getMatchingDoctors,
  addSavedAppointment,
  DEFAULT_METRICS,
  type HealthMetric,
  type Appointment,
  type Doctor,
} from "../api/dashboard";

const METRICS_REF_ID = "dashboard-health-metrics";

export function DashboardPage() {
  const { t } = useTranslation();
  const user = getStoredUser();
  const [recentReports, setRecentReports] = useState<ReportItem[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(() => getSavedHealthMetrics());
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analyzingReport, setAnalyzingReport] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<{ reportTitle: string; result: ReportAnalysisResult } | null>(null);
  const [metricsModalOpen, setMetricsModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleLocation, setScheduleLocation] = useState("");
  const [scheduleAge, setScheduleAge] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [matchingDoctors, setMatchingDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [editingMetrics, setEditingMetrics] = useState<HealthMetric[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const metricsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getReports().then(setRecentReports).catch(() => {});
    setHealthMetrics(getSavedHealthMetrics());
    getAppointments().then(setUpcomingAppointments).catch(() => {});
  }, []);

  const openMetricsModal = () => {
    setEditingMetrics(getSavedHealthMetrics().map((m) => ({ ...m })));
    setMetricsModalOpen(true);
  };

  const handleMetricsSave = async () => {
    const withStatus = editingMetrics.map((m) => {
      const val = (m.value || "").trim();
      const status = !val || val === "0" ? "Not set" : "Recorded";
      const color = val ? "emerald" : "blue";
      return { ...m, value: val || m.value, status, color };
    });
    await saveHealthMetrics(withStatus);
    setHealthMetrics(withStatus);
    setMetricsModalOpen(false);
  };

  const resetMetricsToZero = () => {
    setEditingMetrics(DEFAULT_METRICS.map((m) => ({ ...m })));
  };

  const openScheduleModal = () => {
    setScheduleLocation("");
    setScheduleAge("");
    setScheduleDate("");
    setMatchingDoctors([]);
    setSelectedDoctor(null);
    setSelectedSlot("");
    setScheduleModalOpen(true);
  };

  const searchDoctors = () => {
    const age = parseInt(scheduleAge, 10) || 0;
    const list = getMatchingDoctors(scheduleLocation, age);
    setMatchingDoctors(list);
    setSelectedDoctor(null);
    setSelectedSlot("");
  };

  const confirmAppointment = async () => {
    if (!selectedDoctor || !selectedSlot) return;
    const date = scheduleDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    await addSavedAppointment({
      title: selectedDoctor.specialty + " – " + selectedDoctor.name,
      date,
      time: selectedSlot,
      doctor: selectedDoctor.name,
      contact: selectedDoctor.contactNo,
      venue: selectedDoctor.venue,
    });
    setUpcomingAppointments((prev) => [
      {
        title: selectedDoctor.specialty + " – " + selectedDoctor.name,
        date,
        time: selectedSlot,
        doctor: selectedDoctor.name,
        contact: selectedDoctor.contactNo,
        venue: selectedDoctor.venue,
      },
      ...prev,
    ]);
    setScheduleModalOpen(false);
  };

  const scrollToMetrics = () => {
    metricsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUploadClick = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = [".pdf", ".ppt", ".pptx", ".txt", ".doc", ".docx"];
    const validImages = "image/jpeg,image/png,image/gif,image/webp";
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const isImage = file.type.startsWith("image/");
    if (!validTypes.includes(ext) && !isImage) {
      setUploadError("Please upload a PDF, Word (.doc, .docx), PPT, PPTX, image, or TXT file.");
      e.target.value = "";
      return;
    }
    setUploadError(null);
    setAnalysisError(null);
    setLastAnalysis(null);
    setUploading(true);
    try {
      const result = await uploadReport(file);
      const newReport: ReportItem = { id: result.id, title: result.title, date: "Just now", status: "Analyzing...", color: "blue" };
      setRecentReports((prev) => [newReport, ...prev]);
      setUploading(false);
      e.target.value = "";

      setAnalyzingReport(true);
      try {
        const analysis = await analyzeReport(file);
        setLastAnalysis({ reportTitle: result.title, result: analysis });
        setRecentReports((prev) =>
          prev.map((r) => (r.id === result.id ? { ...r, status: analysis.status || "Reviewed", color: "emerald" as const } : r))
        );
      } catch {
        setAnalysisError("Analysis failed. Your report was uploaded; you can try again later.");
        setRecentReports((prev) => prev.map((r) => (r.id === result.id ? { ...r, status: "Pending", color: "blue" as const } : r)));
      } finally {
        setAnalyzingReport(false);
      }
    } catch {
      setUploadError("Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">{t("dashboard.welcomeBack", { name: user?.name || "User" })}</h1>
          <p className="text-slate-600">{t("dashboard.healthSummary")}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all shadow-lg hover:shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-sky-400 p-4 rounded-xl">
                  <Upload className="size-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{t("dashboard.uploadNewReport")}</h3>
                  <p className="text-slate-600 text-sm">{t("dashboard.getInstantAnalysis")}</p>
                </div>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,image/*,.txt" className="hidden" onChange={handleFileChange} />
                <Button onClick={handleUploadClick} disabled={uploading || analyzingReport} className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                  {uploading ? "Uploading..." : analyzingReport ? "Analyzing..." : t("dashboard.upload")}
                </Button>
              </div>
              {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
              {analysisError && <p className="text-sm text-amber-600 mt-2">{analysisError}</p>}
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-lg hover:shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-4 rounded-xl">
                  <Mic className="size-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{t("dashboard.voiceAnalysis")}</h3>
                  <p className="text-slate-600 text-sm">{t("dashboard.describeSymptoms")}</p>
                </div>
                <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white" asChild>
                  <Link to="/voice-analyzer">{t("dashboard.start")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PDF/Report Analysis Result */}
        {lastAnalysis && (
          <Card className="mb-12 border-2 border-emerald-200 shadow-xl bg-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-4 rounded-xl">
                  <FileText className="size-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Report analysis: {lastAnalysis.reportTitle}</h2>
                  <p className="text-sm text-emerald-600 font-medium">{lastAnalysis.result.status}</p>
                </div>
              </div>
              <p className="text-slate-700 mb-6">{lastAnalysis.result.summary}</p>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">Key findings</h3>
                  <ul className="space-y-2">
                    {lastAnalysis.result.keyFindings.map((finding, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <span className="text-emerald-600 mt-1">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                  {lastAnalysis.result.symptoms && lastAnalysis.result.symptoms.length > 0 && (
                    <>
                      <h3 className="font-bold text-slate-800 mb-3 mt-4">Possible symptoms</h3>
                      <ul className="space-y-2">
                        {lastAnalysis.result.symptoms.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-700">
                            <span className="text-amber-600 mt-1">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {lastAnalysis.result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                  {lastAnalysis.result.prevention && lastAnalysis.result.prevention.length > 0 && (
                    <>
                      <h3 className="font-bold text-slate-800 mb-3 mt-4">Prevention tips</h3>
                      <ul className="space-y-2">
                        {lastAnalysis.result.prevention.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-700">
                            <span className="text-emerald-600 mt-1">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              {lastAnalysis.result.disclaimer && (
                <p className="text-sm text-slate-500 italic mb-4">{lastAnalysis.result.disclaimer}</p>
              )}
              <Button variant="outline" className="border-emerald-200 text-emerald-700" onClick={() => setLastAnalysis(null)}>
                Dismiss
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Health Metrics - user can add/edit; default 0/empty */}
        <div id={METRICS_REF_ID} ref={metricsSectionRef} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{t("dashboard.yourHealthMetrics")}</h2>
            <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700" onClick={openMetricsModal}>
              <Pencil className="size-4 mr-2" />
              Edit metrics
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthMetrics.map((metric, index) => {
              const Icon = index === 0 ? Heart : index === 1 ? Activity : index === 2 ? TrendingUp : BarChart3;
              return (
                <Card key={index} className="border-2 border-slate-100 hover:border-emerald-200 transition-all shadow-md hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`bg-gradient-to-r ${metric.color === "emerald" ? "from-emerald-500 to-teal-400" : "from-blue-500 to-sky-400"} p-3 rounded-lg`}>
                        <Icon className="size-6 text-white" />
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${metric.color === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                        {metric.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mb-1">{metric.label}</div>
                    <div className="text-2xl font-bold text-slate-800">{metric.value || "—"}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Edit Health Metrics Modal */}
        <Dialog open={metricsModalOpen} onOpenChange={setMetricsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add or edit your health metrics</DialogTitle>
              <DialogDescription>Enter your values. Leave blank or 0 if not set. These are stored only on your device.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {editingMetrics.map((m, i) => (
                <div key={i} className="grid grid-cols-3 items-center gap-4">
                  <Label className="col-span-1 text-slate-700">{m.label}</Label>
                  <Input
                    className="col-span-2"
                    placeholder={m.label === "Blood Pressure" ? "e.g. 120/80" : m.label === "Heart Rate" ? "e.g. 72 bpm" : m.label === "Glucose" ? "e.g. 95 mg/dL" : "e.g. 23.5"}
                    value={m.value}
                    onChange={(e) => setEditingMetrics((prev) => prev.map((mm, j) => (j === i ? { ...mm, value: e.target.value } : mm)))}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetMetricsToZero}>
                Reset to empty
              </Button>
              <Button onClick={handleMetricsSave} className="bg-emerald-600 hover:bg-emerald-700">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule New Appointment Modal */}
        <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule new appointment</DialogTitle>
              <DialogDescription>Enter your location and age so we can suggest doctors and consultation times near you.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Your location (city or area)</Label>
                <Input placeholder="e.g. New York, Boston, Chicago" value={scheduleLocation} onChange={(e) => setScheduleLocation(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Your age</Label>
                <Input type="number" min="1" max="120" placeholder="e.g. 35" value={scheduleAge} onChange={(e) => setScheduleAge(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Preferred date (optional)</Label>
                <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
              </div>
              <Button onClick={searchDoctors} className="w-full bg-blue-600 hover:bg-blue-700">
                Find doctors
              </Button>
            </div>
            {matchingDoctors.length > 0 && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold text-slate-800">Select a doctor and time</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {matchingDoctors.map((doc) => (
                    <Card key={doc.id} className={`cursor-pointer border-2 ${selectedDoctor?.id === doc.id ? "border-emerald-500" : "border-slate-200"}`} onClick={() => { setSelectedDoctor(doc); setSelectedSlot(""); }}>
                      <CardContent className="p-4">
                        <div className="font-semibold text-slate-800">{doc.name}</div>
                        <div className="text-sm text-slate-600">{doc.specialty}</div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-700">
                          <Phone className="size-4" />
                          {doc.contactNo}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <MapPin className="size-4" />
                          {doc.venue}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{doc.consultationHours}</div>
                        {selectedDoctor?.id === doc.id && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {doc.suggestedSlots.map((slot) => (
                              <Button
                                key={slot}
                                size="sm"
                                variant={selectedSlot === slot ? "default" : "outline"}
                                className={selectedSlot === slot ? "bg-emerald-600" : ""}
                                onClick={(e) => { e.stopPropagation(); setSelectedSlot(slot); }}
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setScheduleModalOpen(false)}>Cancel</Button>
                  <Button onClick={confirmAppointment} disabled={!selectedDoctor || !selectedSlot} className="bg-emerald-600 hover:bg-emerald-700">
                    Confirm appointment
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Reports */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{t("dashboard.recentReports")}</h2>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <Card key={index} className="border border-slate-200 hover:border-blue-300 transition-all shadow-md hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-lg">
                          <FileText className="size-6 text-emerald-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{report.title}</h3>
                          <p className="text-sm text-slate-600">{report.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${report.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {report.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                View All Reports
              </Button>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{t("dashboard.upcomingAppointments")}</h2>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <Card key={index} className="border border-slate-200 hover:border-emerald-300 transition-all shadow-md hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-emerald-100 to-blue-100 p-3 rounded-lg">
                        <Calendar className="size-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 mb-1">{appointment.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                          <Clock className="size-4" />
                          {appointment.date} at {appointment.time}
                        </div>
                        <p className="text-sm text-slate-600">{appointment.doctor}</p>
                        {appointment.contact && (
                          <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                            <Phone className="size-3" /> {appointment.contact}
                          </p>
                        )}
                        {appointment.venue && (
                          <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                            <MapPin className="size-3" /> {appointment.venue}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50" onClick={openScheduleModal}>
                Schedule New Appointment
              </Button>
            </div>
          </div>
        </div>

        {/* Health Insights */}
        <Card className="border-2 border-blue-100 shadow-xl bg-gradient-to-r from-blue-50 to-emerald-50">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-4 rounded-xl">
                <Brain className="size-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">AI Health Insights</h3>
                <p className="text-slate-700 mb-4">
                  Add your blood pressure, heart rate, glucose, and BMI above to see a fuller picture. Your metrics are private and stored only on your device.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white" onClick={() => { scrollToMetrics(); openMetricsModal(); }}>
                  View & edit detailed metrics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
