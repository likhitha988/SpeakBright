import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import JournalView from '@/components/JournalView';

export const metadata: Metadata = { title: 'English Journal' };

export default function Page() {
  return (
    <>
      <PageHeader title="English Journal" subtitle="Write a few sentences about your day. It stays private on this device." emoji="📓" />
      <JournalView />
    </>
  );
}
