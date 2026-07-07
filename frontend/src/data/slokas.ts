// Curated slokas & devotional quotes rotation (deterministic-per-day)
export type Sloka = {
  id: string;
  titleEn: string;
  titleTe: string;
  sanskrit: string;
  meaningEn: string;
  meaningTe: string;
  deity: "Ganesha" | "Krishna" | "Rama" | "Shiva" | "Devi" | "Vishnu" | "Hanuman";
};

export const SLOKAS: Sloka[] = [
  {
    id: "s1",
    titleEn: "Ganesha Sloka",
    titleTe: "వినాయక శ్లోకం",
    sanskrit: "వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ ।\nనిర్విఘ్నం కురు మే దేవ సర్వకార్యేషు సర్వదా ॥",
    meaningEn: "O Lord with the curved trunk and the radiance of a million suns, please remove all obstacles from my endeavours, always.",
    meaningTe: "వక్రతుండంతో, కోటి సూర్యుల కాంతితో ప్రకాశించే దేవా, నా అన్ని పనులలోనూ విఘ్నాలను తొలగించు.",
    deity: "Ganesha",
  },
  {
    id: "s2",
    titleEn: "Krishna Sloka",
    titleTe: "కృష్ణ శ్లోకం",
    sanskrit: "వసుదేవ సుతం దేవం కంస చాణూర మర్దనమ్ ।\nదేవకీ పరమానందం కృష్ణం వందే జగద్గురుమ్ ॥",
    meaningEn: "I bow to Krishna, son of Vasudeva, destroyer of Kamsa and Chanura, the supreme joy of Devaki, the teacher of the world.",
    meaningTe: "వసుదేవుని కుమారుడు, కంస-చాణూరులను సంహరించిన, దేవకికి పరమానందం, జగద్గురువైన శ్రీకృష్ణునికి నమస్కారం.",
    deity: "Krishna",
  },
  {
    id: "s3",
    titleEn: "Sri Rama Sloka",
    titleTe: "శ్రీరామ శ్లోకం",
    sanskrit: "శ్రీ రామ రామ రామేతి రమే రామే మనోరమే ।\nసహస్రనామ తత్తుల్యం రామ నామ వరాననే ॥",
    meaningEn: "Chanting 'Rama' with a devoted mind is equal to reciting the thousand names of the Lord.",
    meaningTe: "మనోరమమైన రామనామం స్మరిస్తే అది సహస్రనామానికి సమానం.",
    deity: "Rama",
  },
  {
    id: "s4",
    titleEn: "Shiva Sloka",
    titleTe: "శివ శ్లోకం",
    sanskrit: "కర్పూరగౌరం కరుణావతారం సంసారసారం భుజగేంద్రహారమ్ ।\nసదా వసంతం హృదయారవిందే భవం భవానీసహితం నమామి ॥",
    meaningEn: "I bow to Lord Shiva, white as camphor, embodiment of compassion, essence of the world, adorned with serpents — ever present in my heart, together with Bhavani.",
    meaningTe: "కర్పూరగౌర, కరుణామయ, సర్పహారధారి, భవానీ సహిత శంకరునికి నా హృదయాంతరాలలో నివసించే వానికి నమస్కారం.",
    deity: "Shiva",
  },
  {
    id: "s5",
    titleEn: "Devi Sloka",
    titleTe: "దేవి శ్లోకం",
    sanskrit: "సర్వమంగళ మాంగళ్యే శివే సర్వార్థ సాధికే ।\nశరణ్యే త్ర్యంబకే గౌరీ నారాయణీ నమోఽస్తుతే ॥",
    meaningEn: "Salutations to the Goddess who bestows all auspiciousness, fulfils every purpose, gives refuge — the three-eyed Gauri, Narayani.",
    meaningTe: "సర్వమంగళదాయిని, అన్నింటినీ సాధించే, శరణ్యురాలైన త్ర్యంబక గౌరి నారాయణికి నమస్కారం.",
    deity: "Devi",
  },
  {
    id: "s6",
    titleEn: "Hanuman Sloka",
    titleTe: "హనుమాన్ శ్లోకం",
    sanskrit: "మనోజవం మారుత తుల్యవేగం జితేంద్రియం బుద్ధిమతాం వరిష్ఠమ్ ।\nవాతాత్మజం వానరయూథ ముఖ్యం శ్రీరామదూతం శరణం ప్రపద్యే ॥",
    meaningEn: "I take refuge in Hanuman — swift as thought, fast as wind, master of the senses, the wisest of the wise, chief of monkeys and messenger of Sri Rama.",
    meaningTe: "మనోవేగము గల, వాయువులాంటి వేగవంతుడు, జితేంద్రియుడు, బుద్ధిమంతులలో శ్రేష్ఠుడు, వాయుపుత్ర, వానరాధిపతి, శ్రీరామదూత హనుమంతుని శరణు కోరుతున్నాను.",
    deity: "Hanuman",
  },
  {
    id: "s7",
    titleEn: "Vishnu Sloka",
    titleTe: "విష్ణు శ్లోకం",
    sanskrit: "శాంతాకారం భుజగశయనం పద్మనాభం సురేశమ్ ।\nవిశ్వాధారం గగనసదృశం మేఘవర్ణం శుభాంగమ్ ॥",
    meaningEn: "I meditate on the peaceful Lord Vishnu, resting on the serpent, whose navel bears the lotus, ruler of gods, sky-like, cloud-hued and auspicious.",
    meaningTe: "శాంతాకారుడు, శేషశయనుడు, పద్మనాభుడు, సురేశ్వరుడు, విశ్వాధారుడు, ఆకాశసమానుడు, మేఘవర్ణుడు, శుభాంగుడైన విష్ణుమూర్తిని ధ్యానిస్తున్నాను.",
    deity: "Vishnu",
  },
];

// Devotional daily quotes.
export const QUOTES: { en: string; te: string }[] = [
  {
    en: "You have the right to work, but never to the fruit of work.",
    te: "కర్మ మీద మాత్రమే నీకు అధికారం, ఫలముపై కాదు. — భగవద్గీత",
  },
  {
    en: "Whenever dharma declines, I manifest myself.",
    te: "ధర్మం క్షీణించినప్పుడల్లా, నేను అవతరిస్తాను. — భగవద్గీత",
  },
  {
    en: "Perform your duty with equanimity; that is yoga.",
    te: "సమభావంతో కర్మలు చేయుటే యోగం. — భగవద్గీత",
  },
  {
    en: "The mind is restless, but can be tamed through practice and detachment.",
    te: "మనస్సు చంచలం, కానీ అభ్యాసం-వైరాగ్యంతో దీన్ని జయించగలము.",
  },
  {
    en: "He who sees Me in all and all in Me — I am never lost to him.",
    te: "అన్నింటిలో నన్ను, నాలో అన్నింటినీ చూసే వాడికి నేను ఎప్పటికీ దూరం కాను.",
  },
  {
    en: "Truth alone triumphs — Satyameva Jayate.",
    te: "సత్యం మాత్రమే జయిస్తుంది — సత్యమేవ జయతే.",
  },
  {
    en: "Where there is Krishna, there is victory.",
    te: "కృష్ణుడు ఉన్నచోట విజయం ఉంటుంది.",
  },
];

// Deterministic pick by day-of-year.
export function slokaOfTheDay(date: Date): Sloka {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const doy = Math.floor(diff / (1000 * 60 * 60 * 24));
  return SLOKAS[doy % SLOKAS.length];
}

export function quoteOfTheDay(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const doy = Math.floor(diff / (1000 * 60 * 60 * 24));
  return QUOTES[doy % QUOTES.length];
}
