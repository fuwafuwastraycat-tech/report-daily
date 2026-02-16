'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, Chip, SectionTitle } from '@/components/ui';
import { getKnowledge } from '@/lib/mockApi';
import { KnowledgeItem } from '@/lib/types';

export function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    getKnowledge().then(setItems);
  }, []);

  const tags = useMemo(() => [...new Set(items.flatMap((i) => i.tags))], [items]);
  const filtered = items.filter((i) => {
    const textMatch = `${i.title} ${i.body}`.toLowerCase().includes(q.toLowerCase());
    const tagMatch = tag ? i.tags.includes(tag) : true;
    return textMatch && tagMatch;
  });

  return (
    <div className="space-y-3">
      <SectionTitle title="ナレッジ一覧" subtitle="新着順" />
      <input placeholder="タイトル / 本文検索" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <Chip active={!tag} onClick={() => setTag('')}>すべて</Chip>
        {tags.map((t) => <Chip key={t} active={tag === t} onClick={() => setTag(t)}>{t}</Chip>)}
      </div>
      {filtered.map((k) => (
        <Card key={k.id}>
          <h3 className="font-semibold">{k.title}</h3>
          <p className="line-clamp-2 text-sm text-slate-600">{k.body}</p>
          <div className="mt-2 flex flex-wrap gap-1">{k.tags.map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}</div>
          <p className="mt-1 text-xs text-slate-500">{new Date(k.createdAt).toLocaleDateString('ja-JP')}</p>
        </Card>
      ))}
    </div>
  );
}
