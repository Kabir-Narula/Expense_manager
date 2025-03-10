import React from "react";
import { FiArrowDownRight, FiPlus } from "react-icons/fi";
import { MdFastfood, MdShoppingBag, MdHealthAndSafety } from "react-icons/md";
import { MdOutlineReceiptLong } from "react-icons/md";

function Expenses() {
  const categories = [
    { name: "Food", icon: <MdFastfood />, amount: 1200 },
    { name: "Shopping", icon: <MdShoppingBag />, amount: 850 },
    { name: "Health", icon: <MdHealthAndSafety />, amount: 450 },
  ];

  return (
    <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50"> 
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expense Tracking</h1>
          <p className="text-gray-500">September 2023 Spending</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
          <FiPlus className="mr-2" /> Add Expense
        </button>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {categories.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{category.name}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">${category.amount.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-lg ${["bg-red-100", "bg-purple-100", "bg-blue-100"][index]}`}>
                {React.cloneElement(category.icon, { className: "w-6 h-6 " + ["text-red-600", "text-purple-600", "text-blue-600"][index] })}
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <FiArrowDownRight className={`w-4 h-4 ${index === 1 ? "text-purple-600" : "text-red-600"} mr-1`} />
              <span className={`font-medium ${index === 1 ? "text-purple-600" : "text-red-600"}`}>
                {index === 2 ? "+2.1%" : "-4.5%"}
              </span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Expenses */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Spending</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-4">Category</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-4">{["Groceries", "Entertainment", "Bills", "Transport", "Misc"][item-1]}</td>
                  <td className="py-4">Sept {item + 10}, 2023</td>
                  <td className="py-4 font-medium text-red-600">-${(300 - item * 20).toLocaleString()}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item % 2 === 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}>
                      {item % 2 === 0 ? "Pending" : "Paid"}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-indigo-600 hover:text-indigo-700 flex items-center">
                      <MdOutlineReceiptLong className="mr-2" /> View
                    </button>
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

export default Expenses;