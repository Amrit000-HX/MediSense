import { request, isBackendConfigured } from "./client";
import { getReports, type ReportItem } from "./reports";

const STORAGE_METRICS = "medisense_health_metrics";
const STORAGE_APPOINTMENTS = "medisense_appointments";
<<<<<<< HEAD
const STORAGE_REMINDERS = "medisense_appointment_reminders";
const STORAGE_USER_LOCATION = "medisense_user_location";
=======
>>>>>>> local-changes

export interface HealthMetric {
  label: string;
  value: string;
  status: string;
  icon?: string;
  color: string;
}

export interface Appointment {
<<<<<<< HEAD
  id?: string;
=======
>>>>>>> local-changes
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
<<<<<<< HEAD
  latitude?: number;
  longitude?: number;
  distance?: number; // in km, calculated when using GPS
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  ageGroup: string[];
  weightRange?: { min: number; max: number };
  notes: string;
}

export interface AppointmentReminder {
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  reminderTime: string; // ISO string
  notified: boolean;
=======
>>>>>>> local-changes
}

export const DEFAULT_METRICS: HealthMetric[] = [
  { label: "Blood Pressure", value: "", status: "Not set", color: "blue" },
  { label: "Heart Rate", value: "", status: "Not set", color: "blue" },
  { label: "Glucose", value: "", status: "Not set", color: "blue" },
<<<<<<< HEAD
  { label: "Weight", value: "", status: "Not set", color: "blue" },
=======
>>>>>>> local-changes
  { label: "BMI", value: "", status: "Not set", color: "blue" },
];

