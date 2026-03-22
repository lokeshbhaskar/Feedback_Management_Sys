import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { deleteMyAccount, updatePassword } from "../../../api/account";
import { useAuth } from "../../../context/AuthContext";

export default function AccountTab() {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: (res) => {
      setNotice(res?.detail || "Password updated successfully.");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: (err) => {
      setNotice("");
      setError(err?.response?.data?.detail || "Failed to update password.");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      logout();
    },
    onError: (err) => {
      setNotice("");
      setError(err?.response?.data?.detail || "Failed to delete account.");
    },
  });

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword) {
      setError("Both password fields are required.");
      setNotice("");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setNotice("");
      return;
    }
    updatePasswordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
    });
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "This action cannot be undone. Do you want to permanently delete your account?"
    );
    if (!confirmed) return;
    deleteAccountMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs text-slate-500">Signed in as</p>
        <p className="font-semibold text-slate-900">{user?.email || "unknown"}</p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-700">{notice}</p> : null}

      <div className="space-y-3">
        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
        />
        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
        <button
          onClick={handleUpdatePassword}
          disabled={updatePasswordMutation.isPending}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
        </button>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-red-600 font-bold">Danger Zone</h4>
        <p className="text-sm text-slate-600 mt-1">Delete this account permanently.</p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleteAccountMutation.isPending}
          className="mt-3 rounded-xl border border-red-300 bg-white px-4 py-2 text-red-700 font-semibold hover:bg-red-50 disabled:opacity-60"
        >
          {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
}
