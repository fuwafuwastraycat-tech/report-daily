import { SvDashboardPage } from '@/features/sv/SvDashboardPage';
import { SvGuard } from '@/features/sv/SvGuard';

export default function Page() {
  return <SvGuard><SvDashboardPage /></SvGuard>;
}