export const DOCTORS: Doctor[] = [
<<<<<<< HEAD
  { id: "d1", name: "Dr. Sarah Johnson", specialty: "General Physician", contactNo: "+1 234-567-8901", venue: "MediCare Clinic, 123 Health Ave", city: "New York", consultationHours: "Mon–Fri 9:00 AM – 5:00 PM", ageGroup: "adult", suggestedSlots: ["9:00 AM", "10:30 AM", "2:00 PM", "4:00 PM"], latitude: 40.7128, longitude: -74.0060 },
  { id: "d2", name: "Dr. Michael Chen", specialty: "Cardiologist", contactNo: "+1 234-567-8902", venue: "Heart Care Center, 456 Cardiac Rd", city: "New York", consultationHours: "Mon, Wed, Fri 8:00 AM – 4:00 PM", ageGroup: "adult", suggestedSlots: ["8:00 AM", "11:00 AM", "3:00 PM"], latitude: 40.7589, longitude: -73.9851 },
  { id: "d3", name: "Dr. Priya Sharma", specialty: "Pediatrician", contactNo: "+1 234-567-8903", venue: "Kids Wellness, 789 Child St", city: "Boston", consultationHours: "Tue–Sat 10:00 AM – 6:00 PM", ageGroup: "pediatric", suggestedSlots: ["10:00 AM", "12:00 PM", "2:30 PM", "5:00 PM"], latitude: 42.3601, longitude: -71.0589 },
  { id: "d4", name: "Dr. James Wilson", specialty: "Senior Care Specialist", contactNo: "+1 234-567-8904", venue: "Elder Care Clinic, 321 Silver Lane", city: "Boston", consultationHours: "Mon–Fri 8:00 AM – 3:00 PM", ageGroup: "senior", suggestedSlots: ["8:30 AM", "11:00 AM", "1:00 PM"], latitude: 42.3496, longitude: -71.0746 },
  { id: "d5", name: "Dr. Emily Davis", specialty: "General Physician", contactNo: "+1 234-567-8905", venue: "City Health Hub, 100 Main St", city: "Chicago", consultationHours: "Mon–Sat 9:00 AM – 7:00 PM", ageGroup: "all", suggestedSlots: ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"], latitude: 41.8781, longitude: -87.6298 },
  { id: "d6", name: "Dr. Rajesh Kumar", specialty: "Endocrinologist", contactNo: "+1 234-567-8906", venue: "Diabetes & Thyroid Center, 555 Metro Ave", city: "Chicago", consultationHours: "Wed–Fri 10:00 AM – 4:00 PM", ageGroup: "adult", suggestedSlots: ["10:00 AM", "1:00 PM"], latitude: 41.8819, longitude: -87.6278 },
=======
  { id: "d1", name: "Dr. Sarah Johnson", specialty: "General Physician", contactNo: "+1 234-567-8901", venue: "MediCare Clinic, 123 Health Ave", city: "New York", consultationHours: "Mon–Fri 9:00 AM – 5:00 PM", ageGroup: "adult", suggestedSlots: ["9:00 AM", "10:30 AM", "2:00 PM", "4:00 PM"] },
  { id: "d2", name: "Dr. Michael Chen", specialty: "Cardiologist", contactNo: "+1 234-567-8902", venue: "Heart Care Center, 456 Cardiac Rd", city: "New York", consultationHours: "Mon, Wed, Fri 8:00 AM – 4:00 PM", ageGroup: "adult", suggestedSlots: ["8:00 AM", "11:00 AM", "3:00 PM"] },
  { id: "d3", name: "Dr. Priya Sharma", specialty: "Pediatrician", contactNo: "+1 234-567-8903", venue: "Kids Wellness, 789 Child St", city: "Boston", consultationHours: "Tue–Sat 10:00 AM – 6:00 PM", ageGroup: "pediatric", suggestedSlots: ["10:00 AM", "12:00 PM", "2:30 PM", "5:00 PM"] },
  { id: "d4", name: "Dr. James Wilson", specialty: "Senior Care Specialist", contactNo: "+1 234-567-8904", venue: "Elder Care Clinic, 321 Silver Lane", city: "Boston", consultationHours: "Mon–Fri 8:00 AM – 3:00 PM", ageGroup: "senior", suggestedSlots: ["8:30 AM", "11:00 AM", "1:00 PM"] },
  { id: "d5", name: "Dr. Emily Davis", specialty: "General Physician", contactNo: "+1 234-567-8905", venue: "City Health Hub, 100 Main St", city: "Chicago", consultationHours: "Mon–Sat 9:00 AM – 7:00 PM", ageGroup: "all", suggestedSlots: ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"] },
  { id: "d6", name: "Dr. Rajesh Kumar", specialty: "Endocrinologist", contactNo: "+1 234-567-8906", venue: "Diabetes & Thyroid Center, 555 Metro Ave", city: "Chicago", consultationHours: "Wed–Fri 10:00 AM – 4:00 PM", ageGroup: "adult", suggestedSlots: ["10:00 AM", "1:00 PM"] },
>>>>>>> local-changes
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

<<<<<<< HEAD
export function saveHealthMetrics(metrics: HealthMetric[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_METRICS, JSON.stringify(metrics));
=======
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
>>>>>>> local-changes
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

<<<<<<< HEAD
export function addSavedAppointment(appointment: Appointment): void {
  const list = getSavedAppointments();
  const appointmentWithId = { ...appointment, id: `apt_${Date.now()}` };
  list.unshift(appointmentWithId);
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_APPOINTMENTS, JSON.stringify(list));
  // Create reminder for the appointment
  createAppointmentReminder(appointmentWithId);
}

export function createAppointmentReminder(appointment: Appointment & { id?: string }): void {
  if (typeof window === "undefined") return;
  try {
    const appointmentDate = new Date(appointment.date + " " + appointment.time);
    if (isNaN(appointmentDate.getTime())) return;

    // Create reminder 1 day before and 2 hours before
    const reminders: AppointmentReminder[] = [];
    const oneDayBefore = new Date(appointmentDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    reminders.push({
      appointmentId: appointment.id || `apt_${Date.now()}`,
      appointmentDate: appointment.date,
      appointmentTime: appointment.time,
      reminderTime: oneDayBefore.toISOString(),
      notified: false,
    });

    const twoHoursBefore = new Date(appointmentDate);
    twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);
    reminders.push({
      appointmentId: appointment.id || `apt_${Date.now()}`,
      appointmentDate: appointment.date,
      appointmentTime: appointment.time,
      reminderTime: twoHoursBefore.toISOString(),
      notified: false,
    });

    const existing = getSavedReminders();
    existing.push(...reminders);
    localStorage.setItem(STORAGE_REMINDERS, JSON.stringify(existing));
  } catch (e) {
    console.error("Failed to create reminder:", e);
  }
}

export function getSavedReminders(): AppointmentReminder[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_REMINDERS) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as AppointmentReminder[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function markReminderNotified(reminder: AppointmentReminder): void {
  if (typeof window === "undefined") return;
  const reminders = getSavedReminders();
  const updated = reminders.map((r) =>
    r.appointmentId === reminder.appointmentId && r.reminderTime === reminder.reminderTime
      ? { ...r, notified: true }
      : r
  );
  localStorage.setItem(STORAGE_REMINDERS, JSON.stringify(updated));
}

export function checkAndNotifyReminders(): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  const reminders = getSavedReminders();
  const now = new Date();

  reminders.forEach((reminder) => {
    if (reminder.notified) return;
    const reminderTime = new Date(reminder.reminderTime);
    if (reminderTime <= now) {
      showNotification(
        `Appointment Reminder`,
        `You have an appointment with ${reminder.appointmentTime} on ${reminder.appointmentDate}`
      );
      markReminderNotified(reminder);
    }
  });
}

export function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return Promise.resolve(false);
  }
  if (Notification.permission === "granted") {
    return Promise.resolve(true);
  }
  if (Notification.permission === "denied") {
    return Promise.resolve(false);
  }
  return Notification.requestPermission().then((permission) => permission === "granted");
}

export function showNotification(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    });
  }
}

