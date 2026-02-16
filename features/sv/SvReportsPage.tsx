'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, Chip, SectionTitle } from '@/components/ui';
import { getAllStaffs, getReports } from '@/lib/mockApi';
import { Report, Staff } from '@/lib/types';

export function SvReportsPage() {
  const params = useSearchParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [filter, setFilter] = useState(params.get('filter') || '');

  useEffect(() => {
    getReports().then(setReports);
    getAllStaffs().then(setStaffs);
  }, []);

  const list = reports.filter((r) => {
    if (filter === 'unevaluated') return r.status === 'submitted' && !r.svReview?.rating;
    if (filter === 'unlock-requested') return r.unlockRequest?.status === 'pending';
    if (filter === 'locked') return r.locked;
    return true;
  });

  const staffName = (id: string) => staffs.find((s) => s.id === id)?.displayName || id;

  return (
    <div className="space-y-3">
      <SectionTitle title="SV 日報一覧" />
      <div className="flex gap-2">
        <Chip active={view === 'card'} onClick={() => setView('card')}>Card</Chip>
        <Chip active={view === 'table'} onClick={() => setView('table')}>Table</Chip>
      </div>
      <div className="flex flex-wrap gap-2">
        {['', 'unevaluated', 'unlock-requested', 'locked'].map((f) => (
          <Chip key={f || 'all'} active={filter === f} onClick={() => setFilter(f)}>{f || 'all'}</Chip>
        ))}
      </div>

      {view === 'card' ? (
        list.map((r) => (
          <Link key={r.id} href={`/sv/report/${r.id}`}>
            <Card>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{staffName(r.staffId)} / {r.workDate}</p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{r.svReview?.rating || '未評価'}</span>
              </div>
              <p className="text-sm text-slate-600">{r.storeOrVenue}</p>
              <p className="line-clamp-1 text-sm">{r.success?.title || '-'}</p>
              {r.unlockRequest?.status === 'pending' ? <span className="text-xs text-amber-600">解除申請あり</span> : null}
            </Card>
          </Link>
        ))
      ) : (
        <Card>
          <table className="w-full text-left text-sm">
            <thead><tr><th>日付</th><th>担当</th><th>評価</th></tr></thead>
            <tbody>{list.map((r) => <tr key={r.id}><td><Link href={`/sv/report/${r.id}`}>{r.workDate}</Link></td><td>{staffName(r.staffId)}</td><td>{r.svReview?.rating || '-'}</td></tr>)}</tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
