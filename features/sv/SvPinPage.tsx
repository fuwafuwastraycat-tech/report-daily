'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, PrimaryButton, SectionTitle } from '@/components/ui';
import { verifySvPin } from '@/lib/mockApi';

export function SvPinPage() {
  const [pin, setPin] = useState('');
  const router = useRouter();

  return (
    <div className="space-y-4">
      <SectionTitle title="SVログイン" subtitle="PINを入力" />
      <Card className="space-y-3">
        <input type="password" inputMode="numeric" maxLength={4} placeholder="4桁PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
        <PrimaryButton
          onClick={async () => {
            const ok = await verifySvPin(pin);
            if (!ok) return alert('PINが違います');
            router.push('/sv/dashboard');
          }}
        >
          認証
        </PrimaryButton>
      </Card>
    </div>
  );
}
