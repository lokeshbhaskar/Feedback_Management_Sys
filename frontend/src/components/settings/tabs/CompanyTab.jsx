import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../../services/authService";
import { useState } from "react";
import "./companyTab.css";

export default function CompanyTab() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const ownerName = data?.owner_name || data?.email?.split("@")[0] || "Owner";
  const ownerEmail = data?.email || "owner@example.com";
  const companyName = data?.company?.name || "Workspace";
  const companyId = data?.company?.id || "";

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="ct-root">
        <div className="ct-card ct-fade-in">

          {/* Header */}
          <div className="ct-header">
            <p className="ct-eyebrow">Settings</p>
            <h2 className="ct-title">Company Information</h2>
            <p className="ct-subtitle">Manage your workspace details and profile</p>
          </div>

          <div className="ct-divider" />

          {/* Owner */}
          <div className="ct-field-group">
            <label className="ct-label">Workspace Owner</label>
            {isLoading ? (
              <div className="ct-skeleton" />
            ) : (
              <div className="ct-owner-row">
                <div className="ct-avatar">{ownerName[0]}</div>
                <div className="ct-owner-info">
                  <p className="ct-owner-name">{ownerName}</p>
                  <p className="ct-owner-email">{ownerEmail}</p>
                </div>
                <span className="ct-owner-badge">Owner</span>
              </div>
            )}
          </div>

          {/* Name + ID */}
          <div className="ct-grid">
            <div className="ct-field-group">
              <label className="ct-label">Company Name</label>
              {isLoading ? (
                <div className="ct-skeleton" />
              ) : (
                <input
                  className="ct-input"
                  defaultValue={companyName}
                  placeholder="Your company name"
                />
              )}
            </div>

            <div className="ct-field-group">
              <label className="ct-label">Company ID</label>
              {isLoading ? (
                <div className="ct-skeleton" />
              ) : (
                <div className="ct-id-badge" style={{ position: "relative" }}>
                  <input
                    className="ct-input"
                    defaultValue={companyId}
                    disabled
                    placeholder="auto-generated"
                  />
                  <button
                    className="ct-copy-btn"
                    title="Copy ID"
                    onClick={() => navigator.clipboard?.writeText(companyId)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="ct-field-group">
            <label className="ct-label">About</label>
            {isLoading ? (
              <div className="ct-skeleton" style={{ height: "110px" }} />
            ) : (
              <textarea
                className="ct-input ct-textarea"
                rows="4"
                defaultValue="We build amazing products that help businesses grow."
                placeholder="Tell us about your company..."
              />
            )}
          </div>

          <div className="ct-divider" />

          {/* Footer */}
          <div className="ct-footer">
            <span className="ct-hint">Changes apply to all members</span>
            <button
              className={`ct-save-btn ${saved ? "saved" : ""}`}
              onClick={handleSave}
            >
              <span className="ct-btn-text">
                {saved ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Saved
                  </>
                ) : (
                  "Save Changes"
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}