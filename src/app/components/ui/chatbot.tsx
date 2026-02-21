import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Stethoscope, Pill, FileText, Heart, Activity, Brain, AlertTriangle, Calendar, Clock, MapPin, Phone, Shield, Apple, Coffee, Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Card, CardContent } from "./card";
import { getMedicineRecommendations, type Medicine } from "../../api/dashboard";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "medicine" | "appointment" | "report" | "emergency" | "symptom" | "wellness";
  quickActions?: Array<{ label: string; action: string }>;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Comprehensive disease and condition database
const DISEASE_DATABASE = {
  categories: {
    "Respiratory": {
      icon: "🫁",
      conditions: {
        "Asthma": {
          description: "A chronic condition affecting the airways",
          commonSymptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing"],
          keyQuestions: [
            "Do your symptoms worsen at night or early morning?",
            "Do you have triggers like exercise, allergens, or cold air?",
            "Do you use a rescue inhaler? How often?",
            "Have you been diagnosed with asthma before?"
          ],
          recommendations: [
            "Use prescribed inhalers as directed",
            "Avoid known triggers",
            "Keep rescue inhaler available",
            "Consider peak flow monitoring"
          ],
          medicines: ["Albuterol inhaler", "Fluticasone", "Montelukast", "Prednisone"],
          treatments: ["Bronchodilators", "Inhaled corticosteroids", "Leukotriene modifiers", "Oral steroids"],
          emergencyLevel: "medium"
        },
        "COPD": {
          description: "Progressive lung disease causing breathing difficulties",
          commonSymptoms: ["Chronic cough", "Shortness of breath", "Wheezing", "Chest tightness"],
          keyQuestions: [
            "Are you a current or former smoker?",
            "How long have you had breathing difficulties?",
            "Do you cough up mucus? What color is it?",
            "Do you have swelling in your ankles or legs?"
          ],
          recommendations: [
            "Quit smoking immediately",
            "Use prescribed medications regularly",
            "Pulmonary rehabilitation exercises",
            "Annual flu vaccination"
          ],
          medicines: ["Tiotropium", "Salmeterol", "Roflumilast", "Theophylline"],
          treatments: ["Bronchodilators", "Inhaled steroids", "Oxygen therapy", "Pulmonary rehab"],
          emergencyLevel: "medium"
        },
        "Pneumonia": {
          description: "Infection causing inflammation in air sacs of lungs",
          commonSymptoms: ["High fever", "Cough with phlegm", "Chest pain", "Shortness of breath"],
          keyQuestions: [
            "What is your temperature?",
            "Are you coughing up phlegm? What color?",
            "Do you have chest pain that worsens with breathing?",
            "Have you had recent viral infection?"
          ],
          recommendations: [
            "Seek medical evaluation promptly",
            "Complete full course of antibiotics if prescribed",
            "Rest and stay hydrated",
            "Monitor oxygen levels if possible"
          ],
          medicines: ["Amoxicillin", "Azithromycin", "Levofloxacin", "Ceftriaxone"],
          treatments: ["Antibiotics", "Antivirals", "Oxygen therapy", "Fever reducers"],
          emergencyLevel: "high"
        },
        "Bronchitis": {
          description: "Inflammation of the bronchial tubes",
          commonSymptoms: ["Persistent cough", "Mucus production", "Fatigue", "Mild fever"],
          keyQuestions: [
            "How long have you been coughing?",
            "Are you producing clear, yellow, or green mucus?",
            "Do you have fever or body aches?",
            "Do you smoke or have recent respiratory infection?"
          ],
          recommendations: [
            "Rest and stay hydrated",
            "Use humidifier or steam",
            "Avoid irritants like smoke",
            "Consider over-the-counter cough medicine"
          ],
          medicines: ["Dextromethorphan", "Guaifenesin", "Acetaminophen", "Ibuprofen"],
          treatments: ["Cough suppressants", "Expectorants", "Fever reducers", "Steam inhalation"],
          emergencyLevel: "low"
        },
        "Allergic Rhinitis": {
          description: "Allergic inflammation of nasal passages",
          commonSymptoms: ["Sneezing", "Runny nose", "Nasal congestion", "Itchy eyes"],
          keyQuestions: [
            "Do symptoms occur seasonally or year-round?",
            "What triggers your symptoms (pollen, dust, pets)?",
            "Do you have itchy eyes or throat?",
            "Do you have a family history of allergies?"
          ],
          recommendations: [
            "Avoid known allergens",
            "Use air purifiers and keep windows closed",
            "Try saline nasal rinses",
            "Consider allergy testing"
          ],
          medicines: ["Loratadine", "Cetirizine", "Fluticasone nasal spray", "Montelukast", "Fexofenadine", "Azeltastine"],
          treatments: ["Antihistamines", "Nasal steroids", "Decongestants", "Allergy shots", "Immunotherapy"],
          emergencyLevel: "low"
        },
        "Sinusitis": {
          description: "Inflammation of sinus cavities",
          commonSymptoms: ["Facial pain", "Nasal congestion", "Headache", "Thick nasal discharge"],
          keyQuestions: [
            "Do you have pain around your eyes or cheeks?",
            "Is your nasal discharge thick and colored?",
            "Do you have fever or fatigue?",
            "Have you had recent cold or allergies?"
          ],
          recommendations: [
            "Use saline nasal sprays",
            "Apply warm compresses to face",
            "Stay hydrated and rest",
            "Consider decongestants"
          ],
          medicines: ["Amoxicillin", "Doxycycline", "Fluticasone", "Pseudoephedrine", "Ibuprofen"],
          treatments: ["Antibiotics", "Nasal steroids", "Decongestants", "Saline irrigation", "Pain relievers"],
          emergencyLevel: "low"
        },
        "Sleep Apnea": {
          description: "Breathing repeatedly stops and starts during sleep",
          commonSymptoms: ["Loud snoring", "Gasping for air", "Morning headache", "Daytime sleepiness"],
          keyQuestions: [
            "Do you snore loudly and frequently?",
            "Has anyone noticed you stop breathing during sleep?",
            "Do you wake up gasping or choking?",
            "Are you tired during the day despite adequate sleep?"
          ],
          recommendations: [
            "Maintain healthy weight",
            "Avoid alcohol and sedatives",
            "Sleep on your side",
            "Consider CPAP therapy"
          ],
          medicines: ["CPAP machine", "Modafinil", "Armodafinil", "Oxygen therapy"],
          treatments: ["CPAP therapy", "Weight loss", "Oral appliances", "Surgery", "Oxygen therapy"],
          emergencyLevel: "medium"
        }
      }
    },
    "Cardiovascular": {
      icon: "❤️",
      conditions: {
        "Hypertension": {
          description: "High blood pressure affecting heart and blood vessels",
          commonSymptoms: ["Headaches", "Dizziness", "Blurred vision", "Chest pain"],
          keyQuestions: [
            "What was your last blood pressure reading?",
            "Do you monitor your blood pressure at home?",
            "Are you on blood pressure medications?",
            "Do you have risk factors like obesity or smoking?"
          ],
          recommendations: [
            "Monitor blood pressure regularly",
            "Reduce sodium intake",
            "Take medications as prescribed",
            "Exercise regularly (with doctor approval)"
          ],
          medicines: ["Lisinopril", "Amlodipine", "Hydrochlorothiazide", "Metoprolol"],
          treatments: ["ACE inhibitors", "Calcium channel blockers", "Diuretics", "Beta blockers"],
          emergencyLevel: "medium"
        },
        "Heart Failure": {
          description: "Heart cannot pump blood effectively",
          commonSymptoms: ["Shortness of breath", "Swelling in legs", "Fatigue", "Rapid heartbeat"],
          keyQuestions: [
            "Do you have swelling in ankles, feet, or abdomen?",
            "Do you need extra pillows to breathe at night?",
            "How far can you walk before getting short of breath?",
            "Are you on diuretics (water pills)?"
          ],
          recommendations: [
            "Limit salt and fluid intake",
            "Weigh daily to monitor fluid retention",
            "Take medications exactly as prescribed",
            "Report sudden weight gain to doctor"
          ],
          medicines: ["Furosemide", "Spironolactone", "Carvedilol", "Sacubitril/valsartan"],
          treatments: ["Diuretics", "Beta blockers", "ACE inhibitors", "ARNI therapy"],
          emergencyLevel: "high"
        },
        "Coronary Artery Disease": {
          description: "Narrowing or blockage of coronary arteries",
          commonSymptoms: ["Chest pain", "Shortness of breath", "Fatigue", "Heart palpitations"],
          keyQuestions: [
            "Do you have chest pain with exertion?",
            "Does rest relieve your symptoms?",
            "Do you have risk factors (diabetes, smoking, high cholesterol)?",
            "Have you had cardiac tests before?"
          ],
          recommendations: [
            "Seek immediate care for chest pain",
            "Take nitroglycerin if prescribed",
            "Control cholesterol and blood pressure",
            "Consider cardiac rehabilitation"
          ],
          medicines: ["Nitroglycerin", "Aspirin", "Atorvastatin", "Metoprolol"],
          treatments: ["Nitrates", "Antiplatelets", "Statins", "Beta blockers"],
          emergencyLevel: "critical"
        },
        "Arrhythmia": {
          description: "Irregular heartbeat rhythm",
          commonSymptoms: ["Heart palpitations", "Rapid heartbeat", "Dizziness", "Fainting"],
          keyQuestions: [
            "Do you feel skipped or extra beats?",
            "Do you have dizziness or fainting?",
            "Do symptoms occur with exercise?",
            "Do you consume caffeine or alcohol?"
          ],
          recommendations: [
            "Avoid caffeine and stimulants",
            "Manage stress and anxiety",
            "Monitor heart rate if advised",
            "Seek care for persistent symptoms"
          ],
          medicines: ["Amiodarone", "Flecainide", "Metoprolol", "Diltiazem", "Sotalol", "Propafenone"],
          treatments: ["Antiarrhythmics", "Beta blockers", "Calcium channel blockers", "Ablation therapy", "Pacemaker"],
          emergencyLevel: "medium"
        },
        "Atrial Fibrillation": {
          description: "Irregular and often rapid heart rate",
          commonSymptoms: ["Irregular heartbeat", "Heart palpitations", "Fatigue", "Shortness of breath"],
          keyQuestions: [
            "Is your heartbeat irregular or very fast?",
            "Do you feel palpitations or fluttering?",
            "Do you have fatigue or shortness of breath?",
            "Do you have risk factors like high blood pressure?"
          ],
          recommendations: [
            "Take blood thinners as prescribed",
            "Control heart rate and rhythm",
            "Manage underlying conditions",
            "Avoid excessive alcohol"
          ],
          medicines: ["Warfarin", "Dabigatran", "Rivaroxaban", "Apixaban", "Metoprolol", "Diltiazem"],
          treatments: ["Anticoagulants", "Rate control medications", "Rhythm control", "Cardioversion", "Ablation"],
          emergencyLevel: "high"
        },
        "Angina": {
          description: "Chest pain caused by reduced blood flow to heart",
          commonSymptoms: ["Chest pain", "Pressure", "Pain in arms/neck/jaw", "Shortness of breath"],
          keyQuestions: [
            "Does pain occur with exertion and improve with rest?",
            "Do you have pain in your arms, neck, or jaw?",
            "How long do episodes typically last?",
            "Do you have risk factors for heart disease?"
          ],
          recommendations: [
            "Rest during angina episodes",
            "Take nitroglycerin as prescribed",
            "Avoid triggers like heavy meals",
            "Seek regular cardiac care"
          ],
          medicines: ["Nitroglycerin", "Beta blockers", "Calcium channel blockers", "Aspirin", "Ranolazine"],
          treatments: ["Nitrates", "Beta blockers", "Calcium channel blockers", "Lifestyle changes", "Cardiac rehab"],
          emergencyLevel: "high"
        },
        "Stroke": {
          description: "Medical emergency affecting brain blood flow",
          commonSymptoms: ["Facial drooping", "Arm weakness", "Speech difficulty", "Vision problems"],
          keyQuestions: [
            "When did symptoms start? (Time is critical)",
            "Do you have facial asymmetry?",
            "Can you raise both arms equally?",
            "Is speech slurred or confused?"
          ],
          recommendations: [
            "CALL EMERGENCY IMMEDIATELY - Time is brain",
            "Note exact time symptoms started",
            "Do not give food or drink",
            "Keep person comfortable and upright"
          ],
          medicines: ["Alteplase", "Aspirin", "Clopidogrel", "Warfarin"],
          treatments: ["Clot-busting drugs", "Blood thinners", "Thrombectomy", "Rehabilitation"],
          emergencyLevel: "critical"
        }
      }
    },
    "Diabetes & Endocrine": {
      icon: "🩸",
      conditions: {
        "Type 2 Diabetes": {
          description: "Chronic condition affecting blood sugar regulation",
          commonSymptoms: ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision"],
          keyQuestions: [
            "What are your recent blood sugar readings?",
            "Are you on diabetes medications?",
            "Do you check your blood sugar at home?",
            "Have you experienced unexplained weight changes?"
          ],
          recommendations: [
            "Monitor blood sugar regularly",
            "Follow prescribed diet and medication plan",
            "Exercise regularly",
            "Attend regular diabetes check-ups"
          ],
          medicines: ["Metformin", "Glipizide", "Empagliflozin", "Insulin"],
          treatments: ["Metformin", "Sulfonylureas", "SGLT2 inhibitors", "Insulin therapy"],
          emergencyLevel: "medium"
        },
        "Type 1 Diabetes": {
          description: "Autoimmune condition destroying insulin-producing cells",
          commonSymptoms: ["Extreme thirst", "Rapid weight loss", "Frequent urination", "Fatigue"],
          keyQuestions: [
            "How old were you when diagnosed?",
            "Do you use insulin pump or injections?",
            "Have you had DKA (diabetic ketoacidosis)?",
            "Do you count carbohydrates?"
          ],
          recommendations: [
            "Monitor blood sugar 4+ times daily",
            "Take insulin as prescribed",
            "Always carry glucose tablets",
            "Wear medical alert ID"
          ],
          medicines: ["Insulin glargine", "Insulin lispro", "Insulin pump", "Glucagon"],
          treatments: ["Basal-bolus insulin", "Insulin pump therapy", "CGM monitoring", "Emergency glucagon"],
          emergencyLevel: "high"
        },
        "Thyroid Disorders": {
          description: "Imbalance in thyroid hormone production",
          commonSymptoms: ["Fatigue", "Weight changes", "Mood changes", "Temperature sensitivity"],
          keyQuestions: [
            "Have you had unexplained weight gain or loss?",
            "Do you feel hot or cold when others don't?",
            "Are you experiencing hair loss or skin changes?",
            "Have you had thyroid function tests?"
          ],
          recommendations: [
            "Take thyroid medications as prescribed",
            "Regular thyroid function monitoring",
            "Report symptoms to endocrinologist",
            "Maintain consistent medication timing"
          ],
          medicines: ["Levothyroxine", "Methimazole", "Propylthiouracil", "Beta blockers"],
          treatments: ["Thyroid hormone replacement", "Anti-thyroid drugs", "Beta blockers", "Radioactive iodine"],
          emergencyLevel: "low"
        },
        "Obesity": {
          description: "Excessive body fat affecting health",
          commonSymptoms: ["Excess weight", "Fatigue", "Joint pain", "Breathlessness"],
          keyQuestions: [
            "What is your current BMI?",
            "Do you have weight-related health problems?",
            "Have you tried weight loss programs before?",
            "What are your eating and exercise habits?"
          ],
          recommendations: [
            "Create calorie deficit through diet",
            "Exercise 150 minutes weekly",
            "Consider weight loss program",
            "Consult bariatric specialist if needed"
          ],
          medicines: ["Orlistat", "Phentermine", "Liraglutide", "Semaglutide", "Naltrexone", "Bupropion"],
          treatments: ["Diet modification", "Exercise program", "Weight loss medications", "Bariatric surgery", "Behavioral therapy"],
          emergencyLevel: "low"
        },
        "PCOS": {
          description: "Polycystic ovary syndrome - hormonal disorder in women",
          commonSymptoms: ["Irregular periods", "Excess hair growth", "Acne", "Weight gain"],
          keyQuestions: [
            "Are your menstrual periods irregular or absent?",
            "Do you have excess facial or body hair?",
            "Are you struggling with acne or weight gain?",
            "Do you have difficulty getting pregnant?"
          ],
          recommendations: [
            "Maintain healthy weight",
            "Use birth control to regulate periods",
            "Consider anti-androgen medications",
            "Manage insulin resistance"
          ],
          medicines: ["Metformin", "Birth control pills", "Spironolactone", "Clomiphene", "Letrozole"],
          treatments: ["Hormonal contraception", "Anti-androgens", "Insulin sensitizers", "Fertility treatments", "Lifestyle changes"],
          emergencyLevel: "low"
        },
        "Hyperthyroidism": {
          description: "Overactive thyroid producing too much thyroid hormone",
          commonSymptoms: ["Weight loss", "Rapid heartbeat", "Anxiety", "Heat intolerance"],
          keyQuestions: [
            "Have you had unexplained weight loss?",
            "Do you feel anxious or irritable?",
            "Are you sensitive to heat?",
            "Do you have a rapid or irregular heartbeat?"
          ],
          recommendations: [
            "Take anti-thyroid medications as prescribed",
            "Avoid excessive iodine",
            "Monitor heart rate and blood pressure",
            "Consider radioactive iodine treatment"
          ],
          medicines: ["Methimazole", "Propylthiouracil", "Beta blockers", "Radioactive iodine", "Surgery"],
          treatments: ["Anti-thyroid drugs", "Beta blockers", "Radioactive iodine", "Thyroid surgery", "Symptom management"],
          emergencyLevel: "medium"
        },
        "Hypothyroidism": {
          description: "Underactive thyroid not producing enough thyroid hormone",
          commonSymptoms: ["Fatigue", "Weight gain", "Cold intolerance", "Dry skin"],
          keyQuestions: [
            "Do you feel unusually tired or sluggish?",
            "Have you gained weight without trying?",
            "Are you sensitive to cold?",
            "Do you have dry skin or hair loss?"
          ],
          recommendations: [
            "Take thyroid hormone replacement daily",
            "Take medication on empty stomach",
            "Monitor TSH levels regularly",
            "Avoid certain supplements with medication"
          ],
          medicines: ["Levothyroxine", "Liothyronine", "Desiccated thyroid", "Thyroid extract"],
          treatments: ["Thyroid hormone replacement", "Regular monitoring", "Dietary considerations", "Symptom management"],
          emergencyLevel: "low"
        }
      }
    },
    "Gastrointestinal": {
      icon: "🫃",
      conditions: {
        "GERD": {
          description: "Acid reflux causing heartburn and regurgitation",
          commonSymptoms: ["Heartburn", "Regurgitation", "Chest pain", "Difficulty swallowing"],
          keyQuestions: [
            "Do symptoms worsen after meals or when lying down?",
            "Do you have sour taste in mouth?",
            "Are you taking antacids? How often?",
            "Do you have nighttime symptoms?"
          ],
          recommendations: [
            "Avoid trigger foods (spicy, fatty, acidic)",
            "Elevate head of bed",
            "Eat smaller, more frequent meals",
            "Consider prescription medications"
          ],
          medicines: ["Omeprazole", "Pantoprazole", "Ranitidine", "Antacids"],
          treatments: ["PPIs", "H2 blockers", "Antacids", "Lifestyle modifications"],
          emergencyLevel: "low"
        },
        "IBS": {
          description: "Functional disorder affecting large intestine",
          commonSymptoms: ["Abdominal pain", "Bloating", "Diarrhea", "Constipation"],
          keyQuestions: [
            "Do you have alternating diarrhea and constipation?",
            "Are symptoms related to stress or meals?",
            "Do you have mucus in stool?",
            "How long have you had these symptoms?"
          ],
          recommendations: [
            "Identify and avoid trigger foods",
            "Manage stress through relaxation techniques",
            "Consider fiber supplements",
            "Regular exercise routine"
          ],
          medicines: ["Dicyclomine", "Hyoscyamine", "Loperamide", "Psyllium"],
          treatments: ["Antispasmodics", "Fiber supplements", "Antidiarrheals", "Stress management"],
          emergencyLevel: "low"
        },
        "Ulcerative Colitis": {
          description: "Inflammatory bowel disease affecting colon",
          commonSymptoms: ["Bloody diarrhea", "Abdominal pain", "Urgent bowel movements", "Weight loss"],
          keyQuestions: [
            "Do you have blood in stool?",
            "How many bowel movements daily?",
            "Do you have fever or joint pain?",
            "Have you had colonoscopy?"
          ],
          recommendations: [
            "Follow prescribed treatment plan",
            "Avoid trigger foods",
            "Stay hydrated",
            "Monitor for complications"
          ],
          medicines: ["Mesalamine", "Prednisone", "Azathioprine", "Infliximab"],
          treatments: ["5-ASA drugs", "Corticosteroids", "Immunomodulators", "Biologics"],
          emergencyLevel: "medium"
        },
        "Gastritis": {
          description: "Inflammation of stomach lining",
          commonSymptoms: ["Stomach pain", "Nausea", "Vomiting", "Bloating"],
          keyQuestions: [
            "Do you take NSAIDs or aspirin?",
            "Do you drink alcohol regularly?",
            "Do you have H. pylori infection?",
            "Do symptoms worsen after eating?"
          ],
          recommendations: [
            "Avoid irritants (alcohol, spicy foods)",
            "Take medications with food",
            "Consider H. pylori testing",
            "Eat smaller, frequent meals"
          ],
          medicines: ["Omeprazole", "Ranitidine", "Sucralfate", "Antibiotics", "Misoprostol"],
          treatments: ["PPIs", "H2 blockers", "Cytoprotective agents", "H. pylori eradication", "Diet modification"],
          emergencyLevel: "low"
        },
        "Pancreatitis": {
          description: "Inflammation of the pancreas",
          commonSymptoms: ["Severe abdominal pain", "Nausea", "Vomiting", "Fever"],
          keyQuestions: [
            "Do you have severe upper abdominal pain?",
            "Does pain radiate to your back?",
            "Do you have a history of gallstones or alcohol use?",
            "Are your stools pale or oily?"
          ],
          recommendations: [
            "Seek immediate medical care for acute pancreatitis",
            "Fast initially to rest pancreas",
            "Avoid alcohol completely",
            "Manage underlying causes"
          ],
          medicines: ["Pain relievers", "Pancreatic enzymes", "Insulin", "Antibiotics", "IV fluids"],
          treatments: ["Pain management", "Enzyme replacement", "Insulin therapy", "Nutritional support", "Surgery"],
          emergencyLevel: "high"
        },
        "Celiac Disease": {
          description: "Autoimmune disorder causing damage to small intestine",
          commonSymptoms: ["Diarrhea", "Weight loss", "Bloating", "Anemia"],
          keyQuestions: [
            "Do you have symptoms after eating gluten?",
            "Do you have unexplained weight loss?",
            "Are you anemic or have vitamin deficiencies?",
            "Do you have family history of celiac disease?"
          ],
          recommendations: [
            "Follow strict gluten-free diet",
            "Read food labels carefully",
            "Take vitamin and mineral supplements",
            "Consult dietitian for meal planning"
          ],
          medicines: ["Gluten-free diet", "Vitamin supplements", "Iron supplements", "Calcium", "Vitamin D"],
          treatments: ["Gluten-free diet", "Nutritional supplements", "Dietary counseling", "Regular monitoring"],
          emergencyLevel: "low"
        },
        "Diverticulitis": {
          description: "Inflammation or infection of small pouches in colon",
          commonSymptoms: ["Abdominal pain", "Fever", "Nausea", "Change in bowel habits"],
          keyQuestions: [
            "Do you have left lower abdominal pain?",
            "Do you have fever or chills?",
            "Have you had changes in bowel movements?",
            "Do you have a history of diverticulosis?"
          ],
          recommendations: [
            "Rest and clear liquids during acute attacks",
            "Gradually reintroduce solid foods",
            "Consider high-fiber diet after recovery",
            "Avoid nuts and seeds during acute phase"
          ],
          medicines: ["Antibiotics", "Pain relievers", "Fiber supplements", "Probiotics", "Anti-inflammatories"],
          treatments: ["Antibiotics", "Pain management", "Dietary modification", "Surgery", "Fiber supplements"],
          emergencyLevel: "medium"
        }
      }
    },
    "Neurological": {
      icon: "🧠",
      conditions: {
        "Migraine": {
          description: "Severe headaches often with sensory disturbances",
          commonSymptoms: ["Severe headache", "Nausea", "Light sensitivity", "Visual disturbances"],
          keyQuestions: [
            "Is your headache one-sided or pulsating?",
            "Do you have aura before headache starts?",
            "How long do your headaches typically last?",
            "What triggers your migraines?"
          ],
          recommendations: [
            "Keep headache diary to identify triggers",
            "Take migraine medication at onset",
            "Rest in dark, quiet room during attacks",
            "Consider preventive medications if frequent"
          ],
          medicines: ["Sumatriptan", "Rizatriptan", "Propranolol", "Topiramate"],
          treatments: ["Triptans", "Beta blockers", "Anti-seizure meds", "Preventive therapies"],
          emergencyLevel: "medium"
        },
        "Epilepsy": {
          description: "Neurological disorder causing recurrent seizures",
          commonSymptoms: ["Seizures", "Loss of consciousness", "Confusion", "Memory lapses"],
          keyQuestions: [
            "What type of seizures do you have?",
            "How often do seizures occur?",
            "Do you have seizure triggers?",
            "Are you on anti-seizure medications?"
          ],
          recommendations: [
            "Take medications consistently",
            "Get adequate sleep",
            "Avoid known triggers",
            "Wear medical alert ID"
          ],
          medicines: ["Levetiracetam", "Valproic acid", "Lamotrigine", "Carbamazepine"],
          treatments: ["Anti-seizure medications", "Vagus nerve stimulation", "Ketogenic diet", "Surgery"],
          emergencyLevel: "high"
        },
        "Parkinson's Disease": {
          description: "Progressive disorder affecting movement",
          commonSymptoms: ["Tremor", "Stiffness", "Slow movement", "Balance problems"],
          keyQuestions: [
            "Do you have resting tremor?",
            "Is movement slower than usual?",
            "Do you have balance difficulties?",
            "Do you have handwriting changes?"
          ],
          recommendations: [
            "Take medications on schedule",
            "Exercise regularly",
            "Physical therapy for balance",
            "Join support groups"
          ],
          medicines: ["Levodopa", "Carbidopa", "Pramipexole", "Selegiline"],
          treatments: ["Levodopa therapy", "Dopamine agonists", "MAO-B inhibitors", "Deep brain stimulation"],
          emergencyLevel: "medium"
        },
        "Multiple Sclerosis": {
          description: "Autoimmune disease affecting central nervous system",
          commonSymptoms: ["Vision problems", "Numbness", "Weakness", "Balance issues"],
          keyQuestions: [
            "Do you have vision loss or double vision?",
            "Do you have numbness or tingling?",
            "Do you have balance or coordination problems?",
            "Have you had MRI of brain?"
          ],
          recommendations: [
            "Take disease-modifying medications",
            "Physical therapy for mobility",
            "Manage fatigue with rest",
            "Avoid overheating"
          ],
          medicines: ["Interferon beta", "Glatiramer", "Fingolimod", "Ocrelizumab", "Dimethyl fumarate"],
          treatments: ["Disease-modifying therapies", "Steroids for relapses", "Physical therapy", "Symptom management"],
          emergencyLevel: "medium"
        },
        "Alzheimer's Disease": {
          description: "Progressive brain disorder affecting memory and thinking",
          commonSymptoms: ["Memory loss", "Confusion", "Difficulty speaking", "Personality changes"],
          keyQuestions: [
            "Are you having memory problems affecting daily life?",
            "Do you have difficulty completing familiar tasks?",
            "Are you having trouble with language or communication?",
            "Have you noticed changes in mood or behavior?"
          ],
          recommendations: [
            "Create structured daily routine",
            "Use memory aids and reminders",
            "Maintain physical and mental activity",
            "Ensure safe living environment"
          ],
          medicines: ["Donepezil", "Rivastigmine", "Galantamine", "Memantine", "Cholinesterase inhibitors"],
          treatments: ["Cholinesterase inhibitors", "NMDA receptor antagonists", "Cognitive therapy", "Behavioral interventions"],
          emergencyLevel: "medium"
        },
        "Dementia": {
          description: "General term for decline in mental ability affecting daily life",
          commonSymptoms: ["Memory loss", "Communication problems", "Confusion", "Personality changes"],
          keyQuestions: [
            "Are you having trouble remembering recent events?",
            "Do you have difficulty with problem-solving?",
            "Are you having trouble with familiar tasks?",
            "Have you noticed changes in mood or behavior?"
          ],
          recommendations: [
            "Establish consistent daily routine",
            "Use memory aids and calendars",
            "Maintain social connections",
            "Ensure safety at home"
          ],
          medicines: ["Donepezil", "Memantine", "Rivastigmine", "Galantamine", "Antidepressants"],
          treatments: ["Cognitive enhancers", "Behavioral therapy", "Environmental modifications", "Support services"],
          emergencyLevel: "medium"
        },
        "Bell's Palsy": {
          description: "Sudden weakness in facial muscles",
          commonSymptoms: ["Facial drooping", "Difficulty closing eye", "Drooling", "Loss of taste"],
          keyQuestions: [
            "Did facial weakness develop suddenly?",
            "Can you close your eye on affected side?",
            "Do you have difficulty eating or drinking?",
            "Do you have ear pain or headache?"
          ],
          recommendations: [
            "Protect eye from drying out",
            "Use eye drops and tape at night",
            "Practice facial exercises",
            "Massage facial muscles gently"
          ],
          medicines: ["Corticosteroids", "Antiviral medications", "Eye drops", "Pain relievers", "Physical therapy"],
          treatments: ["Steroids", "Antivirals", "Eye care", "Physical therapy", "Facial exercises"],
          emergencyLevel: "low"
        }
      }
    },
    "Mental Health": {
      icon: "🧘",
      conditions: {
        "Depression": {
          description: "Mood disorder affecting thoughts, feelings, and behavior",
          commonSymptoms: ["Persistent sadness", "Loss of interest", "Sleep changes", "Appetite changes"],
          keyQuestions: [
            "How long have you felt this way?",
            "Have you lost interest in activities you enjoyed?",
            "Are you having thoughts of self-harm?",
            "How are your sleep and appetite?"
          ],
          recommendations: [
            "Seek professional help from therapist/psychiatrist",
            "Consider antidepressant medication",
            "Regular exercise and routine",
            "Build support system"
          ],
          medicines: ["Sertraline", "Fluoxetine", "Escitalopram", "Bupropion"],
          treatments: ["SSRIs", "SNRIs", "CBT therapy", "Lifestyle interventions"],
          emergencyLevel: "high"
        },
        "Anxiety Disorders": {
          description: "Excessive worry and fear affecting daily life",
          commonSymptoms: ["Excessive worry", "Panic attacks", "Physical tension", "Avoidance behaviors"],
          keyQuestions: [
            "Do you have panic attacks?",
            "Are you avoiding situations due to fear?",
            "How does anxiety affect your daily life?",
            "Do you have physical symptoms like racing heart?"
          ],
          recommendations: [
            "Practice deep breathing and relaxation",
            "Consider cognitive-behavioral therapy",
            "Regular exercise routine",
            "Limit caffeine and alcohol"
          ],
          medicines: ["Alprazolam", "Sertraline", "Buspirone", "Propranolol"],
          treatments: ["SSRIs", "Benzodiazepines", "CBT", "Exposure therapy"],
          emergencyLevel: "medium"
        },
        "Bipolar Disorder": {
          description: "Mood disorder with extreme mood swings",
          commonSymptoms: ["Mood swings", "Manic episodes", "Depressive episodes", "Risky behavior"],
          keyQuestions: [
            "Do you have periods of extreme energy?",
            "Do you have depressive episodes?",
            "Have you had manic episodes?",
            "Do you have family history of bipolar?"
          ],
          recommendations: [
            "Take mood stabilizers consistently",
            "Maintain regular sleep schedule",
            "Avoid alcohol and drugs",
            "Therapy for coping skills"
          ],
          medicines: ["Lithium", "Valproic acid", "Lamotrigine", "Quetiapine"],
          treatments: ["Mood stabilizers", "Antipsychotics", "Psychotherapy", "Lifestyle management"],
          emergencyLevel: "high"
        },
        "Schizophrenia": {
          description: "Severe mental disorder affecting thoughts and perceptions",
          commonSymptoms: ["Hallucinations", "Delusions", "Disorganized thinking", "Social withdrawal"],
          keyQuestions: [
            "Do you hear voices others don't hear?",
            "Do you have false beliefs?",
            "Do you have difficulty organizing thoughts?",
            "Have you had psychiatric evaluation?"
          ],
          recommendations: [
            "Take antipsychotic medications consistently",
            "Regular psychiatric follow-up",
            "Family support and education",
            "Avoid substance use"
          ],
          medicines: ["Risperidone", "Olanzapine", "Aripiprazole", "Clozapine", "Quetiapine"],
          treatments: ["Antipsychotics", "Psychosocial therapy", "Family therapy", "Rehabilitation", "Case management"],
          emergencyLevel: "critical"
        },
        "OCD": {
          description: "Obsessive-compulsive disorder - unwanted thoughts and repetitive behaviors",
          commonSymptoms: ["Obsessive thoughts", "Compulsive behaviors", "Anxiety", "Distress"],
          keyQuestions: [
            "Do you have unwanted intrusive thoughts?",
            "Do you feel compelled to repeat certain behaviors?",
            "Do these thoughts and behaviors cause distress?",
            "Do they interfere with daily life?"
          ],
          recommendations: [
            "Practice exposure and response prevention",
            "Take medications as prescribed",
            "Learn stress management techniques",
            "Join support groups"
          ],
          medicines: ["Fluoxetine", "Sertraline", "Clomipramine", "Paroxetine", "Fluvoxamine"],
          treatments: ["SSRIs", "Cognitive-behavioral therapy", "Exposure therapy", "Stress management", "Support groups"],
          emergencyLevel: "medium"
        },
        "PTSD": {
          description: "Post-traumatic stress disorder following traumatic events",
          commonSymptoms: ["Flashbacks", "Nightmares", "Anxiety", "Avoidance behaviors"],
          keyQuestions: [
            "Have you experienced a traumatic event?",
            "Do you have flashbacks or nightmares?",
            "Do you avoid things that remind you of trauma?",
            "Are you constantly on guard or easily startled?"
          ],
          recommendations: [
            "Seek trauma-focused therapy",
            "Practice grounding techniques",
            "Build support network",
            "Consider medications for symptoms"
          ],
          medicines: ["Sertraline", "Paroxetine", "Prazosin", "Fluoxetine", "Venlafaxine"],
          treatments: ["Trauma-focused therapy", "SSRIs", "EMDR therapy", "Group therapy", "Stress management"],
          emergencyLevel: "high"
        },
        "ADHD": {
          description: "Attention-deficit/hyperactivity disorder",
          commonSymptoms: ["Inattention", "Hyperactivity", "Impulsivity", "Difficulty focusing"],
          keyQuestions: [
            "Do you have trouble paying attention to details?",
            "Do you feel restless or fidgety?",
            "Do you act impulsively without thinking?",
            "Have you had these symptoms since childhood?"
          ],
          recommendations: [
            "Create structured daily routines",
            "Use organizational tools and reminders",
            "Break tasks into smaller steps",
            "Consider behavioral therapy"
          ],
          medicines: ["Methylphenidate", "Amphetamine salts", "Atomoxetine", "Guanfacine", "Lisdexamfetamine"],
          treatments: ["Stimulants", "Non-stimulants", "Behavioral therapy", "Cognitive therapy", "Coaching"],
          emergencyLevel: "low"
        }
      }
    },
    "Infectious Diseases": {
      icon: "🦠",
      conditions: {
        "COVID-19": {
          description: "Viral infection affecting respiratory system",
          commonSymptoms: ["Fever", "Cough", "Fatigue", "Loss of taste/smell"],
          keyQuestions: [
            "Have you been exposed to COVID-19?",
            "Do you have loss of taste or smell?",
            "Do you have breathing difficulties?",
            "Have you been tested?"
          ],
          recommendations: [
            "Isolate immediately if positive",
            "Monitor oxygen levels",
            "Stay hydrated and rest",
            "Seek care for breathing difficulties"
          ],
          medicines: ["Paxlovid", "Remdesivir", "Acetaminophen", "Ibuprofen"],
          treatments: ["Antivirals", "Supportive care", "Oxygen therapy", "Fever reducers"],
          emergencyLevel: "high"
        },
        "Influenza": {
          description: "Viral infection causing respiratory illness",
          commonSymptoms: ["High fever", "Body aches", "Headache", "Fatigue"],
          keyQuestions: [
            "Did symptoms start suddenly?",
            "Do you have muscle aches?",
            "Have you had flu vaccine?",
            "Do you have breathing difficulties?"
          ],
          recommendations: [
            "Rest and stay hydrated",
            "Take fever reducers",
            "Consider antiviral medication if early",
            "Isolate to prevent spread"
          ],
          medicines: ["Oseltamivir", "Zanamivir", "Acetaminophen", "Ibuprofen"],
          treatments: ["Antivirals", "Supportive care", "Fever management", "Rest"],
          emergencyLevel: "medium"
        },
        "UTI": {
          description: "Urinary tract infection",
          commonSymptoms: ["Painful urination", "Frequent urination", "Urgency", "Pelvic pain"],
          keyQuestions: [
            "Do you have burning with urination?",
            "Do you have blood in urine?",
            "Do you have fever or back pain?",
            "Have you had UTIs before?"
          ],
          recommendations: [
            "Increase fluid intake",
            "Take prescribed antibiotics",
            "Urinate when needed",
            "Consider cranberry supplements"
          ],
          medicines: ["Nitrofurantoin", "Trimethoprim-sulfamethoxazole", "Ciprofloxacin", "Phenazopyridine", "Cefalexin"],
          treatments: ["Antibiotics", "Pain relievers", "Increased fluids", "Prevention strategies", "Cranberry supplements"],
          emergencyLevel: "low"
        },
        "Hepatitis": {
          description: "Inflammation of the liver",
          commonSymptoms: ["Fatigue", "Jaundice", "Abdominal pain", "Dark urine"],
          keyQuestions: [
            "Do you have yellowing of skin or eyes?",
            "Do you have dark urine or pale stools?",
            "Do you have fatigue or abdominal pain?",
            "Have you been exposed to hepatitis?"
          ],
          recommendations: [
            "Avoid alcohol completely",
            "Rest and maintain nutrition",
            "Practice good hygiene",
            "Get vaccinated for hepatitis A and B"
          ],
          medicines: ["Interferon", "Ribavirin", "Entecavir", "Tenofovir", "Sofosbuvir"],
          treatments: ["Antiviral medications", "Interferon therapy", "Liver transplant", "Supportive care", "Vaccination"],
          emergencyLevel: "medium"
        },
        "HIV/AIDS": {
          description: "Human immunodeficiency virus infection",
          commonSymptoms: ["Flu-like symptoms", "Swollen lymph nodes", "Weight loss", "Opportunistic infections"],
          keyQuestions: [
            "Have you had unprotected sex?",
            "Have you shared needles?",
            "Do you have flu-like symptoms?",
            "Have you been exposed to HIV?"
          ],
          recommendations: [
            "Take antiretroviral therapy consistently",
            "Practice safe sex",
            "Never share needles",
            "Regular medical monitoring"
          ],
          medicines: ["Tenofovir", "Emtricitabine", "Dolutegravir", "Darunavir", "Raltegravir"],
          treatments: ["Antiretroviral therapy", "Prophylaxis", "Regular monitoring", "Supportive care", "Prevention"],
          emergencyLevel: "high"
        },
        "Tuberculosis": {
          description: "Bacterial infection affecting lungs",
          commonSymptoms: ["Persistent cough", "Chest pain", "Coughing up blood", "Weight loss"],
          keyQuestions: [
            "Have you had cough for more than 3 weeks?",
            "Do you cough up blood?",
            "Have you had weight loss or fever?",
            "Have you been exposed to TB?"
          ],
          recommendations: [
            "Complete full course of antibiotics",
            "Cover mouth when coughing",
            "Isolate during contagious phase",
            "Ensure proper ventilation"
          ],
          medicines: ["Isoniazid", "Rifampin", "Pyrazinamide", "Ethambutol", "Streptomycin"],
          treatments: ["Multiple drug therapy", "Direct observed therapy", "Nutritional support", "Monitoring", "Prevention"],
          emergencyLevel: "high"
        }
      }
    },
    "Musculoskeletal": {
      icon: "🦴",
      conditions: {
        "Arthritis": {
          description: "Inflammation of joints causing pain and stiffness",
          commonSymptoms: ["Joint pain", "Swelling", "Stiffness", "Reduced range of motion"],
          keyQuestions: [
            "Which joints are affected?",
            "Is pain worse in morning or after activity?",
            "Do you have swelling or redness?",
            "Do symptoms improve with movement?"
          ],
          recommendations: [
            "Exercise regularly to maintain joint function",
            "Use hot/cold therapy for pain relief",
            "Maintain healthy weight",
            "Consider assistive devices"
          ],
          medicines: ["Acetaminophen", "NSAIDs", "Prednisone", "Methotrexate", "Hydroxychloroquine"],
          treatments: ["Pain relievers", "Anti-inflammatory drugs", "DMARDs", "Physical therapy", "Joint protection"],
          emergencyLevel: "low"
        },
        "Osteoporosis": {
          description: "Bone disease causing weak and brittle bones",
          commonSymptoms: ["Back pain", "Loss of height", "Fractures", "Stooped posture"],
          keyQuestions: [
            "Have you lost height over time?",
            "Have you had fractures from minor falls?",
            "Do you have a family history of osteoporosis?",
            "Are you post-menopausal or over 65?"
          ],
          recommendations: [
            "Get adequate calcium and vitamin D",
            "Do weight-bearing exercises",
            "Avoid smoking and excessive alcohol",
            "Prevent falls at home"
          ],
          medicines: ["Alendronate", "Risedronate", "Ibandronate", "Zoledronic acid", "Denosumab"],
          treatments: ["Bisphosphonates", "Calcium supplements", "Vitamin D", "Exercise", "Fall prevention"],
          emergencyLevel: "low"
        },
        "Fibromyalgia": {
          description: "Widespread muscle pain and fatigue",
          commonSymptoms: ["Widespread pain", "Fatigue", "Sleep problems", "Cognitive issues"],
          keyQuestions: [
            "Do you have pain in multiple areas?",
            "Do you have trouble sleeping?",
            "Do you have difficulty concentrating?",
            "Do you have headaches or IBS?"
          ],
          recommendations: [
            "Establish regular sleep routine",
            "Exercise gently and regularly",
            "Manage stress effectively",
            "Pace activities to avoid overexertion"
          ],
          medicines: ["Pregabalin", "Duloxetine", "Amitriptyline", "Cyclobenzaprine", "Milnacipran"],
          treatments: ["Pain relievers", "Antidepressants", "Physical therapy", "Stress management", "Sleep therapy"],
          emergencyLevel: "low"
        },
        "Back Pain": {
          description: "Pain in the back affecting daily activities",
          commonSymptoms: ["Lower back pain", "Stiffness", "Muscle spasms", "Limited movement"],
          keyQuestions: [
            "Did pain start after injury or gradually?",
            "Does pain radiate down your legs?",
            "Do you have numbness or weakness?",
            "Is pain worse with certain activities?"
          ],
          recommendations: [
            "Maintain good posture",
            "Use proper lifting techniques",
            "Stay active with gentle exercises",
            "Apply heat or cold for relief"
          ],
          medicines: ["Ibuprofen", "Acetaminophen", "Muscle relaxants", "Opioids", "Steroid injections"],
          treatments: ["Pain relievers", "Physical therapy", "Exercise", "Posture correction", "Injections"],
          emergencyLevel: "medium"
        }
      }
    }
  }
};

