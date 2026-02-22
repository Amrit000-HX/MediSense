import { request, isBackendConfigured } from "./client";
import { getReports, type ReportItem } from "./reports";

const STORAGE_METRICS = "medisense_health_metrics";
const STORAGE_APPOINTMENTS = "medisense_appointments";

export interface HealthMetric {
  label: string;
  value: string;
  status: string;
  icon?: string;
  color: string;
}

export interface Appointment {
  title: string;
  date: string;
  time: string;
  doctor: string;
  contact?: string;
  venue?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  contactNo: string;
  venue: string;
  city: string;
  consultationHours: string;
  ageGroup: "all" | "pediatric" | "adult" | "senior";
  suggestedSlots: string[];
}

export const DEFAULT_METRICS: HealthMetric[] = [
  { label: "Blood Pressure", value: "", status: "Not set", color: "blue" },
  { label: "Heart Rate", value: "", status: "Not set", color: "blue" },
  { label: "Glucose", value: "", status: "Not set", color: "blue" },
  { label: "BMI", value: "", status: "Not set", color: "blue" },
];

export const DOCTORS: Doctor[] = [
  { id: "d1", name: "Dr. Sarah Johnson", specialty: "General Physician", contactNo: "+1 234-567-8901", venue: "MediCare Clinic, 123 Health Ave", city: "New York", consultationHours: "Mon–Fri 9:00 AM – 5:00 PM", ageGroup: "adult", suggestedSlots: ["9:00 AM", "10:30 AM", "2:00 PM", "4:00 PM"] },
  { id: "d2", name: "Dr. Michael Chen", specialty: "Cardiologist", contactNo: "+1 234-567-8902", venue: "Heart Care Center, 456 Cardiac Rd", city: "New York", consultationHours: "Mon, Wed, Fri 8:00 AM – 4:00 PM", ageGroup: "adult", suggestedSlots: ["8:00 AM", "11:00 AM", "3:00 PM"] },
  { id: "d3", name: "Dr. Priya Sharma", specialty: "Pediatrician", contactNo: "+1 234-567-8903", venue: "Kids Wellness, 789 Child St", city: "Boston", consultationHours: "Tue–Sat 10:00 AM – 6:00 PM", ageGroup: "pediatric", suggestedSlots: ["10:00 AM", "12:00 PM", "2:30 PM", "5:00 PM"] },
  { id: "d4", name: "Dr. James Wilson", specialty: "Senior Care Specialist", contactNo: "+1 234-567-8904", venue: "Elder Care Clinic, 321 Silver Lane", city: "Boston", consultationHours: "Mon–Fri 8:00 AM – 3:00 PM", ageGroup: "senior", suggestedSlots: ["8:30 AM", "11:00 AM", "1:00 PM"] },
  { id: "d5", name: "Dr. Emily Davis", specialty: "General Physician", contactNo: "+1 234-567-8905", venue: "City Health Hub, 100 Main St", city: "Chicago", consultationHours: "Mon–Sat 9:00 AM – 7:00 PM", ageGroup: "all", suggestedSlots: ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"] },
  { id: "d6", name: "Dr. Rajesh Kumar", specialty: "Endocrinologist", contactNo: "+1 234-567-8906", venue: "Diabetes & Thyroid Center, 555 Metro Ave", city: "Chicago", consultationHours: "Wed–Fri 10:00 AM – 4:00 PM", ageGroup: "adult", suggestedSlots: ["10:00 AM", "1:00 PM"] },
];

export function getSavedHealthMetrics(): HealthMetric[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_METRICS) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as HealthMetric[];
      if (Array.isArray(parsed) && parsed.length >= 4) return parsed;
    }
  } catch {}
  return DEFAULT_METRICS.map((m) => ({ ...m }));
}

export async function saveHealthMetrics(metrics: HealthMetric[]): Promise<void> {
  if (!isBackendConfigured()) {
    // Fallback to localStorage
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_METRICS, JSON.stringify(metrics));
    return;
  }
  
  try {
    await request<void>("/api/dashboard/metrics", {
      method: "POST",
      body: { metrics },
    });
    // Also save locally as backup
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_METRICS, JSON.stringify(metrics));
    }
  } catch (error) {
    console.error("Failed to save metrics to backend, using local storage:", error);
    // Fallback to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_METRICS, JSON.stringify(metrics));
    }
  }
}

export function getSavedAppointments(): Appointment[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_APPOINTMENTS) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as Appointment[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export async function addSavedAppointment(appointment: Appointment): Promise<void> {
  if (!isBackendConfigured()) {
    // Fallback to localStorage
    const list = getSavedAppointments();
    list.unshift(appointment);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_APPOINTMENTS, JSON.stringify(list));
    return;
  }
  
  try {
    await request<void>("/api/dashboard/appointments", {
      method: "POST",
      body: appointment,
    });
    // Also save locally as backup
    const list = getSavedAppointments();
    list.unshift(appointment);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_APPOINTMENTS, JSON.stringify(list));
    }
  } catch (error) {
    console.error("Failed to save appointment to backend, using local storage:", error);
    // Fallback to localStorage
    const list = getSavedAppointments();
    list.unshift(appointment);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_APPOINTMENTS, JSON.stringify(list));
    }
  }
}

export function getMatchingDoctors(location: string, age: number): Doctor[] {
  const loc = location.trim().toLowerCase();
  const isPediatric = age > 0 && age < 18;
  const isSenior = age >= 60;
  return DOCTORS.filter((d) => {
    const matchLocation = !loc || d.city.toLowerCase().includes(loc) || d.venue.toLowerCase().includes(loc);
    const matchAge =
      d.ageGroup === "all" ||
      (d.ageGroup === "pediatric" && isPediatric) ||
      (d.ageGroup === "adult" && age >= 18 && age < 60) ||
      (d.ageGroup === "senior" && isSenior);
    return matchLocation && matchAge;
  });
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { title: "Annual Checkup", date: "Mar 15, 2026", time: "10:00 AM", doctor: "Dr. Sarah Johnson" },
  { title: "Follow-up Consultation", date: "Mar 22, 2026", time: "2:30 PM", doctor: "Dr. Michael Chen" },
];

export async function getHealthMetrics(): Promise<HealthMetric[]> {
  const saved = getSavedHealthMetrics();
  const allEmpty = saved.every((m) => !m.value || m.value === "0");
  if (!allEmpty) return saved;
  if (!isBackendConfigured()) return saved;
  try {
    const api = await request<HealthMetric[]>("/api/dashboard/metrics");
    return api.length >= 4 ? api : saved;
  } catch {
    return saved;
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  const saved = getSavedAppointments();
  if (!isBackendConfigured()) return [...saved, ...MOCK_APPOINTMENTS];
  try {
    const api = await request<Appointment[]>("/api/dashboard/appointments");
    return [...saved, ...api];
  } catch {
    return [...saved, ...MOCK_APPOINTMENTS];
  }
}

export { getReports };
export type { ReportItem };
