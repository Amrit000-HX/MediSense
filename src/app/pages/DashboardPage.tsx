import { Link } from "react-router";
import {
  Activity,
  FileText,
  TrendingUp,
  Calendar,
  Bell,
  Upload,
  Mic,
  BarChart3,
  Heart,
  Brain,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function DashboardPage() {
  const recentReports = [
    {
      title: "Blood Test Results",
      date: "2 days ago",
      status: "Reviewed",
      color: "emerald",
    },
    {
      title: "Cholesterol Panel",
      date: "1 week ago",
      status: "Pending",
      color: "blue",
    },
    {
      title: "Thyroid Function Test",
      date: "2 weeks ago",
      status: "Reviewed",
      color: "emerald",
    },
  ];

  const healthMetrics = [
    { label: "Blood Pressure", value: "120/80", status: "Normal", icon: Heart, color: "emerald" },
    { label: "Heart Rate", value: "72 bpm", status: "Good", icon: Activity, color: "blue" },
    { label: "Glucose", value: "95 mg/dL", status: "Normal", icon: TrendingUp, color: "emerald" },
    { label: "BMI", value: "23.5", status: "Healthy", icon: BarChart3, color: "blue" },
  ];

  const upcomingAppointments = [
    { title: "Annual Checkup", date: "Mar 15, 2026", time: "10:00 AM", doctor: "Dr. Sarah Johnson" },
    { title: "Follow-up Consultation", date: "Mar 22, 2026", time: "2:30 PM", doctor: "Dr. Michael Chen" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome back, John!</h1>
          <p className="text-slate-600">Here's your health summary for today</p>
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
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Upload New Report</h3>
                  <p className="text-slate-600 text-sm">Get instant AI analysis</p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white" asChild>
                  <Link to="/upload-report">Upload</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-lg hover:shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-4 rounded-xl">
                  <Mic className="size-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Voice Analysis</h3>
                  <p className="text-slate-600 text-sm">Describe your symptoms</p>
                </div>
                <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white" asChild>
                  <Link to="/voice-analyzer">Start</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Metrics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Health Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthMetrics.map((metric, index) => (
              <Card key={index} className="border-2 border-slate-100 hover:border-emerald-200 transition-all shadow-md hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`bg-gradient-to-r ${metric.color === 'emerald' ? 'from-emerald-500 to-teal-400' : 'from-blue-500 to-sky-400'} p-3 rounded-lg`}>
                      <metric.icon className="size-6 text-white" />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${metric.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 mb-1">{metric.label}</div>
                  <div className="text-2xl font-bold text-slate-800">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Reports */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Reports</h2>
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
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Upcoming Appointments</h2>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
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
                  Based on your recent reports, your overall health is trending positively. Your cholesterol levels show improvement compared to last month. Consider maintaining your current diet and exercise routine.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                  View Detailed Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
