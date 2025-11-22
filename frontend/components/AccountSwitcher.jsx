import { useEffect } from "react";
import { useAccount } from "../src/context/AccountContext.jsx";

export default function AccountSwitcher() {
  const {
    allAccounts,
    currentAccountId,
    setCurrentAccountId,
    loading,
    loadAccounts,
  } = useAccount();

  useEffect(() => {
    if (!allAccounts?.length) loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return null;
  if (!allAccounts || allAccounts.length <= 1) return null; // no need to show if only personal

  return (
    <div className="mb-4">
      <label className="block text-xs text-indigo-300 mb-1">Account</label>
      <select
        className="w-full bg-indigo-800 text-white text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={currentAccountId || ""}
        onChange={(e) => setCurrentAccountId(e.target.value)}
      >
        {allAccounts.map((acc) => (
          <option key={acc._id} value={acc._id}>
            {acc.name || (acc.type === "personal" ? "Personal" : "Shared")}
            {acc.type === "shared" && acc.owner ? "" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
