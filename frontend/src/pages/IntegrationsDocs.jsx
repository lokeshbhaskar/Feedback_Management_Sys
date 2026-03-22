import InternalLayout from "../components/layout/InternalLayout";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ingestExample = `curl -X POST "${apiBaseUrl}/feedback/ingest" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_live_your_generated_key" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "category": "Support",
    "rating": 5,
    "message": "Excellent onboarding support."
  }'`;

const bearerExample = `curl -X POST "${apiBaseUrl}/feedback/ingest" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_live_your_generated_key" \\
  -d '{
    "category": "Feature Request",
    "rating": 4,
    "message": "Please add Slack integration."
  }'`;

export default function IntegrationsDocs() {
  return (
    <InternalLayout
      title="Integration Docs"
      subtitle="Use API keys to send feedback from your backend or third-party systems."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">1) Generate an API key</h2>
          <p className="mt-2 text-sm text-slate-600">
            Open Settings {">"} API Keys and generate a new key. Copy it immediately. The full value is shown only once.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">2) Endpoint</h2>
          <div className="mt-3 rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-100">
            POST <span className="font-mono">{apiBaseUrl}/feedback/ingest</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Auth headers supported: <code>X-API-Key</code> or <code>Authorization: Bearer {"<key>"}</code>.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">3) Request body</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
            <li><code>category</code>: string (required)</li>
            <li><code>rating</code>: integer 1-5 (required)</li>
            <li><code>message</code>: string, min 5 chars (required)</li>
            <li><code>name</code>: string (optional)</li>
            <li><code>email</code>: valid email (optional)</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">4) cURL examples</h2>
          <p className="mt-2 text-sm font-semibold text-slate-700">Using X-API-Key</p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
{ingestExample}
          </pre>
          <p className="mt-4 text-sm font-semibold text-slate-700">Using Authorization Bearer</p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
{bearerExample}
          </pre>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-900">Security notes</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-amber-900">
            <li>Never expose API keys in frontend client code.</li>
            <li>Store keys in server-side environment variables or secret managers.</li>
            <li>Rotate and revoke keys regularly from Settings.</li>
          </ul>
        </section>
      </div>
    </InternalLayout>
  );
}

