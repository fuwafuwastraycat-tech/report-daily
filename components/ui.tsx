'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx('rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100', className)}>{children}</section>;
}

export function PrimaryButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx('min-h-12 w-full rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-white active:scale-[0.99]', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx('min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function Chip({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx('rounded-full border px-3 py-1 text-xs', active ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-600')}
    >
      {children}
    </button>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-3">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
    </header>
  );
}

export function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
      {label}
    </Link>
  );
}
