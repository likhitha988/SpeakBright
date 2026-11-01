import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import SpeakingPractice from '@/components/SpeakingPractice';

export const metadata: Metadata = { title: 'Speak with Confidence' };

export default function Page() {
  return (
    <>
      <PageHeader title="Speak with Confidence" subtitle="Answer friendly questions out loud. There are no wrong answers here, only practice." emoji="🎤" />
      <SpeakingPractice />
    </>
  );
}
