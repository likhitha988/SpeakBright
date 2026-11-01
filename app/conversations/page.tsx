import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ConversationPractice from '@/components/ConversationPractice';

export const metadata: Metadata = { title: 'Everyday Conversations' };

export default function Page() {
  return (
    <>
      <PageHeader title="Everyday Conversations" subtitle="Practise real-life situations step by step with a friendly conversation partner." emoji="💬" />
      <ConversationPractice />
    </>
  );
}
