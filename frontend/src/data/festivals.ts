// Curated 2026 Hindu festivals & Vrathams (Andhra / Telangana calendar).
// Dates are approximate reference values. iso date: YYYY-MM-DD (local).

export type Festival = {
  id: string;
  date: string; // ISO
  nameEn: string;
  nameTe: string;
  kind: "festival" | "vratham";
  descriptionEn: string;
  descriptionTe: string;
};

export const FESTIVALS_2026: Festival[] = [
  { id: "f1", date: "2026-01-14", nameEn: "Makara Sankranti", nameTe: "మకర సంక్రాంతి", kind: "festival",
    descriptionEn: "Harvest festival marking the sun's transit into Capricorn.", descriptionTe: "సూర్యుడు మకర రాశిలోకి ప్రవేశించే సందర్భంగా జరుపుకునే పంట పండుగ." },
  { id: "f2", date: "2026-01-15", nameEn: "Kanuma", nameTe: "కనుమ", kind: "festival",
    descriptionEn: "Third day of Sankranti dedicated to cattle worship.", descriptionTe: "సంక్రాంతి మూడో రోజు — పశువులకు పూజ." },
  { id: "f3", date: "2026-02-15", nameEn: "Maha Shivaratri", nameTe: "మహా శివరాత్రి", kind: "festival",
    descriptionEn: "The great night of Lord Shiva — fasting and vigil.", descriptionTe: "శివుని మహిమాన్విత రాత్రి — ఉపవాసం మరియు జాగరణ." },
  { id: "f4", date: "2026-03-03", nameEn: "Holi", nameTe: "హోళి", kind: "festival",
    descriptionEn: "Festival of colours celebrating spring.", descriptionTe: "వసంతోత్సవం — రంగుల పండుగ." },
  { id: "f5", date: "2026-03-19", nameEn: "Ugadi", nameTe: "ఉగాది", kind: "festival",
    descriptionEn: "Telugu New Year — Vikari samvatsara begins.", descriptionTe: "తెలుగు నూతన సంవత్సరం — ఉగాది పచ్చడి." },
  { id: "f6", date: "2026-03-27", nameEn: "Sri Rama Navami", nameTe: "శ్రీ రామ నవమి", kind: "festival",
    descriptionEn: "Birth of Lord Sri Rama.", descriptionTe: "శ్రీరాముని జన్మదినం." },
  { id: "f7", date: "2026-04-11", nameEn: "Hanuman Jayanti", nameTe: "హనుమాన్ జయంతి", kind: "festival",
    descriptionEn: "Birth anniversary of Lord Hanuman.", descriptionTe: "హనుమంతుని జయంతి." },
  { id: "f8", date: "2026-05-19", nameEn: "Akshaya Tritiya", nameTe: "అక్షయ తృతీయ", kind: "festival",
    descriptionEn: "Auspicious day for new beginnings.", descriptionTe: "శుభ కార్యాలకు, కొత్త ప్రారంభాలకు అత్యంత శుభదినం." },
  { id: "f9", date: "2026-07-09", nameEn: "Guru Purnima", nameTe: "గురు పూర్ణిమ", kind: "festival",
    descriptionEn: "Honoring spiritual and academic teachers.", descriptionTe: "గురువులను గౌరవించే పర్వదినం." },
  { id: "f10", date: "2026-08-15", nameEn: "Varalakshmi Vratham", nameTe: "వరలక్ష్మీ వ్రతం", kind: "vratham",
    descriptionEn: "Vratham dedicated to Goddess Lakshmi by married women.", descriptionTe: "సుమంగళీలు లక్ష్మీదేవిని పూజించే వ్రతం." },
  { id: "f11", date: "2026-08-19", nameEn: "Sri Krishna Janmashtami", nameTe: "శ్రీ కృష్ణాష్టమి", kind: "festival",
    descriptionEn: "Birth of Lord Sri Krishna.", descriptionTe: "శ్రీ కృష్ణ భగవానుని జన్మదినం." },
  { id: "f12", date: "2026-09-14", nameEn: "Vinayaka Chavithi", nameTe: "వినాయక చవితి", kind: "festival",
    descriptionEn: "Ganesha Chaturthi — welcoming Lord Ganesha.", descriptionTe: "వినాయకుని ఆవిర్భావ దినం." },
  { id: "f13", date: "2026-10-10", nameEn: "Dasara / Vijayadashami", nameTe: "దసరా / విజయదశమి", kind: "festival",
    descriptionEn: "Victory of good over evil — tenth day of Navaratri.", descriptionTe: "నవరాత్రుల పదవ దినం — విజయదశమి." },
  { id: "f14", date: "2026-10-08", nameEn: "Durgashtami", nameTe: "దుర్గాష్టమి", kind: "festival",
    descriptionEn: "Eighth day of Navaratri dedicated to Goddess Durga.", descriptionTe: "నవరాత్రుల ఎనిమిదవ రోజు — దుర్గాదేవి పూజ." },
  { id: "f15", date: "2026-11-08", nameEn: "Deepavali", nameTe: "దీపావళి", kind: "festival",
    descriptionEn: "Festival of lights celebrating the triumph of light over darkness.", descriptionTe: "వెలుగుల పండుగ — దీపావళి." },
  { id: "f16", date: "2026-11-11", nameEn: "Karthika Pournami", nameTe: "కార్తీక పౌర్ణమి", kind: "festival",
    descriptionEn: "Highly auspicious full moon of Karthika month.", descriptionTe: "అత్యంత శుభప్రదమైన కార్తీక పౌర్ణమి." },
  { id: "f17", date: "2026-12-04", nameEn: "Vaikunta Ekadashi", nameTe: "వైకుంఠ ఏకాదశి", kind: "vratham",
    descriptionEn: "Ekadashi believed to open the gates of Vaikunta.", descriptionTe: "వైకుంఠ ద్వారాలు తెరుచుకునే ఏకాదశి." },
  { id: "f18", date: "2026-12-25", nameEn: "Dhanurmasa begins", nameTe: "ధనుర్మాసం ప్రారంభం", kind: "observance" as any,
    descriptionEn: "Sacred month observed with early morning prayers.", descriptionTe: "తిరుప్పావై పఠనం, గోదాదేవి పూజలతో ప్రారంభమయ్యే పవిత్ర మాసం." },
];
