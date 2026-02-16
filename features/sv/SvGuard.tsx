'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { hasSvSession } from '@/lib/mockApi';

export function SvGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!hasSvSession()) router.push('/sv');
    else setOk(true);
  }, [router]);

  if (!ok) return <p className="text-sm text-slate-500">認証確認中...</p>;
  return <>{children}</>;
}
