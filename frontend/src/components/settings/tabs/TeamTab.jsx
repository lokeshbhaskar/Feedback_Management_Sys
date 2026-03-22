import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTeamMembers,
  inviteTeamMember,
  removeTeamMember,
  updateTeamMemberRole,
} from "../../../api/team";

const roleTone = {
  owner: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  member: "bg-slate-100 text-slate-700",
};

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function displayRole(role) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function TeamTab() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const membersQuery = useQuery({
    queryKey: ["team-members"],
    queryFn: getTeamMembers,
  });

  const inviteMutation = useMutation({
    mutationFn: ({ inviteName, inviteEmail, inviteRole }) =>
      inviteTeamMember(inviteName, inviteEmail, inviteRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      setNotice("Team member invited successfully.");
      setError("");
      setName("");
      setEmail("");
      setRole("member");
    },
    onError: (err) => {
      setNotice("");
      setError(err?.detail || "Failed to invite team member.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      setNotice("Team member removed.");
      setError("");
    },
    onError: (err) => {
      setNotice("");
      setError(err?.detail || "Failed to remove team member.");
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ memberId, nextRole }) => updateTeamMemberRole(memberId, nextRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      setNotice("Role updated.");
      setError("");
    },
    onError: (err) => {
      setNotice("");
      setError(err?.detail || "Failed to update role.");
    },
  });

  const filteredMembers = useMemo(() => {
    const rows = membersQuery.data || [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((member) => {
      return member.name.toLowerCase().includes(q) || member.email.toLowerCase().includes(q);
    });
  }, [membersQuery.data, search]);

  const handleInvite = () => {
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      setNotice("");
      return;
    }
    inviteMutation.mutate({
      inviteName: name.trim(),
      inviteEmail: email.trim(),
      inviteRole: role,
    });
  };

  const handleRoleChange = (member) => {
    if (member.role === "owner") return;
    const nextRole = member.role === "admin" ? "member" : "admin";
    roleMutation.mutate({ memberId: member.id, nextRole });
  };

  const handleRemove = (memberId) => {
    removeMutation.mutate(memberId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Team Management</h3>
        <p className="text-sm text-slate-600 mt-1">
          Invite teammates, assign roles, and manage workspace access.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-700">{notice}</p> : null}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="font-semibold text-slate-900">Invite New Member</h4>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
          />
          <input
            type="email"
            placeholder="work-email@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
          >
            <option value="member">member</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleInvite}
            disabled={inviteMutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {inviteMutation.isPending ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
          <h4 className="font-semibold text-slate-900">Team Members</h4>
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-sm"
          />
        </div>

        <div className="divide-y divide-slate-200">
          {membersQuery.isLoading ? (
            <div className="bg-white p-4 text-sm text-slate-600">Loading team members...</div>
          ) : membersQuery.isError ? (
            <div className="bg-white p-4 text-sm text-red-600">Failed to load team members.</div>
          ) : filteredMembers.length === 0 ? (
            <div className="bg-white p-4 text-sm text-slate-600">No team members found.</div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white p-4 flex flex-col md:flex-row md:items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white grid place-items-center font-semibold">
                  {initials(member.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-600 truncate">{member.email}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${roleTone[member.role] || roleTone.member}`}
                  >
                    {displayRole(member.role)}
                  </span>
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  <button
                    onClick={() => handleRoleChange(member)}
                    disabled={member.role === "owner" || roleMutation.isPending}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {member.role === "owner" ? "Owner" : "Change Role"}
                  </button>
                  <button
                    onClick={() => handleRemove(member.id)}
                    disabled={member.role === "owner" || removeMutation.isPending}
                    className="px-3 py-1.5 rounded-lg border border-red-300 bg-white text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
