'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, X, Plus, GripVertical, Download, RotateCcw, Camera, Check } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  name: string;
  city: string;
  intention: string;
  fasting: boolean;
  onHajj: boolean;
}

interface Dua {
  id: string;
  text: string;
  category: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_PROFILE = 'arafah-profile-2026';
const STORAGE_DUAS = 'arafah-duas-2026';
const STORAGE_DHIKR = 'arafah-dhikr-2026';
const ARAFAH_DATE = '2026-05-26';
const DEFAULT_MAGHRIB = '19:18';
const DEFAULT_CITY = 'Dubai';
const DEFAULT_LAT = 25.2048;
const DEFAULT_LNG = 55.2708;

const DUA_CATEGORIES = ['Deen', 'Dunya', 'Family', 'Health', 'Ummah', 'General'];
const INSPIRATION_CHIPS = [
  'Forgiveness',
  'Akhirah',
  'Parents',
  'Children',
  'Health',
  'Rizq',
  'Marriage',
  'Ummah',
  'Guidance',
];

const DHIKRS = [
  { key: 'tahlil_full', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', transliteration: 'La ilaha illallahu wahdahu la sharika lahu, lahul mulku wa lahul hamdu wa huwa \'ala kulli sha\'in qadir' },
  { key: 'tahlil', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah' },
  { key: 'tasbih', arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah' },
  { key: 'tasbih_hamd', arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', transliteration: 'SubhanAllahi wa bihamdihi' },
  { key: 'takbir', arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar' },
  { key: 'hamd', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah' },
  { key: 'istighfar', arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah' },
  { key: 'salawat', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', transliteration: 'Allahumma salli \'ala Muhammad' },
];

// ─── Curated Duas Data ────────────────────────────────────────────────────────

interface CuratedDua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  category: 'Best of Arafah' | 'Forgiveness' | 'Quran' | 'Dunya & Akhirah' | 'Family' | 'Health' | 'Protection' | 'Guidance';
  note?: string;
}

const CURATED_DUAS: CuratedDua[] = [
  {
    id: 'best-arafah',
    title: 'The Best Dhikr of Arafah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lahu, lahul mulku wa lahul hamdu wa huwa 'ala kulli sha'in qadir",
    translation: 'None has the right to be worshipped but Allah alone, Who has no partner. His is the dominion and His is the praise, and He has power over all things.',
    source: 'Tirmidhi — Hasan',
    category: 'Best of Arafah',
    note: 'The Prophet ﷺ said: "The best thing I and the Prophets before me have said on the evening of Arafah is this." Repeat abundantly.',
  },
  {
    id: 'forgiveness-aisha',
    title: 'Dua for Forgiveness & Pardon',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
    translation: 'O Allah, You are the Pardoner, You love to pardon, so pardon me.',
    source: 'Tirmidhi & Ibn Majah — Sahih',
    category: 'Forgiveness',
    note: 'Aisha (RA) asked the Prophet ﷺ what to say on Laylatul Qadr. Scholars say this dua is equally powerful on the Day of Arafah.',
  },
  {
    id: 'sayyidul-istighfar',
    title: 'Sayyidul Istighfar — The Master Supplication',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li fa'innahu la yaghfirudh-dhunuba illa anta",
    translation: 'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your slave. I am faithful to my covenant and my promise as much as I can. I seek refuge with You from all the evil I have done. I acknowledge Your blessings upon me, and I confess my sins. So forgive me, for nobody can forgive sins except You.',
    source: 'Bukhari — Sahih',
    category: 'Forgiveness',
    note: 'Whoever says this with conviction in the morning and dies before evening enters Paradise. Whoever says it in the evening and dies before morning enters Paradise.',
  },
  {
    id: 'rabbana-atina',
    title: 'Dua for Good in This World & the Next',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
    translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    source: 'Quran 2:201',
    category: 'Dunya & Akhirah',
    note: 'Anas (RA) said the Prophet ﷺ recited this dua most often of all. It covers all of dunya and akhirah in one.',
  },
  {
    id: 'protect-fire',
    title: 'Protection from the Hellfire',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
    transliteration: 'Allahumma ajirni minan-nar',
    translation: 'O Allah, protect me from the Fire.',
    source: 'Abu Dawud — Sahih',
    category: 'Protection',
    note: 'Say this 7 times after Fajr and after Maghrib. The Prophet ﷺ said: "Allah will protect you from the Fire."',
  },
  {
    id: 'paradise-protection',
    title: 'Ask for Paradise, Refuge from Hell',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ',
    transliteration: "Allahumma inni as'alukal-jannata wa a'udhu bika minan-nar",
    translation: 'O Allah, I ask You for Paradise and I seek refuge with You from the Fire.',
    source: 'Abu Dawud — Sahih',
    category: 'Protection',
    note: 'Simple and direct — the Prophet ﷺ taught us to ask for Paradise explicitly. Don\'t be shy to ask.',
  },
  {
    id: 'parents-forgiveness',
    title: 'Forgiveness for Parents & Believers',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    transliteration: 'Rabbighfir li wa liwalidayya wa lil mu\'minina yawma yaqumul hisab',
    translation: 'My Lord, forgive me and my parents and the believers on the Day the account is established.',
    source: 'Quran 14:41',
    category: 'Family',
    note: 'The dua of Ibrahim (AS). No day is better to pray for your parents than today.',
  },
  {
    id: 'righteous-children',
    title: 'Dua for Righteous Children',
    arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَصْلِحْ لِي فِي ذُرِّيَّتِي',
    transliteration: "Rabbi awzi'ni an ashkura ni'mataka allati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardahu wa aslih li fi dhurriyyati",
    translation: 'My Lord, enable me to be grateful for Your favour which You have bestowed upon me and my parents, and to do righteousness of which You approve. And make righteous for me my offspring.',
    source: 'Quran 46:15',
    category: 'Family',
  },
  {
    id: 'family-hearts',
    title: 'Dua for a Righteous Family',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama",
    translation: 'Our Lord, grant us from our spouses and offspring comfort to our eyes and make us a leader for the righteous.',
    source: 'Quran 25:74',
    category: 'Family',
    note: 'The dua of the servants of the Most Merciful. Ask Allah to make your family a source of joy for your eyes.',
  },
  {
    id: 'guidance-taqwa',
    title: 'Dua for Guidance, Taqwa & Sufficiency',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    transliteration: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina",
    translation: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.',
    source: 'Muslim — Sahih',
    category: 'Guidance',
    note: 'Four things that cover every need: guidance on the right path, God-consciousness, modesty, and freedom from depending on others.',
  },
  {
    id: 'firmness-deen',
    title: 'Dua for Firmness on the Deen',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    transliteration: "Ya muqallibal qulubi, thabbit qalbi 'ala dinik",
    translation: 'O Turner of hearts, keep my heart firm upon Your religion.',
    source: 'Tirmidhi — Hasan Sahih',
    category: 'Guidance',
    note: 'The Prophet ﷺ said this often. Hearts can turn — ask Allah to anchor yours on the straight path.',
  },
  {
    id: 'health-body',
    title: 'Dua for Health in Body, Hearing & Sight',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ',
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa ant",
    translation: 'O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. None has the right to be worshipped except You.',
    source: 'Abu Dawud — Hasan',
    category: 'Health',
  },
  {
    id: 'anxiety-relief',
    title: 'Relief from Anxiety & Grief',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dhala'id-dayni wa ghalabatir-rijal",
    translation: 'O Allah, I seek refuge in You from anxiety and grief, from weakness and laziness, from miserliness and cowardice, and from being overwhelmed by debt and overpowered by men.',
    source: 'Bukhari — Sahih',
    category: 'Health',
  },
  {
    id: 'rizq-barakah',
    title: 'Dua for Rizq & Barakah',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliteration: "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbala",
    translation: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.',
    source: 'Ibn Majah — Sahih',
    category: 'Dunya & Akhirah',
    note: 'Said after Fajr — and perfect for Arafah. Ask for knowledge, halal rizq, and deeds accepted by Allah.',
  },
  {
    id: 'sins-forgiven',
    title: 'Complete Forgiveness of All Sins',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
    transliteration: "Allahummaghfir li dhanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu, wa 'alaniyatahu wa sirrahu",
    translation: 'O Allah, forgive me all my sins — the minor and the major, the first and the last, the open and the hidden.',
    source: 'Muslim — Sahih',
    category: 'Forgiveness',
    note: 'Ask for complete, total forgiveness. Today is the day Allah is most generous with His pardon.',
  },
  {
    id: 'ayatul-kursi-dua',
    title: 'Dua of Āyat al-Kursī',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    transliteration: 'Allahu la ilaha illa huwal-hayyul-qayyum, la ta\'khudhuhus-sinatun wa la nawm',
    translation: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
    source: 'Quran 2:255',
    category: 'Quran',
    note: 'Recite Āyat al-Kursī often today. Whoever recites it after every prayer, nothing stands between them and Paradise except death.',
  },
  {
    id: 'last-two-baqarah',
    title: 'Last Two Verses of Surah Al-Baqarah',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ',
    transliteration: "Aamanar-rasulu bima unzila ilayhi mir-rabbihi wal-mu'minun, kullun amana billahi wa mala'ikatihi wa kutubihi wa rusulihi...",
    translation: 'The Messenger has believed in what was revealed to him from his Lord, and so have the believers. All of them have believed in Allah and His angels and His books and His messengers...',
    source: 'Quran 2:285–286',
    category: 'Quran',
    note: 'The Prophet ﷺ said: "Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him." Recite them today.',
  },
  {
    id: 'ibrahim-safety',
    title: 'Dua of Ibrahim (AS) — Safety of Family',
    arabic: 'رَبِّ اجْعَلْ هَٰذَا الْبَلَدَ آمِنًا وَاجْنُبْنِي وَبَنِيَّ أَن نَّعْبُدَ الْأَصْنَامَ',
    transliteration: "Rabbij'al haadhal balada aminan wajnubni wa baniyya an na'budal-asnam",
    translation: 'My Lord, make this city [Makkah] secure and keep me and my sons away from worshipping idols.',
    source: 'Quran 14:35',
    category: 'Family',
    note: 'Ask Allah to protect your family from every form of shirk and deviation — a timeless dua for every generation.',
  },
  {
    id: 'ummah-dua',
    title: 'Dua for the Ummah',
    arabic: 'اللَّهُمَّ أَصْلِحْ أُمَّةَ مُحَمَّدٍ، اللَّهُمَّ فَرِّجْ عَنْ أُمَّةِ مُحَمَّدٍ، اللَّهُمَّ ارْحَمْ أُمَّةَ مُحَمَّدٍ',
    transliteration: "Allahumma aslih ummata Muhammad, Allahumma farrij 'an ummati Muhammad, Allahummar-ham ummata Muhammad",
    translation: 'O Allah, reform the Ummah of Muhammad. O Allah, relieve the hardship of the Ummah of Muhammad. O Allah, have mercy on the Ummah of Muhammad.',
    source: 'Abu Dawud — Hasan',
    category: 'Guidance',
    note: 'Don\'t forget your brothers and sisters around the world. Arafah is the day to ask for the whole Ummah.',
  },
];

const CURATED_CATEGORIES = ['All', 'Best of Arafah', 'Forgiveness', 'Quran', 'Dunya & Akhirah', 'Family', 'Health', 'Protection', 'Guidance'] as const;

// ─── Suggested Timetable Stages ───────────────────────────────────────────────

const TIMETABLE_STAGES = [
  {
    id: 'stage1',
    label: 'STAGE 1 · MONDAY EVENING',
    date: '25 May 2026',
    title: 'The day before Arafah',
    subtitle: 'Clear the decks and protect the day.',
    color: '#6366f1',
    items: [
      { id: 's1-1', text: 'Take the day off work or studies' },
      { id: 's1-2', text: 'Let family know you need focused time tomorrow' },
      { id: 's1-3', text: 'Silence social media and unnecessary notifications' },
      { id: 's1-4', text: 'Write your duʼā list or review the ones above' },
      { id: 's1-5', text: 'Pray Witr and make istighfār before sleeping early' },
    ],
  },
  {
    id: 'stage2',
    label: 'STAGE 2 · TUESDAY PRE-DAWN',
    date: '26 May — Before Fajr',
    title: 'Rise early',
    subtitle: 'Begin with gratitude and prayer.',
    color: '#8b5cf6',
    items: [
      { id: 's2-1', text: 'Wake up 30 minutes before Fajr' },
      { id: 's2-2', text: 'Make wudu with intention and presence' },
      { id: 's2-3', text: 'Pray 2 rakʻah Tahajjud — make duʼā in sujood' },
      { id: 's2-4', text: 'Eat suhoor with basmala if you are fasting' },
      { id: 's2-5', text: 'Pray Fajr with full khushuʻ' },
    ],
  },
  {
    id: 'stage3',
    label: 'STAGE 3 · AFTER FAJR',
    date: '26 May — Fajr to Dhuhr',
    title: 'Protect the morning',
    subtitle: 'Fill it with Quran and dhikr.',
    color: '#f59e0b',
    items: [
      { id: 's3-1', text: 'Recite morning adhkār (Hisnul Muslim)' },
      { id: 's3-2', text: 'Read Quran — aim for at least 1 juz' },
      { id: 's3-3', text: 'Recite La ilaha illallahu wahdahu... abundantly' },
      { id: 's3-4', text: 'Avoid all idle talk, social media and distractions' },
      { id: 's3-5', text: 'Make wudu and review your duʼā list before Dhuhr' },
    ],
  },
  {
    id: 'stage4',
    label: 'STAGE 4 · DHUHR → MAGHRIB',
    date: '26 May — The Key Window',
    title: 'The heart of the day',
    subtitle: 'Raise your hands and don’t stop.',
    color: '#f97316',
    highlight: true,
    items: [
      { id: 's4-1', text: 'Pray Dhuhr — the window is OPEN. Begin immediately.' },
      { id: 's4-2', text: 'Work through your duʼā list with full presence' },
      { id: 's4-3', text: 'Send salawāt on the Prophet ﷺ abundantly' },
      { id: 's4-4', text: 'Make istighfār — Astaghfirullāh — without stopping' },
      { id: 's4-5', text: 'Pray Asr and continue duʼā immediately after' },
      { id: 's4-6', text: 'Pour everything out in the last 15 minutes before Maghrib' },
    ],
  },
  {
    id: 'stage5',
    label: 'STAGE 5 · MAGHRIB & EVENING',
    date: '26 May — Evening',
    title: 'The day is done',
    subtitle: 'Give thanks.',
    color: '#10b981',
    items: [
      { id: 's5-1', text: 'Break your fast with duʼā at Maghrib (if fasting)' },
      { id: 's5-2', text: 'Pray Maghrib with full gratitude' },
      { id: 's5-3', text: 'Say Alhamdulillāh from the depths of your heart' },
      { id: 's5-4', text: 'Pray Isha and Witr' },
      { id: 's5-5', text: 'Sleep in a state of gratitude and hope' },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function safeLocalGet<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeLocalSet(key: string, value: unknown) {
  try {
    if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function buildTargetDate(maghribTime: string): Date {
  const [h, m] = maghribTime.split(':').map(Number);
  const target = new Date(`${ARAFAH_DATE}T00:00:00`);
  target.setHours(h, m, 0, 0);
  return target;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function OrangeDivider() {
  return (
    <div className="w-full flex items-center justify-center my-16">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f97316]/40 to-transparent" />
    </div>
  );
}

// Flip digit card
function FlipDigit({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== display) {
      setFlipping(true);
      const t = setTimeout(() => {
        setDisplay(value);
        setFlipping(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [value, display]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex items-center justify-center rounded-xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)',
          width: 'clamp(72px, 16vw, 120px)',
          height: 'clamp(84px, 18vw, 140px)',
        }}
      >
        <motion.span
          animate={{ rotateX: flipping ? 90 : 0, opacity: flipping ? 0 : 1 }}
          transition={{ duration: 0.22, ease: 'easeIn' }}
          className="font-mono text-[#f97316] font-bold select-none"
          style={{ fontSize: 'clamp(36px, 8vw, 72px)', lineHeight: 1 }}
        >
          {display}
        </motion.span>
        <div
          className="absolute inset-x-0 top-1/2 h-px"
          style={{ background: 'rgba(249,115,22,0.15)' }}
        />
      </div>
      <span className="text-[#a3a3a3] text-xs font-semibold tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

// Sortable dua item
function SortableDua({
  dua,
  index,
  onDelete,
  onCategoryChange,
}: {
  dua: Dua;
  index: number;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, cat: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: dua.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-3 rounded-xl"
      css-hover-class="group"
      data-group
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1 text-[#a3a3a3] hover:text-[#f97316] transition-colors cursor-grab active:cursor-grabbing shrink-0"
      >
        <GripVertical size={16} />
      </button>
      <span
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
        style={{ background: '#f97316' }}
      >
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[#f5f5f5] text-sm leading-relaxed break-words">{dua.text}</p>
        <select
          value={dua.category}
          onChange={(e) => onCategoryChange(dua.id, e.target.value)}
          className="mt-1 text-xs text-[#a3a3a3] bg-transparent border border-[#1f1f1f] rounded px-2 py-0.5 cursor-pointer hover:border-[#f97316]/50 transition-colors"
        >
          {DUA_CATEGORIES.map((c) => (
            <option key={c} value={c} style={{ background: '#141414' }}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => onDelete(dua.id)}
        className="shrink-0 text-[#a3a3a3] hover:text-red-400 transition-colors mt-1"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// Timeline item
function TimelineItem({
  time,
  icon,
  title,
  description,
  highlight = false,
  side = 'left',
  index = 0,
}: {
  time: string;
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
  side?: 'left' | 'right';
  index?: number;
}) {
  const cardStyle = {
    background: highlight ? 'rgba(249,115,22,0.06)' : 'rgba(255,255,255,0.02)',
    border: highlight ? '2px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.07)',
    boxShadow: highlight ? '0 0 24px rgba(249,115,22,0.15)' : 'none',
  };

  const cardContent = (
    <>
      {highlight && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs font-bold tracking-widest text-[#f97316] mb-2 uppercase"
        >
          ⭐ KEY WINDOW
        </motion.div>
      )}
      <div className="text-xs text-[#a3a3a3] mb-1">{time}</div>
      <div className="text-sm font-semibold text-[#f5f5f5] mb-1">{icon} {title}</div>
      <div className="text-xs text-[#a3a3a3] leading-relaxed">{description}</div>
    </>
  );

  return (
    <>
      {/* Desktop alternating */}
      <div className="hidden md:flex items-center gap-4 w-full">
        {side === 'left' ? (
          <>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl p-4 flex-1 max-w-[calc(50%-32px)]"
              style={cardStyle}
            >
              {cardContent}
            </motion.div>
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: highlight ? '#f97316' : '#3f3f3f' }} />
            <div className="flex-1" />
          </>
        ) : (
          <>
            <div className="flex-1" />
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: highlight ? '#f97316' : '#3f3f3f' }} />
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl p-4 flex-1 max-w-[calc(50%-32px)]"
              style={cardStyle}
            >
              {cardContent}
            </motion.div>
          </>
        )}
      </div>

      {/* Mobile single column */}
      <div className="flex md:hidden items-start gap-3 w-full">
        <div className="flex flex-col items-center">
          <div className="w-2.5 h-2.5 rounded-full mt-4 shrink-0" style={{ background: highlight ? '#f97316' : '#4f4f4f' }} />
          <div className="w-px flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 rounded-xl p-3 mb-3"
          style={cardStyle}
        >
          {cardContent}
        </motion.div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ArafahPage() {
  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [formData, setFormData] = useState<Profile>({
    name: '',
    city: '',
    intention: '',
    fasting: false,
    onHajj: false,
  });

  // Countdown
  const [maghribTime, setMaghribTime] = useState(DEFAULT_MAGHRIB);
  const [maghribCity, setMaghribCity] = useState(DEFAULT_CITY);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [countdownDone, setCountdownDone] = useState(false);
  const [loadingPrayer, setLoadingPrayer] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const targetRef = useRef<Date | null>(null);
  // Manual location fallback
  const [geoFailed, setGeoFailed] = useState(false);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualCity, setManualCity] = useState('');
  const [manualLocationLoading, setManualLocationLoading] = useState(false);

  // Timetable checklist
  const [timetableChecks, setTimetableChecks] = useState<Record<string, boolean>>({});
  const timetableRef = useRef<HTMLDivElement>(null);

  // Du'ā list
  const [duas, setDuas] = useState<Dua[]>([]);
  const [duaInput, setDuaInput] = useState('');
  const [duaCategory, setDuaCategory] = useState('General');
  const [showInspiration, setShowInspiration] = useState(false);
  const [savedImage, setSavedImage] = useState(false);
  const duaListRef = useRef<HTMLDivElement>(null);

  // Dhikr
  const [dhikrCounts, setDhikrCounts] = useState<Record<string, number>>({});
  const [activeDhikr, setActiveDhikr] = useState('tahlil_full');
  const [resetConfirm, setResetConfirm] = useState(false);

  // Curated duas
  const [duaFilter, setDuaFilter] = useState<string>('All');
  const [expandedDua, setExpandedDua] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── Init ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const saved = safeLocalGet<Profile | null>(STORAGE_PROFILE, null);
    if (saved?.name) {
      setProfile(saved);
      setIsReturning(true);
    } else {
      setShowModal(true);
    }

    const savedDuas = safeLocalGet<Dua[]>(STORAGE_DUAS, []);
    setDuas(savedDuas);

    const savedDhikr = safeLocalGet<Record<string, number>>(STORAGE_DHIKR, {});
    setDhikrCounts(savedDhikr);

    const savedTimetable = safeLocalGet<Record<string, boolean>>('arafah-timetable-2026', {});
    setTimetableChecks(savedTimetable);
  }, []);

  // Geolocation + prayer time fetch after profile set
  const profileRef = useRef<Profile | null>(null);
  const geoRequestedRef = useRef(false);

  const fetchPrayerTime = useCallback(async (lat: number, lng: number) => {
    setLoadingPrayer(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      const unix = Math.floor(new Date(`${ARAFAH_DATE}T12:00:00Z`).getTime() / 1000);
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${unix}?latitude=${lat}&longitude=${lng}&method=2`,
        { signal: controller.signal }
      );
      const json = await res.json();
      const mg: string = json?.data?.timings?.Maghrib ?? DEFAULT_MAGHRIB;
      setMaghribTime(mg);
      targetRef.current = buildTargetDate(mg);

      // Reverse geocode (separate short timeout)
      try {
        const geoCtrl = new AbortController();
        const geoTimer = setTimeout(() => geoCtrl.abort(), 5000);
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { signal: geoCtrl.signal }
        );
        clearTimeout(geoTimer);
        const geoJson = await geo.json();
        const addr = geoJson?.address;
        const city = addr?.city ?? addr?.town ?? addr?.village ?? addr?.state ?? DEFAULT_CITY;
        setMaghribCity(city);
        const cur = profileRef.current;
        if (cur) {
          const updated = { ...cur, city: cur.city || city };
          profileRef.current = updated;
          setProfile(updated);
          safeLocalSet(STORAGE_PROFILE, updated);
        }
      } catch {}
    } catch {
      setMaghribTime(DEFAULT_MAGHRIB);
      targetRef.current = buildTargetDate(DEFAULT_MAGHRIB);
    } finally {
      clearTimeout(timer);
      setLoadingPrayer(false);
    }
  }, []); // no profile dependency — uses profileRef instead

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    if (!profile || geoRequestedRef.current) return;
    geoRequestedRef.current = true;
    targetRef.current = buildTargetDate(DEFAULT_MAGHRIB);

    // Safety net: clear loading after 12s no matter what
    const safetyTimer = setTimeout(() => {
      setLoadingPrayer(false);
      setGeoFailed(true);
    }, 12000);

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(safetyTimer);
          fetchPrayerTime(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          clearTimeout(safetyTimer);
          setLoadingPrayer(false);
          setGeoFailed(true);
          targetRef.current = buildTargetDate(DEFAULT_MAGHRIB);
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    } else {
      clearTimeout(safetyTimer);
      setGeoFailed(true);
    }
  }, [profile, fetchPrayerTime]);

  // Countdown interval
  useEffect(() => {
    const tick = () => {
      if (!targetRef.current) return;
      const tl = calcTimeLeft(targetRef.current);
      setTimeLeft(tl);
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        const now = Date.now();
        const target = targetRef.current.getTime();
        if (now >= target) {
          setCountdownDone(true);
          if (!showConfetti) {
            setShowConfetti(true);
            fireConfetti();
          }
        }
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [showConfetti]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function fireConfetti() {
    import('canvas-confetti').then((mod) => {
      const confetti = mod.default;
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 }, colors: ['#f97316', '#fbbf24', '#fff'] });
    });
  }

  function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    const p: Profile = { ...formData };
    setProfile(p);
    safeLocalSet(STORAGE_PROFILE, p);
    setShowModal(false);

    // Save to Supabase (fire-and-forget)
    fetch('/api/arafah-visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: p.name, city: p.city, onHajj: p.onHajj, fasting: p.fasting }),
    }).catch(() => {});

    // Pre-fill intention as first dua
    if (p.intention.trim()) {
      const newDua: Dua = { id: crypto.randomUUID(), text: p.intention.trim(), category: 'General' };
      const updated = [newDua, ...duas];
      setDuas(updated);
      safeLocalSet(STORAGE_DUAS, updated);
    }
  }

  async function fetchPrayerTimeByCity(cityName: string) {
    if (!cityName.trim()) return;
    setManualLocationLoading(true);
    try {
      // Geocode city name via Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
      );
      const data = await res.json();
      if (data?.[0]) {
        const { lat, lon, display_name } = data[0];
        const shortCity = display_name.split(',')[0];
        setMaghribCity(shortCity);
        const cur = profileRef.current;
        if (cur) {
          const updated = { ...cur, city: shortCity };
          profileRef.current = updated;
          setProfile(updated);
          safeLocalSet(STORAGE_PROFILE, updated);
        }
        await fetchPrayerTime(parseFloat(lat), parseFloat(lon));
        setGeoFailed(false);
        setShowManualLocation(false);
      }
    } catch {
      // Keep defaults
    } finally {
      setManualLocationLoading(false);
    }
  }

  function toggleTimetableCheck(id: string) {
    const updated = { ...timetableChecks, [id]: !timetableChecks[id] };
    setTimetableChecks(updated);
    safeLocalSet('arafah-timetable-2026', updated);
  }

  async function saveTimetableImage() {
    if (!timetableRef.current) return;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(timetableRef.current, {
      scale: 2,
    } as Parameters<typeof html2canvas>[1]);
    const link = document.createElement('a');
    link.download = `arafah-plan-${profile?.name ?? 'my'}-1447.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function addDua() {
    if (!duaInput.trim()) return;
    const newDua: Dua = { id: crypto.randomUUID(), text: duaInput.trim(), category: duaCategory };
    const updated = [...duas, newDua];
    setDuas(updated);
    safeLocalSet(STORAGE_DUAS, updated);
    setDuaInput('');
  }

  function deleteDua(id: string) {
    const updated = duas.filter((d) => d.id !== id);
    setDuas(updated);
    safeLocalSet(STORAGE_DUAS, updated);
  }

  function updateCategory(id: string, cat: string) {
    const updated = duas.map((d) => (d.id === id ? { ...d, category: cat } : d));
    setDuas(updated);
    safeLocalSet(STORAGE_DUAS, updated);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = duas.findIndex((d) => d.id === active.id);
      const newIdx = duas.findIndex((d) => d.id === over.id);
      const updated = arrayMove(duas, oldIdx, newIdx);
      setDuas(updated);
      safeLocalSet(STORAGE_DUAS, updated);
    }
  }

  async function saveAsImage() {
    if (!duaListRef.current) return;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(duaListRef.current, {
      background: '#0a0a0a',
      scale: 2,
    } as Parameters<typeof html2canvas>[1]);
    const link = document.createElement('a');
    link.download = `arafah-duas-${profile?.name ?? 'my'}-1447.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setSavedImage(true);
    setTimeout(() => setSavedImage(false), 2000);
  }

  function tapDhikr() {
    const updated = { ...dhikrCounts, [activeDhikr]: (dhikrCounts[activeDhikr] ?? 0) + 1 };
    setDhikrCounts(updated);
    safeLocalSet(STORAGE_DHIKR, updated);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
  }

  function resetDhikr() {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
      return;
    }
    const updated = { ...dhikrCounts, [activeDhikr]: 0 };
    setDhikrCounts(updated);
    safeLocalSet(STORAGE_DHIKR, updated);
    setResetConfirm(false);
  }

  function copyArabic(id: string, arabic: string) {
    navigator.clipboard.writeText(arabic).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function addCuratedToList(dua: CuratedDua) {
    const newDua: Dua = { id: crypto.randomUUID(), text: dua.translation, category: 'Deen' };
    const updated = [...duas, newDua];
    setDuas(updated);
    safeLocalSet(STORAGE_DUAS, updated);
  }

  const filteredDuas = duaFilter === 'All'
    ? CURATED_DUAS
    : CURATED_DUAS.filter((d) => d.category === duaFilter);

  const totalDhikr = Object.values(dhikrCounts).reduce((a, b) => a + b, 0);
  const name = profile?.name ?? '';

  // ── Non-Hajj timetable ───────────────────────────────────────────────────

  const nonHajjTimeline = [
    { time: 'Pre-Dawn', icon: '🌙', title: 'Pray Fajr', description: 'Rise early, make du\'ā, begin your day with dhikr and istighfar.', highlight: false },
    { time: 'After Fajr', icon: '📖', title: 'Recite Quran', description: 'Read Quran and recite the morning adhkar from Hisnul Muslim.', highlight: false },
    { time: '08:00 – 11:00', icon: '🤲', title: 'Fast if Able', description: profile?.fasting ? 'You are fasting — may Allah accept it. Light activity; keep your heart anchored.' : 'Sunnah to fast today. Reflect, limit distraction, stay in a state of awareness.', highlight: false },
    { time: 'Before Dhuhr', icon: '✨', title: 'Review Your Du\'ā List', description: 'Make wudu. Open your list. Prepare your heart. The window opens soon.', highlight: false },
    { time: 'Dhuhr', icon: '🕌', title: 'Pray Dhuhr — Window Opens', description: 'Pray Dhuhr. The best time for du\'ā is now open until Maghrib. Raise your hands.', highlight: false },
    { time: 'Dhuhr → Maghrib', icon: '⭐', title: 'THE KEY WINDOW — Don\'t Stop', description: 'Salawat on the Prophet ﷺ · La ilaha illallah · Ask for everything on your list. This is it.', highlight: true },
    { time: 'Asr', icon: '🌅', title: 'Pray Asr', description: 'Pray Asr. Do not pause — continue du\'ā immediately after. The window is still open.', highlight: false },
    { time: 'Last 15 Minutes', icon: '⏳', title: 'Final Moments', description: 'Pour everything out. Weep if you can. Ask again. And again. These are precious seconds.', highlight: false },
    { time: 'Maghrib', icon: profile?.fasting ? '🍽️' : '🌇', title: profile?.fasting ? 'Break Your Fast & Pray' : 'Pray Maghrib', description: profile?.fasting ? 'Make du\'ā at iftar — accepted. Pray Maghrib. Say Alhamdulillah from the depths of your heart.' : 'Pray Maghrib. Say Alhamdulillah. May Allah accept everything.', highlight: false },
  ];

  const hajjTimeline = [
    { time: 'Pre-Dawn', icon: '🌙', title: 'Fajr in Mina', description: 'Pray Fajr in Mina. Prepare for the journey to Arafah. Pack light — your heart is the luggage.', highlight: false },
    { time: 'After Fajr', icon: '🚌', title: 'Travel to Arafah', description: 'Depart to the plains of Arafah. Recite talbiyah: لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ', highlight: false },
    { time: 'Dhuhr', icon: '🕌', title: 'Pray Dhuhr & Asr (Combined)', description: 'Combine Dhuhr and Asr at Dhuhr time (Qasr). The Wuquf — standing — has begun.', highlight: false },
    { time: 'Dhuhr → Maghrib', icon: '⭐', title: 'WUQUF — THE PILLAR OF HAJJ', description: 'Stand on Arafah. This is the Hajj. Raise your hands. Weep. Ask for everything. Don\'t sit idle.', highlight: true },
    { time: 'Before Sunset', icon: '⏳', title: 'Final Du\'ā on Arafah', description: 'The most powerful moments. Face Qibla. Raise hands. Call upon Allah by His names. Cry if you can.', highlight: false },
    { time: 'After Maghrib', icon: '🌃', title: 'Depart to Muzdalifah', description: 'Leave Arafah calmly after sunset. Recite dhikr. Do NOT pray Maghrib here — combine at Muzdalifah.', highlight: false },
    { time: 'Night in Muzdalifah', icon: '🌕', title: 'Sleep Under the Stars', description: 'Pray Maghrib + Isha combined. Collect pebbles for Rami. Sleep. Tomorrow is Eid.', highlight: false },
  ];

  const timeline = profile?.onHajj ? hajjTimeline : nonHajjTimeline;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: '#0a0a0a',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .font-amiri { font-family: 'Amiri', serif; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }

        @keyframes arafah-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(249,115,22,0.3); }
          50% { box-shadow: 0 0 40px rgba(249,115,22,0.6); }
        }
        .pulse-orange { animation: arafah-pulse 2s ease-in-out infinite; }

        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .scroll-bounce { animation: scroll-bounce 1.5s ease-in-out infinite; }

        .gold-gradient {
          background: linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .radial-glow {
          background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(249,115,22,0.08) 0%, transparent 70%),
                      #0a0a0a;
        }

        .grain-overlay::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9998;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(249,115,22,0.3) 20%, rgba(249,115,22,0.3) 80%, transparent);
          transform: translateX(-50%);
        }
      `}</style>

      {/* ── Welcome Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-2xl p-6 sm:p-8"
              style={{
                background: '#0f0f0f',
                border: '1px solid rgba(249,115,22,0.4)',
                boxShadow: '0 0 60px rgba(249,115,22,0.15)',
              }}
            >
              <div className="text-center mb-6">
                <p className="text-[#a3a3a3] text-xs tracking-widest uppercase mb-2">9 Dhul-Hijjah 1447</p>
                <h2
                  className="font-cormorant text-3xl sm:text-4xl text-[#f5f5f5] mb-1"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}
                >
                  Before we begin...
                </h2>
                <p className="text-[#a3a3a3] text-sm mt-2">
                  Tell us a little about yourself. Your data stays on your device.
                </p>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#a3a3a3] mb-1.5 tracking-wide">
                    What shall we call you? <span className="text-[#f97316]">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name..."
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-[#f5f5f5] placeholder-[#3f3f3f] outline-none focus:border-[#f97316]/60 transition-colors"
                    style={{ background: '#141414', border: '1px solid #1f1f1f' }}
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#a3a3a3] mb-1.5 tracking-wide">
                    Where are you joining from?
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                    placeholder="Your city..."
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-[#f5f5f5] placeholder-[#3f3f3f] outline-none focus:border-[#f97316]/60 transition-colors"
                    style={{ background: '#141414', border: '1px solid #1f1f1f' }}
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#a3a3a3] mb-1.5 tracking-wide">
                    What is your biggest du&apos;ā this Arafah? (private, stays on device)
                  </label>
                  <textarea
                    value={formData.intention}
                    onChange={(e) => {
                      if (e.target.value.length <= 200)
                        setFormData((p) => ({ ...p, intention: e.target.value }));
                    }}
                    placeholder="Pour your heart out..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-[#f5f5f5] placeholder-[#3f3f3f] outline-none resize-none focus:border-[#f97316]/60 transition-colors"
                    style={{ background: '#141414', border: '1px solid #1f1f1f' }}
                  />
                  <p className="text-right text-xs text-[#3f3f3f] mt-0.5">
                    {formData.intention.length}/200
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 rounded-lg p-3 flex items-center justify-between"
                    style={{ background: '#141414', border: '1px solid #1f1f1f' }}>
                    <span className="text-xs text-[#a3a3a3]">Fasting today?</span>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, fasting: !p.fasting }))}
                      className="text-xs font-semibold px-3 py-1 rounded-full transition-all"
                      style={{
                        background: formData.fasting ? '#f97316' : 'transparent',
                        color: formData.fasting ? '#000' : '#a3a3a3',
                        border: formData.fasting ? 'none' : '1px solid #3f3f3f',
                      }}
                    >
                      {formData.fasting ? 'YES' : 'NO'}
                    </button>
                  </div>
                  <div className="flex-1 rounded-lg p-3 flex items-center justify-between"
                    style={{ background: '#141414', border: '1px solid #1f1f1f' }}>
                    <span className="text-xs text-[#a3a3a3]">On Hajj?</span>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, onHajj: !p.onHajj }))}
                      className="text-xs font-semibold px-3 py-1 rounded-full transition-all"
                      style={{
                        background: formData.onHajj ? '#f97316' : 'transparent',
                        color: formData.onHajj ? '#000' : '#a3a3a3',
                        border: formData.onHajj ? 'none' : '1px solid #3f3f3f',
                      }}
                    >
                      {formData.onHajj ? 'YES' : 'NO'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-black text-sm transition-all active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #fbbf24)',
                    boxShadow: '0 4px 24px rgba(249,115,22,0.3)',
                  }}
                >
                  Begin my Arafah ✨
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Returning visitor greeting ───────────────────────────────────── */}
      <AnimatePresence>
        {isReturning && profile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5 }}
            className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-full text-sm text-[#f5f5f5]"
            style={{
              background: 'rgba(20,20,20,0.9)',
              border: '1px solid rgba(249,115,22,0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            Welcome back, {profile.name} 🤲
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Post-Maghrib overlay ─────────────────────────────────────────── */}
      <AnimatePresence>
        {countdownDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9990] flex flex-col items-center justify-center text-center px-6"
            style={{ background: 'rgba(0,0,0,0.97)' }}
          >
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-amiri text-5xl sm:text-7xl mb-4"
              style={{ fontFamily: 'Amiri, serif', color: '#fbbf24', direction: 'rtl' }}
            >
              الحمد لله
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="font-cormorant text-2xl sm:text-4xl text-[#f5f5f5] italic mb-3"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              May Allah accept your du&apos;ā{name ? `, ${name}` : ''}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-[#a3a3a3] text-sm"
            >
              Arafah 1447 has passed. May it be your best yet.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 radial-glow grain-overlay"
        style={{ minHeight: '100svh' }}
      >
        {/* Top date line */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-8 left-0 right-0 flex flex-col items-center gap-2"
        >
          <div className="h-px w-16" style={{ background: '#f97316' }} />
          <p className="text-[#a3a3a3] text-xs tracking-[0.25em] uppercase">
            9 Dhul-Hijjah 1447 · 26 May 2026
          </p>
        </motion.div>

        {/* Arabic title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="font-amiri gold-gradient mb-2"
            style={{
              fontFamily: 'Amiri, serif',
              fontSize: 'clamp(40px, 10vw, 84px)',
              direction: 'rtl',
              lineHeight: 1.3,
            }}
          >
            يَوْمُ عَرَفَة
          </p>
        </motion.div>

        {/* English subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-cormorant italic text-[#f5f5f5]/90"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(22px, 5vw, 42px)',
            fontStyle: 'italic',
          }}
        >
          The Day of Du&apos;ā
        </motion.p>

        {/* Personalized line */}
        {profile && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-3 text-[#a3a3a3] text-sm sm:text-base"
          >
            Bismillah, <span className="text-[#f97316]">{profile.name}</span>. Today is your day.
          </motion.p>
        )}

        {/* Hadith */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-8 max-w-xl w-full rounded-xl px-5 py-4 text-left"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderLeft: '3px solid #f97316',
          }}
        >
          <p
            className="font-amiri text-[#fbbf24] mb-2 leading-relaxed text-right text-base sm:text-lg"
            style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
          >
            مَا مِنْ يَوْمٍ أَكثَرَ مِنْ أَنْ يُعْتِق اللَّهُ فِيهِ عَبْدًا منَ النَّارِ مِنْ يَوْمِ عَرَفَةَ
          </p>
          <p className="text-[#a3a3a3] text-xs sm:text-sm leading-relaxed">
            &ldquo;There is no day on which Allah frees more people from the Fire than the Day of
            Arafah.&rdquo;
          </p>
          <p className="text-[#f97316] text-xs mt-1">— Sahih Muslim</p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 scroll-bounce text-[#3f3f3f]"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      <OrangeDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — COUNTDOWN
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-8 max-w-[1100px] mx-auto">
        <FadeUp>
          <h2
            className="font-cormorant text-center text-2xl sm:text-3xl text-[#f5f5f5] mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Until Arafah Ends
          </h2>
          <p className="text-center text-[#a3a3a3] text-xs sm:text-sm mb-3">
            {loadingPrayer
              ? 'Fetching prayer time for your location...'
              : `Counting down for ${name || 'you'} in ${profile?.city || maghribCity} · Maghrib at ${maghribTime}`}
          </p>

          {/* Manual location fallback */}
          {geoFailed && !loadingPrayer && (
            <div className="flex flex-col items-center gap-2 mb-6">
              <p className="text-xs text-[#a3a3a3]">
                Location not detected — showing Dubai defaults.{' '}
                <button
                  onClick={() => setShowManualLocation((v) => !v)}
                  className="text-[#f97316] underline underline-offset-2 hover:no-underline transition-all"
                >
                  Enter your city manually
                </button>
              </p>
              <AnimatePresence>
                {showManualLocation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 w-full max-w-sm"
                  >
                    <input
                      type="text"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchPrayerTimeByCity(manualCity)}
                      placeholder="e.g. London, Karachi, Cairo..."
                      className="flex-1 px-3 py-2 rounded-xl text-sm text-[#f5f5f5] placeholder-[#3f3f3f] outline-none"
                      style={{ background: '#141414', border: '1px solid #1f1f1f' }}
                    />
                    <button
                      onClick={() => fetchPrayerTimeByCity(manualCity)}
                      disabled={manualLocationLoading}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-black transition-all active:scale-95 disabled:opacity-50"
                      style={{ background: '#f97316' }}
                    >
                      {manualLocationLoading ? '...' : 'Go'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </FadeUp>

        {loadingPrayer ? (
          <div className="flex justify-center gap-4">
            {['DAYS', 'HOURS', 'MINS', 'SECS'].map((l) => (
              <div
                key={l}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="rounded-xl animate-pulse"
                  style={{
                    width: 'clamp(72px,16vw,120px)',
                    height: 'clamp(84px,18vw,140px)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                />
                <span className="text-xs text-[#3f3f3f] tracking-widest">{l}</span>
              </div>
            ))}
          </div>
        ) : (
          <FadeUp delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <FlipDigit value={pad(timeLeft.days)} label="DAYS" />
              <FlipDigit value={pad(timeLeft.hours)} label="HOURS" />
              <FlipDigit value={pad(timeLeft.minutes)} label="MINUTES" />
              <FlipDigit value={pad(timeLeft.seconds)} label="SECONDS" />
            </div>
          </FadeUp>
        )}
      </section>

      <OrangeDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2.5 — CURATED DU'ĀS OF ARAFAH
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-8 max-w-[1100px] mx-auto">
        <FadeUp>
          <h2
            className="font-cormorant text-center text-2xl sm:text-3xl text-[#f5f5f5] mb-1"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Du&apos;ās of Arafah
          </h2>
          <p className="text-center text-[#a3a3a3] text-sm mb-6">
            From the Quran, Sunnah, and the prayers of the Prophets. Raise your hands and ask.
          </p>
        </FadeUp>

        {/* Category filter — horizontal scroll on mobile */}
        <FadeUp delay={0.05}>
          <div
            className="flex gap-2 mb-8 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
            {CURATED_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setDuaFilter(cat)}
                className="px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap shrink-0"
                style={{
                  background: duaFilter === cat ? '#f97316' : 'rgba(255,255,255,0.03)',
                  color: duaFilter === cat ? '#000' : '#a3a3a3',
                  border: duaFilter === cat ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  fontWeight: duaFilter === cat ? 600 : 400,
                  minHeight: 36,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* Dua cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDuas.map((dua, i) => {
            const isExpanded = expandedDua === dua.id;
            const isCopied = copiedId === dua.id;
            return (
              <FadeUp key={dua.id} delay={i * 0.04}>
                <div
                  className="rounded-2xl overflow-hidden transition-all"
                  style={{
                    background: dua.category === 'Best of Arafah'
                      ? 'rgba(249,115,22,0.06)'
                      : 'rgba(255,255,255,0.02)',
                    border: dua.category === 'Best of Arafah'
                      ? '1px solid rgba(249,115,22,0.35)'
                      : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: dua.category === 'Best of Arafah'
                      ? '0 0 20px rgba(249,115,22,0.08)'
                      : 'none',
                  }}
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedDua(isExpanded ? null : dua.id)}
                    className="w-full text-left px-4 pt-4 pb-3 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {dua.category === 'Best of Arafah' && (
                          <span className="text-[10px] font-bold tracking-widest text-[#f97316] uppercase">
                            ⭐ Best of Arafah
                          </span>
                        )}
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.05)', color: '#a3a3a3' }}
                        >
                          {dua.category !== 'Best of Arafah' ? dua.category : ''}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#f5f5f5]">{dua.title}</p>
                      <p className="text-xs text-[#a3a3a3] mt-0.5">{dua.source}</p>
                    </div>
                    <ChevronDown
                      size={16}
                      className="text-[#a3a3a3] shrink-0 mt-1 transition-transform duration-300"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>

                  {/* Arabic preview (always visible) */}
                  <div className="px-4 pb-3">
                    <p
                      className="font-amiri text-[#fbbf24] leading-relaxed text-right"
                      style={{
                        fontFamily: 'Amiri, serif',
                        fontSize: 'clamp(16px,3.5vw,22px)',
                        direction: 'rtl',
                      }}
                    >
                      {isExpanded ? dua.arabic : dua.arabic.length > 80 ? dua.arabic.slice(0, 80) + '…' : dua.arabic}
                    </p>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-4 pb-4 space-y-3"
                          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          {/* Transliteration */}
                          <div className="pt-3">
                            <p className="text-[10px] text-[#a3a3a3] uppercase tracking-widest mb-1">Transliteration</p>
                            <p className="text-xs text-[#f5f5f5]/80 italic leading-relaxed">{dua.transliteration}</p>
                          </div>

                          {/* Translation */}
                          <div>
                            <p className="text-[10px] text-[#a3a3a3] uppercase tracking-widest mb-1">Translation</p>
                            <p className="text-sm text-[#f5f5f5] leading-relaxed">{dua.translation}</p>
                          </div>

                          {/* Note */}
                          {dua.note && (
                            <div
                              className="rounded-lg px-3 py-2"
                              style={{ background: 'rgba(249,115,22,0.06)', borderLeft: '2px solid rgba(249,115,22,0.4)' }}
                            >
                              <p className="text-xs text-[#a3a3a3] leading-relaxed">{dua.note}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => copyArabic(dua.id, dua.arabic)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                              style={{
                                background: isCopied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                                border: isCopied ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.08)',
                                color: isCopied ? '#4ade80' : '#a3a3a3',
                              }}
                            >
                              {isCopied ? <Check size={12} /> : <Download size={12} />}
                              {isCopied ? 'Copied!' : 'Copy Arabic'}
                            </button>
                            <button
                              onClick={() => addCuratedToList(dua)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                              style={{
                                background: 'rgba(249,115,22,0.08)',
                                border: '1px solid rgba(249,115,22,0.25)',
                                color: '#f97316',
                              }}
                            >
                              <Plus size={12} />
                              Add to my list
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </section>

      <OrangeDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — DU'Ā LIST BUILDER
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-8 max-w-[1100px] mx-auto">
        <FadeUp>
          <h2
            className="font-cormorant text-2xl sm:text-3xl text-[#f5f5f5] mb-1"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {name ? `${name}'s` : 'Your'} Du&apos;ā List
          </h2>
          <p className="text-[#a3a3a3] text-sm mb-6">
            {duas.length} du&apos;ā{duas.length !== 1 ? 's' : ''} written
          </p>
        </FadeUp>

        {/* Input row */}
        <FadeUp delay={0.1} className="mb-4">
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <textarea
                value={duaInput}
                onChange={(e) => setDuaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addDua();
                  }
                }}
                placeholder="Pour your heart out..."
                rows={2}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm text-[#f5f5f5] placeholder-[#3f3f3f] outline-none resize-none transition-colors"
                style={{ background: '#141414', border: '1px solid #1f1f1f' }}
              />
              <div className="flex flex-col gap-2">
                <select
                  value={duaCategory}
                  onChange={(e) => setDuaCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs text-[#a3a3a3] outline-none cursor-pointer"
                  style={{ background: '#141414', border: '1px solid #1f1f1f' }}
                >
                  {DUA_CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: '#141414' }}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addDua}
                  className="flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-black transition-all active:scale-95"
                  style={{ background: '#f97316', minHeight: 44 }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Inspiration chips */}
        <FadeUp delay={0.15} className="mb-6">
          <button
            onClick={() => setShowInspiration((p) => !p)}
            className="text-xs text-[#a3a3a3] hover:text-[#f97316] transition-colors mb-2 flex items-center gap-1"
          >
            Need inspiration? <ChevronDown size={12} className={`transition-transform ${showInspiration ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showInspiration && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {INSPIRATION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setDuaInput((p) => (p ? `${p} ${chip.toLowerCase()}` : chip))}
                    className="px-3 py-1.5 rounded-full text-xs text-[#a3a3a3] hover:text-[#f97316] hover:border-[#f97316]/50 transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {chip}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </FadeUp>

        {/* List */}
        <FadeUp delay={0.2}>
          <div
            ref={duaListRef}
            className="rounded-2xl overflow-hidden"
            style={{ background: '#0f0f0f', border: '1px solid #1f1f1f' }}
          >
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: '1px solid #1f1f1f' }}>
              <p
                className="font-cormorant text-lg text-[#fbbf24]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {name ? `${name}'s` : 'My'} Du&apos;ā List — Arafah 1447
              </p>
              <button
                onClick={saveAsImage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#a3a3a3] hover:text-[#f97316] transition-colors"
                style={{ border: '1px solid #1f1f1f' }}
              >
                {savedImage ? <Check size={14} className="text-green-400" /> : <Camera size={14} />}
                {savedImage ? 'Saved!' : 'Save as image'}
              </button>
            </div>

            {duas.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[#3f3f3f] text-sm">Add your first du&apos;ā above...</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={duas.map((d) => d.id)} strategy={verticalListSortingStrategy}>
                  <div className="divide-y" style={{ borderColor: '#1f1f1f' }}>
                    {duas.map((dua, i) => (
                      <SortableDua
                        key={dua.id}
                        dua={dua}
                        index={i}
                        onDelete={deleteDua}
                        onCategoryChange={updateCategory}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </FadeUp>
      </section>

      <OrangeDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3.5 — INTERACTIVE TIMETABLE CHECKLIST
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-8 max-w-[1100px] mx-auto">
        <FadeUp>
          <h2
            className="font-cormorant text-center text-2xl sm:text-3xl text-[#f5f5f5] mb-1"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Suggested Timetable
          </h2>
          <p className="text-center text-[#a3a3a3] text-sm mb-2">
            Look through it, see what you&apos;re able to do, then build your own plan below.
          </p>
          <div className="flex justify-center mb-8">
            <button
              onClick={saveTimetableImage}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-[#a3a3a3] hover:text-[#f97316] transition-colors"
              style={{ border: '1px solid #1f1f1f' }}
            >
              <Camera size={14} />
              Save timetable as image
            </button>
          </div>
        </FadeUp>

        <div ref={timetableRef} className="space-y-4" style={{ background: '#0a0a0a', padding: '4px' }}>
          {TIMETABLE_STAGES.map((stage, si) => {
            const checked = stage.items.filter((it) => timetableChecks[it.id]).length;
            const total = stage.items.length;
            const allDone = checked === total;
            return (
              // Plain motion.div with delay — NOT inView-based, so html2canvas captures all stages
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: si * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: stage.highlight ? 'rgba(249,115,22,0.05)' : 'rgba(255,255,255,0.02)',
                  borderLeft: `3px solid ${stage.color}`,
                  border: stage.highlight
                    ? `1px solid rgba(249,115,22,0.4)`
                    : `1px solid rgba(255,255,255,0.07)`,
                  borderLeftColor: stage.color,
                  borderLeftWidth: 3,
                  boxShadow: stage.highlight ? '0 0 20px rgba(249,115,22,0.1)' : 'none',
                }}
              >
                {/* Stage header */}
                <div
                  className="px-5 pt-4 pb-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1"
                        style={{ color: stage.color }}
                      >
                        {stage.label}
                      </p>
                      <p className="text-xs text-[#a3a3a3] mb-1">{stage.date}</p>
                      <p className="text-base font-semibold text-[#f5f5f5]">{stage.title}</p>
                      <p className="text-xs text-[#a3a3a3]">{stage.subtitle}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className="text-lg font-bold tabular-nums"
                        style={{ color: allDone ? '#4ade80' : stage.color }}
                      >
                        {checked} / {total}
                      </p>
                      <p className="text-[10px] text-[#a3a3a3]">
                        {allDone ? '✓ Done' : 'completed'}
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: allDone ? '#4ade80' : stage.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(checked / total) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="px-5 py-3 space-y-1">
                  {stage.items.map((item) => {
                    const done = !!timetableChecks[item.id];
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleTimetableCheck(item.id)}
                        className="w-full flex items-center gap-3 text-left rounded-xl px-3 py-2.5 transition-all active:scale-[0.99]"
                        style={{
                          background: done ? 'rgba(74,222,128,0.06)' : 'transparent',
                          minHeight: 44,
                        }}
                      >
                        <div
                          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all"
                          style={{
                            background: done ? '#4ade80' : 'transparent',
                            border: done ? 'none' : `1.5px solid rgba(255,255,255,0.35)`,
                            boxShadow: done ? 'none' : `0 0 0 1px ${stage.color}22`,
                          }}
                        >
                          {done && <Check size={11} color="#000" strokeWidth={3} />}
                        </div>
                        <p
                          className="text-sm leading-snug transition-colors flex-1"
                          style={{
                            color: done ? '#6b7280' : '#e5e5e5',
                            textDecoration: done ? 'line-through' : 'none',
                          }}
                        >
                          {item.text}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <OrangeDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — TIMETABLE
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-8 max-w-[1100px] mx-auto">
        <FadeUp>
          <h2
            className="font-cormorant text-center text-2xl sm:text-3xl text-[#f5f5f5] mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {profile?.onHajj
              ? `${name ? `${name}'s` : 'Your'} Hajj Day Plan`
              : 'Your Arafah Plan'}
          </h2>
          <p className="text-center text-[#a3a3a3] text-sm mb-10">
            {profile?.onHajj
              ? 'MashaAllah — you are on Hajj. May Allah accept your Wuquf.'
              : 'A guide to making the most of every moment.'}
          </p>
        </FadeUp>

        {/* Desktop: center line */}
        <div className="relative hidden md:block">
          <div className="timeline-line" />
          <div className="space-y-6 py-4">
            {timeline.map((item, i) => (
              <TimelineItem
                key={i}
                {...item}
                side={i % 2 === 0 ? 'left' : 'right'}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden relative">
          <div
            className="absolute left-1 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.3) 10%, rgba(249,115,22,0.3) 90%, transparent)' }}
          />
          {timeline.map((item, i) => (
            <TimelineItem key={i} {...item} side="left" index={i} />
          ))}
        </div>
      </section>

      <OrangeDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — DHIKR COUNTER
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-8 max-w-[600px] mx-auto">
        <FadeUp>
          <h2
            className="font-cormorant text-center text-2xl sm:text-3xl text-[#f5f5f5] mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Dhikr Counter
          </h2>
          <p className="text-center text-[#a3a3a3] text-sm mb-8">
            Tap the card to count. Keep your tongue moist with remembrance.
          </p>
        </FadeUp>

        {/* Dhikr selector */}
        <FadeUp delay={0.1} className="flex gap-2 mb-4 flex-wrap justify-center">
          {DHIKRS.map((d) => (
            <button
              key={d.key}
              onClick={() => setActiveDhikr(d.key)}
              className="px-3 py-2 rounded-xl text-xs transition-all"
              style={{
                background: activeDhikr === d.key ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                border: activeDhikr === d.key ? '1px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.06)',
                color: activeDhikr === d.key ? '#f97316' : '#a3a3a3',
              }}
            >
              <span
                className="font-amiri block text-sm mb-0.5"
                style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
              >
                {d.arabic}
              </span>
              <span>{d.transliteration}</span>
            </button>
          ))}
        </FadeUp>

        {/* Big tap area */}
        <FadeUp delay={0.15}>
          <motion.button
            onClick={tapDhikr}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-2xl py-12 flex flex-col items-center justify-center gap-3 cursor-pointer select-none pulse-orange"
            style={{
              background: 'rgba(249,115,22,0.05)',
              border: '1px solid rgba(249,115,22,0.25)',
              minHeight: 200,
            }}
          >
            <p
              className="font-amiri gold-gradient"
              style={{
                fontFamily: 'Amiri, serif',
                fontSize: 'clamp(22px,5vw,36px)',
                direction: 'rtl',
              }}
            >
              {DHIKRS.find((d) => d.key === activeDhikr)?.arabic}
            </p>
            <motion.p
              key={dhikrCounts[activeDhikr] ?? 0}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl sm:text-7xl font-bold text-[#f97316]"
            >
              {dhikrCounts[activeDhikr] ?? 0}
            </motion.p>
            <p className="text-[#a3a3a3] text-xs">TAP TO COUNT</p>
          </motion.button>

          <div className="flex items-center justify-between mt-4">
            <p className="text-[#a3a3a3] text-xs">
              Total dhikr today: <span className="text-[#f97316] font-semibold">{totalDhikr}</span>
            </p>
            <button
              onClick={resetDhikr}
              className="flex items-center gap-1.5 text-xs transition-colors px-3 py-1.5 rounded-lg"
              style={{
                color: resetConfirm ? '#ef4444' : '#a3a3a3',
                border: `1px solid ${resetConfirm ? 'rgba(239,68,68,0.4)' : '#1f1f1f'}`,
              }}
            >
              <RotateCcw size={12} />
              {resetConfirm ? 'Confirm reset?' : 'Reset'}
            </button>
          </div>
        </FadeUp>
      </section>

      <OrangeDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer className="px-4 py-16 text-center max-w-[1100px] mx-auto">
        <FadeUp>
          <p
            className="font-amiri gold-gradient mb-2"
            style={{
              fontFamily: 'Amiri, serif',
              fontSize: 'clamp(28px,6vw,52px)',
              direction: 'rtl',
            }}
          >
            تَقَبَّلَ اللهُ مِنَّا وَمِنْكُمْ
          </p>
          <p className="text-[#a3a3a3] text-sm mb-4">May Allah accept from us and from you</p>
          {name && (
            <p className="text-[#f5f5f5] text-sm mb-6">
              Jazakallahu Khairan, <span className="text-[#f97316]">{name}</span>. May this be your
              best Arafah yet.
            </p>
          )}
          <p className="text-[#3f3f3f] text-xs mb-6">
            Made with du&apos;ā · Arafah 1447 · zeebuild.com
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-[#a3a3a3] hover:text-[#f97316] transition-colors underline underline-offset-4"
          >
            Edit my profile
          </button>
        </FadeUp>
      </footer>
    </div>
  );
}
