import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, BookOpenText, LayoutDashboard, Settings, Users, MessageSquareMore } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function MenuLink({ to, label, icon: Icon }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
        isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <Icon size={18} className="shrink-0" />
      {label}
    </Link>
  );
}

export default function InternalLayout({ title, subtitle, actions, children }) {
  const { user, loading, logout } = useAuth();

  const ownerName = user?.owner_name || user?.email?.split("@")[0] || "Owner";
  const ownerEmail = user?.email || "owner@example.com";
  const companyName = user?.company?.name || "Workspace";

  return (
    <div className="bg-slate-50 min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-20">
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
            <MenuLink to="/dashboard" label="Dashboard" icon={LayoutDashboard} />
            <MenuLink to="/feedback-list" label="Feedback List" icon={MessageSquareMore} />
            <MenuLink to="/analytics" label="Analytics" icon={BarChart3} />
            <MenuLink to="/team" label="Team" icon={Users} />
            <MenuLink to="/integrations" label="Integrations" icon={BookOpenText} />
            <MenuLink to="/settings" label="Settings" icon={Settings} />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                {getInitials(ownerName) || "O"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{ownerName}</p>
                <p className="text-xs text-slate-500 truncate">{ownerEmail}</p>
              </div>
            </div>
            {!loading ? (
              <button
                onClick={logout}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm cursor-pointer transition "
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="fixed top-0 left-64 right-0 bg-white border-b border-slate-200 px-8 py-5 z-10">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              {subtitle ? <p className="text-sm text-slate-600 mt-1">{subtitle}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          </div>
        </header>
        <section className="pt-36 xl:pt-28 p-8">{children}</section>
      </main>
    </div>
  );
}
