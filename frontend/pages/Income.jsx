// import React from "react";
import { FiPlus } from "react-icons/fi";
import { MdAttachMoney, MdSavings } from "react-icons/md";
import { useState, useEffect } from "react";
import EditSource from "../components/EditSource";
import api from "../src/Utils/api";
import { MdModeEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AddSourceButton from "../components/AddSourceButton";



function Income() {
  const [open, setOpen] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(null);
  const [avgIncome, setAvgIncome] = useState();
  const [type, setType] = useState("");
  const [selectedIncome, setSelectedIncome] = useState(null)
  const [groupedDataUI, setGroupedDataUI] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        let res = await api.get("/income/get")
        let val = 0
        if (res.status === 200) {
          setIncomeData(res.data);
          res.data.map(data => {
            val += data.amount;
          });
          const groupedData = res.data.reduce((acc, item) => {
            const date = new Date(item.date);
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
          <EditSource open={open} closeModal={() => setOpen(false)} type={type} incomeData={selectedIncome}/>
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

