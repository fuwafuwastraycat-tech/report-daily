'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, SectionTitle } from '@/components/ui';
import { getMyReports, getSavedStaffSelection } from '@/lib/mockApi';
import { Report } from '@/lib/types';

export function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const staffId = getSavedStaffSelection();
    if (!staffId) return;
    getMyReports(staffId).then(setReports);
  }, []);

  return (
    <div className="space-y-3">
      <SectionTitle title="自分の日報一覧" />
      {reports.map((r) => (
        <Card key={r.id}>
          <p className="text-xs text-slate-500">{r.workDate}</p>
          <h3 className="font-semibold">{r.storeOrVenue}</h3>
          <p className="text-sm">ステータス: {r.status}</p>
          <p className="text-sm">評価: {r.svReview?.rating || '未評価'}</p>
        </Card>
      ))}
      <Link href="/" className="text-sm text-primary">ホームに戻る</Link>
    </div>
  );
}
