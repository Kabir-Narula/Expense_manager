import React, { useState, useEffect } from "react";
import api from "../src/Utils/api";
import { MdAttachMoney, MdSavings } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [financialData, setFinancialData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    transactions: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data from existing endpoint
        const userResponse = await api.get("/getUser");
        setUser(userResponse.data);

        // Mock data - replace with actual API calls when backend is ready
        setFinancialData({
          totalIncome: 430000,
          totalExpenses: 320000,
          transactions: []
        });
        
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    fetchData();
  }, []);

  return (
    <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome {user?.fullName}
          </h1>
          <p className="text-gray-500">Your Financial Dashboard</p>
        </div>
      </div>

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
                ${(financialData.totalIncome - financialData.totalExpenses).toLocaleString()}
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
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Transactions</h2>
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
    </div>
  );
}

export default Dashboard;