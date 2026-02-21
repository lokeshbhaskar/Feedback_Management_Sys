import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { getFeedbackList } from "../../api/feedback";

const fallbackFeedback = [
  { id: "f1", message: "Love the new dashboard!", rating: 5, time: "2 mins ago" },
  { id: "f2", message: "Great feature updates", rating: 4, time: "15 mins ago" },
];

export default function Hero() {
  const { user } = useAuth();

  const feedbackQuery = useQuery({
    queryKey: ["hero-feedback"],
    queryFn: () => getFeedbackList({ include_archived: false }),
    enabled: Boolean(user),
  });

  const recentFeedback = user
    ? (feedbackQuery.data || []).slice(0, 2).map((item) => ({
        id: item.id,
        message: item.message,
        rating: item.rating || "-",
        time: new Date(item.created_at).toLocaleString(),
      }))
    : fallbackFeedback;

  return (
    <section className="pt-32 pb-20 gradient-mesh">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mono">
            Trusted by 500+ companies
          </span>
          <h1 className="text-6xl font-bold text-slate-900">
            Turn Feedback Into{" "}
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Action
            </span>
          </h1>

          <p className="text-xl text-slate-600">
            Collect, manage, and analyze user feedback in one powerful platform. Make data-driven decisions that drive growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium text-lg text-center"
            >
              Start Free Trial
            </Link>
            <a
              href="#demo"
              className="px-8 py-4 bg-white text-slate-700 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all font-medium text-lg text-center"
            >
              Watch Demo
            </a>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-red-500 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-500 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-400 to-cyan-500 border-2 border-white"></div>
            </div>
            <div>
              <div className="font-semibold text-slate-900">4.9/5 rating</div>
              <div className="text-sm text-slate-600">from 200+ reviews</div>
            </div>
          </div>
        </div>

        <div className="relative opacity-0 animate-fadeInUp delay-200">
          <div className="glass-card rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-500 mono">DASHBOARD</div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                  {user ? (
                    <>
                      <div className="text-3xl font-bold text-blue-600">{feedbackQuery.data?.length ?? 0}</div>
                      <div className="text-sm text-slate-600 mt-1">Feedback Entries</div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-blue-600">2,847</div>
                      <div className="text-sm text-slate-600 mt-1">Total Feedback</div>
                    </>
                  )}
                </div>
                <div className="bg-linear-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100">
                  <div className="text-3xl font-bold text-green-600">4.8★</div>
                  <div className="text-sm text-slate-600 mt-1">Avg Rating</div>
                </div>
              </div>

              <div className="space-y-3">
                {recentFeedback.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                    <div className={`w-10 h-10 rounded-full shrink-0 ${idx % 2 === 0 ? "bg-linear-to-br from-purple-400 to-pink-500" : "bg-linear-to-br from-blue-400 to-indigo-500"}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">{item.message}</div>
                      <div className="text-sm text-slate-500">{item.rating} stars • {item.time}</div>
                    </div>
                  </div>
                ))}
                {user && feedbackQuery.isSuccess && recentFeedback.length === 0 ? (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-600">
                    No feedback yet.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