// Emergency phone numbers by country
const EMERGENCY_PHONE_NUMBERS = {
  "USA": {
    ambulance: "911",
    police: "911", 
    fire: "911",
    poison_control: "1-800-222-1222"
  },
  "UK": {
    ambulance: "999",
    police: "999",
    fire: "999", 
    non_emergency: "111"
  },
  "India": {
    ambulance: "108",
    police: "100",
    fire: "101",
    women_helpline: "1091"
  },
  "Canada": {
    ambulance: "911",
    police: "911",
    fire: "911"
  },
  "Australia": {
    ambulance: "000",
    police: "000", 
    fire: "000"
  },
  "Germany": {
    ambulance: "112",
    police: "110",
    fire: "112"
  },
  "France": {
    ambulance: "15",
    police: "17",
    fire: "18"
  },
  "Japan": {
    ambulance: "119",
    police: "110",
    fire: "119"
  },
  "China": {
    ambulance: "120",
    police: "110",
    fire: "119"
  }
};

// Comprehensive medical knowledge base
const MEDICAL_KNOWLEDGE_BASE = {
  // Emergency conditions
  emergencies: {
    "chest pain": {
      severity: "critical",
      immediate: "🚨 **CALL AMBULANCE IMMEDIATELY** - This could be a heart attack!",
      whileWaiting: "Sit down, rest, and loosen tight clothing. Chew aspirin if available and not allergic.",
      doNot: "Do not drive yourself to the hospital.",
      phoneNumbers: EMERGENCY_PHONE_NUMBERS
    },
    "difficulty breathing": {
      severity: "critical", 
      immediate: "🚨 **CALL AMBULANCE IMMEDIATELY** - This could be a serious respiratory condition!",
      whileWaiting: "Sit upright, loosen clothing, use prescribed inhaler if available.",
      doNot: "Do not lie flat.",
      phoneNumbers: EMERGENCY_PHONE_NUMBERS
    },
    "severe bleeding": {
      severity: "critical",
      immediate: "🚨 **CALL AMBULANCE IMMEDIATELY** - Severe bleeding can be life-threatening!",
      whileWaiting: "Apply firm pressure to the wound and elevate the injured area.",
      doNot: "Do not remove objects embedded in the wound.",
      phoneNumbers: EMERGENCY_PHONE_NUMBERS
    },
    "loss of consciousness": {
      severity: "critical",
      immediate: "🚨 **CALL AMBULANCE IMMEDIATELY** - Unconsciousness requires immediate medical attention!",
      whileWaiting: "Check breathing and pulse, prepare for CPR if needed.",
      doNot: "Do not move the person unless necessary.",
      phoneNumbers: EMERGENCY_PHONE_NUMBERS
    },
    "stroke symptoms": {
      severity: "critical",
      immediate: "🚨 **CALL AMBULANCE IMMEDIATELY** - Time is brain, every minute counts!",
      whileWaiting: "Note the time symptoms started, keep person comfortable.",
      doNot: "Do not give food or drink.",
      phoneNumbers: EMERGENCY_PHONE_NUMBERS
    },
    "heart attack": {
      severity: "critical",
      immediate: "🚨 **CALL AMBULANCE IMMEDIATELY** - Heart attack requires emergency care!",
      whileWaiting: "Chew aspirin if available, sit down and rest.",
      doNot: "Do not wait to see if symptoms improve.",
      phoneNumbers: EMERGENCY_PHONE_NUMBERS
    },
    "seizure": {
      severity: "high",
      immediate: "🚨 **CALL AMBULANCE** if seizure lasts more than 5 minutes or person is injured!",
      whileWaiting: "Protect person from injury, time the seizure, place on side if possible.",
      doNot: "Do not restrain the person or put anything in their mouth.",
      phoneNumbers: EMERGENCY_PHONE_NUMBERS
    }
  },
  
  // Symptom analysis with follow-up questions
  symptoms: {
    headache: {
      description: "Headaches can range from mild to severe. Let me help you understand your type.",
      questions: [
        "Where is the pain located (one side, both sides, behind eyes)?",
        "How would you describe the pain (throbbing, stabbing, dull)?",
        "How long have you had this headache?",
        "Do you have any other symptoms (nausea, vision changes, sensitivity to light)?",
        "What makes it better or worse?"
      ],
      possibleCauses: ["Tension headache", "Migraine", "Sinus headache", "Dehydration", "Eye strain"],
      recommendations: ["Rest in quiet, dark room", "Stay hydrated", "Apply cold compress", "Consider over-the-counter pain relievers"],
      whenToSeekCare: "Seek immediate care if: sudden severe headache, headache with fever/stiff neck, headache after head injury, or worst headache of your life."
    },
    fever: {
      description: "Fever is your body's response to infection or inflammation.",
      questions: [
        "What is your exact temperature?",
        "How long have you had the fever?",
        "Do you have other symptoms (chills, body aches, cough, rash)?",
        "Have you taken any medication for it?"
      ],
      possibleCauses: ["Viral infection", "Bacterial infection", "Inflammation", "Heat exhaustion"],
      recommendations: ["Rest and stay hydrated", "Use fever reducers if appropriate", "Monitor temperature regularly"],
      whenToSeekCare: "Seek immediate care for: fever above 103°F (39.4°C), fever with confusion, stiff neck, or difficulty breathing."
    },
    cough: {
      description: "Coughs help clear your airways but can indicate various conditions.",
      questions: [
        "Is your cough dry or productive (bringing up mucus)?",
        "What color is the mucus if present?",
        "How long have you been coughing?",
        "Do you have other symptoms (fever, shortness of breath, chest pain)?"
      ],
      possibleCauses: ["Common cold", "Bronchitis", "Allergies", "Asthma", "GERD"],
      recommendations: ["Stay hydrated", "Use honey", "Avoid irritants", "Try steam inhalation"],
      whenToSeekCare: "Seek care for: cough lasting more than 2 weeks, cough with blood, shortness of breath, or high fever."
    }
  },
  
  // Medicine interactions and information
  medicines: {
    interactions: {
      "warfarin": ["aspirin", "ibuprofen", "vitamin K", "grapefruit"],
      "statins": ["grapefruit", "certain antibiotics", "antifungals"],
      "antidepressants": ["MAO inhibitors", "certain pain medications", "alcohol"],
      "blood pressure meds": ["NSAIDs", "decongestants", "alcohol"]
    },
    sideEffects: {
      "antibiotics": ["Nausea", "Diarrhea", "Allergic reactions"],
      "pain relievers": ["Stomach upset", "Kidney effects", "Liver effects"],
      "blood pressure meds": ["Dizziness", "Fatigue", "Dry cough"]
    }
  },
  
  // Wellness and prevention
  wellness: {
    nutrition: {
      principles: ["Eat colorful fruits and vegetables", "Choose whole grains", "Include lean proteins", "Limit processed foods", "Stay hydrated"],
      supplements: ["Vitamin D for bone health", "Omega-3 for heart health", "Probiotics for digestion", "Iron for energy (if deficient)"],
      hydration: "Drink 8 glasses of water daily, more with exercise or heat"
    },
    exercise: {
      recommendations: ["150 minutes moderate exercise weekly", "2 strength training sessions", "Daily stretching", "10,000 steps daily"],
      benefits: ["Improves heart health", "Reduces stress", "Maintains healthy weight", "Improves mood"],
      gettingStarted: "Start with 10-minute walks, gradually increase intensity and duration"
    },
    sleep: {
      guidelines: ["7-9 hours nightly for adults", "Consistent sleep schedule", "Dark, cool room", "No screens before bed"],
      tips: ["Avoid caffeine 6 hours before bed", "Exercise earlier in day", "Relaxation techniques", "Comfortable mattress"],
      problems: "See a doctor for: loud snoring, daytime sleepiness, or difficulty falling asleep"
    },
    mentalHealth: {
      stressManagement: ["Deep breathing", "Meditation", "Regular exercise", "Adequate sleep", "Social connections"],
      warningSigns: ["Persistent sadness", "Loss of interest", "Sleep changes", "Appetite changes", "Difficulty concentrating"],
      whenToSeekHelp: "Seek professional help for: thoughts of self-harm, severe mood changes, or interference with daily life"
    }
  },
  
  // First aid guidance
  firstAid: {
    cuts: ["Clean with soap and water", "Apply antibiotic ointment", "Cover with sterile bandage", "Change daily"],
    burns: ["Cool with running water (10-15 mins)", "Cover loosely with sterile dressing", "Don't use ice or butter", "Seek care for severe burns"],
    sprains: ["RICE method: Rest, Ice, Compression, Elevation", "Avoid heat for 48 hours", "Seek care for severe pain or inability to move"],
    choking: ["Heimlich maneuver if conscious", "Back blows and chest thrusts", "Call emergency services if unsuccessful"],
    fainting: ["Check breathing", "Elevate legs", "Loosen clothing", "Don't prop head up", "Seek care if no quick recovery"]
  }
};

