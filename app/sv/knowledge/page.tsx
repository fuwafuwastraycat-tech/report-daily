import { SvKnowledgePage } from '@/features/knowledge/SvKnowledgePage';
import { SvGuard } from '@/features/sv/SvGuard';

export default function Page() {
  return <SvGuard><SvKnowledgePage /></SvGuard>;
}
