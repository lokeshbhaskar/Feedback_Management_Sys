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
    // console.log("Parsed company_id from URL:", { raw, normalized, id });
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
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Public Feedback Form</h1>
          <p className="text-slate-600 text-sm mt-1">Share your feedback. No login required.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name (optional)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50"
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50"
            required
          >
            <option value="">Select category *</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div>
            <p className="text-sm text-slate-700 mb-2">Star rating *</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  className={`w-10 h-10 rounded-lg border ${form.rating >= star ? "bg-amber-100 border-amber-400" : "bg-white border-slate-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Feedback message *"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50"
          />

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full px-6 py-3 rounded-xl text-white bg-linear-to-r from-blue-600 to-indigo-600 font-medium"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-500">
          <Link to="/dashboard" className="text-blue-600 font-medium">Back to Dashboard</Link>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/35 grid place-items-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full text-center">
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
