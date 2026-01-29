
export default function Features() {
  return (
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16 opacity-0 animate-fadeInUp">
          <div class="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mono mb-4">
            FEATURES
          </div>
          <h2 class="text-5xl font-bold text-slate-900 mb-4">Everything you need to manage feedback</h2>
          <p class="text-xl text-slate-600 max-w-2xl mx-auto">Powerful features designed for modern B2B teams</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="feature-card bg-white p-8 rounded-2xl border border-slate-200 shadow-sm opacity-0 animate-fadeInUp delay-100">
            <div class="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">Real-time Analytics</h3>
            <p class="text-slate-600 leading-relaxed">Track feedback trends, sentiment analysis, and key metrics with beautiful, actionable dashboards.</p>
          </div>

          <div class="feature-card bg-white p-8 rounded-2xl border border-slate-200 shadow-sm opacity-0 animate-fadeInUp delay-200">
            <div class="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">Team Collaboration</h3>
            <p class="text-slate-600 leading-relaxed">Invite team members, assign roles, and collaborate on feedback responses seamlessly.</p>
          </div>

          <div class="feature-card bg-white p-8 rounded-2xl border border-slate-200 shadow-sm opacity-0 animate-fadeInUp delay-300">
            <div class="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">Public Forms</h3>
            <p class="text-slate-600 leading-relaxed">Embed beautiful feedback forms anywhere. No login required for your users.</p>
          </div>

          <div class="feature-card bg-white p-8 rounded-2xl border border-slate-200 shadow-sm opacity-0 animate-fadeInUp delay-100">
            <div class="w-14 h-14 bg-linear-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">Smart Filtering</h3>
            <p class="text-slate-600 leading-relaxed">Filter by date, category, rating, and more to find exactly what you're looking for.</p>
          </div>

          <div class="feature-card bg-white p-8 rounded-2xl border border-slate-200 shadow-sm opacity-0 animate-fadeInUp delay-200">
            <div class="w-14 h-14 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">API Access</h3>
            <p class="text-slate-600 leading-relaxed">Integrate with your existing tools using our powerful REST API and webhooks.</p>
          </div>

          <div class="feature-card bg-white p-8 rounded-2xl border border-slate-200 shadow-sm opacity-0 animate-fadeInUp delay-300">
            <div class="w-14 h-14 bg-linear-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">Enterprise Security</h3>
            <p class="text-slate-600 leading-relaxed">Bank-level encryption, GDPR compliance, and SSO support for enterprise teams.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

