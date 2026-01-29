export default function Hero() {
  return (
    <section className="pt-32 pb-20 gradient-mesh">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mono">
            ✨ Trusted by 500+ companies
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

          <div class="flex flex-col sm:flex-row gap-4">
            <a href="signup.html" class="px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium text-lg text-center">
              Start Free Trial
            </a>
            <a href="#demo" class="px-8 py-4 bg-white text-slate-700 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all font-medium text-lg text-center">
              Watch Demo
            </a>
          </div>
          <div class="flex items-center gap-6 pt-4">
            <div class="flex -space-x-3">
              <div class="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-red-500 border-2 border-white"></div>
              <div class="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 border-2 border-white"></div>
              <div class="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-500 border-2 border-white"></div>
              <div class="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-500 border-2 border-white"></div>
            </div>
            <div>
              <div class="font-semibold text-slate-900">4.9/5 rating</div>
              <div class="text-sm text-slate-600">from 200+ reviews</div>
            </div>
          </div>
        </div>

        {/* Right side card */}

        <div class="relative opacity-0 animate-fadeInUp delay-200">
          <div class="glass-card rounded-3xl p-8 shadow-2xl">
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-slate-500 mono">DASHBOARD</div>
                <div class="flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-400"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div class="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-linear-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                  <div class="text-3xl font-bold text-blue-600">2,847</div>
                  <div class="text-sm text-slate-600 mt-1">Total Feedback</div>
                </div>
                <div class="bg-linear-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100">
                  <div class="text-3xl font-bold text-green-600">4.8★</div>
                  <div class="text-sm text-slate-600 mt-1">Avg Rating</div>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                  <div class="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-500 shrink-0"></div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-slate-900 truncate">Love the new dashboard!</div>
                    <div class="text-sm text-slate-500">5 stars • 2 mins ago</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                  <div class="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 shrink-0"></div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-slate-900 truncate">Great feature updates</div>
                    <div class="text-sm text-slate-500">4 stars • 15 mins ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
