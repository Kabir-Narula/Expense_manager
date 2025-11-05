import { useState, useEffect } from "react"
import api from "../src/Utils/api";
import toast from 'react-hot-toast';

export default function EditSource ({open, closeModal, type, incomeData }) {
    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        if (open) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [open, closeModal]);

    // format the date: 
    let formattedDate = ""
    if (type === "editIncome"){

        const date = new Date(`${incomeData.date}`.replace(/-/g, '\/').replace(/T.+/, ''));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
    }

    const [sourceUI, setSourceUI] = useState(type === "editIncome" ? incomeData.source : "");
    const [amountUI, setAmountUI] = useState(type === "editIncome" ? (incomeData.amount / 100).toFixed(2) : "");
    const [dateUI, setDateUI] = useState(type === "editIncome" ? formattedDate : new Date().toISOString().split('T')[0]);
    const [showError, setShowError] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");

    const [recurringUI, setRecurringUI] = useState(type === "editIncome" ? incomeData.recurring : false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const floatVal = parseFloat(amountUI)
            let cents;
            cents = Math.round(floatVal * 100) 
            const formData = {
                icon:"",
                source: sourceUI,
                amount: cents,
                date: dateUI,
                recurring: recurringUI,
                startDate: dateUI,
            };
            let res;
            if (type === "addIncome") {
                res = await api.post("/income/add", formData);
                toast.success("Income added successfully!");
            } else if (type ==="editIncome") {
                res = await api.put(`/income/${incomeData._id}`, formData);
                toast.success("Income updated successfully!");
            } else if (type === "deleteIncome") {
                res = await api.delete(`/income/${incomeData._id}`);
                toast.success("Income deleted successfully!");
            }
            if (res.status === 200) {
                closeModal();
                setShowError(false);
                setErrorMessage("")
            }
        } catch (error) {
            setShowError(true);
            setErrorMessage(error?.response?.data?.message);
        }
    }

    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">
            <div className="flex flex-col bg-white justify-center gap-5 p-5 rounded-xl shadow-xl w-full max-w-xl border-solid max-h-80 h-80">
                {
                    type === "deleteIncome" ? (
                        <>                        
                            <div>
                                <h1 className="text-2xl font-semibold text-center">Are you sure you want to delete your income?</h1>
                            </div>
                            <div className="flex justify-center">
                                <form className="w-120" onSubmit={handleSubmit}>
                                    <div className=" flex justify-center gap-5 mt-4">
                                        <button 
                                            onClick={() => closeModal()} 
                                            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            No
                                        </button>
                                        <button 
                                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                                            type="submit"
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                {type === "addIncome" && (
                                    <>
                                        <h1 className="text-2xl font-semibold">Add Income</h1>
                                        <h2 className="text-sm text-gray-500">Please provide a name and numerical value for your income source</h2>
                                    </>
                                )}
                                {type === "editIncome" && (
                                    <>                        
                                        <h1 className="text-2xl font-semibold">Edit Income</h1>
                                        <h2 className="text-sm text-gray-500">You may edit the income source, amount, or date as you wish.</h2>
                                    </>
                                )}
                            </div>
                            <div className="flex justify-center">
                                <form className="w-120" onSubmit={handleSubmit}>
                                    <div className="flex flex-row justify-between">
                                        <div className="flex flex-col">
                                            <label>Income Source</label>
                                            <input 
                                                placeholder="pay cheque" 
                                                className="border-1 h-10 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                value={sourceUI}
                                                onChange={(e) => setSourceUI(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label>Amount $</label>
                                            <input 
                                                placeholder="1000" 
                                                className="border-1 h-10 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                type="number"
                                                value={amountUI}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Allow only numbers with up to 2 decimals
                                                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                        setAmountUI(value);
                                                    }
                                                }}
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label>Date</label>
                                        <input 
                                            type="date" 
                                            className="border-1 h-10 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            value={dateUI}
                                            onChange={(e) => setDateUI(e.target.value)}
                                        />
                                    </div>
                                    <hr className="mt-5"/>
                                    {showError && (
                                        <p className="text-red-600">{errorMessage}</p>
                                    )}
                                    <div className=" flex justify-end gap-5 mt-4">
                                        <button 
                                            onClick={() => {
                                                closeModal()
                                                setErrorMessage("")
                                                setShowError(false);
                                            }} 
                                            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <label className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                checked={recurringUI} 
                                                onChange={(e) => setRecurringUI(e.target.checked)}
                                            />
                                                Recurring Every Month
                                        </label>
                                        <button 
                                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                                            type="submit"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}