export function getAgeGroup(age: number): "pediatric" | "adult" | "senior" {
  if (age > 0 && age < 18) return "pediatric";
  if (age >= 60) return "senior";
  return "adult";
=======
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
>>>>>>> local-changes
}

export function getMatchingDoctors(location: string, age: number): Doctor[] {
  const loc = location.trim().toLowerCase();
<<<<<<< HEAD
  const ageGroup = getAgeGroup(age);
=======
  const isPediatric = age > 0 && age < 18;
  const isSenior = age >= 60;
>>>>>>> local-changes
  return DOCTORS.filter((d) => {
    const matchLocation = !loc || d.city.toLowerCase().includes(loc) || d.venue.toLowerCase().includes(loc);
    const matchAge =
      d.ageGroup === "all" ||
<<<<<<< HEAD
      (d.ageGroup === "pediatric" && ageGroup === "pediatric") ||
      (d.ageGroup === "adult" && ageGroup === "adult") ||
      (d.ageGroup === "senior" && ageGroup === "senior");
=======
      (d.ageGroup === "pediatric" && isPediatric) ||
      (d.ageGroup === "adult" && age >= 18 && age < 60) ||
      (d.ageGroup === "senior" && isSenior);
>>>>>>> local-changes
    return matchLocation && matchAge;
  });
}

<<<<<<< HEAD
// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getNearbyDoctors(
  userLat: number,
  userLon: number,
  age: number,
  maxDistanceKm: number = 50
): Promise<Doctor[]> {
  const ageGroup = getAgeGroup(age);
  const doctors = DOCTORS.filter((d) => {
    if (!d.latitude || !d.longitude) return false;
    const matchAge =
      d.ageGroup === "all" ||
      (d.ageGroup === "pediatric" && ageGroup === "pediatric") ||
      (d.ageGroup === "adult" && ageGroup === "adult") ||
      (d.ageGroup === "senior" && ageGroup === "senior");
    return matchAge;
  });

  return doctors
    .map((d) => ({
      ...d,
      distance: calculateDistance(userLat, userLon, d.latitude!, d.longitude!),
    }))
    .filter((d) => d.distance <= maxDistanceKm)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

export function saveUserLocation(lat: number, lon: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_USER_LOCATION, JSON.stringify({ lat, lon, timestamp: Date.now() }));
}

