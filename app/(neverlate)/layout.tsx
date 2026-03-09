import './neverlate.css';

export const metadata = {
  title: 'NeverLate - Life Admin OS',
  description: 'Track passports, visas, licenses, subscriptions, and family renewals in one calm, simple place.',
};

export default function NeverLateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="neverlate" className="neverlate-root">
      {children}
    </div>
  );
}
