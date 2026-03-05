import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { MotoScoutThemeProvider } from './motoscout-theme-provider';
import './motoscout.css';

export const metadata = {
  title: 'MotoScout - Find bikes fast',
  description: 'Motorcycle listing aggregator with alerts',
};

export default async function MotoScoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="motoscout" className="motoscout-root">
      <MotoScoutThemeProvider>
        {children}
      </MotoScoutThemeProvider>
    </div>
  );
}
