import { useState, useEffect } from "react"
import api from "../src/Utils/api";

export default function EditExpense ({open, closeModal, type, expenseData }) {
    // format the date: 
    let formattedDate = ""
    if (type === "editExpense" && expenseData?.date){

        const date = new Date(`${expenseData.date}`.replace(/-/g, '\/').replace(/T.+/, ''));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
    }

    const [categoryUI, setCategoryUI] = useState(type === "editExpense" && expenseData ? expenseData.category : "");
    const [amountUI, setAmountUI] = useState( type === "editExpense" && expenseData ? (expenseData.amount / 100).toFixed(2) : "");
    const [dateUI, setDateUI] = useState(formattedDate);
    const [showError, setShowError] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");
    const [recurringUI, setRecurringUI] = useState(type === "editExpense" && expenseData ? expenseData.recurring : false);
    const [tagsUI, setTagsUI] = useState(type === "editExpense" && expenseData ? (expenseData.tags?.join(', ') || '') : "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const floatVal = parseFloat(amountUI)
            let cents;
            cents = Math.round(floatVal * 100) 
            const formData = {
                icon: "",
                category: categoryUI,
                amount: cents,
                date: dateUI,
                tags: tagsUI,
                recurring: recurringUI,
                startDate: dateUI,
            };
            let res;
            if (type === "addExpense") {
                res = await api.post("/expense/add", formData);
            } else if (type ==="editExpense" && expenseData?._id) {
                res = await api.put(`/expense/${expenseData._id}`, formData);
            } else if (type === "deleteExpense" && expenseData?._id) {
                res = await api.delete(`/expense/${expenseData._id}`);
            } else {
                throw new Error("Invalid operation or missing expense data");
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
            <div className="flex flex-col bg-white justify-center gap-5 p-5 rounded-xl shadow-xl w-full max-w-xl border-solid max-h-[500px] overflow-y-auto">
                {
                    type === "deleteExpense" ? (
                        <>                        
                            <div>
                                <h1 className="text-2xl font-semibold text-center">Are you sure you want to delete your expense?</h1>
                            </div>
                            <div className="flex justify-center">
                                <form className="w-120" onSubmit={handleSubmit}>
                                    <div className=" flex justify-center gap-5 mt-4">
                                        <button 
                                            onClick={() => closeModal()} 
                                            className="border-1 w-20 h-10 rounded-lg cursor-pointer"
                                        >
                                            No
                                        </button>
                                        <button 
                                            className="border-1 w-20 h-10 rounded-lg bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700"
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
                                {type === "addExpense" && (
                                    <>
                                        <h1 className="text-2xl font-semibold">Add Expense</h1>
                                        <h2 className="text-sm text-gray-500">Please provide a category and numerical value for your expense</h2>
                                    </>
                                )}
                                {type === "editExpense" && (
                                    <>                        
                                        <h1 className="text-2xl font-semibold">Edit Expense</h1>
                                        <h2 className="text-sm text-gray-500">You may edit the expense category, amount, or date as you wish.</h2>
                                    </>
                                )}
                            </div>
                            <div className="flex justify-center">
                                <form className="w-120" onSubmit={handleSubmit}>
                                    <div className="flex flex-row justify-between">
                                        <div className="flex flex-col">
                                            <label>Expense Category</label>
                                            <input 
                                                placeholder="groceries" 
                                                className="border-1 h-10 rounded-lg p-2"
                                                value={categoryUI}
                                                onChange={(e) => setCategoryUI(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label>Amount $</label>
                                            <input 
                                                placeholder="50.00" 
                                                className="border-1 h-10 rounded-lg p-2"
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
                                            className="border-1 h-10 rounded-lg p-2"
                                            value={dateUI}
                                            onChange={(e) => setDateUI(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full mt-4">
                                        <label>Tags (comma-separated)</label>
                                        <input 
                                            placeholder="work, urgent, personal" 
                                            className="border-1 h-10 rounded-lg p-2"
                                            value={tagsUI}
                                            onChange={(e) => setTagsUI(e.target.value)}
                                        />
                                    </div>
                                    <hr className="mt-5"/>
                                    {showError && (
                                        <p className="text-red-600">{errorMessage}</p>
                                    )}
                                    <div className=" flex justify-end gap-5 mt-4">
                                        <label className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                checked={recurringUI} 
                                                onChange={(e) => setRecurringUI(e.target.checked)}
                                            />
                                            Recurring Every Month
                                        </label>
                                        <button 
                                            onClick={() => {
                                                closeModal()
                                                setErrorMessage("")
                                                setShowError(false);
                                            }} 
                                            className="border-1 w-20 h-10 rounded-lg cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            className="border-1 w-20 h-10 rounded-lg bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700"
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