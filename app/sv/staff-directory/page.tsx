import { StaffDirectoryPage } from '@/features/staff/StaffDirectoryPage';
import { SvGuard } from '@/features/sv/SvGuard';

export default function Page() {
  return <SvGuard><StaffDirectoryPage /></SvGuard>;
}
