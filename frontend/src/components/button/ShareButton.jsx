import { useState } from "react";

export default function ShareButton({ shareId, compact = false }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/feedback-form?company_id=${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <button
        onClick={handleCopy}
        className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all font-medium"
      >
        {copied ? "Copied" : "Copy Form Link"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
      <input
        type="text"
        readOnly
        value={shareUrl}
        className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
      />
      <button
        onClick={handleCopy}
        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}
