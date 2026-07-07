// Astronomical Panchang calculator for Vedic Hindu calendar.
// Uses simplified but accurate-enough algorithms based on Meeus / Chapront ELP2000.
// Reference formulas widely used in JS panchang implementations.

const DEG = Math.PI / 180;

function rev(a: number) {
  return a - Math.floor(a / 360) * 360;
}

function sind(x: number) { return Math.sin(x * DEG); }
function cosd(x: number) { return Math.cos(x * DEG); }
function tand(x: number) { return Math.tan(x * DEG); }
function asind(x: number) { return Math.asin(x) / DEG; }

// Julian Day for a given Date (UT).
function julianDay(date: Date) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const h = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let yy = y, mm = m;
  if (mm <= 2) { yy = y - 1; mm = m + 12; }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + h / 24 + B - 1524.5;
}

// Sun's ecliptic (tropical) longitude in degrees.
function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = rev(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = rev(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sind(M) +
    (0.019993 - 0.000101 * T) * sind(2 * M) +
    0.000289 * sind(3 * M);
  return rev(L0 + C);
}

// Moon's ecliptic (tropical) longitude in degrees (simplified).
function moonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = rev(218.3164477 + 481267.88123421 * T);
  const D = rev(297.8501921 + 445267.1114034 * T);
  const M = rev(357.5291092 + 35999.0502909 * T);
  const Mp = rev(134.9633964 + 477198.8675055 * T);
  const F = rev(93.272095 + 483202.0175233 * T);

  const lon =
    L +
    6.288774 * sind(Mp) +
    1.274027 * sind(2 * D - Mp) +
    0.658314 * sind(2 * D) +
    0.213618 * sind(2 * Mp) +
    -0.185116 * sind(M) +
    -0.114332 * sind(2 * F) +
    0.058793 * sind(2 * D - 2 * Mp) +
    0.057066 * sind(2 * D - M - Mp) +
    0.053322 * sind(2 * D + Mp) +
    0.045758 * sind(2 * D - M) +
    -0.040923 * sind(M - Mp) +
    -0.034720 * sind(D) +
    -0.030383 * sind(M + Mp);

  return rev(lon);
}

// Ayanamsa (Lahiri) in degrees.
function ayanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  // Lahiri approximation
  return 23.85 + 50.2564 * T / 3600 + T * (0.0000464 * T);
}

function siderealLongitude(tropical: number, jd: number) {
  return rev(tropical - ayanamsa(jd));
}

// ---- Names ----

const TITHI_NAMES = {
  en: [
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
  ],
  te: [
    "పాడ్యమి", "విదియ", "తదియ", "చవితి", "పంచమి",
    "షష్ఠి", "సప్తమి", "అష్టమి", "నవమి", "దశమి",
    "ఏకాదశి", "ద్వాదశి", "త్రయోదశి", "చతుర్దశి", "పౌర్ణమి",
    "పాడ్యమి", "విదియ", "తదియ", "చవితి", "పంచమి",
    "షష్ఠి", "సప్తమి", "అష్టమి", "నవమి", "దశమి",
    "ఏకాదశి", "ద్వాదశి", "త్రయోదశి", "చతుర్దశి", "అమావాస్య",
  ],
};

const NAKSHATRA_NAMES = {
  en: [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
  ],
  te: [
    "అశ్విని", "భరణి", "కృత్తిక", "రోహిణి", "మృగశిర", "ఆర్ద్ర",
    "పునర్వసు", "పుష్యమి", "ఆశ్లేష", "మఖ", "పూర్వ ఫల్గుణి", "ఉత్తర ఫల్గుణి",
    "హస్త", "చిత్త", "స్వాతి", "విశాఖ", "అనూరాధ", "జ్యేష్ఠ",
    "మూల", "పూర్వాషాఢ", "ఉత్తరాషాఢ", "శ్రవణం", "ధనిష్ఠ", "శతభిష",
    "పూర్వాభాద్ర", "ఉత్తరాభాద్ర", "రేవతి",
  ],
};

const YOGA_NAMES = {
  en: [
    "Vishkumbha", "Preeti", "Ayushmaan", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
    "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
  ],
  te: [
    "విష్కుంభ", "ప్రీతి", "ఆయుష్మాన్", "సౌభాగ్య", "శోభన", "అతిగండ",
    "సుకర్మ", "ధృతి", "శూల", "గండ", "వృద్ధి", "ధ్రువ", "వ్యాఘాత",
    "హర్షణ", "వజ్ర", "సిద్ధి", "వ్యతీపాత", "వరీయాన్", "పరిఘ", "శివ",
    "సిద్ధ", "సాధ్య", "శుభ", "శుక్ల", "బ్రహ్మ", "ఇంద్ర", "వైధృతి",
  ],
};