export function getUserLocation(): { lat: number; lon: number } | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_USER_LOCATION) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.lat && parsed.lon) return { lat: parsed.lat, lon: parsed.lon };
    }
  } catch {}
  return null;
}

// Enhanced medicine recommendations with diverse categories and smart filtering
export const MEDICINE_DATABASE: Medicine[] = [
  // Pain Relief & Fever
  {
    name: "Paracetamol (Acetaminophen)",
    dosage: "500mg",
    frequency: "Every 4-6 hours",
    duration: "3-5 days",
    ageGroup: ["pediatric", "adult", "senior"],
    weightRange: { min: 0, max: Infinity },
    notes: "For fever and pain. Pediatric: 10-15mg/kg per dose. Adult: 500-1000mg per dose.",
  },
  {
    name: "Ibuprofen",
    dosage: "200-400mg",
    frequency: "Every 6-8 hours",
    duration: "3-7 days",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "For inflammation and pain. Not recommended for children under 6 months.",
  },
  {
    name: "Naproxen Sodium",
    dosage: "220-440mg",
    frequency: "Every 8-12 hours",
    duration: "3-5 days",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 50, max: Infinity },
    notes: "Long-acting pain reliever. Take with food to reduce stomach upset.",
  },
  {
    name: "Aspirin",
    dosage: "300-600mg",
    frequency: "Every 4-6 hours",
    duration: "3-5 days",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "For pain, fever, and inflammation. Not for children under 16.",
  },
  
  // Allergy Relief
  {
    name: "Cetirizine",
    dosage: "10mg",
    frequency: "Once daily",
    duration: "As needed",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 30, max: Infinity },
    notes: "Antihistamine for allergies. May cause drowsiness.",
  },
  {
    name: "Loratadine",
    dosage: "10mg",
    frequency: "Once daily",
    duration: "As needed",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 30, max: Infinity },
    notes: "Non-drowsy antihistamine for allergies.",
  },
  {
    name: "Fexofenadine",
    dosage: "180mg",
    frequency: "Once daily",
    duration: "As needed",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Fast-acting non-drowsy allergy relief.",
  },
  {
    name: "Diphenhydramine",
    dosage: "25-50mg",
    frequency: "Every 6 hours",
    duration: "As needed",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 30, max: Infinity },
    notes: "For severe allergies and sleep. Causes drowsiness.",
  },
  
  // Cold & Flu
  {
    name: "Phenylephrine",
    dosage: "10mg",
    frequency: "Every 4 hours",
    duration: "3-5 days",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Decongestant for nasal congestion. Avoid if you have high blood pressure.",
  },
  {
    name: "Dextromethorphan",
    dosage: "10-30mg",
    frequency: "Every 6-8 hours",
    duration: "3-7 days",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Cough suppressant. Do not use with MAO inhibitors.",
  },
  {
    name: "Guaifenesin",
    dosage: "200-400mg",
    frequency: "Every 4 hours",
    duration: "3-7 days",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Expectorant to loosen mucus. Drink plenty of water.",
  },
  
  // Digestive Health
  {
    name: "Omeprazole",
    dosage: "20mg",
    frequency: "Once daily before breakfast",
    duration: "2-4 weeks",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "For acid reflux and stomach ulcers. Take 30 minutes before food.",
  },
  {
    name: "Ranitidine",
    dosage: "150mg",
    frequency: "Twice daily",
    duration: "2-4 weeks",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "H2 blocker for heartburn and acid reflux.",
  },
  {
    name: "Loperamide",
    dosage: "2mg",
    frequency: "After each loose stool",
    duration: "1-2 days",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 30, max: Infinity },
    notes: "For diarrhea. Do not use if you have fever or bloody stools.",
  },
  {
    name: "Simethicone",
    dosage: "40-125mg",
    frequency: "After meals and bedtime",
    duration: "As needed",
    ageGroup: ["pediatric", "adult", "senior"],
    weightRange: { min: 10, max: Infinity },
    notes: "For gas and bloating relief.",
  },
  
  // Antibiotics (Prescription Required)
  {
    name: "Amoxicillin",
    dosage: "250-500mg",
    frequency: "Every 8 hours",
    duration: "7-10 days",
    ageGroup: ["pediatric", "adult"],
    weightRange: { min: 0, max: Infinity },
    notes: "Antibiotic. Pediatric: 20-40mg/kg/day. Adult: 500mg-1g per dose. Take with food.",
  },
  {
    name: "Azithromycin",
    dosage: "250-500mg",
    frequency: "Once daily",
    duration: "3-5 days",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Macrolide antibiotic. Good for respiratory infections.",
  },
  {
    name: "Ciprofloxacin",
    dosage: "250-750mg",
    frequency: "Twice daily",
    duration: "7-14 days",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 50, max: Infinity },
    notes: "Fluoroquinolone antibiotic. For urinary and respiratory infections.",
  },
  {
    name: "Doxycycline",
    dosage: "100mg",
    frequency: "Twice daily",
    duration: "7-14 days",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Tetracycline antibiotic. Take with plenty of water. Avoid sun exposure.",
  },
  
  // Chronic Conditions
  {
    name: "Metformin",
    dosage: "500-1000mg",
    frequency: "Twice daily with meals",
    duration: "Long-term",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 50, max: Infinity },
    notes: "For type 2 diabetes. Start with 500mg twice daily. Monitor blood sugar.",
  },
  {
    name: "Atorvastatin",
    dosage: "10-80mg",
    frequency: "Once daily at bedtime",
    duration: "Long-term",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Statin for high cholesterol. Monitor liver function.",
  },
  {
    name: "Lisinopril",
    dosage: "5-40mg",
    frequency: "Once daily",
    duration: "Long-term",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "ACE inhibitor for high blood pressure. Monitor potassium levels.",
  },
  {
    name: "Amlodipine",
    dosage: "5-10mg",
    frequency: "Once daily",
    duration: "Long-term",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Calcium channel blocker for hypertension and angina.",
  },
  
  // Mental Health
  {
    name: "Sertraline",
    dosage: "25-200mg",
    frequency: "Once daily",
    duration: "Long-term",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "SSRI for depression and anxiety. May take 4-6 weeks for full effect.",
  },
  {
    name: "Escitalopram",
    dosage: "5-20mg",
    frequency: "Once daily",
    duration: "Long-term",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "SSRI for anxiety and depression. Fewer side effects than some alternatives.",
  },
  {
    name: "Alprazolam",
    dosage: "0.25-2mg",
    frequency: "2-3 times daily as needed",
    duration: "Short-term only",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Benzodiazepine for anxiety. Risk of dependence. Use short-term only.",
  },
  
  // Vitamins & Supplements
  {
    name: "Vitamin D3",
    dosage: "1000-4000 IU",
    frequency: "Once daily",
    duration: "Long-term",
    ageGroup: ["pediatric", "adult", "senior"],
    weightRange: { min: 10, max: Infinity },
    notes: "For bone health and immune support. Take with fatty meal.",
  },
  {
    name: "Vitamin B12",
    dosage: "500-1000 mcg",
    frequency: "Once daily",
    duration: "Long-term",
    ageGroup: ["pediatric", "adult", "senior"],
    weightRange: { min: 10, max: Infinity },
    notes: "For energy and nerve function. Important for vegetarians.",
  },
  {
    name: "Omega-3 Fish Oil",
    dosage: "1000-2000mg",
    frequency: "Once or twice daily",
    duration: "Long-term",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 30, max: Infinity },
    notes: "For heart health and inflammation. Take with meals.",
  },
  {
    name: "Probiotics",
    dosage: "1-10 billion CFU",
    frequency: "Once daily",
    duration: "Long-term",
    ageGroup: ["pediatric", "adult", "senior"],
    weightRange: { min: 10, max: Infinity },
    notes: "For digestive health and immunity. Take with or without food.",
  },
  
  // Cardiovascular
  {
    name: "Aspirin (low dose)",
    dosage: "75-100mg",
    frequency: "Once daily",
    duration: "As prescribed",
    ageGroup: ["senior"],
    weightRange: { min: 50, max: Infinity },
    notes: "Cardiovascular protection. Not for children. Consult doctor before use.",
  },
  {
    name: "Clopidogrel",
    dosage: "75mg",
    frequency: "Once daily",
    duration: "Long-term",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Antiplatelet for stroke prevention. Do not stop suddenly.",
  },
  {
    name: "Warfarin",
    dosage: "1-10mg",
    frequency: "Once daily",
    duration: "Long-term",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 40, max: Infinity },
    notes: "Anticoagulant. Requires regular blood monitoring (INR).",
  },
  
  // Respiratory
  {
    name: "Albuterol (Salbutamol)",
    dosage: "90-180 mcg",
    frequency: "As needed for asthma attacks",
    duration: "As needed",
    ageGroup: ["pediatric", "adult", "senior"],
    weightRange: { min: 10, max: Infinity },
    notes: "Inhaler for asthma and COPD. Fast-acting bronchodilator.",
  },
  {
    name: "Fluticasone",
    dosage: "44-220 mcg",
    frequency: "Once or twice daily",
    duration: "Long-term",
    ageGroup: ["pediatric", "adult", "senior"],
    weightRange: { min: 10, max: Infinity },
    notes: "Inhaled corticosteroid for asthma prevention. Rinse mouth after use.",
  },
  {
    name: "Montelukast",
    dosage: "4-10mg",
    frequency: "Once daily at bedtime",
    duration: "Long-term",
    ageGroup: ["pediatric", "adult", "senior"],
    weightRange: { min: 10, max: Infinity },
    notes: "Leukotriene receptor antagonist for asthma and allergies.",
  },
  
  // Women's Health
  {
    name: "Folic Acid",
    dosage: "400-800 mcg",
    frequency: "Once daily",
    duration: "Long-term",
    ageGroup: ["pediatric", "adult", "senior"],
    weightRange: { min: 10, max: Infinity },
    notes: "Essential during pregnancy. Prevents neural tube defects.",
  },
  {
    name: "Iron Supplements",
    dosage: "65 mg elemental iron",
    frequency: "Once daily",
    duration: "3-6 months",
    ageGroup: ["pediatric", "adult", "senior"],
    weightRange: { min: 20, max: Infinity },
    notes: "For anemia. Take with Vitamin C for better absorption.",
  },
  {
    name: "Calcium Carbonate",
    dosage: "500-1000mg",
    frequency: "Once or twice daily",
    duration: "Long-term",
    ageGroup: ["adult", "senior"],
    weightRange: { min: 30, max: Infinity },
    notes: "For bone health. Take with meals for better absorption.",
  },
];

