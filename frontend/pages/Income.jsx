// import React from "react";
import { FiPlus } from "react-icons/fi";
import { MdAttachMoney, MdSavings } from "react-icons/md";
import { useState, useEffect } from "react";
import EditSource from "../components/EditSource";
import api from "../src/Utils/api";
import { MdModeEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

function Income() {
  const [open, setOpen] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(null);
  const [avgIncome, setAvgIncome] = useState();
  const [type, setType] = useState("");
  const [selectedIncome, setSelectedIncome] = useState(null)

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        let res = await api.get("/income/get")
        let val = 0
        if (res.status === 200) {
          setIncomeData(res.data);
          res.data.map(data => {
            console.log(data.amount)
            val += data.amount;
          });
          const cents = (val/100).toFixed(2);
          const avg = (cents / res.data.length).toFixed(2);
          setTotalIncome(cents);
          setAvgIncome(avg)
        }
      } catch (error) {
        console.log(error.message);
      }
    } 
    fetchIncomeData();
  }, [open])

  useEffect(() => {
    console.log(avgIncome);
  }, [avgIncome])

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
            onClick={() => { setOpen(true); setType("addIncome") }}
          >
            <FiPlus className="mr-2" /> Add Income
          </button>
        </div>
        <EditSource open={open} closeModal={() => setOpen(false)} type={type} incomeData={selectedIncome}/>
        {/* Income Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Income</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">${totalIncome}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MdAttachMoney className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Income</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">${isNaN(avgIncome) ? "0.00" : avgIncome}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MdSavings className="w-6 h-6 text-blue-600" />
              </div>
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
                </tr>
              </thead>
              <tbody>
                {incomeData && (incomeData.map((item) => (
                  <tr key={item._id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-4">{item.source}</td>
                    <td className="py-4">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </td>
                    <td className="py-4 font-medium">${(item.amount / 100).toFixed(2)}</td>
                    <td>
                      <div className="flex justify-center gap-5">   
                        <button onClick={() => {
                          setOpen(true); 
                          setType("editIncome");
                          setSelectedIncome(item._id)
                          console.log(item._id)
                        }}>
                          <MdModeEdit className="text-2xl text-green-500"/>
                        </button>
                        <button onClick={() => {
                            setOpen(true); 
                            setType("deleteIncome");
                            setSelectedIncome(item._id)
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

export default Income;

