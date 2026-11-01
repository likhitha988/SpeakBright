import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ReadingPractice from '@/components/ReadingPractice';

export const metadata: Metadata = { title: 'Read English Aloud' };

export default function Page() {
  return (
    <>
      <PageHeader title="Read English Aloud" subtitle="Read short passages, listen to them, and build smooth, confident reading." emoji="📖" />
      <ReadingPractice />
    </>
  );
}
