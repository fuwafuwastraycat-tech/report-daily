import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Telecom Sales Daily Report',
  description: 'Mock UI scaffold for sales reporting'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <main className="mx-auto min-h-screen max-w-md bg-slate-50 px-4 pb-24 pt-4">{children}</main>
      </body>
    </html>
  );
}
