'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Chip, PrimaryButton, SecondaryButton, SectionTitle } from '@/components/ui';
import { decideUnlock, getReportById, reviewTags, saveSvReview } from '@/lib/mockApi';
import { Report } from '@/lib/types';

export function SvReportDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [toast, setToast] = useState('');
  const [rating, setRating] = useState<'S' | 'A' | 'B' | 'C'>('A');
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [correctionEnabled, setCorrectionEnabled] = useState(false);
  const [correctedSuccess, setCorrectedSuccess] = useState('');
  const [correctedFailure, setCorrectedFailure] = useState('');

  useEffect(() => {
    getReportById(id).then((r) => {
      if (!r) return;
      setReport(r);
      if (r.svReview?.rating) setRating(r.svReview.rating as 'S' | 'A' | 'B' | 'C');
      setTags(r.svReview?.tags || []);
      setComment(r.svReview?.comment || '');
    });
  }, [id]);

  if (!report) return <p>Loading...</p>;

  return (
    <div className="space-y-3 pb-4">
      <SectionTitle title={`日報詳細 ${report.workDate}`} />
      {toast ? <div className="rounded-xl bg-emerald-100 p-2 text-sm text-emerald-700">{toast}</div> : null}
      <Card><p className="font-semibold">会場: {report.storeOrVenue}</p><p>販社: {report.eventCompany}</p></Card>
      <details open><summary>STEP2 数値</summary><Card><pre className="text-xs">{JSON.stringify({ visitors: report.visitors, catch: report.catchCount, seated: report.seated }, null, 2)}</pre></Card></details>
      <details><summary>STEP5 成功</summary><Card><p>{report.success?.title}</p><p className="text-sm">{report.success?.keyTalk}</p></Card></details>
      <details><summary>STEP6 失敗</summary><Card><p>{report.failure?.title}</p><p className="text-sm">{report.failure?.nextAction}</p></Card></details>

      <Card className="space-y-2 border-2 border-primary/30">
        <p className="font-semibold">評価パネル</p>
        <div className="flex gap-2">{(['S', 'A', 'B', 'C'] as const).map((r) => <Chip key={r} active={rating === r} onClick={() => setRating(r)}>{r}</Chip>)}</div>
        <div className="flex flex-wrap gap-2">{reviewTags.map((t) => <Chip key={t} active={tags.includes(t)} onClick={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])}>{t}</Chip>)}</div>
        <textarea placeholder="コメント" value={comment} onChange={(e) => setComment(e.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={correctionEnabled} onChange={(e) => setCorrectionEnabled(e.target.checked)} />添削</label>
        {correctionEnabled ? (
          <>
            <textarea placeholder="成功文添削" value={correctedSuccess} onChange={(e) => setCorrectedSuccess(e.target.value)} />
            <textarea placeholder="失敗文添削" value={correctedFailure} onChange={(e) => setCorrectedFailure(e.target.value)} />
          </>
        ) : null}
        <PrimaryButton
          onClick={async () => {
            await saveSvReview(id, { rating, tags, comment, correctionEnabled, correctedSuccess, correctedFailure });
            if (rating === 'S') setToast('ナレッジ候補に追加されました');
            setTimeout(() => setToast(''), 2500);
          }}
        >
          保存
        </PrimaryButton>

        {report.unlockRequest?.status === 'pending' ? (
          <div className="grid grid-cols-2 gap-2">
            <SecondaryButton onClick={async () => { await decideUnlock(id, true); router.refresh(); }}>解除承認</SecondaryButton>
            <SecondaryButton onClick={async () => { await decideUnlock(id, false); router.refresh(); }}>解除否認</SecondaryButton>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
