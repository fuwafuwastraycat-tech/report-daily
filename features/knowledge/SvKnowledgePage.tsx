'use client';

import { useEffect, useState } from 'react';
import { Card, SectionTitle } from '@/components/ui';
import { createKnowledge, getKnowledge } from '@/lib/mockApi';
import { KnowledgeItem } from '@/lib/types';

export function SvKnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');

  const load = () => getKnowledge().then(setItems);
  useEffect(() => load(), []);

  return (
    <div className="space-y-3">
      <SectionTitle title="SV ナレッジ管理" />
      <Card className="space-y-2">
        <input placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="本文" value={body} onChange={(e) => setBody(e.target.value)} />
        <input placeholder="タグ(カンマ区切り)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <button
          className="rounded-xl bg-primary p-3 text-white"
          onClick={async () => {
            await createKnowledge({ title, body, tags: tags.split(',').map((v) => v.trim()).filter(Boolean) });
            setTitle(''); setBody(''); setTags('');
            load();
          }}
        >
          追加
        </button>
      </Card>
      {items.map((k) => <Card key={k.id}><h4 className="font-semibold">{k.title}</h4><p className="text-sm">{k.body}</p></Card>)}
    </div>
  );
}
