import { useState } from "react";
import api from "../src/Utils/api";
import { useAccount } from "../src/context/AccountContext.jsx";

export default function InviteMemberModal({ open, onClose, onInvited }) {
  const { currentAccountId } = useAccount();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/accounts/${currentAccountId}/invite`, {
        email: email.trim(),
        message: message.trim(),
      });

      // Show success message
      alert(response.data?.message || "Invitation sent successfully!");

      setEmail("");
      setMessage("");
      onInvited?.();
      onClose?.();
    } catch (e) {
      const errorMsg =
        e?.response?.data?.message || "Failed to send invitation";
      setError(errorMsg);
      console.error("Invitation error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Invite Member</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Message (optional)
            </label>
            <textarea
              className="w-full border rounded-md px-3 py-2"
              rows={3}
              placeholder="Hi! Join our shared account."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm rounded-md bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white"
            >
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
