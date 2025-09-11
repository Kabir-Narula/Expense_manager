// import React from "react";
import { FiArrowUpRight, FiPlus } from "react-icons/fi";
import { MdAttachMoney, MdOutlineReceiptLong, MdSavings } from "react-icons/md";
import { useState } from "react";
import EditIncome from "../components/EditIncome"

function Income() {

  const [open, setOpen] = useState(false);

  return (
    <>
    
      <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Income Tracking</h1>
            <p className="text-gray-500">September 2023 Earnings</p>
          </div>
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            onClick={() => {
              setOpen(true) 
              console.log(open)
            }}
          >
            
            <FiPlus className="mr-2" /> Add Income
          </button>

        </div>
        <EditIncome open={open} closeModal={() => setOpen(false)} />


        {/* Income Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Income</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">$12,450</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MdAttachMoney className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <FiArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+5.2%</span>
              <span className="text-gray-500 ml-2">vs last quarter</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Income</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">$950</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MdSavings className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <FiArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+8.1%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Deposits</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">$1,500</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <MdOutlineReceiptLong className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <FiArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+3.4%</span>
              <span className="text-gray-500 ml-2">in clearance</span>
            </div>
          </div>
        </div>

        {/* Recent Income */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Earnings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-4">Source</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-4">{["Freelance Work", "Salary", "Investment", "Side Project", "Consulting"][item-1]}</td>
                    <td className="py-4">Sept {item + 10}, 2023</td>
                    <td className="py-4 font-medium">${(1200 - item * 50).toLocaleString()}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                        Received
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
    </>
  );
}

export default Income;