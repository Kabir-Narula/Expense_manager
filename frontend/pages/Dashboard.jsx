// import React from "react";
import { FiArrowUpRight, FiArrowDownRight, FiDollarSign } from "react-icons/fi";
import { MdSavings, MdAttachMoney, MdOutlineSavings } from "react-icons/md";

function Dashboard() {
  // Personal finance metrics
  const totalIncome = 12450;
  const totalExpenses = 8200;
  const netSavings = totalIncome - totalExpenses;
  const budgetUtilization = ((totalExpenses / totalIncome) * 100).toFixed(1);

  // Transactions matching Income page
  const transactions = [
    { id: 1, client: "Client #1", date: "Sept 11, 2023", amount: 1200 },
    { id: 2, client: "Client #2", date: "Sept 12, 2023", amount: 1150 },
    { id: 3, client: "Client #3", date: "Sept 13, 2023", amount: 1100 },
    { id: 4, client: "Client #4", date: "Sept 14, 2023", amount: 1050 },
    { id: 5, client: "Client #5", date: "Sept 15, 2023", amount: 1000 },
  ];

  return (
    <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Overview</h1>
          <p className="text-gray-500">September 2023 Summary</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Export Report
        </button>
      </div>

      {/* Personal Finance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Income */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MdAttachMoney className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <FiArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+5.2%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">${totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <FiArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-red-600 font-medium">-2.5%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        {/* Net Savings */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Net Savings</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">${netSavings.toLocaleString()}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <MdSavings className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <FiArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Budget Used</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{budgetUtilization}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <MdOutlineSavings className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <FiArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-red-600 font-medium">-4.2%</span>
            <span className="text-gray-500 ml-2">vs target</span>
          </div>
        </div>
      </div>

      {/* Financial Trends Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Financial Trends</h2>
          <div className="flex gap-4">
            <button className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
              12 Months
            </button>
            <button className="text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-lg">
              30 Days
            </button>
          </div>
        </div>
        <div className="h-96 bg-gradient-to-b from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center">
          <p className="text-gray-500">Chart Implementation Coming Soon</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-4">Transaction</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-4">Payment from {transaction.client}</td>
                  <td className="py-4">{transaction.date}</td>
                  <td className="py-4 font-medium">${transaction.amount.toLocaleString()}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;