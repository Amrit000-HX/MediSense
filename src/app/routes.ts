import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
<<<<<<< HEAD
=======
import { ProtectedDashboard } from "./components/ProtectedDashboard";
import { ProtectedUploadReport } from "./components/ProtectedUploadReport";
import { ProtectedVoiceAnalyzer } from "./components/ProtectedVoiceAnalyzer";
>>>>>>> local-changes
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
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "features", Component: FeaturesPage },
      { path: "how-it-works", Component: HowItWorksPage },
      { path: "contact", Component: ContactPage },
<<<<<<< HEAD
      { path: "voice-analyzer", Component: VoiceAnalyzerPage },
      { path: "upload-report", Component: UploadReportPage },
      { path: "dashboard", Component: DashboardPage },
=======
      { path: "voice-analyzer", Component: ProtectedVoiceAnalyzer },
      { path: "upload-report", Component: ProtectedUploadReport },
      { path: "dashboard", Component: ProtectedDashboard },
>>>>>>> local-changes
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignUpPage,
  },
]);