const KARANA_NAMES = {
  en: [
    "Kimstughna", "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija",
    "Vishti", "Shakuni", "Chatushpada", "Naga",
  ],
  te: [
    "కింస్తుఘ్న", "బవ", "బాలవ", "కౌలవ", "తైతిల", "గర", "వణిజ",
    "విష్టి", "శకుని", "చతుష్పాద", "నాగ",
  ],
};

const VARA_NAMES = {
  en: ["Ravi", "Soma", "Mangala", "Budha", "Guru", "Shukra", "Shani"],
  te: ["ఆదివారం", "సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం"],
};

const MASA_NAMES = {
  en: [
    "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
    "Ashwin", "Kartika", "Margashira", "Pushya", "Magha", "Phalguna",
  ],
  te: [
    "చైత్రం", "వైశాఖం", "జ్యేష్ఠం", "ఆషాఢం", "శ్రావణం", "భాద్రపదం",
    "ఆశ్వయుజం", "కార్తీకం", "మార్గశిరం", "పుష్యం", "మాఘం", "ఫాల్గుణం",
  ],
};

const RITU_NAMES = {
  en: ["Vasanta", "Grishma", "Varsha", "Sharad", "Hemanta", "Shishira"],
  te: ["వసంత", "గ్రీష్మ", "వర్ష", "శరత్", "హేమంత", "శిశిర"],
};

// Telugu 60-year cycle names
const SAMVATSARA_NAMES = {
  en: [
    "Prabhava", "Vibhava", "Shukla", "Pramoduta", "Prajapati", "Angirasa", "Shrimukha",
    "Bhava", "Yuva", "Dhata", "Ishvara", "Bahudhanya", "Pramathi", "Vikrama", "Vrusha",
    "Chitrabhanu", "Svabhanu", "Tarana", "Parthiva", "Vyaya", "Sarvajitu", "Sarvadhari",
    "Virodhi", "Vikruti", "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
    "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava", "Shubhakritu", "Sobhakritu",
    "Krodhi", "Vishvavasu", "Parabhava", "Plavanga", "Kilaka", "Saumya", "Sadharana",
    "Virodhikritu", "Paridhavi", "Pramadi", "Ananda", "Rakshasa", "Nala", "Pingala",
    "Kalayukti", "Siddharthi", "Raudra", "Durmati", "Dundubhi", "Rudhirodgari",
    "Raktakshi", "Krodhana", "Akshaya",
  ],
  te: [
    "ప్రభవ", "విభవ", "శుక్ల", "ప్రమోదూత", "ప్రజోత్పత్తి", "ఆంగీరస", "శ్రీముఖ",
    "భావ", "యువ", "ధాత", "ఈశ్వర", "బహుధాన్య", "ప్రమాథి", "విక్రమ", "వృష",
    "చిత్రభాను", "స్వభాను", "తారణ", "పార్థివ", "వ్యయ", "సర్వజిత్తు", "సర్వధారి",
    "విరోధి", "వికృతి", "ఖర", "నందన", "విజయ", "జయ", "మన్మథ", "దుర్ముఖి",
    "హేవిళంబి", "విళంబి", "వికారి", "శార్వరి", "ప్లవ", "శుభకృత్తు", "శోభకృత్తు",
    "క్రోధి", "విశ్వావసు", "పరాభవ", "ప్లవంగ", "కీలక", "సౌమ్య", "సాధారణ",
    "విరోధికృతు", "పరిధావి", "ప్రమాదీచ", "ఆనంద", "రాక్షస", "నల", "పింగళ",
    "కాలయుక్తి", "సిద్ధార్థి", "రౌద్రి", "దుర్మతి", "దుందుభి", "రుధిరోద్గారి",
    "రక్తాక్షి", "క్రోధన", "అక్షయ",
  ],
};

// ---- Public API ----

export type PanchangResult = {
  tithi: { index: number; nameEn: string; nameTe: string; paksha: "shukla" | "krishna"; endsAt: Date };
  nakshatra: { index: number; nameEn: string; nameTe: string; endsAt: Date };
  yoga: { index: number; nameEn: string; nameTe: string; endsAt: Date };
  karana: { nameEn: string; nameTe: string };
  vara: { index: number; nameEn: string; nameTe: string };
  masa: { nameEn: string; nameTe: string };
  ritu: { nameEn: string; nameTe: string };
  ayana: { nameEn: string; nameTe: string };
  samvatsara: { nameEn: string; nameTe: string };
};

