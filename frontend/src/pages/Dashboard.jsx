import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/authService";
import InternalLayout from "../components/layout/InternalLayout";
import ShareButton from "../components/button/ShareButton";
import { dashboardStats, dashboardToneMap } from "../data/data";

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const ownerName = data?.owner_name || data?.email?.split("@")[0] || "Owner";
  const ownerEmail = data?.email || "owner@example.com";
  const companyName = data?.company?.name || "Workspace";
  const companyId = data?.company?.id;

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-600">Loading dashboard...</div>;
  }

  if (isError) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Session error</h2>
          <p className="text-slate-600 mb-6">Could not load your profile from `/auth/me`. Please login again.</p>
          <Link to="/login" className="inline-flex items-center px-5 py-2.5 rounded-xl text-white bg-linear-to-r from-blue-600 to-indigo-600">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <InternalLayout
      title="Dashboard"
      subtitle={`Welcome back, ${ownerName}. Here's what's happening at ${companyName}.`}
      actions={(
        <>
          <ShareButton shareId={companyId} compact />
          <Link to="/" className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium">
            Go to Homepage
          </Link>
          <Link
            to="/feedback-form"
            search={companyId ? { company_id: companyId } : undefined}
            className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all font-medium"
          >
            View Public Form
          </Link>
        </>
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${dashboardToneMap[stat.tone].badge}`}>{stat.trend}</span>
              <div className={`w-9 h-9 rounded-lg ${dashboardToneMap[stat.tone].card}`} />
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
    </InternalLayout>
  );
}
