// Simple i18n string map. Add keys as needed.

export const strings = {
  // App
  appName: { en: "GKVG Calendar", te: "GKVG క్యాలెండర్" },
  appTagline: { en: "Telugu Panchang & Devotion", te: "తెలుగు పంచాంగం & భక్తి" },

  // Tabs
  tab_home: { en: "Home", te: "హోమ్" },
  tab_calendar: { en: "Calendar", te: "క్యాలెండర్" },
  tab_festivals: { en: "Festivals", te: "పండుగలు" },
  tab_devotion: { en: "Devotion", te: "భక్తి" },
  tab_settings: { en: "Settings", te: "సెట్టింగ్స్" },

  // Home
  today_panchang: { en: "Today's Panchang", te: "నేటి పంచాంగం" },
  daily_devotion: { en: "Daily Devotion", te: "నిత్య భక్తి" },
  auspicious_timings: { en: "Auspicious Timings", te: "శుభ ముహూర్తాలు" },
  inauspicious_timings: { en: "Inauspicious Periods", te: "అశుభ కాలాలు" },

  // Panchang labels
  tithi: { en: "Tithi", te: "తిథి" },
  nakshatra: { en: "Nakshatram", te: "నక్షత్రం" },
  yoga: { en: "Yoga", te: "యోగం" },
  karana: { en: "Karana", te: "కరణం" },
  vara: { en: "Vara", te: "వారం" },
  paksha: { en: "Paksha", te: "పక్షం" },
  masa: { en: "Masa", te: "మాసం" },
  ritu: { en: "Ritu", te: "ఋతువు" },
  ayana: { en: "Ayana", te: "అయనం" },
  samvatsara: { en: "Samvatsara", te: "సంవత్సరం" },
  sunrise: { en: "Sunrise", te: "సూర్యోదయం" },
  sunset: { en: "Sunset", te: "సూర్యాస్తమయం" },
  rahukalam: { en: "Rahukalam", te: "రాహుకాలం" },
  yamagandam: { en: "Yamagandam", te: "యమగండం" },
  gulika: { en: "Gulika Kalam", te: "గుళిక కాలం" },
  abhijit: { en: "Abhijit Muhurta", te: "అభిజిత్ ముహూర్తం" },

  // Paksha
  shukla: { en: "Shukla Paksha", te: "శుక్ల పక్షం" },
  krishna: { en: "Krishna Paksha", te: "కృష్ణ పక్షం" },

  // Calendar
  select_a_date: {
    en: "Select a date to view details",
    te: "వివరాలు చూడటానికి తేదీ ఎంచుకోండి",
  },
  no_festival_today: {
    en: "No festival on this day",
    te: "ఈ రోజు పండుగ లేదు",
  },

  // Festivals
  upcoming_festivals: {
    en: "Upcoming Festivals",
    te: "రాబోయే పండుగలు",
  },
  vratham: { en: "Vratham", te: "వ్రతం" },
  festival: { en: "Festival", te: "పండుగ" },
  observance: { en: "Observance", te: "అనుష్ఠానం" },
  no_festivals: {
    en: "No upcoming festivals",
    te: "రాబోయే పండుగలు లేవు",
  },

  // Devotion
  daily_sloka: { en: "Daily Sloka", te: "నిత్య శ్లోకం" },
  mantras: { en: "Mantras", te: "మంత్రాలు" },
  stories: { en: "Stories", te: "కథలు" },
  deities: { en: "Deities", te: "దేవతలు" },

  // Settings
  appearance: { en: "Appearance", te: "రూపం" },
  dark_mode: { en: "Dark Mode", te: "డార్క్ మోడ్" },
  language: { en: "Language", te: "భాష" },
  english: { en: "English", te: "ఇంగ్లీష్" },
  telugu: { en: "Telugu", te: "తెలుగు" },
  notifications: {
    en: "Daily Notifications",
    te: "నిత్య నోటిఫికేషన్‌లు",
  },
  notifications_desc: {
    en: "Get today's Panchang each morning",
    te: "ప్రతి ఉదయం నేటి పంచాంగం అందుకోండి",
  },
  location: { en: "Location", te: "ప్రదేశం" },
  about: { en: "About", te: "గురించి" },
  version: { en: "Version", te: "వెర్షన్" },

  // Common
  today: { en: "Today", te: "నేడు" },
  tomorrow: { en: "Tomorrow", te: "రేపు" },
  now: { en: "Now", te: "ఇప్పుడు" },
  view_all: { en: "View All", te: "అన్నీ చూడండి" },
  close: { en: "Close", te: "మూసివేయి" },
} as const;

export type StringKey = keyof typeof strings;