function pickName(list: { en: string[]; te: string[] }, i: number) {
  const idx = ((i % list.en.length) + list.en.length) % list.en.length;
  return { nameEn: list.en[idx], nameTe: list.te[idx] };
}

// Find time when tithi/nakshatra/yoga index changes (moving forward from `jdStart`).
function findEndTime(
  jdStart: number,
  currentIndex: number,
  divisor: number,
  compute: (jd: number) => number
): Date {
  let lo = jdStart;
  let hi = jdStart + 2; // search up to 2 days ahead
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const val = compute(mid);
    const idx = Math.floor(val / divisor);
    if (idx === currentIndex) lo = mid;
    else hi = mid;
  }
  const jd = (lo + hi) / 2;
  // JD -> Date (UT)
  const unix = (jd - 2440587.5) * 86400 * 1000;
  return new Date(unix);
}

export function computePanchang(date: Date): PanchangResult {
  const jd = julianDay(date);

  const sunTrop = sunLongitude(jd);
  const moonTrop = moonLongitude(jd);
  const sunSid = siderealLongitude(sunTrop, jd);
  const moonSid = siderealLongitude(moonTrop, jd);

  // Tithi
  const tithiAngle = rev(moonSid - sunSid);
  const tithiIndex = Math.floor(tithiAngle / 12); // 0..29
  const tithi = pickName(TITHI_NAMES, tithiIndex);
  const tithiEnd = findEndTime(jd, tithiIndex, 12, (j) => rev(siderealLongitude(moonLongitude(j), j) - siderealLongitude(sunLongitude(j), j)));

  // Nakshatra
  const nakIndex = Math.floor(moonSid / (360 / 27));
  const nakshatra = pickName(NAKSHATRA_NAMES, nakIndex);
  const nakEnd = findEndTime(jd, nakIndex, 360 / 27, (j) => siderealLongitude(moonLongitude(j), j));

  // Yoga
  const yogaAngle = rev(moonSid + sunSid);
  const yogaIndex = Math.floor(yogaAngle / (360 / 27));
  const yoga = pickName(YOGA_NAMES, yogaIndex);
  const yogaEnd = findEndTime(jd, yogaIndex, 360 / 27, (j) => rev(siderealLongitude(moonLongitude(j), j) + siderealLongitude(sunLongitude(j), j)));

  // Karana
  const karanaIndex = Math.floor(tithiAngle / 6); // 0..59
  // Karana sequence
  const karanaSeq = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
  ];
  let karanaEn: string;
  let karanaTe: string;
  if (karanaIndex === 0) {
    karanaEn = KARANA_NAMES.en[0]; karanaTe = KARANA_NAMES.te[0];
  } else if (karanaIndex >= 57) {
    const map = [8, 9, 10];
    const idx = map[karanaIndex - 57];
    karanaEn = KARANA_NAMES.en[idx]; karanaTe = KARANA_NAMES.te[idx];
  } else {
    const seqIdx = (karanaIndex - 1) % 7;
    karanaEn = KARANA_NAMES.en[1 + seqIdx];
    karanaTe = KARANA_NAMES.te[1 + seqIdx];
    void karanaSeq;
  }

  // Vara (0=Sunday). Use local date's day-of-week.
  const varaIdx = date.getDay();
  const vara = pickName(VARA_NAMES, varaIdx);

  // Masa (approx by sun sidereal sign)
  const rasi = Math.floor(sunSid / 30); // 0..11 starting Mesha
  // Amanta scheme: Chaitra begins when sun in Meena (11) roughly (approx); simplified:
  const masaIdx = rasi; // Chaitra..Phalguna aligned with Mesha..Meena roughly
  const masa = pickName(MASA_NAMES, masaIdx);

  // Ritu (2 masas each)
  const rituIdx = Math.floor(masaIdx / 2);
  const ritu = pickName(RITU_NAMES, rituIdx);

  // Ayana
  const ayanaEn = sunSid >= 270 || sunSid < 90 ? "Uttarayana" : "Dakshinayana";
  const ayanaTe = sunSid >= 270 || sunSid < 90 ? "ఉత్తరాయణం" : "దక్షిణాయనం";

  // Samvatsara (60-year cycle). Reference: 1987-88 = Prabhava (index 0) — approximation
  const year = date.getFullYear();
  const sIdx = ((year - 1987) % 60 + 60) % 60;
  const samvatsara = { nameEn: SAMVATSARA_NAMES.en[sIdx], nameTe: SAMVATSARA_NAMES.te[sIdx] };

  return {
    tithi: {
      index: tithiIndex,
      nameEn: tithi.nameEn,
      nameTe: tithi.nameTe,
      paksha: tithiIndex < 15 ? "shukla" : "krishna",
      endsAt: tithiEnd,
    },
    nakshatra: { index: nakIndex, nameEn: nakshatra.nameEn, nameTe: nakshatra.nameTe, endsAt: nakEnd },
    yoga: { index: yogaIndex, nameEn: yoga.nameEn, nameTe: yoga.nameTe, endsAt: yogaEnd },
    karana: { nameEn: karanaEn, nameTe: karanaTe },
    vara: { index: varaIdx, nameEn: vara.nameEn, nameTe: vara.nameTe },
    masa,
    ritu,
    ayana: { nameEn: ayanaEn, nameTe: ayanaTe },
    samvatsara,
  };
}

