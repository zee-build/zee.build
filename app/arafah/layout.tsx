import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Day of Arafah — Du\'ā Tool | Arafah 1447',
  description:
    'A personalized Arafah countdown, du\'ā list builder, timetable, and dhikr counter for Muslims around the world. Arafah 9 Dhul-Hijjah 1447 — 26 May 2026.',
  openGraph: {
    title: 'Day of Arafah — Du\'ā Tool | Arafah 1447',
    description:
      'Countdown to Maghrib, build your du\'ā list, follow your Arafah plan — for Muslims everywhere.',
    url: 'https://zeebuild.com/arafah',
    siteName: 'ZeeBuild',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Day of Arafah — Du\'ā Tool | Arafah 1447',
    description: 'Your personalized Arafah companion. Countdown · Du\'ā List · Timetable · Dhikr.',
  },
};

export default function ArafahLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
