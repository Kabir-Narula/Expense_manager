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
        { Object.entries(groupedDataUI).map(([year, months]) => (
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
        ))}
      </div>
    </>
  );
}

export default Income;

