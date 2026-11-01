import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import DashboardView from '@/components/DashboardView';

export const metadata: Metadata = { title: 'Dashboard' };

export default function Page() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Pick up where you left off. No pressure, just practice." emoji="🏠" />
      <DashboardView />
    </>
  );
}
