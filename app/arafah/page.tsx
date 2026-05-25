'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
  { key: 'tahlil', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah' },
  { key: 'tasbih', arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah' },
  { key: 'takbir', arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar' },
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const card = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-xl p-4 flex-1 max-w-[calc(50%-32px)] ${
        highlight
          ? 'border-2 shadow-lg'
          : 'border'
      }`}
      style={{
        background: highlight ? 'rgba(249,115,22,0.06)' : 'rgba(255,255,255,0.02)',
        border: highlight ? '2px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: highlight ? '0 0 24px rgba(249,115,22,0.15)' : 'none',
      }}
    >
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
      <div className="text-sm font-semibold text-[#f5f5f5] mb-1">
        {icon} {title}
      </div>
      <div className="text-xs text-[#a3a3a3] leading-relaxed">{description}</div>
    </motion.div>
  );

  // Mobile: always single column
  return (
    <>
      {/* Desktop alternating layout */}
      <div className="hidden md:flex items-center gap-4 w-full">
        {side === 'left' ? (
          <>
            {card}
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: highlight ? '#f97316' : '#3f3f3f' }}
            />
            <div className="flex-1" />
          </>
        ) : (
          <>
            <div className="flex-1" />
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: highlight ? '#f97316' : '#3f3f3f' }}
            />
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-xl p-4 flex-1 max-w-[calc(50%-32px)]`}
              style={{
                background: highlight ? 'rgba(249,115,22,0.06)' : 'rgba(255,255,255,0.02)',
                border: highlight ? '2px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: highlight ? '0 0 24px rgba(249,115,22,0.15)' : 'none',
              }}
            >
              {highlight && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xs font-bold tracking-widest text-[#f97316] mb-2 uppercase"
                >
                  ⭐ KEY WINDOW
                </motion.div>
              )}
              <div className="text-xs text-[#a3a3a3] mb-1">{time}</div>
              <div className="text-sm font-semibold text-[#f5f5f5] mb-1">
                {icon} {title}
              </div>
              <div className="text-xs text-[#a3a3a3] leading-relaxed">{description}</div>
            </motion.div>
          </>
        )}
      </div>

      {/* Mobile single column */}
      <div className="flex md:hidden items-start gap-3 w-full">
        <div className="flex flex-col items-center">
          <div
            className="w-2.5 h-2.5 rounded-full mt-4 shrink-0"
            style={{ background: highlight ? '#f97316' : '#3f3f3f' }}
          />
          <div className="w-px flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.06 }}
          className="flex-1 rounded-xl p-3 mb-3"
          style={{
            background: highlight ? 'rgba(249,115,22,0.06)' : 'rgba(255,255,255,0.02)',
            border: highlight ? '2px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.06)',
            boxShadow: highlight ? '0 0 16px rgba(249,115,22,0.12)' : 'none',
          }}
        >
          {highlight && (
            <div className="text-xs font-bold tracking-widest text-[#f97316] mb-1 uppercase">
              ⭐ KEY WINDOW
            </div>
          )}
          <div className="text-xs text-[#a3a3a3] mb-0.5">{time}</div>
          <div className="text-sm font-semibold text-[#f5f5f5] mb-1">
            {icon} {title}
          </div>
          <div className="text-xs text-[#a3a3a3] leading-relaxed">{description}</div>
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

  // Du'ā list
  const [duas, setDuas] = useState<Dua[]>([]);
  const [duaInput, setDuaInput] = useState('');
  const [duaCategory, setDuaCategory] = useState('General');
  const [showInspiration, setShowInspiration] = useState(false);
  const [savedImage, setSavedImage] = useState(false);
  const duaListRef = useRef<HTMLDivElement>(null);

  // Dhikr
  const [dhikrCounts, setDhikrCounts] = useState<Record<string, number>>({});
  const [activeDhikr, setActiveDhikr] = useState('tahlil');
  const [resetConfirm, setResetConfirm] = useState(false);

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
  }, []);

  // Geolocation + prayer time fetch after profile set
  const fetchPrayerTime = useCallback(async (lat: number, lng: number) => {
    setLoadingPrayer(true);
    try {
      const unix = Math.floor(new Date(`${ARAFAH_DATE}T12:00:00Z`).getTime() / 1000);
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${unix}?latitude=${lat}&longitude=${lng}&method=2`
      );
      const json = await res.json();
      const mg: string = json?.data?.timings?.Maghrib ?? DEFAULT_MAGHRIB;
      setMaghribTime(mg);
      targetRef.current = buildTargetDate(mg);

      // Reverse geocode
      try {
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const geoJson = await geo.json();
        const addr = geoJson?.address;
        const city = addr?.city ?? addr?.town ?? addr?.village ?? addr?.state ?? DEFAULT_CITY;
        setMaghribCity(city);
        if (profile) {
          const updated = { ...profile, city: profile.city || city };
          setProfile(updated);
          safeLocalSet(STORAGE_PROFILE, updated);
        }
      } catch {}
    } catch {
      setMaghribTime(DEFAULT_MAGHRIB);
      targetRef.current = buildTargetDate(DEFAULT_MAGHRIB);
    } finally {
      setLoadingPrayer(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    // Set default target
    targetRef.current = buildTargetDate(DEFAULT_MAGHRIB);
    // Request geolocation
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchPrayerTime(pos.coords.latitude, pos.coords.longitude),
        () => {
          setLoadingPrayer(false);
          targetRef.current = buildTargetDate(DEFAULT_MAGHRIB);
        }
      );
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

    // Pre-fill intention as first dua
    if (p.intention.trim()) {
      const newDua: Dua = { id: crypto.randomUUID(), text: p.intention.trim(), category: 'General' };
      const updated = [newDua, ...duas];
      setDuas(updated);
      safeLocalSet(STORAGE_DUAS, updated);
    }
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
          <p className="text-center text-[#a3a3a3] text-xs sm:text-sm mb-8">
            {loadingPrayer
              ? 'Fetching prayer time for your location...'
              : `Counting down for ${name || 'you'} in ${profile?.city || maghribCity} · Maghrib at ${maghribTime}`}
          </p>
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
