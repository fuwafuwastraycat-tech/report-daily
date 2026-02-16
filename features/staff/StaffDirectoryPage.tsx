'use client';

import { useEffect, useState } from 'react';
import { Card, PrimaryButton, SectionTitle } from '@/components/ui';
import { addStaff, getAllStaffs, toggleStaffActive } from '@/lib/mockApi';
import { Staff } from '@/lib/types';

export function StaffDirectoryPage() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');

  const load = () => getAllStaffs().then(setStaffs);
  useEffect(() => load(), []);

  return (
    <div className="space-y-3">
      <SectionTitle title="スタッフディレクトリ" />
      <Card className="space-y-2">
        <input placeholder="表示名" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="イベント会社(任意)" value={company} onChange={(e) => setCompany(e.target.value)} />
        <PrimaryButton onClick={async () => { if (!name) return; await addStaff({ displayName: name, eventCompany: company, active: true }); setName(''); setCompany(''); load(); }}>スタッフ追加</PrimaryButton>
      </Card>
      {staffs.map((s) => (
        <Card key={s.id} className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{s.displayName}</h3>
            <p className="text-xs text-slate-500">{s.eventCompany || '販社なし'}</p>
          </div>
          <button className="rounded-xl border px-3 py-2 text-sm" onClick={async () => { await toggleStaffActive(s.id); load(); }}>
            {s.active ? 'active' : 'inactive'}
          </button>
        </Card>
      ))}
    </div>
  );
}
