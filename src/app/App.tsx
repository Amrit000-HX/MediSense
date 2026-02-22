import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LanguageFontSync } from "./components/LanguageFontSync";
<<<<<<< HEAD

export default function App() {
=======
import { initEmailJS } from "./api/otp";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Initialize EmailJS when app loads
    initEmailJS();
  }, []);

>>>>>>> local-changes
  return (
    <>
      <LanguageFontSync />
      <RouterProvider router={router} />
    </>
  );
}
