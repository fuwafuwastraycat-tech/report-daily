'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Chip, PrimaryButton, SecondaryButton, SectionTitle } from '@/components/ui';
import {
  findOrCreateTodayReport,
  getActiveStaffs,
  getReportById,
  getSavedStaffSelection,
  reportCauseTags,
  requestUnlock,
  saveStaffSelection,
  submitReport,
  updateReport
} from '@/lib/mockApi';
import { Staff } from '@/lib/types';

const customerTypes = ['18歳以下', 'ファミリー', 'シニア', '外国籍', '乗り換え検討層', '不明'];
const visitPurpose = ['MNP検討', '新規', '機種変更', '料金見直し', '光/でんき相談', '手続き目的', '立ち寄り'];
const unlockReasons = ['記載ミス', '追記したい成果', 'SVコメント対応', 'その他'];

export function ReportTodayPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [unlockReason, setUnlockReason] = useState(unlockReasons[0]);
  const [unlockMemo, setUnlockMemo] = useState('');

  const [form, setForm] = useState({
    workDate: new Date().toISOString().slice(0, 10),
    staffId: '',
    eventCompany: '',
    storeOrVenue: '',
    photos: [] as string[],
    visitors: '',
    catchCount: '',
    seated: '',
    prospects: '',
    seatedBreakdown: { auUq: '', sbYm: '', docomoAhamo: '', rakuten: '', other: '' },
    acquisitions: { auMnp: '', auNew: '', uqSim: '', uqHs: '' },
    ltv: { hikari: '', bl: '', commufa: '', denki: '', goldSilver: '' },
    success: { title: '', customerTypes: [] as string[], visitPurpose: '', keyTalk: '', reason: '', other: '' },
    failure: { title: '', causeTag: '', nextAction: '', impression: '', notes: '' }
  });

  useEffect(() => {
    getActiveStaffs().then((data) => {
      setStaffs(data);
      const saved = getSavedStaffSelection();
      if (saved) setForm((v) => ({ ...v, staffId: saved }));
    });
  }, []);

  const progressText = `${step}/6`;

  const onPhotoUpload = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, 3 - form.photos.length);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setForm((v) => ({ ...v, photos: [...v.photos, String(reader.result)] }));
      reader.readAsDataURL(file);
    });
  };

  const saveStep = async () => {
    if (step === 1) {
      if (!form.staffId || !form.eventCompany || !form.storeOrVenue) {
        alert('STEP1の必須項目を入力してください');
        return false;
      }
      saveStaffSelection(form.staffId);
      const report = await findOrCreateTodayReport({
        workDate: form.workDate,
        staffId: form.staffId,
        eventCompany: form.eventCompany,
        storeOrVenue: form.storeOrVenue,
        photos: form.photos
      });
      setReportId(report.id);
      setLocked(report.locked);
      return true;
    }

    if (!reportId) return false;
    if (step === 2) {
      await updateReport(reportId, {
        visitors: Number(form.visitors || 0),
        catchCount: Number(form.catchCount || 0),
        seated: Number(form.seated || 0),
        prospects: Number(form.prospects || 0),
        seatedBreakdown: Object.fromEntries(Object.entries(form.seatedBreakdown).map(([k, v]) => [k, Number(v || 0)]))
      });
    }
    if (step === 3) {
      await updateReport(reportId, { acquisitions: Object.fromEntries(Object.entries(form.acquisitions).map(([k, v]) => [k, Number(v || 0)])) });
    }
    if (step === 4) {
      await updateReport(reportId, { ltv: Object.fromEntries(Object.entries(form.ltv).map(([k, v]) => [k, Number(v || 0)])) });
    }
    if (step === 5) {
      await updateReport(reportId, { success: form.success });
    }
    if (step === 6) {
      await updateReport(reportId, { failure: form.failure });
    }
    return true;
  };

  const onNext = async () => {
    if (locked) return;
    const ok = await saveStep();
    if (!ok) return;
    if (step < 6) setStep((v) => v + 1);
    else {
      if (reportId) await submitReport(reportId);
      alert('日報を提出しました');
      router.push('/reports/me');
    }
  };

  const loadExisting = async () => {
    if (!form.staffId) return;
    const report = await findOrCreateTodayReport({
      workDate: form.workDate,
      staffId: form.staffId,
      eventCompany: form.eventCompany || staffs.find((s) => s.id === form.staffId)?.eventCompany || '',
      storeOrVenue: form.storeOrVenue || '未入力',
      photos: form.photos
    });
    const full = await getReportById(report.id);
    if (!full) return;
    setReportId(full.id);
    setLocked(full.locked);
  };

  useEffect(() => {
    if (form.staffId) loadExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.staffId]);

  const dots = useMemo(() => Array.from({ length: 6 }), []);

  return (
    <div className="space-y-4 pb-20">
      <SectionTitle title="本日の日報" subtitle={`進捗 ${progressText}`} />
      <div className="flex gap-1">
        {dots.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${i + 1 <= step ? 'bg-primary' : 'bg-slate-200'}`} />
        ))}
      </div>

      {locked ? (
        <Card className="border border-amber-200 bg-amber-50">
          <p className="text-sm font-semibold text-amber-700">この日報はロック中です</p>
          <SecondaryButton className="mt-2" onClick={() => setUnlockOpen((v) => !v)}>
            ロック解除申請
          </SecondaryButton>
          {unlockOpen ? (
            <div className="mt-2 space-y-2">
              <select value={unlockReason} onChange={(e) => setUnlockReason(e.target.value)}>
                {unlockReasons.map((r) => <option key={r}>{r}</option>)}
              </select>
              <textarea placeholder="メモ(任意)" value={unlockMemo} onChange={(e) => setUnlockMemo(e.target.value)} />
              <PrimaryButton onClick={async () => reportId && (await requestUnlock(reportId, unlockReason, unlockMemo), alert('申請しました'))}>申請送信</PrimaryButton>
            </div>
          ) : null}
        </Card>
      ) : null}

      {step === 1 && (
        <Card className="space-y-2">
          <input type="date" value={form.workDate} onChange={(e) => setForm({ ...form, workDate: e.target.value })} />
          <select value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })}>
            <option value="">スタッフを選択</option>
            {staffs.map((s) => (
              <option key={s.id} value={s.id}>{s.displayName}</option>
            ))}
          </select>
          <input placeholder="イベント会社" value={form.eventCompany} onChange={(e) => setForm({ ...form, eventCompany: e.target.value })} />
          <input placeholder="店舗名 / 開催会場" value={form.storeOrVenue} onChange={(e) => setForm({ ...form, storeOrVenue: e.target.value })} />
          <label className="block rounded-xl border border-dashed border-slate-300 p-3 text-sm">写真アップロード(最大3枚)
            <input className="hidden" type="file" accept="image/*" multiple onChange={(e) => onPhotoUpload(e.target.files)} />
          </label>
          <div className="flex gap-2">
            {form.photos.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} alt="upload" className="h-16 w-16 rounded-lg object-cover" />
                <button className="absolute -right-1 -top-1 rounded-full bg-black px-1 text-xs text-white" onClick={() => setForm({ ...form, photos: form.photos.filter((_, idx) => idx !== i) })}>×</button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="space-y-2">
          <input placeholder="来店者数" value={form.visitors} onChange={(e) => setForm({ ...form, visitors: e.target.value })} />
          <input placeholder="キャッチ数" value={form.catchCount} onChange={(e) => setForm({ ...form, catchCount: e.target.value })} />
          <input placeholder="着座数" value={form.seated} onChange={(e) => setForm({ ...form, seated: e.target.value })} />
          <input placeholder="見込数" value={form.prospects} onChange={(e) => setForm({ ...form, prospects: e.target.value })} />
          <details>
            <summary className="cursor-pointer text-sm font-semibold">着座内訳</summary>
            <div className="mt-2 grid gap-2">
              {Object.entries(form.seatedBreakdown).map(([k, v]) => (
                <input key={k} placeholder={k} value={v} onChange={(e) => setForm({ ...form, seatedBreakdown: { ...form.seatedBreakdown, [k]: e.target.value } })} />
              ))}
            </div>
          </details>
        </Card>
      )}

      {step === 3 && (
        <Card className="grid gap-2">
          {Object.entries(form.acquisitions).map(([k, v]) => (
            <input key={k} placeholder={k} value={v} onChange={(e) => setForm({ ...form, acquisitions: { ...form.acquisitions, [k]: e.target.value } })} />
          ))}
        </Card>
      )}

      {step === 4 && (
        <Card>
          <details open>
            <summary className="cursor-pointer text-sm font-semibold">LTV内訳</summary>
            <div className="mt-2 grid gap-2">
              {Object.entries(form.ltv).map(([k, v]) => (
                <input key={k} placeholder={k} value={v} onChange={(e) => setForm({ ...form, ltv: { ...form.ltv, [k]: e.target.value } })} />
              ))}
            </div>
          </details>
        </Card>
      )}

      {step === 5 && (
        <Card className="space-y-2">
          <input placeholder="成功事例タイトル(20文字推奨)" value={form.success.title} onChange={(e) => setForm({ ...form, success: { ...form.success, title: e.target.value } })} />
          <div className="flex flex-wrap gap-2">
            {customerTypes.map((c) => (
              <Chip key={c} active={form.success.customerTypes.includes(c)} onClick={() => setForm({ ...form, success: { ...form.success, customerTypes: form.success.customerTypes.includes(c) ? form.success.customerTypes.filter((x) => x !== c) : [...form.success.customerTypes, c] } })}>{c}</Chip>
            ))}
          </div>
          <select value={form.success.visitPurpose} onChange={(e) => setForm({ ...form, success: { ...form.success, visitPurpose: e.target.value } })}>
            <option value="">来店目的を選択</option>
            {visitPurpose.map((v) => <option key={v}>{v}</option>)}
          </select>
          <textarea placeholder="キートーク" value={form.success.keyTalk} onChange={(e) => setForm({ ...form, success: { ...form.success, keyTalk: e.target.value } })} />
          <textarea placeholder="成約理由" value={form.success.reason} onChange={(e) => setForm({ ...form, success: { ...form.success, reason: e.target.value } })} />
          <textarea placeholder="その他" value={form.success.other} onChange={(e) => setForm({ ...form, success: { ...form.success, other: e.target.value } })} />
        </Card>
      )}

      {step === 6 && (
        <Card className="space-y-2">
          <input placeholder="失注タイトル" value={form.failure.title} onChange={(e) => setForm({ ...form, failure: { ...form.failure, title: e.target.value } })} />
          <select value={form.failure.causeTag} onChange={(e) => setForm({ ...form, failure: { ...form.failure, causeTag: e.target.value } })}>
            <option value="">原因タグを選択</option>
            {reportCauseTags.map((t) => <option key={t}>{t}</option>)}
          </select>
          <textarea placeholder="次回アクション" value={form.failure.nextAction} onChange={(e) => setForm({ ...form, failure: { ...form.failure, nextAction: e.target.value } })} />
          <textarea placeholder="所感" value={form.failure.impression} onChange={(e) => setForm({ ...form, failure: { ...form.failure, impression: e.target.value } })} />
          <textarea placeholder="メモ" value={form.failure.notes} onChange={(e) => setForm({ ...form, failure: { ...form.failure, notes: e.target.value } })} />
        </Card>
      )}

      <div className="fixed bottom-0 left-0 right-0 mx-auto flex w-full max-w-md gap-2 border-t bg-white p-3">
        <SecondaryButton disabled={step === 1} onClick={() => setStep((v) => Math.max(v - 1, 1))}>戻る</SecondaryButton>
        <PrimaryButton onClick={onNext}>{step === 6 ? '提出' : '次へ'}</PrimaryButton>
      </div>
    </div>
  );
}
