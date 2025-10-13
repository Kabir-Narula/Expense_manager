import { useParams, useLocation } from "react-router-dom"
import AddSourceButton from "../components/AddSourceButton";
import { useState, useEffect } from "react";
import EditSource from "../components/EditSource";
import { IoIosArrowForward } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

export default function IncomeByYear() {
    const { year } = useParams();
    const location = useLocation();
    const {income} = location.state || {};
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("");
    const [incomeUI, setIncomeUI] = useState(null);
    const [expandedMonth, setExpandedMonth] = useState(null);
    const [selectedIncome, setSelectedIncome] = useState({})
    const [refreshKey, setRefreshKey] = useState(0); // trigger re-fetch

    useEffect(() => {
        if (income) {
            setIncomeUI(income);
        }
    }, [income]);

    useEffect(() => {
        console.log("second useEffect: " + JSON.stringify(incomeUI, null, 2))
    }, [incomeUI])

    // Fetch year data on mount and when refreshKey changes
    useEffect(() => {
        const fetchYearData = async () => {
            try {
                const response = await fetch(`/api/v1/finances/income/${year}`);
                if (response.ok) {
                    const data = await response.json();
                    setIncomeUI(data);
                }
            } catch (error) {
                console.error('Failed to fetch year data:', error);
            }
        };
        fetchYearData();
    }, [year, refreshKey]);

    return (
        <>
            <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Income for {year}</h1>
                    <AddSourceButton func={() => { setOpen(true); setType("addIncome") }} text="Add Income"/>
                </div>

                {open &&
                    <EditSource
                        open={open}
                        closeModal={() => {
                            setOpen(false);
                            setRefreshKey(prev => prev + 1); // trigger re-fetch after modal close
                        }}
                        type={type}
                        incomeData={selectedIncome}
                    />
                }
                {
                    incomeUI && Object.entries(incomeUI).map(([month, incomeData]) => (
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
                                                    {incomeData.income.map((item) => (
                                                        <tr
                                                            key={item._id}
                                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                                        >
                                                            <td className="py-4">{item.source}</td>
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
                                                                        setType("editIncome");
                                                                        setSelectedIncome(item);
                                                                    }}>
                                                                        <MdModeEdit className="text-2xl text-green-500"/>
                                                                    </button>
                                                                    <button onClick={() => {
                                                                        setOpen(true);
                                                                        setType("deleteIncome");
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
