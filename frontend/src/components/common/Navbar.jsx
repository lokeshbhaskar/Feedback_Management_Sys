import { Link } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user, loading, logout } = useAuth();
    const isAuthenticated = Boolean(user) || Boolean(localStorage.getItem("access_token"));

    return (
        <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">F</span>
                        </div>
                        <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FeedbackFlow</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
                        <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
                        <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        {loading && isAuthenticated ? null : isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>

    );
}
