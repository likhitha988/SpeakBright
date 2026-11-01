import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import SettingsView from '@/components/SettingsView';

export const metadata: Metadata = { title: 'Settings' };

export default function Page() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Make SpeakBright comfortable for you." emoji="⚙️" />
      <SettingsView />
    </>
  );
}
