'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, PrimaryButton, SectionTitle } from '@/components/ui';
import { getReports } from '@/lib/mockApi';

export function SvDashboardPage() {
  const [counts, setCounts] = useState({ unevaluated: 0, unlock: 0, today: 0 });

  useEffect(() => {
    getReports().then((reports) => {
      const today = new Date().toISOString().slice(0, 10);
      setCounts({
        unevaluated: reports.filter((r) => r.status === 'submitted' && !r.svReview?.rating).length,
        unlock: reports.filter((r) => r.unlockRequest?.status === 'pending').length,
        today: reports.filter((r) => r.workDate === today && r.status === 'submitted').length
      });
    });
  }, []);

  return (
    <div className="space-y-3">
      <SectionTitle title="SV ダッシュボード" />
      <Card className="space-y-2 border-2 border-primary/40">
        <p className="text-sm text-slate-600">未評価日報数</p>
        <p className="text-3xl font-bold">{counts.unevaluated}</p>
        <Link href="/sv/reports?filter=unevaluated"><PrimaryButton>未評価のみ開く</PrimaryButton></Link>
      </Card>
      <Card><p>ロック解除申請: <b>{counts.unlock}</b></p></Card>
      <Card><p>本日提出: <b>{counts.today}</b></p></Card>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Link href="/sv/reports" className="rounded-xl border p-3">日報一覧</Link>
        <Link href="/sv/staff-directory" className="rounded-xl border p-3">スタッフ管理</Link>
        <Link href="/sv/knowledge" className="rounded-xl border p-3">ナレッジ管理</Link>
      </div>
    </div>
  );
}
