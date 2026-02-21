import { Link } from "react-router";
import {
  Brain,
  FileText,
  MessageSquare,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Users,
  Clock,
  Award,
  Activity,
  Baby,
  User,
  UserCircle2,
  Sparkles,
  Heart,
  TrendingUp,
  BarChart,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { DiseaseModal } from "../components/DiseaseModal";
import aiHumanTech from "@/assets/27795985fee1a3aafe4d5b3a59a107858813c3d2.png";
import aiDoctorTech from "@/assets/3a45a9c10668f994c148773eee030b10555ca43b.png";
import dnaTech from "@/assets/4193469899c0f6ab6b394da7bbea3f4bd9ff4134.png";
import bgPattern from "@/assets/a60f65e947494263765d4160830f0c9ceb22daae.png";
import { useTranslation } from "../context/LanguageContext";

export function HomePage() {
  const { t } = useTranslation();
  const [selectedDisease, setSelectedDisease] = useState<{
    name: string;
    icon: any;
    gradient: string;
  } | null>(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning algorithms analyze your medical reports with unprecedented accuracy.",
      color: "from-blue-500 to-sky-400",
    },
    {
      icon: MessageSquare,
      title: "Personalized Explanations",
      description:
        "Get clear, easy-to-understand explanations tailored to your health literacy level.",
      color: "from-emerald-500 to-teal-400",
    },
    {
      icon: FileText,
      title: "Comprehensive Reports",
      description:
        "Transform complex medical jargon into actionable insights and recommendations.",
      color: "from-sky-400 to-blue-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Bank-level encryption ensures your medical data remains confidential and protected.",
      color: "from-emerald-600 to-green-700",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description:
        "Upload your report and receive detailed analysis in seconds, not days.",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: CheckCircle2,
      title: "Verified Accuracy",
      description:
        "Our AI is trained on millions of medical documents and validated by healthcare professionals.",
      color: "from-teal-500 to-emerald-500",
    },
  ];

  const stats = [
    { icon: Clock, value: "24/7", label: "Availability", color: "text-sky-100" },
    { icon: FileText, value: "5M+", label: "Reports Analyzed", color: "text-blue-100" },
    { icon: Users, value: "850K+", label: "Active Users", color: "text-emerald-100" },
    { icon: Award, value: "99.2%", label: "Accuracy Rate", color: "text-teal-100" },
  ];

  const diseases = [
    { name: "Diabetes", icon: Activity, gradient: "from-blue-400 to-sky-500" },
    { name: "Hypertension", icon: Heart, gradient: "from-emerald-500 to-teal-500" },
    { name: "Cardiovascular Disease", icon: Activity, gradient: "from-sky-400 to-blue-500" },
    { name: "Thyroid Disorders", icon: TrendingUp, gradient: "from-teal-600 to-green-600" },
    { name: "Respiratory Infections", icon: Activity, gradient: "from-blue-500 to-indigo-500" },
    { name: "Anemia", icon: Activity, gradient: "from-emerald-600 to-green-700" },
    { name: "Kidney Disease", icon: Activity, gradient: "from-sky-500 to-blue-600" },
    { name: "Liver Disease", icon: Activity, gradient: "from-teal-500 to-emerald-600" },
    { name: "Cancer Screening", icon: BarChart, gradient: "from-blue-400 to-sky-500" },
    { name: "Cholesterol", icon: TrendingUp, gradient: "from-emerald-500 to-teal-500" },
    { name: "Vitamin Deficiency", icon: Activity, gradient: "from-sky-400 to-blue-500" },
    { name: "Arthritis", icon: Activity, gradient: "from-teal-600 to-green-600" },
    { name: "Osteoporosis", icon: Activity, gradient: "from-blue-500 to-indigo-500" },
    { name: "Mental Health", icon: Brain, gradient: "from-emerald-600 to-green-700" },
    { name: "Allergies", icon: Activity, gradient: "from-sky-500 to-blue-600" },
    { name: "Autoimmune Disorders", icon: Shield, gradient: "from-teal-500 to-emerald-600" },
  ];

  const ageCategories = [
    {
      icon: Baby,
      title: "Children (0-17 years)",
      description:
        "Specialized analysis for pediatric reports including growth charts, developmental assessments, and childhood diseases.",
      features: ["Growth tracking", "Vaccination reports", "Developmental milestones"],
      image: "https://images.unsplash.com/photo-1758691463080-30a990ef61bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMHBlZGlhdHJpYyUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzcxMjI5OTMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      borderColor: "border-emerald-200",
    },
    {
      icon: User,
      title: "Adults (18-59 years)",
      description:
        "Comprehensive analysis for adult health reports including chronic disease management and preventive care.",
      features: ["Lifestyle disease tracking", "Metabolic analysis", "Preventive health"],
      image: "https://images.unsplash.com/photo-1764173040253-09c8c1d2a2fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHVsdCUyMHByb2Zlc3Npb25hbCUyMGhlYWx0aCUyMHdlbGxuZXNzfGVufDF8fHx8MTc3MTIyOTkzMXww&ixlib=rb-4.1.0&q=80&w=1080",
      bgGradient: "from-sky-50 to-blue-50",
      iconBg: "bg-gradient-to-r from-blue-500 to-sky-400",
      borderColor: "border-blue-200",
    },
    {
      icon: UserCircle2,
      title: "Seniors (60+ years)",
      description:
        "Tailored insights for senior health reports focusing on age-related conditions and medication management.",
      features: ["Age-related conditions", "Medication tracking", "Cognitive health"],
      image: "https://images.unsplash.com/photo-1603129473525-4cd6f36fe057?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBlbGRlcmx5JTIwaGVhbHRoY2FyZSUyMGhhcHB5fGVufDF8fHx8MTc3MTIyOTkzMXww&ixlib=rb-4.1.0&q=80&w=1080",
      bgGradient: "from-teal-50 to-emerald-50",
      iconBg: "bg-gradient-to-r from-teal-500 to-emerald-500",
      borderColor: "border-teal-200",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Patient",
      content:
        "MediSense helped me understand my thyroid test results in simple terms. I finally know what my TSH levels mean and what actions to take.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    {
      name: "Dr. Rajesh Kumar",
      role: "Cardiologist",
      content:
        "This platform is a game-changer for patient education. My patients come to appointments better informed and ask more meaningful questions.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    },
    {
      name: "Anjali Patel",
      role: "Healthcare Administrator",
      content:
        "MediSense has reduced patient queries about basic report interpretation by 60%. Our staff can now focus on more complex patient needs.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    },
  ];

  const featureShowcase = [
    {
      title: "AI-Powered Analysis",
      description:
        "Our advanced neural networks process millions of data points to deliver accurate, context-aware medical report analysis using cutting-edge artificial intelligence.",
      image: aiHumanTech,
      quote: "Intelligence is the ability to adapt to change - and our AI adapts to your unique health needs.",
      bgColor: "bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-800",
    },
    {
      title: "Personalized Explanations",
      description:
        "Every individual is unique. Our AI tailors explanations based on your age, health literacy, and medical history for maximum understanding.",
      image: aiDoctorTech,
      quote: "Understanding your health is the first step towards better health outcomes.",
      bgColor: "bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900",
    },
    {
      title: "Comprehensive Reports",
      description:
        "From blood tests to genetic screenings, get complete insights across all types of medical reports with detailed analysis.",
      image: dnaTech,
      quote: "Knowledge about your health empowers you to make informed decisions.",
      bgColor: "bg-white",
    },
  ];

  return (
    <div className="bg-white relative">
      {/* Background Pattern - Fixed */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0">
        <img src={bgPattern} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50 opacity-90"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-emerald-700 px-6 py-3 rounded-full text-sm font-bold shadow-lg border border-emerald-100 animate-float">
                <Sparkles className="size-5 animate-pulse" />
                {t("home.hero.badge")}
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold text-slate-800 leading-tight">
                {t("home.hero.title")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                  {t("home.hero.titleHighlight")}
                </span>
              </h1>
              
              <p className="text-2xl text-slate-600 leading-relaxed">
                {t("home.hero.subtitle")}
              </p>

              {/* Stats Pills */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-3">
                    <Clock className="size-6 text-blue-600" />
                    <div>
                      <div className="font-bold text-slate-800 text-lg">24/7</div>
                      <div className="text-xs text-blue-600 font-medium">{t("home.hero.available")}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border-2 border-emerald-100 hover:border-emerald-300 transition-all">
                  <div className="flex items-center gap-3">
                    <Award className="size-6 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-800 text-lg">99.2%</div>
                      <div className="text-xs text-emerald-600 font-medium">{t("home.hero.accurate")}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border-2 border-sky-100 hover:border-sky-300 transition-all">
                  <div className="flex items-center gap-3">
                    <Users className="size-6 text-sky-600" />
                    <div>
                      <div className="font-bold text-slate-800 text-lg">850K+</div>
                      <div className="text-xs text-sky-600 font-medium">{t("home.hero.users")}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-6">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-10 py-6 text-lg shadow-xl transition-all" asChild>
                  <Link to="/signup">
                    {t("home.hero.uploadReport")}
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-10 py-6 text-lg transition-all"
                  asChild
                >
                  <Link to="/how-it-works">
                    <Heart className="mr-2 size-5" />
                    {t("home.hero.learnMore")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Visual Element - Three Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-emerald-100">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1766325693532-b47cd7d9bd0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBtZWRpY2FsJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzExODY3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Doctor using medical technology"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    AI Powered
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-blue-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758691462126-2ee47c8bf9e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwYXRpZW50JTIwY29uc3VsdGF0aW9uJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NzE2NDM2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Doctor patient consultation"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-teal-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758691463203-cce9d415b2b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVjaG5vbG9neSUyMGhlYWx0aGNhcmUlMjBpbm5vdmF0aW9ufGVufDF8fHx8MTc3MTYwMDA1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Medical technology innovation"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <stat.icon className={`size-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disease Coverage */}
      <section className="relative py-20 bg-gradient-to-b from-sky-50 to-white border-y border-emerald-100">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
              Comprehensive Coverage
            </div>
            <h2 className="text-5xl font-bold text-slate-800 mb-4">
              All Major Health Conditions
            </h2>
            <p className="text-xl text-slate-600">
              Expert AI analysis across 16+ disease categories
            </p>
          </div>
          <div className="relative overflow-hidden py-6">
            <div className="flex gap-4 animate-scroll">
              {diseases.concat(diseases).map((disease, index) => (
                <div
                  key={index}
                  className="group flex-shrink-0 w-64 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-emerald-100 hover:border-emerald-300"
                  onClick={() => setSelectedDisease(disease)}
                >
                  <div className={`bg-gradient-to-r ${disease.gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <disease.icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {disease.name}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Click to learn more
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase - Why Choose MediSense */}
      <section className="relative py-20 bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              Our Advantages
            </div>
            <h2 className="text-5xl font-bold text-slate-800 mb-6">
              Why Choose MediSense
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
              Cutting-edge technology meets compassionate healthcare
            </p>
          </div>

          <div className="space-y-24">
            {featureShowcase.map((feature, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <h3 className="text-4xl font-bold text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-xl text-slate-600 leading-relaxed">{feature.description}</p>
                  <blockquote className="border-l-4 border-emerald-600 pl-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-r-xl">
                    <p className="text-slate-800 italic text-xl font-bold leading-relaxed">
                      "{feature.quote}"
                    </p>
                  </blockquote>
                </div>
                <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                  <div className={`rounded-2xl overflow-hidden shadow-2xl ${feature.bgColor} p-8 border-4 ${index === 2 ? 'border-emerald-200' : 'border-blue-200'}`}>
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Categories */}
      <section className="relative py-20 bg-gradient-to-b from-sky-50 to-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              Age-Specific Care
            </div>
            <h2 className="text-5xl font-bold text-slate-800 mb-6">
              Personalized for Every Age Group
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
              Tailored health insights from childhood to senior years
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {ageCategories.map((category, index) => (
              <Card key={index} className={`border-3 ${category.borderColor} hover:shadow-2xl transition-all overflow-hidden`}>
                <div className={`h-64 overflow-hidden bg-gradient-to-br ${category.bgGradient} relative group`}>
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-5 right-5">
                    <div className={`${category.iconBg} w-14 h-14 rounded-xl flex items-center justify-center shadow-xl`}>
                      <category.icon className="size-7 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className={`p-6 bg-gradient-to-br ${category.bgGradient} space-y-4`}>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {category.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{category.description}</p>
                  <ul className="space-y-2">
                    {category.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                        <CheckCircle2 className="size-5 flex-shrink-0 text-emerald-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              Core Features
            </div>
            <h2 className="text-5xl font-bold text-slate-800 mb-6">
              Powerful Features for Better Health
            </h2>
            <p className="text-2xl text-slate-600">
              Advanced technology with medical expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all bg-white">
                <CardContent className="p-6 space-y-4">
                  <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-800">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <blockquote className="space-y-6">
            <p className="text-5xl md:text-6xl font-black text-white italic leading-tight">
              "The greatest wealth is health"
            </p>
            <footer className="text-blue-100 text-2xl font-bold">— Ancient Wisdom</footer>
          </blockquote>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 bg-gradient-to-b from-white to-sky-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              Testimonials
            </div>
            <h2 className="text-5xl font-bold text-slate-800 mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-2xl text-slate-600">
              See what our users are saying
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all bg-white">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200"
                    />
                    <div>
                      <div className="font-bold text-slate-800 text-lg">{testimonial.name}</div>
                      <div className="text-sm text-emerald-600 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-slate-700 italic leading-relaxed">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-800">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-6xl font-bold text-white mb-8">
            Ready to Understand Your Health Better?
          </h2>
          <p className="text-3xl text-blue-100 mb-12">
            Join thousands taking control of their health
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-white text-emerald-700 hover:bg-gray-50 px-12 py-6 text-xl" asChild>
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-3 size-6" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-12 py-6 text-xl"
              asChild
            >
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Disease Modal */}
      <DiseaseModal
        selectedDisease={selectedDisease}
        onClose={() => setSelectedDisease(null)}
      />
    </div>
  );
}