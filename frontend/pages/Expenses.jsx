// import React from "react";
import { FiPlus } from "react-icons/fi";
import { MdAttachMoney, MdTrendingDown } from "react-icons/md";
import { useState, useEffect } from "react";
import EditExpense from "../components/AddExpense";
import api from "../src/Utils/api";
import { MdModeEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

function Expenses() {
  const [open, setOpen] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(null);
  const [avgExpense, setAvgExpense] = useState();
  const [type, setType] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null)

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        let res = await api.get("/expense/get")
        let val = 0
        if (res.status === 200) {
          setExpenseData(res.data);
          res.data.map(data => {
            val += data.amount;
          });
          const cents = (val/100).toFixed(2);
          const avg = (cents / res.data.length).toFixed(2);
          setTotalExpense(cents);
          setAvgExpense(avg)
        }
      } catch (error) {
        console.log(error.message);
      }
    } 
    fetchExpenseData();
  }, [open])

  useEffect(() => {
    console.log(avgExpense);
  }, [avgExpense])

  return (
    <>
      <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Expense Tracking</h1>
            <p className="text-gray-500">September 2023 Spending</p>
          </div>
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            onClick={() => { setOpen(true); setType("addExpense") }}
          >
            <FiPlus className="mr-2" /> Add Expense
          </button>
        </div>
        <EditExpense open={open} closeModal={() => setOpen(false)} type={type} expenseData={selectedExpense}/>
        {/* Expense Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">${totalExpense}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <MdAttachMoney className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Expense</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">${isNaN(avgExpense) ? "0.00" : avgExpense}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <MdTrendingDown className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
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
                </tr>
              </thead>
              <tbody>
                {expenseData && (expenseData.map((item) => (
                  <tr key={item._id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-4">{item.category}</td>
                    <td className="py-4">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </td>
                    <td className="py-4 font-medium text-red-600">-${(item.amount / 100).toFixed(2)}</td>
                    <td>
                      <div className="flex justify-center gap-5">   
                        <button onClick={() => {
                          setOpen(true); 
                          setType("editExpense");
                          setSelectedExpense(item._id)
                          console.log(item._id)
                        }}>
                          <MdModeEdit className="text-2xl text-green-500"/>
                        </button>
                        <button onClick={() => {
                            setOpen(true); 
                            setType("deleteExpense");
                            setSelectedExpense(item._id)
                            console.log(item._id)
                        }}
                        >
                          <FaTrashAlt className="text-2xl text-red-500"/>
                        </button>                  
                      </div>
                    </td>
                  </tr>
                ))) }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Expenses;
