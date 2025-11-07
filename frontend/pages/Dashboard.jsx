import { useState, useEffect } from "react";
import api from "../src/Utils/api";
import { MdAttachMoney, MdSavings } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";
import InviteMemberModal from "../components/InviteMemberModal";
import { useAccount } from "../src/context/AccountContext.jsx";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [financialData, setFinancialData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    transactions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data from existing endpoint
        const userResponse = await api.get("/auth/getUser");
        setUser(userResponse.data);

        // Mock data - replace with actual API calls when backend is ready
        setFinancialData({
          totalIncome: 430000,
          totalExpenses: 320000,
          transactions: [],
        });
        // invitations
        const invRes = await api.get("/invitations");
        setInvitations(invRes.data?.invitations || []);
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    fetchData();
  }, []);

  const [invitations, setInvitations] = useState([]);
  const { isOwner, currentAccount, loadAccounts, setCurrentAccountId } =
    useAccount();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const createShared = async () => {
    try {
      setCreating(true);
      const name = prompt("Enter a name for your shared account:", "Household");
      if (!name) return;
      const res = await api.post("/accounts", { name });
      // refresh and switch to new account
      await loadAccounts();
      setCurrentAccountId(res.data?.account?._id);
    } finally {
      setCreating(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await api.post(`/invitations/${id}/accept`);
      // Remove from invitations list
      setInvitations((prev) => prev.filter((i) => i._id !== id));
      // Reload accounts to show the new shared account
      await loadAccounts();
      // Dispatch event for other components
      window.dispatchEvent(new Event("accountsUpdated"));
      // Show success message
      alert(
        response.data?.message ||
          "Invitation accepted! You can now access the shared account.",
      );
    } catch (e) {
      console.error("Failed to accept invitation:", e);
      alert(
        e?.response?.data?.message ||
          "Failed to accept invitation. Please try again.",
      );
    }
  };

  const handleDecline = async (id) => {
    try {
      await api.post(`/invitations/${id}/decline`);
      setInvitations((prev) => prev.filter((i) => i._id !== id));
      alert("Invitation declined");
    } catch (e) {
      console.error("Failed to decline invitation:", e);
      alert(
        e?.response?.data?.message ||
          "Failed to decline invitation. Please try again.",
      );
    }
  };

  return (
    <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome {user?.fullName}
          </h1>
          <p className="text-gray-500">Your Financial Dashboard</p>
        </div>
        {isOwner && currentAccount?.type === "shared" && (
          <button
            onClick={() => setInviteOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Invite Member
          </button>
        )}
        {isOwner && currentAccount?.type === "personal" && (
          <button
            disabled={creating}
            onClick={createShared}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            {creating ? "Creating..." : "Create Shared Account"}
          </button>
        )}
      </div>
      {inviteOpen && (
        <InviteMemberModal
          open={inviteOpen}
          onClose={() => setInviteOpen(false)}
          onInvited={() => {}}
        />
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                ${financialData.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MdAttachMoney className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                ${financialData.totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Net Savings</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                $
                {(
                  financialData.totalIncome - financialData.totalExpenses
                ).toLocaleString()}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <MdSavings className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-4">Description</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {financialData.transactions.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invitations */}
      {invitations.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl shadow-sm mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🔔 Pending Invitations ({invitations.length})
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            You have been invited to join shared account(s). Accept to become a
            member.
          </p>
          <div className="space-y-3">
            {invitations.map((i) => (
              <div
                key={i._id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-800">
                    {i.account?.name || "Shared Account"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Invited by:{" "}
                    <span className="font-medium">
                      {i.inviter?.fullName || "Unknown"}
                    </span>
                    {i.inviter?.email && (
                      <span className="text-gray-500">
                        {" "}
                        ({i.inviter.email})
                      </span>
                    )}
                  </p>
                  {i.message && (
                    <p className="text-sm text-gray-500 mt-2 italic">
                      "{i.message}"
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleAccept(i._id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecline(i._id)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
