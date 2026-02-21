import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LanguageFontSync } from "./components/LanguageFontSync";

export default function App() {
  return (
    <>
      <LanguageFontSync />
      <RouterProvider router={router} />
    </>
  );
}
