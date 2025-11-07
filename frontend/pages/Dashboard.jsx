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
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Get account context - must be declared before useEffect
  const { isOwner, currentAccount, loadAccounts, setCurrentAccountId, currentAccountId } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user data from existing endpoint
        const userResponse = await api.get("/auth/getUser");
        setUser(userResponse.data);

        // Fetch real-time income data
        const incomeResponse = await api.get("/income/get");
        const incomes = incomeResponse.data || [];
        
        // Fetch real-time expense data
        const expenseResponse = await api.get("/expense/get");
        const expenses = expenseResponse.data || [];

        // Calculate total income (amounts are in cents)
        const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
        
        // Calculate total expenses (amounts are in cents)
        const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

        // Combine and sort recent transactions (last 10)
        const allTransactions = [
          ...incomes.map(item => ({
            _id: item._id,
            description: item.source || 'Income',
            amount: item.amount,
            date: item.date,
            type: 'income',
            createdBy: item.createdBy
          })),
          ...expenses.map(item => ({
            _id: item._id,
            description: item.category || 'Expense',
            amount: item.amount,
            date: item.date,
            type: 'expense',
            createdBy: item.createdBy
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        setFinancialData({
          totalIncome,
          totalExpenses,
          transactions: allTransactions
        });

        // invitations
        const invRes = await api.get("/invitations");
        setInvitations(invRes.data?.invitations || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentAccountId]); // Refetch when account changes

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
              {loading ? (
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mt-2"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  ${(financialData.totalIncome / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
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
              {loading ? (
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mt-2"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  ${(financialData.totalExpenses / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
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
              {loading ? (
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mt-2"></div>
              ) : (
                <p className={`text-2xl font-bold mt-2 ${
                  financialData.totalIncome - financialData.totalExpenses >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  ${((financialData.totalIncome - financialData.totalExpenses) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
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
                <th className="pb-4">Type</th>
                <th className="pb-4">Description</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Created By</th>
                <th className="pb-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading skeleton
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-4"><div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div></td>
                    <td className="py-4"><div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div></td>
                    <td className="py-4"><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></td>
                    <td className="py-4"><div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div></td>
                    <td className="py-4"><div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div></td>
                  </tr>
                ))
              ) : financialData.transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No transactions found. Start by adding income or expenses!
                  </td>
                </tr>
              ) : (
                financialData.transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'income' ? '↑ Income' : '↓ Expense'}
                      </span>
                    </td>
                    <td className="py-4 text-gray-700">{transaction.description}</td>
                    <td className={`py-4 font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${(transaction.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-xs ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {(transaction.createdBy?.fullName || transaction.createdBy?.email || "You").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-600">
                          {transaction.createdBy?.fullName || transaction.createdBy?.email || "You"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600 text-sm">
                      {transaction.date 
                        ? new Date(transaction.date.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : '-'}
                    </td>
                  </tr>
                ))
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
