import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { ProtectedDashboard } from "./components/ProtectedDashboard";
import { ProtectedUploadReport } from "./components/ProtectedUploadReport";
import { ProtectedVoiceAnalyzer } from "./components/ProtectedVoiceAnalyzer";
import { HomePage } from "./pages/HomePage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { DashboardPage } from "./pages/DashboardPage";
import { VoiceAnalyzerPage } from "./pages/VoiceAnalyzerPage";
import { UploadReportPage } from "./pages/UploadReportPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">404 - Page Not Found</h1>
          <p className="text-slate-600">The page you're looking for doesn't exist.</p>
          <a 
            href="/"
            className="text-emerald-600 hover:text-emerald-700 underline"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/dashboard",
        element: <ProtectedDashboard />,
      },
      {
        path: "/upload-report",
        element: <ProtectedUploadReport />,
      },
      {
        path: "/voice-analyzer",
        element: <ProtectedVoiceAnalyzer />,
      },
      {
        path: "/features",
        element: <FeaturesPage />,
      },
      {
        path: "/how-it-works",
        element: <HowItWorksPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
    ],
  },
]);
