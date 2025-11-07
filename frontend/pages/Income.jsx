// import React from "react";
import { useState, useEffect } from "react";
import EditSource from "../components/EditSource";
import api from "../src/Utils/api";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import AddSourceButton from "../components/AddSourceButton";
import { parseDateToLocal } from "../src/Utils/dateFormatter";



function Income() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [groupedDataUI, setGroupedDataUI] = useState({})

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        let res = await api.get("/income/get")
        if (res.status === 200) {
          const groupedData = res.data.reduce((acc, item) => {
            const date = parseDateToLocal(item.date);
            const year = date.getFullYear();
            const month = date.toLocaleDateString("default", {month: "long"});

            if (!acc[year]) 
              acc[year] = {};

            if (!acc[year][month]) 
              acc[year][month] = { income: [] }
            
            acc[year][month].income.push(item);
            
            return acc;
          
          }, {})
          setGroupedDataUI(groupedData);
        }
      } catch (error) {
        console.log(error.message);
      }
    } 
    fetchIncomeData();
  }, [open])

  return (
    <>
      <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Income Tracking</h1>
          </div>
          <AddSourceButton func={() => { setOpen(true); setType("addIncome") }} text="Add Income"/>
        </div>
        {open &&
          <EditSource open={open} closeModal={() => setOpen(false)} type={type}/>
        }

        {/* breakdown by year  */}
        {Object.keys(groupedDataUI).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm mx-4">
            <div className="text-center max-w-md">
              <div className="mb-4">
                <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Income Recorded Yet</h3>
              <p className="text-gray-500 mb-6">Start tracking your income by adding your first source. Track salaries, freelance work, and other income streams.</p>
              <AddSourceButton func={() => { setOpen(true); setType("addIncome") }} text="Add Your First Income"/>
            </div>
          </div>
        ) : (
          Object.entries(groupedDataUI).map(([year, months]) => (
            <div 
              key={year}
              className="bg-white border-1 rounded-xl shadow-sm p-2 m-4"
              >
              <Link 
                className="flex justify-between items-center"
                to={`/income/${year}`}
                state={{income: months}}
              >
                <p>{year}</p>
                <IoIosArrowForward/>
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Income;

