import { Link, useLocation } from "react-router";
import { Menu, X, LogIn, UserPlus, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import logoImage from "@/assets/184da1d23b1d7b6a564271e33d32f4a06365fd10.png";
import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { path: "/", label: t("header.nav.home") },
    { path: "/upload-report", label: t("header.nav.uploadReport") },
    { path: "/features", label: t("header.nav.features") },
    { path: "/how-it-works", label: t("header.nav.howItWorks") },
    { path: "/voice-analyzer", label: t("header.nav.voiceAnalyzer") },
    { path: "/contact", label: t("header.nav.contact") },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-emerald-100 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
              <img src={logoImage} alt="MediSense Logo" className="relative size-14 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-slate-800">
                MediSense
              </span>
              <span className="text-[10px] text-emerald-700 -mt-1 font-semibold tracking-wide">{t("header.tagline")}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-all font-medium ${
                  isActive(link.path)
                    ? "text-emerald-700 scale-105"
                    : "text-slate-600 hover:text-blue-600 hover:scale-105"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language & CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-all">
                <Globe className="size-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name ?? language}</span>
              </button>
              <div className="absolute top-full right-0 mt-2 bg-white border border-emerald-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="block w-full px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-all font-medium" asChild>
              <Link to="/login">
                <LogIn className="size-4 mr-2" />
                {t("header.login")}
              </Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all font-medium" asChild>
              <Link to="/signup">
                <UserPlus className="size-4 mr-2" />
                {t("header.signUp")}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="size-6 text-slate-600" />
            ) : (
              <Menu className="size-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-100">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-2 py-1 rounded transition-colors ${
                    isActive(link.path)
                      ? "text-emerald-700 font-medium bg-emerald-50"
                      : "text-slate-600 hover:text-blue-600 hover:bg-sky-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-emerald-100">
                <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 w-full" asChild>
                  <Link to="/login">
                    <LogIn className="size-4 mr-2" />
                    {t("header.login")}
                  </Link>
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white w-full" asChild>
                  <Link to="/signup">
                    <UserPlus className="size-4 mr-2" />
                    {t("header.signUp")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}