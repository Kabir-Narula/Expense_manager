import { useState, useEffect } from "react";
import api from "../src/Utils/api";
import { formatDateToSend } from "../src/Utils/dateFormatter";
import toast from "react-hot-toast";

export default function EditExpense({ open, closeModal, type, expenseData }) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (open) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, closeModal]);

  // format the date:
  let formattedStartDate = "";
  let formattedEndDate = "";
  if (type === "editExpense") {
    formattedStartDate = formatDateToSend(expenseData.date);
    formattedEndDate = formatDateToSend(expenseData.endDate);
  }
  const [categoryUI, setCategoryUI] = useState(
    type === "editExpense" ? expenseData.category : "",
  );
  const [amountUI, setAmountUI] = useState(
    type === "editExpense" ? (expenseData.amount / 100).toFixed(2) : "",
  );
  const [startDateUI, setStartDateUI] = useState(formattedStartDate);
  const [endDateUI, setEndDateUI] = useState(formattedEndDate);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recurringUI, setRecurringUI] = useState(
    type === "editExpense" ? expenseData.recurring : "once",
  );
  const recurrenceOptions = ["once", "bi-weekly", "monthly"];
  const [endOption, setEndOption] = useState(
    type === "editExpense"
      ? expenseData.endDate
        ? "customEndDate"
        : "noEndDate"
      : "noEndDate",
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const floatVal = parseFloat(amountUI);
      let cents;
      cents = Math.round(floatVal * 100);
      const formData = {
        icon: "",
        category: categoryUI,
        amount: cents,
        date: startDateUI,
        recurring: recurringUI,
        endDate: endDateUI,
        head: true,
      };
      let res;
      if (type === "addExpense") {
        res = await api.post("/expense/add", formData);
      } else if (type === "editExpense") {
        res = await api.put(`/expense/${expenseData._id}`, formData);
      } else if (type === "deleteExpense") {
        res = await api.delete(`/expense/${expenseData._id}`);
      }
      if (res.status === 200) {
        closeModal();
        setShowError(false);
        setErrorMessage("");
      }
    } catch (error) {
      setShowError(true);
      setErrorMessage(error?.response?.data?.message);
    }
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75 border-black">
      <div className="flex flex-col bg-white justify-center gap-5 p-5 rounded-xl shadow-xl w-full max-w-xl border-solid max-h-120 border-red-50">
        {type === "deleteExpense" ? (
          <>
            <div>
              <h1 className="text-2xl font-semibold text-center">
                Are you sure you want to delete your Expense?
              </h1>
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
                  <h2 className="text-sm text-gray-500">
                    Please provide a name and numerical value for your expense
                    source
                  </h2>
                </>
              )}
              {type === "editExpense" && (
                <>
                  <h1 className="text-2xl font-semibold">Edit Expense</h1>
                  <h2 className="text-sm text-gray-500">
                    You may edit the expense source, amount, or date as you
                    wish.
                  </h2>
                </>
              )}
            </div>
            <div className="flex justify-center">
              <form className="w-120" onSubmit={handleSubmit}>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    <label>Expense Source</label>
                    <input
                      placeholder="pay cheque"
                      className="border-1 h-10 rounded-lg p-2"
                      value={categoryUI}
                      onChange={(e) => setCategoryUI(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>Amount $</label>
                    <input
                      placeholder="1000"
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
                <div className="flex flex-col">
                  <label>Date</label>
                  <input
                    type="date"
                    className="border-1 h-10 rounded-lg p-2"
                    value={startDateUI}
                    onChange={(e) => setStartDateUI(e.target.value)}
                    disabled={
                      type === "editExpense" &&
                      expenseData.head === true &&
                      expenseData.recurring !== "once"
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <select
                    className="border rounded-md px-2 py-1 text-sm mt-4 mb-4 max-w-35"
                    value={recurringUI}
                    onChange={(e) => setRecurringUI(e.target.value)}
                    disabled={
                      expenseData.recurring === "once" &&
                      expenseData.head === false &&
                      type === "editExpense"
                    }
                  >
                    {recurrenceOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {(recurringUI === "bi-weekly" ||
                    recurringUI === "monthly") && (
                    <>
                      <div className="flex justify-between">
                        <input
                          type="radio"
                          name="endOption"
                          value="customEndDate"
                          checked={endOption === "customEndDate"}
                          onChange={(e) => setEndOption(e.target.value)}
                        />
                        <div className="flex flex-col w-full max-w-xs">
                          <label>End Date</label>
                          <input
                            className="border-1 h-10 rounded-lg p-2"
                            type="date"
                            value={endDateUI}
                            onChange={(e) => setEndDateUI(e.target.value)}
                            disabled={endOption === "noEndDate"}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <input
                          type="radio"
                          name="endOption"
                          value="noEndDate"
                          checked={endOption === "noEndDate"}
                          onChange={(e) => {
                            setEndOption(e.target.value);
                            setEndDateUI("");
                          }}
                        />
                        <p>I will manually cancel recurring transactions</p>
                      </div>
                    </>
                  )}
                  {expenseData.recurring === "once" &&
                    expenseData.head === false &&
                    type === "editExpense" && (
                      <p className="text-green-600">
                        This is part of a recurring expense. To edit the
                        recurring expense, go to the most recent recurring entry
                        and make changes there.
                      </p>
                    )}
                </div>
                <hr className="mt-5" />
                {showError && <p className="text-red-600">{errorMessage}</p>}
                <div className=" flex justify-end gap-5 mt-4">
                  <button
                    onClick={() => {
                      closeModal();
                      setErrorMessage("");
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
        )}
      </div>
    </div>
  );
}
