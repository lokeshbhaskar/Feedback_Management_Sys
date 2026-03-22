import { Link, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { submitPublicFeedback } from "../api/feedback";

const categories = ["Bug", "Feature Request", "Support", "General"];

export default function FeedbackForm() {
  const search = useSearch({ from: "/feedback-form" });

  const companyId = useMemo(() => {
    const raw = search?.company_id;
    if (raw == null) return null;
    const normalized = String(raw).replace(/^"+|"+$/g, "").trim();
    const id = Number(normalized);
    return Number.isFinite(id) && id > 0 ? id : null;
  }, [search]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    rating: 0,
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const submitMutation = useMutation({
    mutationFn: submitPublicFeedback,
    onSuccess: () => {
      setShowSuccess(true);
      setForm({ name: "", email: "", category: "", rating: 0, message: "" });
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!companyId) {
      alert("Missing company id in URL. Open this page from Dashboard.");
      return;
    }
    if (!form.category || !form.rating || !form.message.trim()) {
      alert("Category, rating, and feedback message are required.");
      return;
    }

    submitMutation.mutate({
      company_id: companyId,
      name: form.name || null,
      email: form.email || null,
      category: form.category,
      rating: form.rating,
      message: form.message.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0e7ff_0%,_#f8fafc_45%,_#f1f5f9_100%)] px-4 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/90 backdrop-blur shadow-xl shadow-slate-200/60 overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-slate-200 bg-linear-to-r from-blue-50 via-indigo-50 to-sky-50">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white">
                Feedback Portal
              </span>
              {companyId ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200">
                  Company #{companyId}
                </span>
              ) : null}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Tell us what you think</h1>
            <p className="text-slate-600 text-sm mt-1">Your feedback helps us improve faster. No login required.</p>
          </div>

          <div className="px-6 sm:px-8 py-6 sm:py-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-400 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-2">Category *</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const active = form.category === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setForm({ ...form, category })}
                        className={`px-4 py-2 rounded-full text-sm border transition ${
                          active
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-2">Rating *</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className={`w-11 h-11 rounded-xl border text-lg transition ${
                        form.rating >= star
                          ? "bg-amber-100 border-amber-400 text-amber-700"
                          : "bg-white border-slate-300 text-slate-400 hover:border-slate-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-2">Message *</p>
                <textarea
                  placeholder="Share details about your experience..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-400 outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl text-white bg-linear-to-r from-blue-600 to-indigo-600 font-semibold hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-60"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Feedback"}
                </button>
                <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
                  Back to Dashboard
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/35 grid place-items-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full text-center shadow-xl shadow-slate-900/10">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center mx-auto mb-3 text-2xl">
              ✓
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Thanks for your feedback</h2>
            <p className="text-slate-600 text-sm mt-2">Your response has been submitted successfully.</p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="mt-4 px-5 py-2.5 rounded-xl text-white bg-slate-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
