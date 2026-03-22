import { useEffect, useState } from "react";
import { generateApiKey, getApiKeys, revokeApiKey } from "../../../api/apiKeys";

export default function ApiKeysTab() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revokingId, setRevokingId] = useState(null);
  const [latestCreated, setLatestCreated] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const list = await getApiKeys();
        setKeys(list);
      } catch (err) {
        setError(err?.response?.data?.detail || "Failed to load API keys.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError("");
      setNotice("");
      const created = await generateApiKey();
      setKeys((prev) => [created, ...prev]);
      setLatestCreated(created);
      setNotice("New API key generated. Copy it now. You will not be able to view it again.");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to generate API key.");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      setRevokingId(id);
      setError("");
      const revoked = await revokeApiKey(id);
      setKeys((prev) => prev.map((k) => (k.id === id ? revoked : k)));
      if (latestCreated?.id === id) {
        setLatestCreated(null);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to revoke API key.");
    } finally {
      setRevokingId(null);
    }
  };

  const handleCopy = async (id) => {
    const plaintext = latestCreated?.id === id ? latestCreated.plaintext_key : null;
    if (!plaintext) {
      return;
    }

    try {
      await navigator.clipboard.writeText(plaintext);
      setNotice("API key copied to clipboard.");
      setError("");
    } catch {
      setError("Clipboard copy failed. Please copy manually.");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">API Keys</h3>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {notice && <p className="text-sm text-green-700">{notice}</p>}

      {latestCreated?.plaintext_key && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Copy this key now. It will not be shown again.
          </p>
          <code className="mt-2 block overflow-x-auto rounded-md bg-white p-3 font-mono text-sm">
            {latestCreated.plaintext_key}
          </code>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading keys...</p>
      ) : (
        <div className="space-y-3">
          {keys.length === 0 && <p className="text-sm text-slate-500">No API keys yet.</p>}

          {keys.map((key) => (
            <div
              key={key.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center"
            >
              <div className="flex-1">
                <code className="font-mono text-sm break-all">{key.masked_key}</code>
                <p className="mt-1 text-xs text-slate-500">
                  Created: {new Date(key.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => handleCopy(key.id)}
                  disabled={!key.is_active || latestCreated?.id !== key.id}
                >
                  Copy
                </button>
                <button
                  className="rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => handleRevoke(key.id)}
                  disabled={!key.is_active || revokingId === key.id}
                >
                  {key.is_active ? (revokingId === key.id ? "Revoking..." : "Revoke") : "Revoked"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleGenerate}
        disabled={generating}
      >
        {generating ? "Generating..." : "Generate New API Key"}
      </button>
    </div>
  );
}
