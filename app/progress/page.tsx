import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ProgressView from '@/components/ProgressView';

export const metadata: Metadata = { title: 'My Progress' };

export default function Page() {
  return (
    <>
      <PageHeader title="My Progress" subtitle="See how your practice is growing. Every step counts." emoji="📈" />
      <ProgressView />
    </>
  );
}
