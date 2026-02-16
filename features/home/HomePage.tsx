'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Card, PrimaryButton, SectionTitle } from '@/components/ui';
import { getKnowledge, getReports, getSavedStaffSelection } from '@/lib/mockApi';

export function HomePage() {
  const [hasToday, setHasToday] = useState(false);
  const [latestKnowledge, setLatestKnowledge] = useState<{ id: string; title: string; body: string } | null>(null);
  const [stats, setStats] = useState({ weekly: [2, 4, 3, 5, 1, 3, 4], monthlyS: 2, knowledgeCount: 0 });

  useEffect(() => {
    const init = async () => {
      const selectedStaff = getSavedStaffSelection();
      const reports = await getReports();
      const today = new Date().toISOString().slice(0, 10);
      setHasToday(reports.some((r) => r.staffId === selectedStaff && r.workDate === today));
      const k = await getKnowledge();
      setLatestKnowledge(k[0] || null);
      setStats((v) => ({ ...v, knowledgeCount: k.length, monthlyS: reports.filter((r) => r.svReview?.rating === 'S').length }));
    };
    init();
  }, []);

  const max = useMemo(() => Math.max(...stats.weekly), [stats.weekly]);

  return (
    <div className="space-y-4">
      <SectionTitle title="営業日報" subtitle="今日の活動を6ステップで記録" />
      <Link href="/report/today">
        <PrimaryButton>{hasToday ? '今日の日報を編集' : '今日の日報を入力'}</PrimaryButton>
      </Link>

      <Card>
        <h3 className="mb-3 text-base font-bold">成長メーター</h3>
        <div className="mb-4 flex h-20 items-end gap-2">
          {stats.weekly.map((v, idx) => (
            <div key={idx} className="flex-1 rounded-t-md bg-primary/70" style={{ height: `${(v / max) * 100}%` }} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="rounded-xl bg-slate-100 p-2">今月S評価: <b>{stats.monthlyS}</b></p>
          <p className="rounded-xl bg-slate-100 p-2">ナレッジ数: <b>{stats.knowledgeCount}</b></p>
        </div>
      </Card>

      <Card>
        <p className="mb-1 text-xs text-slate-500">最新ナレッジ</p>
        <h4 className="font-semibold">{latestKnowledge?.title || 'ナレッジはまだありません'}</h4>
        <p className="line-clamp-2 text-sm text-slate-600">{latestKnowledge?.body || 'S評価日報から自動登録されます。'}</p>
        <Link href="/knowledge" className="mt-3 inline-block text-sm font-medium text-primary">
          ナレッジ一覧へ
        </Link>
      </Card>

      <div className="flex gap-2 text-xs">
        <Link href="/reports/me" className="rounded-xl border border-slate-200 px-3 py-2">自分の日報一覧</Link>
        <Link href="/sv" className="rounded-xl border border-slate-200 px-3 py-2">SV画面</Link>
      </div>
    </div>
  );
}