// Enhanced condition-based medicine recommendations with smart filtering
export function getMedicineRecommendations(
  age: number,
  weightKg: number,
  condition?: string
): Medicine[] {
  const ageGroup = getAgeGroup(age);
  let medicines = MEDICINE_DATABASE.filter((m) => {
    const matchesAge = m.ageGroup.includes(ageGroup);
    const matchesWeight =
      !m.weightRange || (weightKg >= m.weightRange.min && weightKg <= m.weightRange.max);
    return matchesAge && matchesWeight;
  });

  // Enhanced condition-based filtering with better matching
  if (condition) {
    const conditionLower = condition.toLowerCase();
    const conditionWords = conditionLower.split(/\s+/);
    
    medicines = medicines.filter((m) => {
      const notesLower = m.notes.toLowerCase();
      const nameLower = m.name.toLowerCase();
      
      // Direct keyword matching
      const hasDirectMatch = conditionWords.some(word => 
        notesLower.includes(word) || nameLower.includes(word)
      );
      
      // Symptom-based matching
      const symptomMatches = {
        // Pain related
        'pain': ['pain', 'ache', 'headache', 'migraine', 'muscle', 'joint'],
        'fever': ['fever', 'temperature', 'hot'],
        'inflammation': ['inflammation', 'swelling', 'redness'],
        
        // Allergy related
        'allergy': ['allergy', 'allergic', 'histamine', 'hay fever', 'pollen'],
        'itch': ['itch', 'itchy', 'rash', 'hives'],
        
        // Cold/Flu related
        'cold': ['cold', 'flu', 'congestion', 'stuffy', 'runny nose'],
        'cough': ['cough', 'chesty', 'dry cough'],
        'mucus': ['mucus', 'phlegm', 'chest congestion'],
        
        // Digestive related
        'heartburn': ['heartburn', 'acid reflux', 'gerd', 'burning'],
        'stomach': ['stomach', 'upset stomach', 'nausea', 'indigestion'],
        'diarrhea': ['diarrhea', 'loose stool', 'watery stool'],
        'gas': ['gas', 'bloating', 'flatulence', 'burping'],
        'constipation': ['constipation', 'bowel movement', 'stool'],
        
        // Mental health
        'anxiety': ['anxiety', 'panic', 'worry', 'stress'],
        'depression': ['depression', 'sad', 'low mood', 'hopeless'],
        'sleep': ['sleep', 'insomnia', 'cant sleep', 'restless'],
        
        // Chronic conditions
        'diabetes': ['diabetes', 'blood sugar', 'glucose'],
        'cholesterol': ['cholesterol', 'lipid', 'fatty'],
        'blood pressure': ['blood pressure', 'hypertension', 'high bp'],
        'asthma': ['asthma', 'wheezing', 'breathing', 'inhaler'],
        
        // Women's health
        'pregnancy': ['pregnancy', 'pregnant', 'expecting'],
        'anemia': ['anemia', 'iron', 'low blood', 'fatigue'],
        'bone': ['bone', 'osteoporosis', 'calcium'],
        
        // General
        'infection': ['infection', 'bacterial', 'antibiotic'],
        'vitamin': ['vitamin', 'supplement', 'deficiency'],
        'energy': ['energy', 'tired', 'fatigue', 'weak']
      };
      
      // Check symptom matches
      for (const [symptom, keywords] of Object.entries(symptomMatches)) {
        if (keywords.some((keyword: string) => conditionWords.includes(keyword))) {
          // Find medicines that treat this symptom
          if (symptomMatches[symptom as keyof typeof symptomMatches].some((k: string) => notesLower.includes(k) || nameLower.includes(k))) {
            return true;
          }
        }
      }
      
      return hasDirectMatch;
    });
    
    // Prioritize results based on relevance
    const medicinesWithScore = medicines.map(medicine => {
      let score = 0;
      const notesLower = medicine.notes.toLowerCase();
      const nameLower = medicine.name.toLowerCase();
      
      // Higher score for exact matches
      conditionWords.forEach((word: string) => {
        if (nameLower.includes(word)) score += 10;
        if (notesLower.includes(word)) score += 5;
      });
      
      // Bonus for common over-the-counter medicines for general conditions
      const otcMedicines = ['paracetamol', 'ibuprofen', 'cetirizine', 'loratadine', 'omeprazole'];
      if (otcMedicines.some((otc: string) => nameLower.includes(otc))) {
        score += 2;
      }
      
      return { ...medicine, _relevanceScore: score };
    });
    
    // Sort by relevance score
    medicinesWithScore.sort((a, b) => b._relevanceScore - a._relevanceScore);
    medicines = medicinesWithScore;
  }

  // Limit results to top 15 for better UX
  return medicines.slice(0, 15);
}

=======
>>>>>>> local-changes
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
