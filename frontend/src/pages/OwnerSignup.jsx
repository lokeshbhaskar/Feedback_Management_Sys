import { Link, useNavigate } from "@tanstack/react-router";
import "../styles/signup.css";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signupOwner as signupApi } from "../services/authService";

const OwnerSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ownerName: "",
    companyName: "",
    email: "",
    password: "",
  });

  const signupMutation = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      navigate({ to: "/login" });
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      alert(error?.response?.data?.detail || "Signup failed");
    },
  })
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.ownerName.trim() ||
      !form.companyName.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }
    signupMutation.mutate(form);
  }
  return (
    <div className="bg-slate-50 gradient-mesh min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-2">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FeedbackFlow
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mt-6 mb-2">
            Create your account
          </h1>
          <p className="text-slate-600">
            Start managing feedback in minutes
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Owner Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Work Email
              </label>
              <input
                type="email"
                placeholder="john@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                placeholder="Acme Inc."
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">
                This will be your workspace name
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">
                At least 8 characters
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="w-5 h-5 text-blue-600 border-slate-300 rounded mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{" "}
                <span className="text-blue-600 font-medium cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-blue-600 font-medium cursor-pointer">
                  Privacy Policy
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={signupMutation.isLoading}
              className="w-full px-6 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-lg disabled:opacity-50"
            >
              {signupMutation.isLoading ? "Creating..." : "Create Account"}
            </button>

          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span>🔒 SSL Encrypted</span>
          <span>🛡️ GDPR Compliant</span>
          <span>✅ SOC 2 Certified</span>
        </div>
      </div>
    </div>
  );
};

export default OwnerSignup;
