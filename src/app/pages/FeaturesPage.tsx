import {
  Brain,
  FileSearch,
  Languages,
  TrendingUp,
  Bell,
  Lock,
  Download,
  Sparkles,
  BarChart3,
  UserCheck,
  Stethoscope,
  ClipboardCheck,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function FeaturesPage() {
  const coreFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Analysis",
      description:
        "Our proprietary AI algorithms analyze medical reports using natural language processing and deep learning to extract meaningful insights from complex medical data.",
      benefits: [
        "Identifies key health indicators",
        "Detects patterns and trends",
        "Flags abnormal values automatically",
      ],
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: Languages,
      title: "Medical Jargon Translation",
      description:
        "Converts complex medical terminology into clear, understandable language that anyone can comprehend, without losing accuracy or important details.",
      benefits: [
        "Plain language explanations",
        "Context-aware translations",
        "Multiple literacy levels supported",
      ],
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: FileSearch,
      title: "Comprehensive Report Analysis",
      description:
        "Supports analysis of various medical reports including blood tests, imaging reports, pathology results, and more with specialized AI models for each type.",
      benefits: [
        "Blood work analysis",
        "Radiology report interpretation",
        "Lab result explanations",
      ],
      color: "from-teal-500 to-emerald-500",
    },
    {
      icon: TrendingUp,
      title: "Health Trend Tracking",
      description:
        "Track your health metrics over time and identify trends, improvements, or areas that need attention with our intelligent tracking system.",
      benefits: [
        "Historical data comparison",
        "Visual trend graphs",
        "Predictive health insights",
      ],
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Sparkles,
      title: "Personalized Recommendations",
      description:
        "Receive tailored health recommendations based on your specific results, medical history, and current health status.",
      benefits: [
        "Customized lifestyle suggestions",
        "Dietary recommendations",
        "Follow-up test suggestions",
      ],
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Get alerted when new results are available, when values fall outside normal ranges, or when follow-up actions are recommended.",
      benefits: [
        "Real-time result notifications",
        "Abnormal value alerts",
        "Reminder for follow-ups",
      ],
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description:
        "All data is encrypted both in transit and at rest using industry-standard AES-256 encryption.",
    },
    {
      icon: UserCheck,
      title: "HIPAA Compliant",
      description:
        "Our platform adheres to all HIPAA regulations ensuring your medical information is protected.",
    },
    {
      icon: ClipboardCheck,
      title: "Secure Access Control",
      description:
        "Multi-factor authentication and role-based access ensure only you can view your medical data.",
    },
  ];

  const additionalFeatures = [
    {
      icon: Download,
      title: "Export & Share",
      description: "Download your analysis reports or securely share them with healthcare providers.",
    },
    {
      icon: BarChart3,
      title: "Visual Dashboards",
      description: "Interactive charts and graphs make it easy to visualize your health data.",
    },
    {
      icon: Stethoscope,
      title: "Doctor Consultation Ready",
      description: "Generate summary reports perfect for discussing with your healthcare provider.",
    },
  ];

  const quotes = [
    {
      text: "The best doctor gives the least medicines.",
      author: "Benjamin Franklin",
    },
    {
      text: "An ounce of prevention is worth a pound of cure.",
      author: "Benjamin Franklin",
    },
    {
      text: "The greatest wealth is health.",
      author: "Virgil",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
              Comprehensive Features
            </div>
            <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
              Powerful Features for Complete Health Understanding
            </h1>
            <p className="text-2xl text-gray-600 font-medium">
              Discover how our AI-powered platform transforms complex medical reports into
              actionable health insights
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              Core Features
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6">Everything You Need</h2>
            <p className="text-2xl text-gray-600 font-medium">
              Comprehensive tools to understand your medical reports
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="border-2 border-teal-200 hover:border-teal-400 hover:shadow-2xl hover:shadow-teal-500/20 transition-all hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-white to-teal-50/30">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl`}>
                      <feature.icon className="size-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed font-medium">{feature.description}</p>
                      <ul className="space-y-3">
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                            <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border-2 border-white/30 shadow-2xl">
            <blockquote className="space-y-6">
              <p className="text-4xl md:text-5xl font-extrabold text-white italic leading-tight drop-shadow-2xl">
                "{quotes[0].text}"
              </p>
              <footer className="text-teal-100 text-xl font-bold">— {quotes[0].author}</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                Security & Privacy
              </div>
              <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
                Your Privacy & Security is Our Priority
              </h2>
              <p className="text-2xl text-gray-600 font-medium leading-relaxed">
                We understand the sensitive nature of medical data. That's why we've implemented
                enterprise-grade security measures to protect your information.
              </p>

              <div className="space-y-6 pt-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-2 border-emerald-200 hover:border-emerald-400">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <feature.icon className="size-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:scale-105 transition-transform">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc2VjdXJpdHklMjBwcml2YWN5fGVufDF8fHx8MTc3MTIzMDk1MHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medical data security"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              Additional Features
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6">And Much More</h2>
            <p className="text-2xl text-gray-600 font-medium">
              Extra features to enhance your healthcare experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all hover:scale-110 hover:-translate-y-3 group">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="bg-gradient-to-r from-cyan-500 to-teal-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:rotate-12 transition-transform">
                    <feature.icon className="size-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Another Quote */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="space-y-6">
            <p className="text-4xl md:text-5xl font-extrabold text-gray-900 italic leading-tight">
              "{quotes[1].text}"
            </p>
            <footer className="text-teal-600 text-xl font-bold">— {quotes[1].author}</footer>
          </blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <h2 className="text-6xl font-extrabold text-white drop-shadow-2xl">
            Experience All These Features Today
          </h2>
          <p className="text-3xl text-teal-100 font-medium">
            Start understanding your medical reports better with our comprehensive AI platform
          </p>
          <button className="bg-white text-teal-600 hover:bg-gray-100 px-12 py-6 rounded-2xl font-bold text-xl transition-all hover:scale-110 shadow-2xl">
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
