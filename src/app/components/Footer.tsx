import { Link } from "react-router";
import { Activity, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="size-6 text-white" />
              </div>
              <span className="font-semibold text-xl text-white">MediSense</span>
            </div>
            <p className="text-sm">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-blue-400 transition-colors">
                  {t("header.nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-sm hover:text-blue-400 transition-colors">
                  {t("header.nav.features")}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm hover:text-blue-400 transition-colors">
                  {t("header.nav.howItWorks")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-blue-400 transition-colors">
                  {t("header.nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.services")}</h3>
            <ul className="space-y-2 text-sm">
              <li>{t("footer.aiReportAnalysis")}</li>
              <li>{t("footer.personalizedExplanations")}</li>
              <li>{t("footer.healthInsights")}</li>
              <li>{t("footer.medicalTerminologyTranslation")}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="size-4" />
                <span>support@medintelai.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="size-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="size-4" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
