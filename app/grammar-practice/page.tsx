import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import GrammarPractice from '@/components/GrammarPractice';

export const metadata: Metadata = { title: 'Grammar Through Speaking' };

export default function Page() {
  return (
    <>
      <PageHeader title="Grammar Through Speaking" subtitle="Tiny lessons from everyday sentences. Learn, fix, and say your own." emoji="🧩" />
      <GrammarPractice />
    </>
  );
}
