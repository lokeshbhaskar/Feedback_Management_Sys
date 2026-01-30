import { Link } from "@tanstack/react-router";

export default function Navbar() {
    return (
        <nav class="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <div class="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <span class="text-white font-bold text-xl">F</span>
                        </div>
                        <span class="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FeedbackFlow</span>
                    </div>

                    <div class="hidden md:flex items-center space-x-8">
                        <a href="#features" class="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
                        <a href="#pricing" class="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
                        <a href="#about" class="text-slate-600 hover:text-slate-900 transition-colors">About</a>
                    </div>

                    <div className="flex items-center space-x-4">
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
                    </div>
                </div>
            </div>
        </nav>

    );
}
