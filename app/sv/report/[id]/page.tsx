import { SvReportDetailPage } from '@/features/sv/SvReportDetailPage';
import { SvGuard } from '@/features/sv/SvGuard';

export default function Page({ params }: { params: { id: string } }) {
  return <SvGuard><SvReportDetailPage id={params.id} /></SvGuard>;
}
