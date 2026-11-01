import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import AiTutorBox from '@/components/AiTutorBox';

export const metadata: Metadata = { title: 'English Tutor' };

export default function TutorPage() {
  return (
    <>
      <PageHeader
        title="Friendly English Tutor"
        subtitle="Ask how to say something in English, or get gentle help with a sentence. This tutor only helps with English communication."
        emoji="🤝"
      />
      <div className="max-w-3xl">
        <AiTutorBox mode="tutor" />
      </div>
    </>
  );
}
