import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LanguageFontSync } from "./components/LanguageFontSync";
import { initEmailJS } from "./api/otp";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Initialize EmailJS when app loads
    initEmailJS();
  }, []);

  return (
    <>
      <LanguageFontSync />
      <RouterProvider router={router}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
          <div className="relative z-50 w-full">
            {/* Main Content */}
          </div>
        </div>
      </RouterProvider>
    </>
  );
}
