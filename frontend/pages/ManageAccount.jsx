import { useEffect, useState } from "react";
import api from "../src/Utils/api";
import { useAccount } from "../src/context/AccountContext.jsx";

export default function ManageAccount() {
  const { currentAccount, currentAccountId, isOwner, loadAccounts } =
    useAccount();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMembers = async () => {
    if (!currentAccountId) return;
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/accounts/${currentAccountId}/members`);
      setMembers(res.data || []);
      setError(""); // Clear stale error messages after successful fetch
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [currentAccountId]);

  const removeMember = async (userId) => {
    if (!isOwner) return;
    if (!confirm("Remove this member?")) return;
    await api.delete(`/accounts/${currentAccountId}/members/${userId}`);
    await loadMembers();
  };

  const deleteAccount = async () => {
    if (!isOwner) return;
    if (
      !confirm("This will delete the shared account for all members. Continue?")
    )
      return;
    await api.delete(`/accounts/${currentAccountId}`);
    await loadAccounts();
    window.location.href = "/dashboard";
  };

  return (
    <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Account</h1>
          <p className="text-gray-500">
            {currentAccount?.name ||
              (currentAccount?.type === "personal" ? "Personal" : "Shared")}
          </p>
        </div>
        {isOwner && currentAccount?.type === "shared" && (
          <button
            onClick={deleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Delete Shared Account
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p>Loading members...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-3">Members</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={m.userId}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                        {(m.fullName || m.email).charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{m.fullName || "-"}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-600">{m.email}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        m.role === "owner"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {m.role === "owner" ? "👑 Owner" : "Member"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {isOwner && m.role !== "owner" && (
                      <button
                        onClick={() => removeMember(m.userId)}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
