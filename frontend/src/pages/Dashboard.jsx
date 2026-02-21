import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/authService";

const defaultStats = [
  { label: "Total Feedback", value: "2,847", trend: "+12.5%", tone: "blue" },
  { label: "Feedback Today", value: "47", trend: "+5", tone: "violet" },
  { label: "Average Rating", value: "4.8", trend: "+0.2", tone: "amber" },
  { label: "Response Rate", value: "89%", trend: "+3.1%", tone: "green" },
];

const toneMap = {
  blue: { badge: "bg-blue-100 text-blue-700", card: "bg-blue-100 text-blue-600" },
  violet: {
    badge: "bg-violet-100 text-violet-700",
    card: "bg-violet-100 text-violet-600",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700",
    card: "bg-amber-100 text-amber-600",
  },
  green: {
    badge: "bg-emerald-100 text-emerald-700",
    card: "bg-emerald-100 text-emerald-600",
  },
};

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const ownerName = data?.owner_name || data?.email?.split("@")[0] || "Owner";
  const ownerEmail = data?.email || "owner@example.com";
  const companyName = data?.company?.name || "Workspace";
  const companyId = data?.company?.id;
  const ownerRole = (data?.role || "owner").toUpperCase();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Session error</h2>
          <p className="text-slate-600 mb-6">
            Could not load your profile from `/auth/me`. Please login again.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-white bg-linear-to-r from-blue-600 to-indigo-600"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-10">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FeedbackFlow
            </span>
          </div>

          <div className="mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-linear-to-br from-pink-500 to-violet-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                {getInitials(companyName) || "W"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{companyName}</p>
                <p className="text-xs text-slate-500">Your workspace</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium">
              Dashboard
            </Link>
            <Link to="/feedback-list" className="flex items-center gap-3 px-4 py-3 text-slate-700 rounded-xl hover:bg-slate-100 font-medium">
              Feedback List
            </Link>
            <button className="w-full text-left px-4 py-3 text-slate-500 rounded-xl bg-slate-50 cursor-not-allowed">
              Analytics (coming soon)
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                {getInitials(ownerName) || "O"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{ownerName}</p>
                <p className="text-xs text-slate-500 truncate">{ownerEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ml-64 min-h-screen">
        <div className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-[5]">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                  {ownerRole}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Welcome back, <span className="font-semibold">{ownerName}</span>. Here&apos;s what&apos;s happening at{" "}
                <span className="font-semibold">{companyName}</span>.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
              >
                Go to Homepage
              </Link>
              <Link
                to="/feedback-form"
                search={companyId ? { company_id: companyId } : undefined}
                className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all font-medium"
              >
                View Public Form
              </Link>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {defaultStats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${toneMap[stat.tone].badge}`}>
                    {stat.trend}
                  </span>
                  <div className={`w-9 h-9 rounded-lg ${toneMap[stat.tone].card}`} />
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Owner Profile</h2>
            <p className="text-slate-600 mb-4">Loaded securely from `/auth/me`.</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">Name</p>
                <p className="font-semibold text-slate-900">{ownerName}</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">Email</p>
                <p className="font-semibold text-slate-900 truncate">{ownerEmail}</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">Company</p>
                <p className="font-semibold text-slate-900 truncate">{companyName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
