import InternalLayout from "../components/layout/InternalLayout";
import TeamTab from "../components/settings/tabs/TeamTab";

export default function Team() {
  return (
    <InternalLayout
      title="Team"
      subtitle="Invite members and manage roles for your workspace."
    >
      <TeamTab />
    </InternalLayout>
  );
}
