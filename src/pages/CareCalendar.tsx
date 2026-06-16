import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Droplets, Wind, Plus, Menu, Sparkles, Sprout, Heart, Info, CheckCircle2, Globe, Trash2, Edit2,
  AlertTriangle, Flame, CloudRain, Clock, Clipboard, LifeBuoy, X, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGarden } from '../context/GardenContext';
import { useOutletContext } from 'react-router-dom';
import { Plant, JournalEntry } from '../types';

// Gregorian A.D. to Bikram Sambat B.S. Date Converter
export function convertADtoBS(date: Date) {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  const year = date.getFullYear();

  // Reference transitions model for 2026. Supports robust extrapolation for prior/future years too.
  const transitions: Record<number, {
    transitionDay: number;
    prevBsMonthIdx: number;
    nextBsMonthIdx: number;
    prevBsYear: number;
    nextBsYear: number;
    prevMonthDays: number;
  }> = {
    0: { transitionDay: 15, prevBsMonthIdx: 8, nextBsMonthIdx: 9, prevBsYear: 2082, nextBsYear: 2082, prevMonthDays: 29 }, // Jan 15 is Magh 1. Jan 14 is Poush 29.
    1: { transitionDay: 13, prevBsMonthIdx: 9, nextBsMonthIdx: 10, prevBsYear: 2082, nextBsYear: 2082, prevMonthDays: 29 }, // Feb 13 is Falgun 1. Feb 12 is Magh 29.
    2: { transitionDay: 15, prevBsMonthIdx: 10, nextBsMonthIdx: 11, prevBsYear: 2082, nextBsYear: 2082, prevMonthDays: 30 }, // Mar 15 is Chaitra 1. Mar 14 is Falgun 30.
    3: { transitionDay: 14, prevBsMonthIdx: 11, nextBsMonthIdx: 0, prevBsYear: 2082, nextBsYear: 2083, prevMonthDays: 30 }, // Apr 14 is Baisakh 1. Apr 13 is Chaitra 30.
    4: { transitionDay: 15, prevBsMonthIdx: 0, nextBsMonthIdx: 1, prevBsYear: 2083, nextBsYear: 2083, prevMonthDays: 31 }, // May 15 is Jeth 1. May 14 is Baisakh 31.
    5: { transitionDay: 15, prevBsMonthIdx: 1, nextBsMonthIdx: 2, prevBsYear: 2083, nextBsYear: 2083, prevMonthDays: 32 }, // Jun 15 is Ashadh 1. Jun 14 is Jeth 32.
    6: { transitionDay: 17, prevBsMonthIdx: 2, nextBsMonthIdx: 3, prevBsYear: 2083, nextBsYear: 2083, prevMonthDays: 32 }, // Jul 17 is Shrawan 1. Jul 16 is Ashadh 32.
    7: { transitionDay: 17, prevBsMonthIdx: 3, nextBsMonthIdx: 4, prevBsYear: 2083, nextBsYear: 2083, prevMonthDays: 31 }, // Aug 17 is Bhadra 1. Aug 16 is Shrawan 31.
    8: { transitionDay: 17, prevBsMonthIdx: 4, nextBsMonthIdx: 5, prevBsYear: 2083, nextBsYear: 2083, prevMonthDays: 31 }, // Sep 17 is Ashwin 1. Sep 16 is Bhadra 31.
    9: { transitionDay: 18, prevBsMonthIdx: 5, nextBsMonthIdx: 6, prevBsYear: 2083, nextBsYear: 2083, prevMonthDays: 31 }, // Oct 18 is Kartik 1. Oct 17 is Ashwin 31.
    10: { transitionDay: 17, prevBsMonthIdx: 6, nextBsMonthIdx: 7, prevBsYear: 2083, nextBsYear: 2083, prevMonthDays: 30 }, // Nov 17 is Mangsir 1. Nov 16 is Kartik 30.
    11: { transitionDay: 16, prevBsMonthIdx: 7, nextBsMonthIdx: 8, prevBsYear: 2083, nextBsYear: 2083, prevMonthDays: 29 }, // Dec 16 is Poush 1. Dec 15 is Mangsir 29.
  };

  const trans = transitions[month];
  let bsYear = trans.nextBsYear;
  let bsMonthIdx = trans.nextBsMonthIdx;
  let bsDay = 1;

  const yearDiff = year - 2026;
  bsYear += yearDiff;

  if (day < trans.transitionDay) {
    bsYear = trans.prevBsYear + yearDiff;
    bsMonthIdx = trans.prevBsMonthIdx;
    bsDay = trans.prevMonthDays - (trans.transitionDay - day);
  } else {
    bsDay = day - trans.transitionDay + 1;
  }

  return {
    bsYear,
    bsMonthIdx,
    bsDay
  };
}