export function AIChatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "🏥 **Welcome to MediSense - Your Medical Assistant**\\n\\nI can help you with health information and guidance!\\n\\n**🩺 What I can do:**\\n• Help you find medical conditions and diseases\\n• Provide medicine information and safety tips\\n• Analyze your symptoms\\n• Give emergency guidance with phone numbers\\n• Share wellness and prevention tips\\n\\n**🚀 Quick Start - Click any option below:**\\n\\n**Or just type what you need help with!**\\n• \"I have a headache\"\\n• \"Tell me about asthma\"\\n• \"Chest pain emergency\"\\n• \"Medicines for diabetes\"\\n\\nLet's get started! What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
      quickActions: [
        { label: "🏥 Find Disease", action: "I want to find a disease" },
        { label: "💊 Medicines", action: "I need medicine information" },
        { label: "🩺 Symptoms", action: "I have symptoms" },
        { label: "🚨 Emergency", action: "I need emergency help" },
        { label: "🧘 Wellness", action: "I need wellness tips" }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentContext, setCurrentContext] = useState<string>("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<{ text: string; type: Message["type"]; quickActions?: Array<{ label: string; action: string }> }> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Disease selection system with interactive clickable options
    if (lowerMessage.includes("disease") || lowerMessage.includes("condition") || lowerMessage.includes("what type") || lowerMessage.includes("choose disease") || lowerMessage.includes("select medical condition")) {
      const categories = Object.keys(DISEASE_DATABASE.categories);
      
      return {
        text: `🏥 **Select a Medical Department**\\n\\nChoose from our specialized medical departments:\\n\\n${categories.map((cat, i) => `${i + 1}. **${DISEASE_DATABASE.categories[cat as keyof typeof DISEASE_DATABASE.categories].icon} ${cat}**`).join('\\n')}\\n\\n**Click on any department above or type its name!**\\n\\n**Available Departments:**\\n${categories.map(cat => `• **${cat}** - ${Object.keys(DISEASE_DATABASE.categories[cat as keyof typeof DISEASE_DATABASE.categories].conditions).length} conditions`).join('\\n')}\\n\\n**Quick Start Options:**\\n• Click the buttons below\\n• Type: "Respiratory", "Cardiovascular", etc.\\n• Or say a specific condition like "Asthma"`,
        type: "symptom",
        quickActions: categories.map(cat => ({
          label: `${DISEASE_DATABASE.categories[cat as keyof typeof DISEASE_DATABASE.categories].icon} ${cat}`,
          action: `Show me ${cat} conditions`
        }))
      };
    }

    // Category-specific responses with interactive clickable conditions
    for (const [categoryName, category] of Object.entries(DISEASE_DATABASE.categories)) {
      if (lowerMessage.includes(categoryName.toLowerCase())) {
        const conditions = Object.keys(category.conditions);
        
        return {
          text: `${category.icon} **${categoryName} Department**\\n\\n**Available Conditions (${conditions.length}):**\\n\\n${conditions.map((cond, i) => `${i + 1}. **${cond}**`).join('\\n')}\\n\\n**Click on any condition above or type its name!**\\n\\n**Common symptoms in this department:**\\n${conditions.flatMap(cond => (category.conditions[cond as keyof typeof category.conditions] as any).commonSymptoms).slice(0, 6).map((s: string) => `• ${s}`).join('\\n')}\\n\\n**Quick Actions:**\\n• Click any condition button below\\n• Type a condition name\\n• Describe your symptoms`,
          type: "symptom",
          quickActions: conditions.map(cond => ({
            label: cond,
            action: `Tell me about ${cond}`
          }))
        };
      }
    }

    // Specific condition responses with interactive options
    for (const [categoryName, category] of Object.entries(DISEASE_DATABASE.categories)) {
      for (const [conditionName, condition] of Object.entries(category.conditions)) {
        if (lowerMessage.includes(conditionName.toLowerCase())) {
          const emergencyText = condition.emergencyLevel === "critical" ? 
            "🚨 **CRITICAL EMERGENCY** - Call emergency services immediately!" :
            condition.emergencyLevel === "high" ? 
            "⚠️ **HIGH PRIORITY** - See a doctor soon" :
            "ℹ️ **MODERATE PRIORITY** - Consult healthcare provider";

          return {
            text: `${category.icon} **${conditionName}**\\n\\n**About this condition:**\\n${condition.description}\\n\\n**Common symptoms:**\\n${condition.commonSymptoms.map(s => `• ${s}`).join('\\n')}\\n\\n**💊 Recommended medicines:**\\n${condition.medicines.map(m => `• ${m}`).join('\\n')}\\n\\n**🩺 Treatment options:**\\n${condition.treatments.map(t => `• ${t}`).join('\\n')}\\n\\n**📋 What to do:**\\n${condition.recommendations.map(r => `• ${r}`).join('\\n')}\\n\\n${emergencyText}\\n\\n**Click on any option below or ask questions!**`,
            type: condition.emergencyLevel === "critical" ? "emergency" : "symptom",
            quickActions: [
              { label: "💊 Medicines", action: `Show medicines for ${conditionName}` },
              { label: "🩺 Treatments", action: `Show treatments for ${conditionName}` },
              { label: "❓ Questions", action: `Ask me questions about ${conditionName}` },
              { label: "🚨 Emergency", action: `Emergency info for ${conditionName}` }
            ]
          };
        }
      }
    }

    // Interactive medicine information
    if (lowerMessage.includes("medicine") || lowerMessage.includes("drug") || lowerMessage.includes("medication") || lowerMessage.includes("interaction") || lowerMessage.includes("pharmaceutical")) {
      return {
        text: `💊 **Medicine Information Center**\\n\\nI can help you with:\\n\\n• **Drug Interactions** - Check if medicines are safe together\\n• **Side Effects** - Learn about medicine side effects\\n• **Disease Medicines** - Get medicines for specific conditions\\n• **Dosage Info** - How to take medicines properly\\n\\n**⚠️ Dangerous Drug Combinations:**\\n• Warfarin + Aspirin → Bleeding risk\\n• Statins + Grapefruit → Muscle damage\\n• Antidepressants + MAO inhibitors → Serotonin syndrome\\n\\n**Click any option below or ask about a specific medicine!**`,
        type: "medicine",
        quickActions: [
          { label: "💊 Interactions", action: "Check drug interactions" },
          { label: "⚠️ Side Effects", action: "Show common side effects" },
          { label: "🏥 Disease Medicines", action: "Show medicines for diseases" },
          { label: "📋 Dosage Guide", action: "How to take medicines" }
        ]
      };
    }

    // Interactive medicine suggestions for specific conditions
    if (lowerMessage.includes("medicines for") || lowerMessage.includes("treatment for") || lowerMessage.includes("drugs for") || lowerMessage.includes("pharmaceutical for")) {
      for (const [categoryName, category] of Object.entries(DISEASE_DATABASE.categories)) {
        for (const [conditionName, condition] of Object.entries(category.conditions)) {
          if (lowerMessage.includes(conditionName.toLowerCase())) {
            return {
              text: `💊 **Medicines for ${conditionName}**\\n\\n**Recommended medications:**\\n${condition.medicines.map((m, i) => `${i + 1}. ${m}`).join('\\n')}\\n\\n**Treatment approaches:**\\n${condition.treatments.map((t, i) => `${i + 1}. ${t}`).join('\\n')}\\n\\n**Important safety notes:**\\n• Always take medicines as prescribed\\n• Tell your doctor about all medicines you take\\n• Report side effects immediately\\n• Never share prescription medicines\\n\\n**Click any option below for more details!**`,
              type: "medicine",
              quickActions: [
                { label: "💊 Side Effects", action: `Side effects of ${conditionName} medicines` },
                { label: "📋 How to Take", action: `How to take ${conditionName} medicines` },
                { label: "🔄 Alternatives", action: `Alternative treatments for ${conditionName}` },
                { label: "🚨 Emergency", action: `Emergency info for ${conditionName}` }
              ]
            };
          }
        }
      }
    }

    // Emergency detection with professional medical protocols - highest priority
    const emergencyKeywords = Object.keys(MEDICAL_KNOWLEDGE_BASE.emergencies);
    for (const emergency of emergencyKeywords) {
      if (lowerMessage.includes(emergency.toLowerCase())) {
        const emergencyInfo = MEDICAL_KNOWLEDGE_BASE.emergencies[emergency as keyof typeof MEDICAL_KNOWLEDGE_BASE.emergencies];
        const phoneNumbers = emergencyInfo.phoneNumbers;
        
        let phoneText = "**📞 International Emergency Medical Services:**\\n\\n";
        phoneText += "🇺🇸 **United States:** 911 (Emergency Medical Services)\\n";
        phoneText += "🇮🇳 **India:** 108 (Ambulance), 100 (Police Emergency)\\n";
        phoneText += "🇬🇧 **United Kingdom:** 999 (Emergency Services)\\n";
        phoneText += "🇨🇦 **Canada:** 911 (Emergency Medical Services)\\n";
        phoneText += "🇦🇺 **Australia:** 000 (Emergency Services)\\n";
        phoneText += "🇩🇪 **Germany:** 112 (Emergency Medical Services)\\n";
        phoneText += "🇫🇷 **France:** 15 (Medical Emergency), 17 (Police)\\n";
        phoneText += "🇯🇵 **Japan:** 119 (Emergency Services)\\n";
        phoneText += "🇨🇳 **China:** 120 (Ambulance), 110 (Police)\\n\\n";
        
        return {
          text: `🚨 **MEDICAL EMERGENCY - IMMEDIATE ACTION REQUIRED**\\n\\n**Critical Assessment:** ${emergencyInfo.immediate}\\n\\n${phoneText}\\n**Emergency First Aid Protocol:**\\n${emergencyInfo.whileWaiting}\\n\\n**Critical Safety Precautions:**\\n${emergencyInfo.doNot}\\n\\n**Emergency Response Guidelines:**\\n• Contact your local emergency medical services IMMEDIATELY\\n• Provide clear, concise information about the emergency\\n• Follow all instructions from emergency medical personnel\\n• Do not administer any medications unless specifically instructed\\n• Keep the patient calm and comfortable while waiting\\n\\n**Professional Medical Disclaimer:** This emergency guidance is for immediate response only. Professional medical evaluation and treatment are essential for all medical emergencies.\\n\\n**Emergency Contact Options:**\\n• Click your country's emergency number for immediate connection\\n• Stay on the line with emergency services until instructed otherwise\\n• Follow all medical professional instructions precisely`,
          type: "emergency",
          quickActions: [
            { label: "🇺🇸 USA 911", action: "Connect to USA Emergency Medical Services" },
            { label: "🇮🇳 India 108", action: "Connect to India Ambulance Services" },
            { label: "🇬🇧 UK 999", action: "Connect to UK Emergency Services" },
            { label: "🇨🇦 Canada 911", action: "Connect to Canada Emergency Medical Services" },
            { label: "All Countries", action: "Display all international emergency numbers" }
          ]
        };
      }
    }

    // Symptom analysis
    for (const [symptom, info] of Object.entries(MEDICAL_KNOWLEDGE_BASE.symptoms)) {
      if (lowerMessage.includes(symptom)) {
        setCurrentContext(symptom);
        return {
          text: `🩺 **${symptom.charAt(0).toUpperCase() + symptom.slice(1)} Analysis**\\n\\n${info.description}\\n\\n**To help you better, please tell me:**\\n${info.questions.map((q, i) => `${i + 1}. ${q}`).join('\\n')}\\n\\n**Possible causes:** ${info.possibleCauses.join(', ')}\\n\\n**Initial recommendations:**\\n${info.recommendations.map(r => `• ${r}`).join('\\n')}\\n\\n**⚠️ ${info.whenToSeekCare}**`,
          type: "symptom",
          quickActions: [
            { label: "Schedule Consultation", action: "I need to schedule a medical consultation" },
            { label: "Additional Symptoms", action: "I have additional symptoms to report" }
          ]
        };
      }
    }

    // Wellness and prevention
    if (lowerMessage.includes("wellness") || lowerMessage.includes("health") || lowerMessage.includes("nutrition") || lowerMessage.includes("exercise") || lowerMessage.includes("sleep") || lowerMessage.includes("mental health")) {
      return {
        text: `🧘 **Wellness & Prevention**\\n\\n**Nutrition Guidelines:**\\n${MEDICAL_KNOWLEDGE_BASE.wellness.nutrition.principles.map((p: string) => `• ${p}`).join('\\n')}\\n\\n**Exercise Recommendations:**\\n${MEDICAL_KNOWLEDGE_BASE.wellness.exercise.recommendations.map((r: string) => `• ${r}`).join('\\n')}\\n\\n**Sleep Hygiene:**\\n${MEDICAL_KNOWLEDGE_BASE.wellness.sleep.guidelines.map((g: string) => `• ${g}`).join('\\n')}\\n\\n**Mental Health Support:**\\n${MEDICAL_KNOWLEDGE_BASE.wellness.mentalHealth.stressManagement.map((s: string) => `• ${s}`).join('\\n')}\\n\\n**📋 Daily Wellness Checklist:**\\n• 8 glasses of water\\n• 5 servings of fruits/vegetables\\n• 30 minutes exercise\\n• 7-9 hours sleep\\n• 10 minutes mindfulness/meditation\\n\\nWhich area would you like detailed guidance on?`,
        type: "wellness",
        quickActions: [
          { label: "Nutrition Plan", action: "I need a nutrition plan" },
          { label: "Exercise Routine", action: "Help me create an exercise routine" },
          { label: "Sleep Tips", action: "I have trouble sleeping" },
          { label: "Stress Management", action: "I need help with stress" }
        ]
      };
    }

    // First aid guidance
    if (lowerMessage.includes("first aid") || lowerMessage.includes("injury") || lowerMessage.includes("cut") || lowerMessage.includes("burn") || lowerMessage.includes("sprain")) {
      return {
        text: `🆘 **First Aid Guidance**\\n\\n**Common First Aid Situations:**\\n\\n🩹 **Cuts & Wounds:**\\n${MEDICAL_KNOWLEDGE_BASE.firstAid.cuts.map((c: string) => `• ${c}`).join('\\n')}\\n\\n🔥 **Burns:**\\n${MEDICAL_KNOWLEDGE_BASE.firstAid.burns.map((b: string) => `• ${b}`).join('\\n')}\\n\\n🦴 **Sprains & Strains:**\\n${MEDICAL_KNOWLEDGE_BASE.firstAid.sprains.map((s: string) => `• ${s}`).join('\\n')}\\n\\n😮‍💨 **Choking:**\\n${MEDICAL_KNOWLEDGE_BASE.firstAid.choking.map((c: string) => `• ${c}`).join('\\n')}\\n\\n😵 **Fainting:**\\n${MEDICAL_KNOWLEDGE_BASE.firstAid.fainting.map((f: string) => `• ${f}`).join('\\n')}\\n\\n⚠️ **Remember:** First aid is temporary care. Always seek professional medical attention for serious injuries.\\n\\nWhat specific situation do you need help with?`,
        type: "emergency"
      };
    }

    // Appointment scheduling
    if (lowerMessage.includes("appointment") || lowerMessage.includes("doctor") || lowerMessage.includes("consultation") || lowerMessage.includes("schedule")) {
      return {
        text: `🗓️ **Appointment Scheduling Assistant**\\n\\nI can help you prepare for your medical visit:\\n\\n**Before Your Appointment:**\\n• Write down your symptoms and when they started\\n• List all medications you're taking\\n• Note any allergies or medical conditions\\n• Prepare questions to ask your doctor\\n• Bring your insurance card and ID\\n\\n**During Your Appointment:**\\n• Be honest about all symptoms\\n• Ask about treatment options\\n• Understand follow-up care needed\\n• Request written instructions\\n\\n**After Your Appointment:**\\n• Follow the treatment plan\\n• Schedule any needed follow-ups\\n• Monitor your symptoms\\n• Fill prescriptions as directed\\n\\n**Types of Specialists:**\\n• General Physician - Overall health\\n• Cardiologist - Heart conditions\\n• Neurologist - Brain/nervous system\\n• Orthopedist - Bones/joints\\n• Dermatologist - Skin conditions\\n\\nWould you like help scheduling a specific type of appointment?`,
        type: "appointment",
        quickActions: [
          { label: "Schedule General Checkup", action: "I need a general checkup" },
          { label: "Specialist Referral", action: "I need to see a specialist" }
        ]
      };
    }

    // Report analysis help
    if (lowerMessage.includes("report") || lowerMessage.includes("test") || lowerMessage.includes("result") || lowerMessage.includes("lab")) {
      return {
        text: `📋 **Medical Report Analysis**\\n\\nI can help you understand your medical reports and test results:\\n\\n**Common Test Results I Can Explain:**\\n• Blood tests (CBC, cholesterol, glucose)\\n• Imaging results (X-rays, MRI, CT scans)\\n• Heart tests (ECG, stress test)\\n• Hormone levels\\n• Organ function tests\\n\\n**What I Look For:**\\n• Values outside normal ranges\\n• Trends over time\\n• Relationships between different results\\n• Potential causes of abnormalities\\n\\n**How to Get Help:**\\n1. Upload your report in the dashboard\\n2. I'll analyze and explain the findings\\n3. Provide context and next steps\\n4. Suggest questions for your doctor\\n\\n**Important:** Always discuss results with your healthcare provider for personalized interpretation.\\n\\nDo you have a specific report you'd like me to help analyze?`,
        type: "report",
        quickActions: [
          { label: "Upload Report", action: "I want to upload a medical report" },
          { label: "Understand Test Results", action: "Help me understand my test results" }
        ]
      };
    }

    // Default interactive response
    return {
      text: `🏥 **MediSense - Your Medical Assistant**\\n\\nI'm here to help with your health questions!\\n\\n**🩺 What I can help you with:**\\n• **Find Diseases** - Browse 25+ medical conditions\\n• **Medicine Info** - Learn about medications and safety\\n• **Symptom Check** - Understand what your symptoms might mean\\n• **Emergency Help** - Get emergency numbers and first aid\\n• **Wellness Tips** - Health advice and prevention\\n\\n**🚀 Try these examples:**\\n• \"I want to find a disease\"\\n• \"Tell me about asthma\"\\n• \"I have a headache\"\\n• \"Chest pain emergency\"\\n• \"Medicines for diabetes\"\\n\\n**Or click any option below!**`,
      type: "text",
      quickActions: [
        { label: "🏥 Find Disease", action: "I want to find a disease" },
        { label: "💊 Medicines", action: "I need medicine information" },
        { label: "🩺 Symptoms", action: "I have symptoms" },
        { label: "🚨 Emergency", action: "I need emergency help" },
        { label: "🧘 Wellness", action: "I need wellness tips" }
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    const botResponseData = await generateBotResponse(inputValue);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseData.text,
      sender: "bot",
      timestamp: new Date(),
      type: botResponseData.type,
      quickActions: botResponseData.quickActions
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: Activity, label: "Symptoms", action: "I need help with symptoms" },
    { icon: Pill, label: "Medicines", action: "Tell me about a medication" },
    { icon: Stethoscope, label: "Appointment", action: "I need to schedule an appointment" },
    { icon: FileText, label: "Report Analysis", action: "Help me understand my medical report" },
    { icon: AlertTriangle, label: "Emergency", action: "I need emergency guidance" },
    { icon: Heart, label: "Wellness", action: "Give me health advice" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="border-2 border-blue-200 shadow-2xl bg-white">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold">MediBot Assistant</h3>
                  <p className="text-xs text-blue-100">AI Medical Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-white hover:bg-white/20"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className={`p-2 rounded-lg ${
                    message.type === "emergency" ? "bg-red-100" :
                    message.type === "symptom" ? "bg-blue-100" :
                    message.type === "medicine" ? "bg-purple-100" :
                    message.type === "wellness" ? "bg-green-100" :
                    message.type === "appointment" ? "bg-orange-100" :
                    message.type === "report" ? "bg-indigo-100" :
                    "bg-blue-100"
                  }`}>
                    <Bot className={`size-4 ${
                      message.type === "emergency" ? "text-red-600" :
                      message.type === "symptom" ? "text-blue-600" :
                      message.type === "medicine" ? "text-purple-600" :
                      message.type === "wellness" ? "text-green-600" :
                      message.type === "appointment" ? "text-orange-600" :
                      message.type === "report" ? "text-indigo-600" :
                      "text-blue-600"
                    }`} />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : message.type === "emergency" ? "bg-red-50 border border-red-200 text-red-800" :
                          message.type === "symptom" ? "bg-blue-50 border border-blue-200 text-blue-800" :
                          message.type === "medicine" ? "bg-purple-50 border border-purple-200 text-purple-800" :
                          message.type === "wellness" ? "bg-green-50 border border-green-200 text-green-800" :
                          message.type === "appointment" ? "bg-orange-50 border border-orange-200 text-orange-800" :
                          message.type === "report" ? "bg-indigo-50 border border-indigo-200 text-indigo-800" :
                          "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {/* Quick Actions for Bot Messages */}
                  {message.sender === "bot" && message.quickActions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => setInputValue(action.action)}
                          className="text-xs px-2 py-1 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {message.sender === "user" && (
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <User className="size-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Bot className="size-4 text-blue-600" />
                </div>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2">
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(action.action)}
                  className={`text-xs h-8 border-slate-200 hover:bg-slate-50 ${
                    action.label === "Emergency" ? "border-red-200 text-red-600 hover:bg-red-50" :
                    action.label === "Symptoms" ? "border-blue-200 text-blue-600 hover:bg-blue-50" :
                    action.label === "Medicines" ? "border-purple-200 text-purple-600 hover:bg-purple-50" :
                    action.label === "Wellness" ? "border-green-200 text-green-600 hover:bg-green-50" :
                    "text-slate-600"
                  }`}
                >
                  <action.icon className="size-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your health question or click a button above..."
                className="flex-1 border-slate-300 focus:border-blue-500"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function FloatingChatbotButton({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 right-4 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
        isOpen 
          ? 'bg-slate-600 text-white' 
          : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
      }`}
    >
      {isOpen ? (
        <X className="size-6" />
      ) : (
        <MessageCircle className="size-6" />
      )}
    </button>
  );
}
