import {
  Upload,
  Scan,
  Brain,
  FileText,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Target,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";

export function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Upload Your Medical Report",
      description:
        "Securely upload your medical report in any format - PDF, image (JPG, PNG), or text document. Our system accepts lab results, imaging reports, pathology reports, and more.",
      details: [
        "Drag and drop or browse to upload",
        "Supports multiple file formats",
        "Encrypted upload process",
        "No storage on our servers (optional)",
      ],
    },
    {
      number: 2,
      icon: Scan,
      title: "Document Processing & OCR",
      description:
        "Our advanced Optical Character Recognition (OCR) technology extracts text from your document, even from scanned or photographed reports with high accuracy.",
      details: [
        "99%+ accuracy rate",
        "Handles handwritten notes",
        "Processes multiple pages",
        "Preserves document structure",
      ],
    },
    {
      number: 3,
      icon: Brain,
      title: "AI Analysis & Interpretation",
      description:
        "Our AI engine, trained on millions of medical documents, analyzes your report to identify key findings, metrics, and medical terminology that need explanation.",
      details: [
        "Natural language processing",
        "Medical terminology recognition",
        "Context-aware analysis",
        "Pattern detection across values",
      ],
    },
    {
      number: 4,
      icon: FileText,
      title: "Personalized Explanation Generation",
      description:
        "The AI generates clear, personalized explanations tailored to your health literacy level, breaking down complex medical jargon into understandable language.",
      details: [
        "Plain language translations",
        "Visual aids and diagrams",
        "Comparison to normal ranges",
        "Related health information",
      ],
    },
    {
      number: 5,
      icon: CheckCircle2,
      title: "Review & Take Action",
      description:
        "Review your comprehensive analysis, explore interactive visualizations, and receive actionable recommendations for next steps in your health journey.",
      details: [
        "Interactive dashboard",
        "Downloadable PDF reports",
        "Share with your doctor",
        "Track changes over time",
      ],
    },
  ];

  const technologies = [
    {
      icon: Brain,
      title: "Machine Learning",
      description:
        "Advanced neural networks trained on millions of medical documents to understand context and nuance.",
    },
    {
      icon: Shield,
      title: "Secure Processing",
      description:
        "All processing happens in a secure, encrypted environment with no unauthorized access.",
    },
    {
      icon: Zap,
      title: "Real-Time Analysis",
      description:
        "Our optimized infrastructure delivers results in under 30 seconds for most reports.",
    },
    {
      icon: Target,
      title: "Continuous Learning",
      description:
        "Our AI continuously improves through feedback and new medical research integration.",
    },
  ];

  const reportTypes = [
    "Blood Test Results",
    "Complete Blood Count (CBC)",
    "Metabolic Panels",
    "Lipid Panels",
    "Hormone Tests",
    "Radiology Reports",
    "MRI/CT Scan Reports",
    "X-Ray Reports",
    "Ultrasound Reports",
    "Pathology Reports",
    "Biopsy Results",
    "Genetic Test Results",
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              How MediSense Works
            </h1>
            <p className="text-xl text-gray-600">
              From upload to insights in five simple steps - see how our AI transforms complex
              medical reports into clear, actionable information
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                      {step.number}
                    </div>
                    <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center">
                      <step.icon className="size-8 text-blue-600" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h2>
                  <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <Card className="border-gray-200 shadow-lg">
                    <CardContent className="p-8">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                        <step.icon className="size-24 text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600 italic">
                          Step {step.number}: {step.title}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-gray-600">
              The cutting-edge technology that makes it all possible
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="size-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tech.title}</h3>
                  <p className="text-gray-600 text-sm">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Reports Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Supports All Types of Medical Reports
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our AI is trained to understand and analyze a wide variety of medical documents,
                ensuring comprehensive coverage for all your health needs.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {reportTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{type}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6">
                  Try It Now
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1768323286301-6fd85d28f47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2UlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc3MTE4MTUxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="AI healthcare technology"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Try MediSense?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Upload your first medical report and experience the power of AI-driven health insights
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
            Get Started Now
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