// -------- Sunrise / Sunset & Kalams --------

// NOAA-style solar time algorithm.
export function computeSunTimes(date: Date, lat: number, lon: number) {
  // Day of year
  const start = new Date(Date.UTC(date.getFullYear(), 0, 1));
  const N = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start.getTime()) / 86400000) + 1;
  void N;

  // Approximate using standard formulas
  const jd = julianDay(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)));
  const T = (jd - 2451545.0) / 36525;
  const L0 = rev(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = rev(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C =
    (1.914602 - 0.004817 * T) * sind(M) +
    (0.019993 - 0.000101 * T) * sind(2 * M) +
    0.000289 * sind(3 * M);
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const appLong = trueLong - 0.00569 - 0.00478 * sind(omega);
  const eps0 = 23 + (26 + (21.448 - 46.815 * T) / 60) / 60;
  const eps = eps0 + 0.00256 * cosd(omega);
  const decl = asind(sind(eps) * sind(appLong));

  const y = tand(eps / 2) * tand(eps / 2);
  const eqTime =
    4 *
    (y * sind(2 * L0) -
      2 * 0.016708634 * sind(M) +
      4 * 0.016708634 * y * sind(M) * cosd(2 * L0) -
      0.5 * y * y * sind(4 * L0) -
      1.25 * 0.016708634 * 0.016708634 * sind(2 * M)) /
    DEG;

  const zenith = 90 + 50 / 60; // official sunrise/sunset with refraction
  const cosH = (cosd(zenith) - sind(lat) * sind(decl)) / (cosd(lat) * cosd(decl));
  if (cosH > 1 || cosH < -1) {
    return { sunrise: null, sunset: null };
  }
  const H = Math.acos(cosH) / DEG;

  const solarNoonUTC = (720 - 4 * lon - eqTime) / 60; // hours UTC
  const sunriseUTC = solarNoonUTC - H * 4 / 60;
  const sunsetUTC = solarNoonUTC + H * 4 / 60;

  const base = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const sunrise = new Date(base.getTime() + sunriseUTC * 3600 * 1000);
  const sunset = new Date(base.getTime() + sunsetUTC * 3600 * 1000);
  return { sunrise, sunset };
}

// Sequence of Rahu / Yama / Gulika starting Sunday (day index 0..6).
// Each divides day (sunrise->sunset) into 8 equal parts; period n (0-based) is inauspicious.
// Sources: standard Vedic references.
const RAHU_PART = [7, 1, 6, 4, 5, 3, 2]; // Sun..Sat
const YAMA_PART = [4, 3, 2, 1, 0, 6, 5];
const GULIKA_PART = [6, 5, 4, 3, 2, 1, 0];

export function computeKalams(sunrise: Date, sunset: Date, varaIdx: number) {
  const dayMs = sunset.getTime() - sunrise.getTime();
  const part = dayMs / 8;
  const build = (idx: number) => {
    const start = new Date(sunrise.getTime() + idx * part);
    const end = new Date(sunrise.getTime() + (idx + 1) * part);
    return { start, end };
  };
  return {
    rahu: build(RAHU_PART[varaIdx]),
    yama: build(YAMA_PART[varaIdx]),
    gulika: build(GULIKA_PART[varaIdx]),
  };
}

export function formatTime(d: Date | null | undefined, tz: string = "Asia/Kolkata"): string {
  if (!d) return "—";
  try {
    return d.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = ((h + 11) % 12) + 1;
    const mm = m.toString().padStart(2, "0");
    return `${hh}:${mm} ${ampm}`;
  }
}