// Translation dictionary for switching between English (EN) and Nepali (NP)
const EN_NP_TRANSLATIONS = {
  EN: {
    careSchedule: "Care Schedule",
    nepalesePatro: "Nepalese Patro (B.S.)",
    goToToday: "Go to Today",
    wateringNeeded: "Watering Needed",
    nourishmentFeed: "Nourishment & Feed",
    completedActivities: "Completed Actions",
    logActivity: "Log Done Action",
    actionsDue: "Actions Due",
    agendaFor: "Agenda for",
    nextFertilizing: "Upcoming Fertilizing Schedules",
    upcomingFertilizers: "Next Time to Fertilize",
    addCustomFertilizer: "🧪 Quick Log Fertilizer",
    fertilizerLabTitle: "🧪 Apply & Log Fertilizers on Calendar",
    magnesiumAdvisor: "🍋 Citrus Magnesium & Fertilizing Guide",
    solidFertilizers: "Solid Fertilizers (Every 30–45 Days)",
    liquidFertilizers: "Liquid Fertilizers & Sprays (Every 10–14 Days)",
    epsomSaltInfo: "Epsom Salt (Magnesium Sulfate) Guide",
    timingRain: "Timing, Rain, and Combined Treatments",
    fertilizerTimeline: "📅 90-Day Seasonal Master Calendar",
    selectPlant: "Select Plant",
    category: "Category",
    titleLabel: "Nutrient / Log Label",
    notesDetails: "Notes / Details",
    saveLog: "Save Fertilizer Log",
    cancel: "Cancel",
    applySolid: "Apply Solid Blend",
    applyPeel: "Apply Onion/Banana Water",
    applyRice: "Apply Rice Water",
    applyEpsomFoliar: "Spray Epsom (Foliar)",
    applyEpsomSoil: "Drench Epsom (Soil)",
    applyWoodAsh: "Apply Wood Ash + Coffee",
    yellowLeavesHelp: "Interveinal Chlorosis Cure",
    nextFeedLabel: "Next Feed",
    intervalHeading: "Recurrence (Days)",
    qtyHeading: "Applied Qty",
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    nepaliMonths: ["Baisakh", "Jeth", "Asar", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"],
  },
  NP: {
    careSchedule: "हेरचाह तालिका",
    nepalesePatro: "नेपाली पात्रो (बि.सं.)",
    goToToday: "आजको दिन",
    wateringNeeded: "सिंचाई आवश्यक (" + "पानी" + ")",
    nourishmentFeed: "मलजल र पोषण",
    completedActivities: "पूरा भएका कार्यहरू",
    logActivity: "कार्य दर्ता गर्नुहोस्",
    actionsDue: "गर्नुपर्ने कार्यहरू",
    agendaFor: "को दैनिक कार्यसूची",
    nextFertilizing: "मल हाल्ने भावी तालिका",
    upcomingFertilizers: "अर्को पटक मल हाल्ने समय",
    addCustomFertilizer: "🧪 मलजल दर्ता थप्नुहोस्",
    fertilizerLabTitle: "🧪 मलजल प्रयोग र क्यालेन्डर तालिका दर्ता",
    magnesiumAdvisor: "🍋 कागती/सुन्तलाको म्याग्नेसियम र मल सल्लाहकार",
    solidFertilizers: "ठोस प्राङ्गारिक मलहरू (हरेक ३०-४५ दिनमा)",
    liquidFertilizers: "तरल मल र स्प्रेहरू (हरेक १०-१४ दिनमा)",
    epsomSaltInfo: "इप्सम नुन (म्याग्नेसियम सल्फेट) निर्देशिका",
    timingRain: "मौसम, वर्षा र उपचारको सही समय",
    fertilizerTimeline: "📅 ९०-दिने मौसमी चक्र समयरेखा",
    selectPlant: "बिरुवा छान्नुहोस्",
    category: "विधा",
    titleLabel: "मलको नाम / विवरण",
    notesDetails: "मुख्य बुँदा / थप टिप्पणी",
    saveLog: "मलजल लग सुरक्षित गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    applySolid: "ठोस मल प्रयोग",
    applyPeel: "केराको बोक्राको झोल",
    applyRice: "चामल धुन खोजेको पानी",
    applyEpsomFoliar: "इप्सम पात स्प्रे",
    applyEpsomSoil: "इप्सम जरा ड्रेन्च",
    applyWoodAsh: "खरानी + कफी जोडी",
    yellowLeavesHelp: "पहेंलो पातको उपचार",
    nextFeedLabel: "अर्को मल",
    intervalHeading: "चक्र (दिनमा)",
    qtyHeading: "मलको परिणाम",
    weekdays: ['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिही', 'शुक्र', 'शनि'],
    months: ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"],
    nepaliMonths: ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"],
  }
};

// Recommended default fertilizers dictionary inspired by expert details
const RECOMMENDED_FERTILIZERS = [
  { id: 'cow_dung', name: 'Aged Cow Dung (Solid)', nameNP: 'कुहिएको गोबर मल (ठोस)', defInterval: 35, qty: '2 big handfuls (150-200g)', notes: 'Aged 8-9 months. Scratch into top 1" of soil away from stem and water thoroughly.', type: 'solid' },
  { id: 'vermicompost', name: 'Vermicompost (Solid)', nameNP: 'गड्यौलाको मल (ठोस)', defInterval: 35, qty: '1-2 handfuls (100g)', notes: 'Rich organic nutrients. Scratch into topsoil.', type: 'solid' },
  { id: 'bone_meal', name: 'Bone Meal (Solid)', nameNP: 'हड्डीको धुलो मल (ठोस)', defInterval: 60, qty: '2 tablespoons', notes: 'Apply once every 60 days. Great for flowering and rooting assistance.', type: 'solid' },
  { id: 'egg_shells', name: 'Dried Crushed Egg Shells', nameNP: 'अण्डाको बोक्रा धुलो (ठोस)', defInterval: 60, qty: '1 tablespoon', notes: 'Calcium boost. Apply every 60 days scratch into soil.', type: 'solid' },
  { id: 'onion_peel', name: 'Onion & Banana Peel Water', nameNP: 'प्याज र केरा बोक्राको झोल', defInterval: 12, qty: '0.5 Liter (Diluted 1:5)', notes: 'High Potassium loop. Dilute 1 part peel tea with 5 parts pure water.', type: 'liquid' },
  { id: 'rice_water', name: "Rice Soaked Water (Liquid)", nameNP: 'चामल धोएको पानी (तरल)', defInterval: 7, qty: 'Undiluted drench', notes: 'Use once a week to completely replace regular morning watering.', type: 'liquid' },
  { id: 'epsom_foliar', name: 'Epsom Salt Foliar Spray (Magnesium)', nameNP: 'इप्सम नुन पात स्प्रे (म्याग्नेसियम)', defInterval: 15, qty: '1 tsp in 1L of water', notes: 'Instant rescue for interveinal chlorosis (yellowing between green veins) in Citrus. Spray leaves until wet early morning/late evening.', type: 'liquid' },
  { id: 'epsom_soil', name: 'Epsom Salt Soil Drench (Magnesium)', nameNP: 'इप्सम नुन जरा ड्रेन्च', defInterval: 30, qty: '0.5 tsp per pot in water', notes: 'Dissolve 1 tablespoon in 5L of water. Water the soil directly monthly.', type: 'liquid' },
  { id: 'wood_ash_coffee', name: 'Wood Ash + Used Coffee Grounds', nameNP: 'खरानी र कफी विकल्प मल', defInterval: 60, qty: '1 tbsp ash + 1 tbsp grounds', notes: 'Eco-friendly alternative to Epsom Salt. Supplies Magnesium/Calcium with gentle acidic balance once every 2 months.', type: 'solid' },
  { id: 'pgr', name: 'Plant Growth Regulator (PGR)', nameNP: 'PGR हारमोन स्प्रे', defInterval: 25, qty: 'Fine mist on leaves', notes: 'Max 2-3 times per season (budding, tiny green fruit, and 20 days later). Stop when fruits reach half-size.', type: 'liquid' },
  { id: 'custom', name: 'Custom Fertilizer Formulation', nameNP: 'अनुकूलित विशिष्ट मल', defInterval: 14, qty: 'As specified', notes: 'Use your own household mixtures or commercial NPK combinations.', type: 'custom' }
];

// Interactive Seasonal master calendar 90-day timeline items
const TIMELINE_STEPS = [
  { day: 1, name: 'Apply Solids', nameNP: 'ठोस मल दिने', time: 'Day 1', fertId: 'cow_dung', icon: '🟫', desc: 'Cow Dung, Vermicompost, Bone Meal blend. Scratch 1 inch.' },
  { day: 5, name: 'Spray PGR', nameNP: 'PGR हर्मोन स्प्रे', time: 'Day 5', fertId: 'pgr', icon: '🧪', desc: 'Apply fine mist on leaves early morning or late evening.' },
  { day: 10, name: 'Peel Water', nameNP: 'प्याज केरा झोल', time: 'Day 10', fertId: 'onion_peel', icon: '🍌', desc: 'Drench soil with diluted peel tea (dilution 1:5).' },
  { day: 15, name: 'Epsom Spray', nameNP: 'इप्सम नुन स्प्रे', time: 'Day 15', fertId: 'epsom_foliar', icon: '🧂', desc: 'Deficiency rescue! Spray foliage wet to fix yellowing veins.' },
  { day: 20, name: 'Second PGR', nameNP: 'दोस्रो PGR स्प्रे', time: 'Day 20', fertId: 'pgr', icon: '🧪', desc: 'Crucial if tiny fruits are starting to set on container stems.' },
  { day: 25, name: 'Rice Water', nameNP: 'चामल धोएको पानी', time: 'Day 25', fertId: 'rice_water', icon: '🍚', desc: 'Weekly morning soil drench. Replaces regular morning water.' },
  { day: 30, name: 'Repeat Solids', nameNP: 'पुनः ठोस मलजल', time: 'Day 30', fertId: 'vermicompost', icon: '🟫', desc: 'Repeat Cow dung/Vermicompost. strictly skip Bone Meal until Day 60.' },
];

export default function CareCalendar() {
  const navigate = useNavigate();
  const { 
    plants, 
    spaces,
    recordWatering, 
    recordFertilization, 
    addJournalEntry, 
    updateJournalEntry, 
    deleteJournalEntry,
    updatePlant
  } = useGarden();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  
  const [currentDate, setCurrentDate] = useState(new Date("2026-06-15")); // Base simulation date
  const [selectedDay, setSelectedDay] = useState<number>(15); // June 15
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [locale, setLocale] = useState<'EN' | 'NP'>('EN');
  const [activeTab, setActiveTab] = useState<'calendar' | 'lab' | 'tracker'>('calendar');

  // Interactive timeline selected bubble helper
  const [activeTimelineIdx, setActiveTimelineIdx] = useState<number>(3); // Default Day 15 Epsom

  // Quick Fertilize Selector states
  const [selPlantId, setSelPlantId] = useState<string>('');
  const [selFertId, setSelFertId] = useState<string>('epsom_foliar');
  const [custFertName, setCustFertName] = useState<string>('');
  const [custInterval, setCustInterval] = useState<number>(15);
  const [custQty, setCustQty] = useState<string>('1 teaspoon in 1L water');
  const [custNotes, setCustNotes] = useState<string>('Spray on foliage');

  const [generalLogs, setGeneralLogs] = useState<Array<{ id: string; date: string; category: string; title: string; notes: string }>>(() => {
    try {
      const saved = localStorage.getItem('garden-general-logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAddLog, setShowAddLog] = useState(false);
  const [logPlantId, setLogPlantId] = useState<string>('general');
  const [logCategory, setLogCategory] = useState<'general' | 'watering' | 'repotting' | 'fertilizing' | 'new-growth' | 'pest-treatment'>('general');
  const [logTitle, setLogTitle] = useState('');
  const [logNotes, setLogNotes] = useState('');

  // Editing direct log state
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthStr = String(month + 1).padStart(2, '0');
  const dayStr = String(selectedDay).padStart(2, '0');
  const dateStr = `${year}-${monthStr}-${dayStr}`;

  // Sync first plant ID on mount
  useEffect(() => {
    if (plants.length > 0 && !selPlantId) {
      setSelPlantId(plants[0].id);
    }
  }, [plants, selPlantId]);

  // Synchronize dynamic pre-fills when selecting different fertilizer models
  useEffect(() => {
    if (selFertId === 'custom') {
      setCustFertName(locale === 'EN' ? 'Custom Seaweed Liquid' : 'अनुकूलित लेउ मल');
      setCustInterval(14);
      setCustQty('50 ml');
      setCustNotes('Mix into water.');
    } else {
      const model = RECOMMENDED_FERTILIZERS.find(f => f.id === selFertId);
      if (model) {
        setCustFertName(locale === 'EN' ? model.name : model.nameNP);
        setCustInterval(model.defInterval);
        setCustQty(model.qty);
        setCustNotes(model.notes);
      }
    }
  }, [selFertId, locale]);

  // Converts standard digits / text to elegant translation formats
  const toNepaliDigits = (val: string | number) => {
    const nepaliDigits = ['०','१','२','३','४','५','६','७','८','९'];
    return String(val).split('').map(char => {
      const num = parseInt(char, 10);
      return isNaN(num) ? char : nepaliDigits[num];
    }).join('');
  };

  const tn = (val: string | number) => {
    if (locale === 'EN') return String(val);
    return toNepaliDigits(val);
  };

  const t = (key: keyof typeof EN_NP_TRANSLATIONS['EN']) => {
    return EN_NP_TRANSLATIONS[locale][key];
  };

  // SMARTEST FERTILIZATION FINDER: Automatically grabs from journals or defaults!
  const getNextFertilizationInfo = (p: Plant) => {
    let baseDateStr = p.lastFertilizedDate || "2026-06-15";
    let appliedFertilizerTitle = locale === 'EN' ? "Standard Feed" : "साधारण पोषण";
    
    // Scan matching journals
    if (p.journals) {
      const fertLogs = p.journals
        .filter(j => j.category === 'fertilizing')
        .sort((a, b) => b.date.localeCompare(a.date));
      if (fertLogs.length > 0) {
        baseDateStr = fertLogs[0].date;
        appliedFertilizerTitle = fertLogs[0].title;
      }
    }

    const lastFeed = new Date(baseDateStr);
    const intervalDays = p.fertilizerIntervalDays || 30;
    const nextFeed = new Date(lastFeed.getTime() + intervalDays * 24 * 60 * 60 * 1000);
    
    const yyyy = nextFeed.getFullYear();
    const mm = String(nextFeed.getMonth() + 1).padStart(2, '0');
    const dd = String(nextFeed.getDate()).padStart(2, '0');
    const nextDateStr = `${yyyy}-${mm}-${dd}`;

    // simulation anchor date: June 15, 2026
    const todaySim = new Date("2026-06-15");
    todaySim.setHours(0,0,0,0);
    nextFeed.setHours(0,0,0,0);
    
    const diffTime = nextFeed.getTime() - todaySim.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return {
      baseDateStr,
      nextDateStr,
      nextDayNum: nextFeed.getDate(),
      nextMonthNum: nextFeed.getMonth(),
      nextYearNum: nextFeed.getFullYear(),
      daysRemaining: diffDays,
      appliedFertilizerTitle,
      intervalDays
    };
  };

  const getCompletedActivitiesForDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const list: Array<{
      id: string;
      source: 'plant' | 'general';
      plantId?: string;
      plantName?: string;
      plantImage?: string;
      category: string;
      title: string;
      notes: string;
    }> = [];

    plants.forEach(p => {
      if (p.journals) {
        p.journals.forEach(j => {
          if (j.date === dateStr) {
            list.push({
              id: j.id,
              source: 'plant',
              plantId: p.id,
              plantName: p.name,
              plantImage: p.image,
              category: j.category,
              title: j.title,
              notes: j.notes
            });
          }
        });
      }
    });

    generalLogs.forEach(g => {
      if (g.date === dateStr) {
        list.push({
          id: g.id,
          source: 'general',
          category: g.category,
          title: g.title,
          notes: g.notes
        });
      }
    });

    return list;
  };

  const handleAddCustomLog = (e: React.FormEvent) => {
    e.preventDefault();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(selectedDay).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const defaultLabel = logCategory.charAt(0).toUpperCase() + logCategory.slice(1);
    const finalTitle = logTitle.trim() || `${defaultLabel} Log`;

    if (logPlantId === 'general') {
      const newGenLog = {
        id: `gen-${Date.now()}`,
        date: dateStr,
        category: logCategory,
        title: finalTitle,
        notes: logNotes.trim() || 'Custom general garden activity logged.'
      };
      const updated = [newGenLog, ...generalLogs];
      setGeneralLogs(updated);
      localStorage.setItem('garden-general-logs', JSON.stringify(updated));
    } else {
      addJournalEntry(logPlantId, {
        date: dateStr,
        category: logCategory,
        title: finalTitle,
        notes: logNotes.trim() || 'Custom care activity logged.'
      });

      if (logCategory === 'watering') {
        updatePlant(logPlantId, { lastWateredDate: dateStr, vitality: 100 });
      } else if (logCategory === 'fertilizing') {
        updatePlant(logPlantId, { lastFertilizedDate: dateStr, vitality: Math.min(100, (plants.find(pl => pl.id === logPlantId)?.vitality || 80) + 10) });
      } else if (logCategory === 'repotting') {
        updatePlant(logPlantId, { lastRepottedDate: dateStr });
      }
    }

    setLogTitle('');
    setLogNotes('');
    setShowAddLog(false);
  };

  // Perform dynamic, schedule-altering quick log of specified fertilizer!
  const submitQuickFertilizeLog = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selPlantId) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

    // Add journal log
    addJournalEntry(selPlantId, {
      date: dateStr,
      category: 'fertilizing',
      title: custFertName,
      notes: `${custQty} applied. ${custNotes}`
    });

    // Update plant intervals so next fertilize schedules dynamically!
    updatePlant(selPlantId, {
      lastFertilizedDate: dateStr,
      fertilizerIntervalDays: custInterval,
      vitality: 100
    });

    // Create action toast inside done list
    const actionDesc = locale === 'EN' 
      ? `Successfully applied "${custFertName}" to plant! Next dose calculated in ${custInterval} days.`
      : `सफलतापूर्वक "${custFertName}" प्रयोग गरियो! अर्को खुराक ${toNepaliDigits(custInterval)} दिनपछि तय भयो।`;

    alert(actionDesc);
  };

  const handleDeleteCompletedActivity = (activity: { id: string; source: 'plant' | 'general'; plantId?: string }) => {
    if (activity.source === 'general') {
      const updated = generalLogs.filter(g => g.id !== activity.id);
      setGeneralLogs(updated);
      localStorage.setItem('garden-general-logs', JSON.stringify(updated));
    } else if (activity.source === 'plant' && activity.plantId) {
      deleteJournalEntry(activity.plantId, activity.id);
    }
  };

  const handleSaveEditLog = (activity: { id: string; source: 'plant' | 'general'; plantId?: string }) => {
    if (activity.source === 'general') {
      const updated = generalLogs.map(g => g.id === activity.id ? { ...g, title: editTitle, notes: editNotes } : g);
      setGeneralLogs(updated);
      localStorage.setItem('garden-general-logs', JSON.stringify(updated));
    } else if (activity.source === 'plant' && activity.plantId) {
      updateJournalEntry(activity.plantId, activity.id, { title: editTitle, notes: editNotes });
    }
    setEditingActivityId(null);
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 15));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 15));
  };

  const getCareEventsForDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const queryDate = new Date(year, month, day);
    queryDate.setHours(0,0,0,0);
    const queryTime = queryDate.getTime();

    const waterPlants: Plant[] = [];
    const feedPlants: Plant[] = [];

    plants.forEach(p => {
      // Watering check
      if (p.lastWateredDate && p.wateringIntervalDays) {
        const lastWater = new Date(p.lastWateredDate);
        lastWater.setHours(0,0,0,0);
        const diffMs = queryTime - lastWater.getTime();
        const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
        
        if (diffDays >= 0 && diffDays % p.wateringIntervalDays === 0) {
          waterPlants.push(p);
        }
      }

      // Next fertilizing check dynamically computed based on live logs / defaults!
      const { nextDateStr, intervalDays } = getNextFertilizationInfo(p);
      const nextDate = new Date(nextDateStr);
      nextDate.setHours(0,0,0,0);
      const diffMs = queryTime - nextDate.getTime();
      const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

      if (diffDays >= 0 && diffDays % intervalDays === 0) {
        feedPlants.push(p);
      }
    });

    return { waterPlants, feedPlants };
  };

  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Weekday padding
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`pad-${i}`} className="h-18 bg-surface-container-low/20" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const isToday = d === 15 && 
                    currentDate.getMonth() === 5 && // June
                    currentDate.getFullYear() === 2026;
    
    const isSelected = selectedDay === d;
    const { waterPlants, feedPlants } = getCareEventsForDate(d);
    
    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
    const bsInfo = convertADtoBS(cellDate);

    days.push(
      <button
        key={d}
        onClick={() => {
          setSelectedDay(d);
          setIsModalOpen(true);
        }}
        className={`min-h-[4.5rem] sm:min-h-[5rem] h-auto border-t border-l border-outline-variant/10 p-1.5 flex flex-col justify-between items-start text-left transition-all hover:bg-surface-container-low/60 relative
          ${isToday ? 'bg-primary/5' : ''}
          ${isSelected ? 'ring-2 ring-primary bg-primary/10 z-10 font-bold' : ''}
        `}
      >
        <div className="flex justify-between items-center w-full">
          <span className={`text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors
            ${isToday ? 'bg-primary text-on-primary font-black shadow-sm' : 'text-on-surface-variant'}
            ${isSelected && !isToday ? 'bg-secondary text-on-secondary font-black' : ''}
          `}>
            {tn(d)}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.5 rounded leading-none">
            {toNepaliDigits(bsInfo.bsDay)}
          </span>
        </div>

        <div className="w-full flex flex-col gap-0.5 mt-1 overflow-hidden">
          {waterPlants.length > 0 && (
            <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[8px] font-extrabold px-1 py-0.5 rounded leading-tight truncate">
              <Droplets className="w-1.5 h-1.5 shrink-0 text-blue-500" />
              <span>{locale === 'EN' ? 'W' : 'सिं'}({tn(waterPlants.length)})</span>
            </div>
          )}
          {feedPlants.length > 0 && (
            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[8px] font-extrabold px-1 py-0.5 rounded leading-tight truncate">
              <Sparkles className="w-1.5 h-1.5 shrink-0 text-amber-500" />
              <span>{locale === 'EN' ? 'F' : 'मल'}({tn(feedPlants.length)})</span>
            </div>
          )}
        </div>
      </button>
    );
  }

  const selectedDayCare = getCareEventsForDate(selectedDay);
  const totalCareCount = selectedDayCare.waterPlants.length + selectedDayCare.feedPlants.length;

  return (
    <div className="bg-background min-h-screen flex flex-col pb-32">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <button onClick={openSidebar} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold text-lg sm:text-xl text-primary truncate">
            {t('careSchedule')}
          </h1>
        </div>

        {/* Global same-page English / Nepali Toggle */}
        <div className="flex items-center gap-1 bg-surface-container-high/70 p-0.5 rounded-xl border border-outline-variant/20 shadow-sm">
          <button
            onClick={() => setLocale('EN')}
            className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${locale === 'EN' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLocale('NP')}
            className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all ${locale === 'NP' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            नेपाली
          </button>
        </div>
      </header>

      <main className="pt-20 flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 space-y-6">
        {/* Modern Tabs Navigation Selector to reduce functional overload */}
        <div id="care-calendar-dashboard-navigation" className="flex flex-wrap items-center justify-start gap-1 p-1 bg-surface-container-high/60 dark:bg-surface-container-low/40 rounded-2xl border border-outline-variant/10 shadow-sm max-w-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === 'calendar'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{locale === 'EN' ? 'Calendar & Daily Tasks' : 'पात्रो र दैनिक कार्य'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === 'lab'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{locale === 'EN' ? 'Nutrient Lab & Guides' : 'मलजल प्रयोगशाला र निर्देशिका'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === 'tracker'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{locale === 'EN' ? 'Upcoming Tracker' : 'आगामी कार्य ट्र्याकर'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Calendar Card + Seasonal Master Timeline */}
          <div className={
            activeTab === 'tracker'
              ? 'hidden'
              : activeTab === 'calendar'
                ? 'lg:col-span-7 xl:col-span-8 space-y-6'
                : 'lg:col-span-7 space-y-6'
          }>
            {activeTab === 'calendar' && (
              /* English/Nepali Gregorian Calendar UI Card */
              <div className="bg-white dark:bg-surface-container-lowest rounded-3xl shadow-md border border-outline-variant/10 overflow-hidden flex flex-col">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/10 bg-slate-50/50 gap-2">
                <div className="space-y-0.5">
                  <h2 className="font-headline font-extrabold text-sm sm:text-base text-primary flex flex-wrap items-center gap-1.5 leading-tight">
                    <span>
                      {locale === 'EN' 
                        ? `${EN_NP_TRANSLATIONS.EN.months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                        : `${EN_NP_TRANSLATIONS.NP.months[currentDate.getMonth()]} ${toNepaliDigits(currentDate.getFullYear())}`
                      }
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                      {(() => {
                        const startD = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                        const endD = new Date(currentDate.getFullYear(), currentDate.getMonth(), totalDays);
                        const startBS = convertADtoBS(startD);
                        const endBS = convertADtoBS(endD);
                        const mStart = locale === 'EN' ? EN_NP_TRANSLATIONS.EN.nepaliMonths[startBS.bsMonthIdx] : EN_NP_TRANSLATIONS.NP.nepaliMonths[startBS.bsMonthIdx];
                        const mEnd = locale === 'EN' ? EN_NP_TRANSLATIONS.EN.nepaliMonths[endBS.bsMonthIdx] : EN_NP_TRANSLATIONS.NP.nepaliMonths[endBS.bsMonthIdx];
                        return mStart === mEnd 
                          ? `${mStart} ${tn(startBS.bsYear)} B.S.`
                          : `${mStart} - ${mEnd} ${tn(startBS.bsYear)} B.S.`;
                      })()}
                    </span>
                  </h2>
                </div>
                  <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-surface-container rounded-lg transition-colors">
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentDate(new Date("2026-06-15"));
                        setSelectedDay(15);
                      }} 
                      className="px-2.5 py-1 bg-primary/15 text-primary text-[10px] font-bold uppercase rounded"
                    >
                      {t('goToToday')}
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-surface-container rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Localized Week Headers */}
                <div className="grid grid-cols-7 border-b border-outline-variant/10 bg-surface-container-low/20">
                  {EN_NP_TRANSLATIONS[locale].weekdays.map((day, idx) => (
                    <div key={idx} className="py-2 text-center text-[10px] font-black uppercase text-on-surface-variant tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days Grid Rendering */}
                <div className="grid grid-cols-7 border-r border-b border-outline-variant/5 bg-surface-container-lowest">
                  {days}
                </div>
              </div>
            )}

            {activeTab === 'lab' && (
              <>
                {/* EXPERT ADVISOR: Interveinal Chlorosis & Magnesium Guidance */}
                <div className="bg-amber-50/30 dark:bg-amber-950/10 rounded-3xl border border-amber-200/50 p-5 space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute right-[-10px] top-[-10px] text-amber-500/10 pointer-events-none">
                  <Sprout className="w-32 h-32" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-800 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-amber-900 flex items-center gap-2">
                      {t('magnesiumAdvisor')}
                    </h3>
                    <p className="text-xs text-amber-800/80 leading-relaxed mt-1">
                      {locale === 'EN'
                        ? "Warning: Homemade peel waters provide Potassium, but NOT Magnesium. Citrus container plants are Magnesium-hungry! Without it, leaves suffer interveinal chlorosis (yellowing between deep green veins), starting precisely like your plant is showing now."
                        : "चेतावनी: घरमै बनाइने प्याज/केराको बोक्राको झोलले पोटासियम दिन्छ तर सुन्तला र कागती वर्गका बिरुवालाई अति आवश्यक 'म्याग्नेसियम' पुग्दैन। म्याग्नेसियम नभए पातको सिराहरू हरियो र बाँकी भाग पहेंलो हुन्छ (इन्टरभिनल क्लोरोसिस)। र यो पहेंलोपन तपाईको बिरुवामा सुरु भइसकेको छ।"
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                  <div className="bg-white dark:bg-surface-container-lowest p-3.5 rounded-2xl border border-amber-100">
                    <h4 className="text-[11px] font-bold uppercase text-amber-800 tracking-wide flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Epsom Salt (Magnesium Sulfate) Fast Relief
                    </h4>
                    <ul className="text-[11px] text-on-surface-variant space-y-1 leading-relaxed">
                      <li>• <strong>Foliar Mist:</strong> Dissolve 1 tsp in 1L water; spray wet. Every 15 days until leaves turn deep green.</li>
                      <li>• <strong>Soil Drench:</strong> Dissolve 1/2 tsp per pot once a month.</li>
                      <li>• <strong>Expiry:</strong> Pure mineral chemically stable; never expires even if clumping occurs! Keep airtight.</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-surface-container-lowest p-3.5 rounded-2xl border border-amber-100">
                    <h4 className="text-[11px] font-bold uppercase text-amber-800 tracking-wide flex items-center gap-1.5 mb-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      Homemade Alternative Recipe
                    </h4>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      If Epsom Salt is unavailable, mix <strong>1 tbsp of Wood Ash</strong> (contains Magnesium/Calcium) and <strong>1 tbsp of used Coffee Grounds</strong> (maintains acidic soil balance for citrus root absorption). Repeat once every 2 months.
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-amber-200/50 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-amber-500/5 -mx-5 -mb-5 px-5 py-3">
                  <div className="flex items-center gap-2 text-[11px] text-amber-800">
                    <Clock className="w-3.5 h-3.5" />
                    <span><strong>Timing:</strong> Spray early AM (&lt;7:00) or late PM (&gt;17:30) when leaf stomata are wide open. Avoid midday sun!</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-amber-800">
                    <CloudRain className="w-3.5 h-3.5" />
                    <span><strong>Rain:</strong> Reapply if it rains within 2h. Safe after 4h.</span>
                  </div>
                </div>
              </div>

              {/* 90-DAY SEASONAL TIMELINE SLIDER (Full interactive integration) */}
              <div className="bg-white dark:bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/10 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-bold text-sm text-primary flex items-center gap-1.5">
                    <Clipboard className="w-4 h-4 text-primary" />
                    {t('placeholder_timeline_text' as any) || t('fertilizerTimeline')}
                  </h3>
                  <span className="text-[10px] bg-secondary/10 text-secondary font-black px-2.5 py-0.5 rounded-full uppercase">
                    {locale === 'EN' ? "90-Day Loop" : "९०-दिने चक्र"}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {locale === 'EN'
                    ? "Care cycle prevents nutrient overload. Spacing rules: Wait at least 3-5 days between treatments. Tap any milestone below to configure and instantly apply it to your calendar!"
                    : "कडा पोषण दबावबाट बच्न उपचारको अन्तराल ३ देखि ५ दिनको हुनुपर्दछ। कुनै पनि चरणमा क्लिक गरी सोझै क्यालेन्डरमा दर्ता गर्नुहोस्!"}
                </p>

                {/* Horizontal Strip */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 py-2 scrollbar-thin px-1">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isActive = activeTimelineIdx === idx;
                    return (
                      <button
                        key={step.day}
                        onClick={() => {
                          setActiveTimelineIdx(idx);
                          setSelFertId(step.fertId);
                        }}
                        className={`flex flex-col items-center p-3 rounded-2xl border text-center cursor-pointer min-w-[76px] transition-all
                          ${isActive 
                            ? 'bg-secondary text-white border-secondary shadow-md scale-105' 
                            : 'bg-surface-container border-outline-variant/10 text-on-surface hover:bg-surface-container-high'
                          }
                        `}
                      >
                        <span className="text-lg">{step.icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-wider block mt-1">
                          {locale === 'EN' ? step.time : toNepaliDigits(step.day) + " औं दिन"}
                        </span>
                        <span className="text-[10px] font-bold block truncate max-w-[70px] mt-0.5">
                          {locale === 'EN' ? step.name : step.nameNP}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Timeline Description and quick application button */}
                <div className="bg-surface-container-low p-4 rounded-2xl border border-secondary/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase bg-secondary/15 text-secondary px-2 py-0.5 rounded-full inline-block">
                      {locale === 'EN' ? "Timeline Stage Details" : "चक्र विवरण"}
                    </span>
                    <h4 className="text-xs font-bold text-on-surface">
                      {locale === 'EN' ? TIMELINE_STEPS[activeTimelineIdx].name : TIMELINE_STEPS[activeTimelineIdx].nameNP} - {locale === 'EN' ? TIMELINE_STEPS[activeTimelineIdx].time : toNepaliDigits(TIMELINE_STEPS[activeTimelineIdx].day) + " दिन"}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      {TIMELINE_STEPS[activeTimelineIdx].desc}
                    </p>
                  </div>
                  
                  {/* Timeline quick apply button */}
                  <button
                    onClick={() => {
                      if (plants.length > 0) {
                        submitQuickFertilizeLog();
                      } else {
                        alert("No plants found in garden to fertilize!");
                      }
                    }}
                    className="whitespace-nowrap px-4 py-2 bg-secondary text-white hover:bg-secondary/95 text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{locale === 'EN' ? "Log This Step Now" : "सोझै सुरक्षित गर्नुहोस्"}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

            {/* Right Column: Next Fertilizer schedules & Agenda List */}
            <div className={
              activeTab === 'tracker'
                ? 'lg:col-span-12 space-y-6'
                : activeTab === 'calendar'
                  ? 'lg:col-span-5 xl:col-span-4 space-y-6'
                  : 'lg:col-span-5 space-y-6'
            }>
              
              {activeTab === 'tracker' && (
                /* AUTOMATIC NEXT TIMES TO FERTILIZE PANEL (Mandatory Requirement) */
                <div className="bg-white dark:bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/10 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                  <h3 className="font-headline font-bold text-sm text-primary flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    {t('upcomingFertilizers')}
                  </h3>
                  <span className="text-[9px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                    {locale === 'EN' ? "Auto-Track" : "स्वचालित ट्र्याक"}
                  </span>
                </div>

                <div className={activeTab === 'tracker' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3 max-h-[350px] overflow-y-auto scrollbar-thin"}>
                  {plants.map(p => {
                    const info = getNextFertilizationInfo(p);
                    const isDueToday = info.daysRemaining <= 0;
                    
                    return (
                      <div key={p.id} className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/20 transition-all flex flex-col justify-between gap-2.5">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-11 h-11 rounded-full object-cover border border-outline" alt="" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-on-surface leading-tight truncate">{p.name}</h4>
                            <p className="text-[10px] text-on-surface-variant italic truncate">{p.scientificName}</p>
                            <p className="text-[10px] text-gray-500 font-bold mt-1 max-w-[200px] truncate">
                              🧩 {locale === 'EN' ? "Last Logged:" : "अघिल्लो पटक:"} {info.appliedFertilizerTitle} ({locale === 'EN' ? "Interval:" : "चक्र:"} {tn(info.intervalDays)}d)
                            </p>
                          </div>
                          
                          {/* Next Fertilizer Date state */}
                          <div className="text-right">
                            <span className="text-[10px] text-gray-600 block leading-none font-bold mb-1">
                              {t('nextFeedLabel')}
                            </span>
                            <span className="text-xs font-black text-secondary block leading-none">
                              {locale === 'EN'
                                ? `${info.nextDateStr.split('-')[1]}/${info.nextDateStr.split('-')[2]}`
                                : `${toNepaliDigits(info.nextDateStr.split('-')[1])}/${toNepaliDigits(info.nextDateStr.split('-')[2])}`
                              }
                            </span>
                          </div>
                        </div>

                        {/* Automatic Time Remaining details */}
                        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-2.5">
                          <div className="flex items-center gap-1 text-[10px] font-black">
                            {isDueToday ? (
                              <span className="text-orange-600 bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {locale === 'EN' ? "⚠️ FEED DUE NOW" : "⚠️ अहिले मल दिने समय भयो"}
                              </span>
                            ) : (
                              <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {locale === 'EN' ? `Due in ${info.daysRemaining} days` : `${toNepaliDigits(info.daysRemaining)} दिन बाँकी`}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              setSelPlantId(p.id);
                              // Highlight & focus quick adding section
                              const element = document.getElementById("fertilizer-lab-section");
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="text-[10px] font-black hover:underline text-primary flex items-center gap-1"
                          >
                            <span>{locale === 'EN' ? "Apply Nutrients" : "मल छान्नुहोस्"}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {plants.length === 0 && (
                    <p className="text-xs text-on-surface-variant/70 italic text-center py-6">{locale === 'EN' ? "No plants registered in garden." : "कुनै बिरुवा फेला परेन।"}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'lab' && (
              /* DYNAMIC QUICK LOG FERTILIZER APPLICATION FORM (Mandatory requirement: option to adding other fertilizers) */
              <div id="fertilizer-lab-section" className="bg-white dark:bg-surface-container-lowest p-5 rounded-3xl border border-primary/20 space-y-4 shadow-md bg-emerald-50/5">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-bold text-sm text-primary flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-primary" />
                    {t('fertilizerLabTitle')}
                  </h3>
                  <span className="text-[9px] bg-primary text-on-primary font-bold px-2 py-0.5 rounded-full uppercase">
                    {locale === 'EN' ? "Lab" : "मलजल प्रयोगशाला"}
                  </span>
                </div>

                <form onSubmit={submitQuickFertilizeLog} className="space-y-3 text-left">
                  {/* Select Plant */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-on-surface-variant">{t('selectPlant')}</label>
                    <select
                      value={selPlantId}
                      onChange={e => setSelPlantId(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/25 rounded-xl py-2 px-3 text-xs font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {plants.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.scientificName})</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Recommended / custom fertilizer types */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-on-surface-variant">
                      {locale === 'EN' ? "Select Fertilizer Variety" : "मलको प्रकार चयन"}
                    </label>
                    <select
                      value={selFertId}
                      onChange={e => setSelFertId(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/25 rounded-xl py-2 px-3 text-xs font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {RECOMMENDED_FERTILIZERS.map(f => (
                        <option key={f.id} value={f.id}>
                          {locale === 'EN' ? f.name : f.nameNP} ({f.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Editable Fertilizer parameters */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-on-surface-variant">{t('titleLabel')}</label>
                    <input
                      type="text"
                      required
                      value={custFertName}
                      onChange={e => setCustFertName(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/25 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-on-surface-variant">{t('intervalHeading')}</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="365"
                        value={custInterval}
                        onChange={e => setCustInterval(parseInt(e.target.value, 10) || 15)}
                        className="w-full bg-surface-container border border-outline-variant/25 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-on-surface-variant">{t('qtyHeading')}</label>
                      <input
                        type="text"
                        required
                        value={custQty}
                        onChange={e => setCustQty(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant/25 rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-on-surface-variant">{t('notesDetails')}</label>
                    <textarea
                      value={custNotes}
                      onChange={e => setCustNotes(e.target.value)}
                      rows={2}
                      className="w-full bg-surface-container border border-outline-variant/25 rounded-xl py-2 px-3 text-xs text-on-surface resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary text-on-primary hover:bg-primary/95 text-xs font-black rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t('saveLog')}</span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'calendar' && (
              /* Selected Day Agenda Detail panel (Shared) */
              <div className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/10 space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    {t('agendaFor')} {locale === 'EN' ? t('months')[currentDate.getMonth()] : t('months')[currentDate.getMonth()]} {tn(selectedDay)}
                  </h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase">
                    {tn(totalCareCount)} {t('actionsDue')}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Water section */}
                  <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/5">
                    <h4 className="font-bold text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-2">
                      <Droplets className="w-3.5 h-3.5" />
                      {t('wateringNeeded')} ({tn(selectedDayCare.waterPlants.length)})
                    </h4>
                    {selectedDayCare.waterPlants.length > 0 ? (
                      <div className="space-y-2">
                        {selectedDayCare.waterPlants.map(p => {
                          const isWatered = p.journals?.some(j => j.date === dateStr && j.category === 'watering');
                          const journal = p.journals?.find(j => j.date === dateStr && j.category === 'watering');
                          return (
                            <div key={p.id} className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10 space-y-2">
                              <div className="flex justify-between items-center text-xs text-on-surface">
                                <div className="flex items-center gap-2 min-w-0">
                                  <img src={p.image} className="w-7 h-7 rounded-full object-cover shrink-0 border border-outline-variant/10" alt="" />
                                  <span className="font-bold text-xs truncate max-w-[120px]">{p.name}</span>
                                </div>
                                {isWatered ? (
                                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[9px] font-black rounded-md flex items-center gap-0.5 shadow-sm border border-emerald-500/15">
                                    ✓ {locale === 'EN' ? 'Done' : 'सम्पन्न'}
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => recordWatering(p.id, dateStr)}
                                    className="py-1 px-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-[10px] font-black rounded-full active:scale-95 transition-all"
                                  >
                                    {locale === 'EN' ? 'Water' : 'पानी हाल्ने'}
                                  </button>
                                )}
                              </div>
                              {isWatered && journal && (
                                <div className="pt-1.5 border-t border-dashed border-outline-variant flex gap-1 items-center">
                                  <input
                                    type="text"
                                    defaultValue={journal.notes}
                                    placeholder={locale === 'EN' ? "Log details (e.g. wiped dust)" : "विवरण थप्नुहोस्"}
                                    onChange={(e) => updateJournalEntry(p.id, journal.id, { notes: e.target.value })}
                                    className="w-full bg-white dark:bg-surface-container-lowest text-[10px] p-1 border border-outline-variant/20 rounded-md focus:outline-none text-on-surface"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] text-on-surface-variant/60 italic px-1">{locale === 'EN' ? "No watering needed on this day." : "यस दिन सिंचाई आवश्यक छैन।"}</p>
                    )}
                  </div>

                  {/* Fertilizer section */}
                  <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/5">
                    <h4 className="font-bold text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('nourishmentFeed')} ({tn(selectedDayCare.feedPlants.length)})
                    </h4>
                    {selectedDayCare.feedPlants.length > 0 ? (
                      <div className="space-y-2">
                        {selectedDayCare.feedPlants.map(p => {
                          const isFed = p.journals?.some(j => j.date === dateStr && j.category === 'fertilizing');
                          const journal = p.journals?.find(j => j.date === dateStr && j.category === 'fertilizing');
                          return (
                            <div key={p.id} className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10 space-y-2">
                              <div className="flex justify-between items-center text-xs text-on-surface">
                                <div className="flex items-center gap-2 min-w-0">
                                  <img src={p.image} className="w-7 h-7 rounded-full object-cover shrink-0 border border-outline-variant/10" alt="" />
                                  <span className="font-bold text-xs truncate max-w-[120px]">{p.name}</span>
                                </div>
                                {isFed ? (
                                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[9px] font-black rounded-md flex items-center gap-0.5 shadow-sm border border-emerald-500/15">
                                    ✓ {locale === 'EN' ? 'Done' : 'सम्पन्न'}
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => recordFertilization(p.id, dateStr)}
                                    className="py-1 px-2.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-[10px] font-black rounded-full active:scale-95 transition-all"
                                  >
                                    {locale === 'EN' ? 'Feed' : 'मल दिने'}
                                  </button>
                                )}
                              </div>
                              {isFed && journal && (
                                <div className="pt-1.5 border-t border-dashed border-outline-variant flex gap-1 items-center">
                                  <input
                                    type="text"
                                    defaultValue={journal.notes}
                                    placeholder={locale === 'EN' ? "Log details (e.g. used wood ash)" : "विवरण थप्नुहोस्"}
                                    onChange={(e) => updateJournalEntry(p.id, journal.id, { notes: e.target.value })}
                                    className="w-full bg-white dark:bg-surface-container-lowest text-[10px] p-1 border border-outline-variant/20 rounded-md focus:outline-none text-on-surface"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] text-on-surface-variant/60 italic px-1">{locale === 'EN' ? "No schedule calculated." : "यस दिन मलजल तालिका छैन।"}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-outline-variant/10 my-3" />

                {/* History list for selected date */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-[11px] text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      {t('completedActivities')} ({tn(getCompletedActivitiesForDate(selectedDay).length)})
                    </h4>
                    <button
                      onClick={() => setShowAddLog(!showAddLog)}
                      className="px-2 py-1 bg-primary text-on-primary text-[9px] font-black rounded"
                    >
                      + {locale === 'EN' ? "Add Log" : "कार्य दर्ता"}
                    </button>
                  </div>

                  {/* Standard done activity form */}
                  <AnimatePresence>
                    {showAddLog && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddCustomLog}
                        className="bg-surface-container-lowest p-3 rounded-2xl border border-primary/20 space-y-3 overflow-hidden text-left"
                      >
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-on-surface-variant">{t('selectPlant')}</label>
                          <select
                            value={logPlantId}
                            onChange={e => setLogPlantId(e.target.value)}
                            className="w-full bg-surface-container border-none rounded-xl py-1 px-2 text-xs text-on-surface"
                          >
                            <option value="general">Garden-Wide Log</option>
                            {plants.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-on-surface-variant">{t('category')}</label>
                          <select
                            value={logCategory}
                            onChange={e => setLogCategory(e.target.value as any)}
                            className="w-full bg-surface-container border-none rounded-xl py-1 px-2 text-xs text-on-surface"
                          >
                            <option value="general">General</option>
                            <option value="watering">Watering</option>
                            <option value="fertilizing">Fertilizing</option>
                            <option value="repotting">Repotting</option>
                            <option value="pest-treatment">Pest treatment</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-on-surface-variant">{t('titleLabel')}</label>
                          <input
                            type="text"
                            required
                            value={logTitle}
                            onChange={e => setLogTitle(e.target.value)}
                            placeholder="Wiped dust, leaf shine, NPK..."
                            className="w-full bg-surface-container border-none rounded-xl py-1.5 px-2 text-xs text-on-surface"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-on-surface-variant">{t('notesDetails')}</label>
                          <input
                            type="text"
                            required
                            value={logNotes}
                            onChange={e => setLogNotes(e.target.value)}
                            className="w-full bg-surface-container border-none rounded-xl py-1.5 px-2 text-xs text-on-surface"
                          />
                        </div>

                        <div className="flex justify-end gap-1.5 pt-1">
                          <button type="submit" className="px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded">
                            {t('saveLog')}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin">
                    {getCompletedActivitiesForDate(selectedDay).map(activity => (
                      <div key={activity.id} className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/10 text-left relative">
                        {editingActivityId === activity.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              className="w-full bg-surface-container text-xs p-1 rounded"
                            />
                            <textarea
                              value={editNotes}
                              onChange={e => setEditNotes(e.target.value)}
                              className="w-full bg-surface-container text-xs p-1 rounded resize-none h-12"
                            />
                            <div className="flex justify-end gap-1">
                              <button onClick={() => setEditingActivityId(null)} className="px-2 py-0.5 bg-gray-200 text-[9px] font-bold rounded">Cancel</button>
                              <button onClick={() => handleSaveEditLog(activity)} className="px-2 py-0.5 bg-primary text-white text-[9px] font-bold rounded">Save</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded">
                              {activity.plantName || "Garden-Wide"} • {activity.category}
                            </span>
                            <h5 className="font-bold text-xs mt-1 text-on-surface leading-tight">{activity.title}</h5>
                            <p className="text-[10px] text-on-surface-variant/90 leading-tight mt-0.5">{activity.notes}</p>
                            
                            <div className="absolute right-1 top-1 flex items-center">
                              <button 
                                onClick={() => {
                                  setEditingActivityId(activity.id);
                                  setEditTitle(activity.title);
                                  setEditNotes(activity.notes);
                                }}
                                className="p-1 text-gray-400 hover:text-primary"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button onClick={() => handleDeleteCompletedActivity(activity)} className="p-1 text-gray-400 hover:text-red-500">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {getCompletedActivitiesForDate(selectedDay).length === 0 && (
                      <p className="text-[10px] text-on-surface-variant/60 italic text-center py-2">{locale === 'EN' ? "No achievements logged." : "कुनै गतिविधिको इतिहास छैन।"}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Unified bottom legend */}
        <div className="flex items-center gap-6 justify-center bg-surface-container-low/50 py-3 px-6 rounded-2xl border border-outline-variant/5 max-w-sm mx-auto shadow-sm">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-on-surface-variant">
            <div className="w-2.5 h-2.5 rounded bg-blue-500" />
            <span>{locale === 'EN' ? 'Water' : 'सिंचाई'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-on-surface-variant">
            <div className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span>{locale === 'EN' ? 'Fertilization' : 'मलजल'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-on-surface-variant">
            <div className="w-2.5 h-2.5 rounded bg-primary" />
            <span>{locale === 'EN' ? 'Selected Day' : 'चयनित गते'}</span>
          </div>
        </div>
      </main>

      {/* Dynamic Overlay Care Details Popup Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-surface-container-low max-w-2xl w-full rounded-2xl shadow-2xl border border-outline-variant/15 flex flex-col max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-outline-variant/10 flex items-center justify-between bg-slate-50/50 dark:bg-surface-container-high/40">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wider">
                    {locale === 'EN' ? "Care Date Details" : "हेरचाह विवरण"}
                  </span>
                  <h3 className="font-headline font-bold text-base sm:text-lg text-primary flex flex-wrap items-center gap-1.5 leading-tight">
                    <span>
                      {locale === 'EN'
                        ? `${EN_NP_TRANSLATIONS.EN.months[currentDate.getMonth()]} ${selectedDay}, ${currentDate.getFullYear()}`
                        : `${EN_NP_TRANSLATIONS.NP.months[currentDate.getMonth()]} ${toNepaliDigits(selectedDay)}, ${toNepaliDigits(currentDate.getFullYear())}`
                      }
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-medium">
                      {(() => {
                        const cellD = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
                        const bs = convertADtoBS(cellD);
                        const mName = locale === 'EN' ? EN_NP_TRANSLATIONS.EN.nepaliMonths[bs.bsMonthIdx] : EN_NP_TRANSLATIONS.NP.nepaliMonths[bs.bsMonthIdx];
                        return locale === 'EN'
                          ? `${mName} ${bs.bsDay}, ${bs.bsYear} B.S.`
                          : `${mName} ${toNepaliDigits(bs.bsDay)}, ${toNepaliDigits(bs.bsYear)} बि.सं.`;
                      })()}
                    </span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-surface-container rounded-full transition-all text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left custom-scrollbar">
                {/* Stats Section: Total plants to care + locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/50 dark:bg-emerald-950/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-950/30">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-lg text-emerald-800 dark:text-emerald-400">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-bold leading-none">
                        {locale === 'EN' ? "Plants Needing Care" : "हेरचाह गर्नुपर्ने संख्या"}
                      </span>
                      <span className="text-sm font-black text-on-surface">
                        {(() => {
                          const wCount = selectedDayCare.waterPlants.length;
                          const fCount = selectedDayCare.feedPlants.length;
                          // Distinct count
                          const uniquePlantsOnDayMap = new Map<string, Plant>();
                          selectedDayCare.waterPlants.forEach(p => uniquePlantsOnDayMap.set(p.id, p));
                          selectedDayCare.feedPlants.forEach(p => uniquePlantsOnDayMap.set(p.id, p));
                          const careCount = uniquePlantsOnDayMap.size;
                          return locale === 'EN' 
                            ? `${careCount} ${careCount === 1 ? 'Plant' : 'Plants'}`
                            : `${toNepaliDigits(careCount)} बिरुवा`;
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 border-t sm:border-t-0 sm:border-l border-outline-variant/15 pt-2.5 sm:pt-0 sm:pl-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-950/50 rounded-lg text-amber-800 dark:text-amber-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-bold leading-none">
                        {locale === 'EN' ? "Respective Locations" : "सम्बन्धित स्थानहरू"}
                      </span>
                      <span className="text-xs font-black text-on-surface truncate block max-w-[200px]" title={(() => {
                        const uniquePlantsOnDayMap = new Map<string, Plant>();
                        selectedDayCare.waterPlants.forEach(p => uniquePlantsOnDayMap.set(p.id, p));
                        selectedDayCare.feedPlants.forEach(p => uniquePlantsOnDayMap.set(p.id, p));
                        const uniquePlants = Array.from(uniquePlantsOnDayMap.values());
                        const locs = Array.from(new Set(
                          uniquePlants.map(p => {
                            const space = spaces.find(s => s.id === p.spaceId);
                            return space ? space.name : (p.habitat || 'Garden');
                          })
                        ));
                        return locs.length > 0 ? locs.join(', ') : (locale === 'EN' ? 'No locations' : 'कुनै स्थान छैन');
                      })()}>
                        {(() => {
                          const uniquePlantsOnDayMap = new Map<string, Plant>();
                          selectedDayCare.waterPlants.forEach(p => uniquePlantsOnDayMap.set(p.id, p));
                          selectedDayCare.feedPlants.forEach(p => uniquePlantsOnDayMap.set(p.id, p));
                          const uniquePlants = Array.from(uniquePlantsOnDayMap.values());
                          const locs = Array.from(new Set(
                            uniquePlants.map(p => {
                              const space = spaces.find(s => s.id === p.spaceId);
                              return space ? space.name : (p.habitat || 'Garden');
                            })
                          ));
                          return locs.length > 0 ? locs.join(', ') : (locale === 'EN' ? 'No locations' : 'कुनै स्थान छैन');
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agenda Details Section */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Clipboard className="w-4 h-4 text-primary" />
                    <span>{locale === 'EN' ? "Daily Agendas & Plans" : "दैनिक कार्यतालिका र योजना"}</span>
                  </h4>
                  <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/10 space-y-1.5 text-xs text-on-surface-variant">
                    {selectedDayCare.waterPlants.length === 0 && selectedDayCare.feedPlants.length === 0 ? (
                      <p className="italic text-gray-500">{locale === 'EN' ? "No care tasks scheduled for this date." : "यस दिन कुनै पनि कार्यतालिका खाली छ।"}</p>
                    ) : (
                      <ul className="space-y-1.5 list-disc pl-4">
                        {selectedDayCare.waterPlants.map(p => {
                          const locName = spaces.find(s => s.id === p.spaceId)?.name || p.habitat || 'Garden';
                          return (
                            <li key={`water-agenda-${p.id}`}>
                              {locale === 'EN' 
                                ? `Water ${p.name} situated in ${locName}` 
                                : `${locName} मा रहेको ${p.name} मा सिंचाई (पानी हाल्नुहोस्)`
                              }
                            </li>
                          );
                        })}
                        {selectedDayCare.feedPlants.map(p => {
                          const locName = spaces.find(s => s.id === p.spaceId)?.name || p.habitat || 'Garden';
                          const fertInfo = getNextFertilizationInfo(p);
                          return (
                            <li key={`feed-agenda-${p.id}`} className="text-amber-800 dark:text-amber-300 font-medium">
                              {locale === 'EN'
                                ? `Apply nutrient feeds to ${p.name} in ${locName} (${fertInfo.appliedFertilizerTitle})`
                                : `${locName} मा रहेको ${p.name} मा मलजल थप्नुहोस् (${fertInfo.appliedFertilizerTitle})`
                              }
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Watering Schedule list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <Droplets className="w-4 h-4" />
                    <span>{locale === 'EN' ? "Watering Schedule" : "सिंचाई कार्यतालिका"}</span>
                  </h4>
                  {selectedDayCare.waterPlants.length > 0 ? (
                    <div className="space-y-2">
                       {selectedDayCare.waterPlants.map(p => {
                        const locName = spaces.find(s => s.id === p.spaceId)?.name || p.habitat || 'Garden';
                        const isWatered = p.journals?.some(j => j.date === dateStr && j.category === 'watering');
                        const journal = p.journals?.find(j => j.date === dateStr && j.category === 'watering');
                        return (
                          <div key={`modal-water-${p.id}`} className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-surface-container-lowest border border-outline-variant/10 text-xs text-on-surface space-y-2">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-3 min-w-0">
                                <img src={p.image} className="w-9 h-9 rounded-full object-cover shrink-0 border border-outline" alt="" />
                                <div className="min-w-0">
                                  <span className="font-bold truncate block">{p.name}</span>
                                  <button
                                    type="button" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (p.spaceId) {
                                        navigate(`/space/${p.spaceId}`);
                                      } else {
                                        navigate(`/room-planner`);
                                      }
                                    }}
                                    className="text-[10px] text-gray-500 hover:text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer transition-colors text-left"
                                    title={locale === 'EN' ? "Go to room space details" : "कोठा विवरण हेर्नुहोस्"}
                                  >
                                    <MapPin className="w-3" /> 
                                    <span className="font-bold underline decoration-dotted">{locName}</span>
                                  </button>
                                </div>
                              </div>
                              {isWatered ? (
                                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-black rounded-lg flex items-center gap-0.5 shadow-sm border border-emerald-500/15">
                                  ✓ {locale === 'EN' ? 'Done' : 'सम्पन्न'}
                                </span>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => {
                                    recordWatering(p.id, dateStr);
                                  }}
                                  className="py-1.5 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 text-[10px] font-black rounded-full transition-all shrink-0 active:scale-95"
                                >
                                  {locale === 'EN' ? 'Water' : 'सिंचाई गर्नुहोस्'}
                                </button>
                              )}
                            </div>
                            {isWatered && journal && (
                              <div className="pt-2 border-t border-dashed border-outline-variant flex gap-1.5 items-center w-full">
                                <span className="text-[9px] text-emerald-600 font-bold shrink-0">{locale === 'EN' ? "Log:" : "टिप्पणी:"}</span>
                                <input
                                  type="text"
                                  defaultValue={journal.notes}
                                  placeholder={locale === 'EN' ? "Type notes (e.g., added misting)..." : "टिप्पणी लेख्नुहोस्..."}
                                  onChange={(e) => updateJournalEntry(p.id, journal.id, { notes: e.target.value })}
                                  className="flex-1 bg-white dark:bg-surface-container text-[10px] p-1 border border-outline-variant/20 rounded focus:outline-none text-on-surface"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-on-surface-variant/60 italic pl-1">{locale === 'EN' ? "No watering needed on this day." : "यस दिन सम्बन्धि कुनै बिरुवालाई सिंचाई आवश्यक छैन।"}</p>
                  )}
                </div>

                {/* Fertilizers Needed List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4" />
                    <span>{locale === 'EN' ? "Fertilizers Needed" : "मलखादको आवश्यकता"}</span>
                  </h4>
                  {selectedDayCare.feedPlants.length > 0 ? (
                     <div className="space-y-2">
                      {selectedDayCare.feedPlants.map(p => {
                        const locName = spaces.find(s => s.id === p.spaceId)?.name || p.habitat || 'Garden';
                        const fertInfo = getNextFertilizationInfo(p);
                        const isFed = p.journals?.some(j => j.date === dateStr && j.category === 'fertilizing');
                        const journal = p.journals?.find(j => j.date === dateStr && j.category === 'fertilizing');
                        return (
                          <div key={`modal-feed-${p.id}`} className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-surface-container-lowest border border-outline-variant/10 text-xs text-on-surface space-y-2">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-3 min-w-0">
                                <img src={p.image} className="w-9 h-9 rounded-full object-cover shrink-0 border border-outline" alt="" />
                                <div className="min-w-0">
                                  <span className="font-bold truncate block">{p.name}</span>
                                  <span className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold block leading-none mb-1">
                                    🧪 {fertInfo.appliedFertilizerTitle} ({locale === 'EN' ? "Interval:" : "अन्तर:"} {tn(fertInfo.intervalDays)}d)
                                  </span>
                                  <button
                                    type="button" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (p.spaceId) {
                                        navigate(`/space/${p.spaceId}`);
                                      } else {
                                        navigate(`/room-planner`);
                                      }
                                    }}
                                    className="text-[10px] text-gray-500 hover:text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer transition-colors text-left"
                                    title={locale === 'EN' ? "Go to room space details" : "कोठा विवरण हेर्नुहोस्"}
                                  >
                                    <MapPin className="w-3" /> 
                                    <span className="font-bold underline decoration-dotted">{locName}</span>
                                  </button>
                                </div>
                              </div>
                              {isFed ? (
                                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-black rounded-lg flex items-center gap-0.5 shadow-sm border border-emerald-500/15">
                                  ✓ {locale === 'EN' ? 'Done' : 'सम्पन्न'}
                                </span>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => {
                                    recordFertilization(p.id, dateStr);
                                  }}
                                  className="py-1.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-700 text-[10px] font-black rounded-full transition-all shrink-0 active:scale-95"
                                >
                                  {locale === 'EN' ? 'Feed' : 'मलजल दिनुहोस्'}
                                </button>
                              )}
                            </div>
                            {isFed && journal && (
                              <div className="pt-2 border-t border-dashed border-outline-variant flex gap-1.5 items-center w-full">
                                <span className="text-[9px] text-emerald-600 font-bold shrink-0">{locale === 'EN' ? "Log:" : "टिप्पणी:"}</span>
                                <input
                                  type="text"
                                  defaultValue={journal.notes}
                                  placeholder={locale === 'EN' ? "Type notes (e.g., Epsom salts)..." : "टिप्पणी लेख्नुहोस्..."}
                                  onChange={(e) => updateJournalEntry(p.id, journal.id, { notes: e.target.value })}
                                  className="flex-1 bg-white dark:bg-surface-container text-[10px] p-1 border border-outline-variant/20 rounded focus:outline-none text-on-surface"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-on-surface-variant/60 italic pl-1">{locale === 'EN' ? "No fertilizers scheduled for this day." : "यस दिन कुनै पनि रासायनिक वा कम्पोष्ट मल तालिका खाली छ।"}</p>
                  )}
                </div>

                {/* Historic Logs on this Date */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/10">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>{t('completedActivities')} ({tn(getCompletedActivitiesForDate(selectedDay).length)})</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddLog(!showAddLog)}
                      className="px-2.5 py-1 bg-primary text-on-primary text-[9px] font-black rounded active:scale-95 transition-all"
                    >
                      {showAddLog ? "✕ Close Form" : `+ ${locale === 'EN' ? "Add Log" : "नयाँ लग दर्ता"}`}
                    </button>
                  </div>

                  {/* Add action log form inline inside popup */}
                  <AnimatePresence>
                    {showAddLog && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddCustomLog}
                        className="bg-surface-container-lowest p-3.5 rounded-xl border border-primary/20 space-y-3 overflow-hidden text-left"
                      >
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-on-surface-variant uppercase">{t('selectPlant')}</label>
                          <select
                            value={logPlantId}
                            onChange={e => setLogPlantId(e.target.value)}
                            className="w-full bg-surface-container border-none rounded-lg py-1 px-2.5 text-xs text-on-surface"
                          >
                            <option value="general">Garden-Wide Log</option>
                            {plants.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-on-surface-variant uppercase">{t('category')}</label>
                          <select
                            value={logCategory}
                            onChange={e => setLogCategory(e.target.value as any)}
                            className="w-full bg-surface-container border-none rounded-lg py-1 px-2.5 text-xs text-on-surface"
                          >
                            <option value="general">General</option>
                            <option value="watering">Watering</option>
                            <option value="fertilizing">Fertilizing</option>
                            <option value="repotting">Repotting</option>
                            <option value="pest-treatment">Pest treatment</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-on-surface-variant uppercase">{t('titleLabel')}</label>
                          <input
                            type="text"
                            required
                            value={logTitle}
                            onChange={e => setLogTitle(e.target.value)}
                            placeholder="Wiped dust, leaf shine, NPK..."
                            className="w-full bg-surface-container border-none rounded-lg py-1.5 px-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-on-surface-variant uppercase">{t('notesDetails')}</label>
                          <input
                            type="text"
                            required
                            value={logNotes}
                            onChange={e => setLogNotes(e.target.value)}
                            className="w-full bg-surface-container border-none rounded-lg py-1.5 px-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="flex justify-end gap-1.5 pt-1">
                          <button type="submit" className="px-3 py-1.5 bg-primary text-on-primary text-[10px] font-bold rounded-lg shadow active:scale-95 transition-all">
                            {t('saveLog')}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Log entries lists */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin">
                    {getCompletedActivitiesForDate(selectedDay).map(activity => (
                      <div key={activity.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-container-lowest border border-outline-variant/10 text-left relative flex flex-col gap-1">
                        {editingActivityId === activity.id ? (
                          <div className="space-y-2 w-full">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              className="w-full bg-surface-container text-xs p-1 rounded border-none focus:outline-none"
                            />
                            <textarea
                              value={editNotes}
                              onChange={e => setEditNotes(e.target.value)}
                              className="w-full bg-surface-container text-xs p-1 rounded border-none resize-none h-12 focus:outline-none"
                            />
                            <div className="flex justify-end gap-1">
                              <button type="button" onClick={() => setEditingActivityId(null)} className="px-2 py-1 bg-gray-200 dark:bg-surface-container text-[9px] font-bold rounded-lg text-on-surface">Cancel</button>
                              <button type="button" onClick={() => handleSaveEditLog(activity)} className="px-2 py-1 bg-primary text-white text-[9px] font-bold rounded-lg shadow-sm">Save</button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full">
                            <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded">
                              {activity.plantName || "Garden-Wide"} • {activity.category}
                            </span>
                            <h5 className="font-bold text-xs mt-1 text-on-surface leading-tight">{activity.title}</h5>
                            <p className="text-[10px] text-on-surface-variant/90 leading-tight mt-0.5">{activity.notes}</p>
                            
                            <div className="absolute right-1 top-1.5 flex items-center gap-0.5">
                              <button 
                                type="button"
                                onClick={() => {
                                  setEditingActivityId(activity.id);
                                  setEditTitle(activity.title);
                                  setEditNotes(activity.notes);
                                }}
                                className="p-1 text-gray-400 hover:text-primary rounded animate-pulse"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleDeleteCompletedActivity(activity)} 
                                className="p-1 text-gray-400 hover:text-red-500 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {getCompletedActivitiesForDate(selectedDay).length === 0 && (
                      <p className="text-[10px] text-on-surface-variant/60 italic text-center py-4">{locale === 'EN' ? "No completed logs for this day." : "यस दिनको कुनै काम दर्ता गरिएको इतिहास छैन।"}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 dark:bg-surface-container-high/20 border-t border-outline-variant/10 text-right flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4.5 py-2 bg-gray-200 dark:bg-surface-container-high hover:bg-gray-300 dark:hover:bg-surface-container-highest text-xs font-bold rounded-xl active:scale-95 transition-all text-on-surface"
                >
                  {locale === 'EN' ? 'Close Window' : 'बन्द गर्नुहोस्'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
