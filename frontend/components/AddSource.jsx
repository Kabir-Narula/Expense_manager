import { useState } from "react"
import api from "../src/Utils/api"
export default function EditIncome ({open, closeModal }) {

    const [source, setSource] = useState("");
    const [amount, setAmount] = useState(0)

    const handleChange = (e) => {
        setAmount(e.target.value);
    }

    const handleSave = async () => {
        if (amount <= 0) {
            console.log("please enter a valid amount")
        }
        const floatVal = parseFloat(amount)
        if (!isNaN(floatVal)) {
            const cents = Math.round(floatVal * 100);
            setAmount(0)
            const res = await api.post("/add")
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">
            <div className="flex flex-col bg-white justify-center gap-5 p-5 rounded-xl shadow-xl w-full max-w-xl border-solid max-h-80 h-80">
                <div className="">
                    <h1 className="text-2xl font-semibold">Add Income</h1>
                    <h2 className="text-sm text-gray-500">Please provide a name and numerical value for your income source</h2>
                </div>
                <div className="flex justify-center">
                    <form className="w-120">
                        <div className="flex flex-row justify-around">
                            <div className="flex flex-col">
                                <label>Income Source</label>
                                <input placeholder="pay cheque" className="border-1 h-10 rounded-lg p-2"/>
                            </div>
                            <div className="flex flex-col">
                                <label>Amount $</label>
                                <input 
                                    placeholder="1000" 
                                    className="border-1 h-10 rounded-lg p-2"
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <hr className="mt-5"/>
                        <div className=" flex justify-end gap-5 mt-4">
                            <button 
                                onClick={() => closeModal()} 
                                className="border-1 w-20 h-10 rounded-lg cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                className="border-1 w-20 h-10 rounded-lg bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700"
                                onClick={handleSave}
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