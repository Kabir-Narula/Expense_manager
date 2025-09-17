import { useState, useEffect } from "react"
import api from "../src/Utils/api";

export default function EditIncome ({open, closeModal, type, incomeData }) {
    const [sourceUI, setSourceUI] = useState("");
    const [amountUI, setAmountUI] = useState(null);
    const [dateUI, setDateUI] = useState("");
    const [showError, setShowError] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");
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
            };
            let res;
            if (type === "addIncome") {
                res = await api.post("/income/add", formData);s
            } else if (type ==="editIncome") {
                res = await api.put(`/income/${incomeData}`, formData);
            }
            if (res.status === 200) {
                closeModal();
            }
        } catch (error) {
            setShowError(true);
            console.log(incomeData)
            setErrorMessage(error?.response?.data?.message);
        }
    }

    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">
            <div className="flex flex-col bg-white justify-center gap-5 p-5 rounded-xl shadow-xl w-full max-w-xl border-solid max-h-80 h-80">
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
                                    className="border-1 h-10 rounded-lg p-2"
                                    value={sourceUI}
                                    onChange={(e) => setSourceUI(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Amount $</label>
                                <input 
                                    placeholder="1000" 
                                    className="border-1 h-10 rounded-lg p-2"
                                    type="number"
                                    value={amountUI}
                                    onChange={(e) => setAmountUI(e.target.value)}
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
                        <hr className="mt-5"/>
                        {showError && (
                            <p className="text-red-600">{errorMessage}</p>
                        )}
                        <div className=" flex justify-end gap-5 mt-4">
                            <button 
                                onClick={() => closeModal()} 
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
            </div>
        </div>
    )
}
