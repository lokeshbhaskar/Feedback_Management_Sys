import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import "../styles/login.css";
import { useState } from "react";
import { login as loginApi } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      navigate({ to: "/dashboard" });
    },
    onError: (err) => {
      alert("Invalid credentials");
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <div className="bg-slate-50 gradient-mesh min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-2">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FeedbackFlow
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mt-6 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="john@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl transition-all input-focus"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl transition-all input-focus"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-5 h-5 text-blue-600 border-slate-300 rounded"
              />
              <label htmlFor="remember" className="text-sm text-slate-600">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full px-6 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium text-lg"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all flex items-center justify-center gap-2 font-medium text-slate-700"
              >
                Google
              </button>

              <button
                type="button"
                className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all flex items-center justify-center gap-2 font-medium text-slate-700"
              >
                GitHub
              </button>
            </div>
          </form>
        </div>

        {/* Signup */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
