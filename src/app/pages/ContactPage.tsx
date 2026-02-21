import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTranslation } from "../context/LanguageContext";

export function ContactPage() {
  const { t } = useTranslation();
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@medintelai.com", "sales@medintelai.com"],
      color: "blue",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "Mon-Fri 9AM-6PM EST"],
      color: "green",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Healthcare Avenue", "San Francisco, CA 94102"],
      color: "purple",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9AM - 6PM", "Weekend: Closed"],
      color: "orange",
    },
  ];

  const faqs = [
    {
      question: "How secure is my medical data?",
      answer:
        "We use bank-level AES-256 encryption and are fully HIPAA compliant. Your data is never shared with third parties without your explicit consent.",
    },
    {
      question: "What types of medical reports can I upload?",
      answer:
        "We support blood tests, imaging reports, pathology results, genetic tests, and most other medical documents in PDF, image, or text format.",
    },
    {
      question: "How long does the analysis take?",
      answer:
        "Most reports are analyzed in under 30 seconds. Complex or lengthy reports may take up to 2 minutes.",
    },
    {
      question: "Can I share my results with my doctor?",
      answer:
        "Yes! You can download a PDF summary or securely share a link with your healthcare provider directly from the platform.",
    },
    {
      question: "Is the service available 24/7?",
      answer:
        "Yes, MediSense is available 24/7. You can upload and analyze your medical reports anytime, from anywhere.",
    },
    {
      question: "What age groups do you cater to?",
      answer:
        "We provide personalized analysis for all age groups - children (0-17), adults (18-59), and seniors (60+) with tailored insights for each group.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{t("contact.title")}</h1>
            <p className="text-xl text-gray-600">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div
                    className={`bg-${info.color}-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <info.icon className={`size-7 text-${info.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Image */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our team will respond within 24 hours.
              </p>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" className="bg-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" className="bg-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[150px] bg-white"
                  />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
                  Send Message
                  <Send className="ml-2 size-5" />
                </Button>
              </form>
            </div>

            {/* Image & Additional Info */}
            <div className="space-y-8">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758691461935-202e2ef6b69f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXRpZW50JTIwZG9jdG9yJTIwY29uc3VsdGF0aW9ufGVufDF8fHx8MTc3MTEzMDA0NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Patient doctor consultation"
                  className="w-full h-auto"
                />
              </div>

              <Card className="border-gray-200 bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Enterprise Solutions</h3>
                  <p className="text-gray-700 mb-4">
                    Looking for a custom solution for your healthcare organization? Our enterprise
                    team can help you integrate MediSense into your existing systems.
                  </p>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions about MediSense
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              View Full FAQ
            </Button>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-gray-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="size-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">123 Healthcare Avenue</p>
                  <p className="text-gray-600">San Francisco, CA 94102</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}