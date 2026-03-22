import InternalLayout from "../components/layout/InternalLayout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "../api/analytics";

export default function Analytics() {
  const [range, setRange] = useState("30d");

  const { data: analytics, isLoading, isError } = useQuery({
    queryKey: ["analytics-summary", range],
    queryFn: () => getAnalyticsSummary(range),
  });

  const maxCategory = Math.max(...(analytics?.categories || []).map((row) => row.count), 1);
  const maxRating = Math.max(...(analytics?.ratings || []).map((row) => row.count), 1);
  const maxTrend = Math.max(...(analytics?.trend || []).map((row) => row.count), 1);

  return (
    <InternalLayout
      title="Analytics"
      subtitle="Track feedback trends, ratings, and response performance."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Overview</h2>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1">
            {[
              { key: "7d", label: "Last 7 days" },
              { key: "30d", label: "Last 30 days" },
              { key: "all", label: "All time" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setRange(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  range === opt.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-slate-600">
            Loading analytics...
          </div>
        ) : isError ? (
          <div className="bg-white border border-red-200 rounded-2xl p-8 text-red-600">
            Failed to load analytics data.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-sm text-slate-500">Total Feedback</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{analytics?.total ?? 0}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-sm text-slate-500">Average Rating</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{analytics?.avg_rating ?? 0}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-sm text-slate-500">Response Rate</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{analytics?.response_rate ?? 0}%</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-sm text-slate-500">Archived</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{analytics?.archived ?? 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Category Breakdown</h3>
                <div className="space-y-3">
                  {(analytics?.categories || []).length === 0 ? (
                    <p className="text-sm text-slate-500">No category data yet.</p>
                  ) : (
                    (analytics?.categories || []).map((row) => (
                      <div key={row.category}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-700">{row.category}</span>
                          <span className="text-slate-500">{row.count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${(row.count / maxCategory) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Rating Distribution</h3>
                <div className="space-y-3">
                  {(analytics?.ratings || []).map((row) => (
                    <div key={row.star}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-700">{row.star} star</span>
                        <span className="text-slate-500">{row.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-amber-500"
                          style={{ width: `${(row.count / maxRating) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Feedback Trend</h3>
              <div className="grid grid-cols-7 md:grid-cols-10 xl:grid-cols-15 gap-2 items-end min-h-[180px]">
                {(analytics?.trend || []).map((row) => (
                  <div key={row.date} className="flex flex-col items-center gap-2">
                    <div className="w-full max-w-[18px] h-[140px] flex items-end">
                      <div
                        className="w-full rounded-t bg-indigo-500"
                        style={{ height: `${(row.count / maxTrend) * 100}%` }}
                        title={`${row.date}: ${row.count}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">{row.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </InternalLayout>
  );
}
