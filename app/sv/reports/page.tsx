import { SvReportsPage } from '@/features/sv/SvReportsPage';
import { SvGuard } from '@/features/sv/SvGuard';

export default function Page() {
  return <SvGuard><SvReportsPage /></SvGuard>;
}
