import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveFeedback,
  exportFeedbackCsv,
  getFeedbackList,
  replyFeedback,
} from "../api/feedback";

const categories = ["", "Bug", "Feature Request", "Support", "General"];

export default function FeedbackList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [replyById, setReplyById] = useState({});

  const params = useMemo(() => {
    const p = { include_archived: false };
    if (search.trim()) p.search = search.trim();
    if (category) p.category = category;
    if (rating) p.rating = Number(rating);
    return p;
  }, [search, category, rating]);

  const feedbackQuery = useQuery({
    queryKey: ["feedback-list", params],
    queryFn: () => getFeedbackList(params),
  });

  const archiveMutation = useMutation({
    mutationFn: archiveFeedback,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feedback-list"] }),
  });

  const replyMutation = useMutation({
    mutationFn: replyFeedback,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feedback-list"] }),
  });

  const handleExport = async () => {
    try {
      const blob = await exportFeedbackCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "feedback-export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export feedback");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Feedback List</h1>
            <p className="text-sm text-slate-600">Search, filter, reply, archive, and export feedback.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700">Dashboard</Link>
            <button onClick={handleExport} className="px-4 py-2 rounded-xl text-white bg-slate-900">Export CSV</button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback"
            className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50"
          >
            {categories.map((c) => (
              <option key={c || "all"} value={c}>
                {c || "All categories"}
              </option>
            ))}
          </select>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50"
          >
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} star</option>
            ))}
          </select>
        </div>

        {feedbackQuery.isLoading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600">Loading feedback...</div>
        ) : feedbackQuery.isError ? (
          <div className="bg-white border border-red-200 rounded-2xl p-6 text-red-600">Failed to load feedback.</div>
        ) : feedbackQuery.data?.length ? (
          <div className="space-y-3">
            {feedbackQuery.data.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700">{item.category}</span>
                    <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700">{item.rating || "-"}★</span>
                    <span className="text-slate-500">{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => archiveMutation.mutate(item.id)}
                    disabled={archiveMutation.isPending}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700"
                  >
                    Archive
                  </button>
                </div>
                <p className="text-slate-900 font-medium mb-1">{item.name || "Anonymous"}</p>
                <p className="text-slate-600 text-sm mb-3">{item.email || "No email"}</p>
                <p className="text-slate-800 mb-4 whitespace-pre-wrap">{item.message}</p>

                {item.reply_text ? (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm mb-3">
                    <span className="font-semibold">Reply:</span> {item.reply_text}
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <input
                    value={replyById[item.id] || ""}
                    onChange={(e) => setReplyById((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Write a reply"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-slate-50"
                  />
                  <button
                    onClick={() => {
                      const reply = (replyById[item.id] || "").trim();
                      if (!reply) return;
                      replyMutation.mutate({ id: item.id, reply_text: reply });
                      setReplyById((prev) => ({ ...prev, [item.id]: "" }));
                    }}
                    disabled={replyMutation.isPending}
                    className="px-4 py-2 rounded-lg text-white bg-linear-to-r from-blue-600 to-indigo-600"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600">No feedback found.</div>
        )}
      </div>
    </div>
  );
}
