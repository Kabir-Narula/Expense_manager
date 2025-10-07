import { useParams, useLocation } from "react-router-dom"
import AddSourceButton from "../components/AddSourceButton";
import { useState, useEffect } from "react";
import EditSource from "../components/EditSource";
import { IoIosArrowForward } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

export default function ExpenseByYear() {
    const { year } = useParams();
    const location = useLocation();
    const {expense} = location.state || {};
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("");
    const [expenseUI, setExpenseUI] = useState(null);
    const [expandedMonth, setExpandedMonth] = useState(null);
    const [selectedIncome, setSelectedIncome] = useState({})
    useEffect(() => {
        if (expense) {
            setExpenseUI(expense);
        }
    }, [expense]); 

    useEffect(() => {
        console.log("second useEffect: " + JSON.stringify(expenseUI, null, 2))
    }, [expenseUI])
    
    return (
 <>
            <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Expenses for {year}</h1>
                    <AddSourceButton func={() => { setOpen(true); setType("addExpense") }} text="Add Expense"/>
                </div>
                
                {/* TODO: Ensure there is functionality for adding income for specific year/month */}
                {open &&
                    <EditSource open={open} closeModal={() => setOpen(false)} type={type} incomeData={selectedIncome}/>
                }
                {
                    expenseUI && Object.entries(expenseUI).map(([month, expenseData]) => (
                        <div
                            key={month}
                            className="flex flex-col border-1 rounded-xl shadow-sm p-2 m-4 bg-white"
                            onClick={() => setExpandedMonth(expandedMonth === month ? null : month)}
                        >
                            <div
                                className="flex justify-between items-center"
                            >
                                <p>{month}</p>
                                <IoIosArrowForward />
                            </div>
                                {
                                    expandedMonth === month && (
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
                                                    {expenseData.income.map((item) => (
                                                        <tr 
                                                            key={item._id}
                                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                                        >
                                                            <td className="py-4">{item.category}</td>
                                                            <td className="py-4">
                                                                {/* Format date as a human-readable string */}
                                                                {item.date ? new Date(item.date.slice(0, 10) + 'T00:00:00').toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric"
                                                                }) : ""}
                                                            </td>
                                                             <td className="py-4 font-medium">${(item.amount / 100).toFixed(2)}</td>
                                                             <td>
                                                                <div className="flex justify-center gap-5">
                                                                    <button onClick={() => {
                                                                        setOpen(true); 
                                                                        setType("editExpense");
                                                                        setSelectedIncome(item);
                                                                    }}>
                                                                        <MdModeEdit className="text-2xl text-green-500"/>
                                                                    </button>
                                                                    <button onClick={() => {
                                                                        setOpen(true); 
                                                                        setType("deleteExpense");
                                                                        setSelectedIncome(item);
                                                                    }}
                                                                    >
                                                                        <FaTrashAlt className="text-2xl text-red-500"/>
                                                                    </button>
                                                                </div>
                                                             </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>  
                                        </div>
                                    )
                                }
                        </div>
                    ))
                }
            </div>

        </>
    )
}