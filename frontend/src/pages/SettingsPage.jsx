import InternalLayout from "../components/layout/InternalLayout";
import Settings from "../components/settings/Settings";

export default function SettingsPage() {
  return (
    <InternalLayout
      title="Settings"
      subtitle="Manage company profile, API keys, team, and account settings."
    >
      <Settings />
    </InternalLayout>
  );
}
