// import React from "react";
import { useParams, useLocation } from "react-router-dom";
import AddSourceButton from "../components/AddSourceButton";
import { useState, useEffect } from "react";
import AddExpense from "../components/AddExpense.jsx";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import api from "../src/Utils/api";
import { useAccount } from "../src/context/AccountContext.jsx";
import { parseDateToLocal } from "../src/Utils/dateFormatter.js";
import {
  exportExpenseToCSV,
  exportExpenseToPDF,
} from "../src/Utils/exportUtils.js";
import ExportButtons from "../src/components/ExportButtons.jsx";
import DateRangeSelector from "../components/DateRangeSelector.jsx";
import ViewOptions from "../src/Utils/ViewOptions.js";
import Pagination from "../components/pagination.jsx";

function Expenses() {
  const { year } = useParams();
  const location = useLocation();
  const { expense } = location.state || {};
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [expenseUI, setExpenseUI] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState({});
  const { currentAccountId, user, isOwner } = useAccount();
  const [members, setMembers] = useState([]);
  const [memberFilter, setMemberFilter] = useState("all");
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [range, setRange] = useState("4w");
  const [customSearch, setCustomSearch] = useState(false);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const todayStr = parseDateToLocal(today);
  const yesterdayStr = parseDateToLocal(yesterday);
  const [customStartDateUI, setCustomStartDateUI] = useState(yesterdayStr);
  const [customEndDateUI, setCustomEndDateUI] = useState(todayStr);
  const [refreshKey, setRefreshKey] = useState(0); // trigger re-fetch
  const [noDataMessage, setNoDataMessage] = useState("");
  const viewOptions = ViewOptions({ setRange });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  // Export handlers
  const handleExportCSV = () => {
    if (!expenseUI || expenseUI.length === 0) {
      return { success: false, message: "No data to export" };
    }
    return exportExpenseToCSV(expenseUI, year, memberFilter);
  };

  const handleExportPDF = () => {
    if (!expenseUI || expenseUI.length === 0) {
      return { success: false, message: "No data to export" };
    }
    return exportExpenseToPDF(expenseUI, year, memberFilter);
  };
  const handleRangeSubmit = async (e) => {
    e.preventDefault();
    try {
      setNoDataMessage("");
      const res = await api.get(
        `expense/get?start=${customStartDateUI}&end=${customEndDateUI}`
      );
      if (res.status === 200) {
        const expenseDocuments = res.data;
        if (expenseDocuments.length === 0) {
          setNoDataMessage("Nothing to show!");
        }
        const withFilter =
          memberFilter === "all"
            ? expenseDocuments
            : expenseDocuments.filter((i) => i.createdBy?._id === memberFilter);
        setExpenseUI(withFilter);
      }
    } catch (error) {
      setNoDataMessage(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
  };
  useEffect(() => {
    if (expense) {
      setExpenseUI(expense);
    }
  }, [expense]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        if (!currentAccountId) return;
        const res = await api.get(`/accounts/${currentAccountId}/members`);
        setMembers(res.data || []);
      } catch (e) {
        setMembers([]);
      }
    };
    fetchMembers();
  }, [currentAccountId]);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        let res = await api.get(`expense/get?range=${range}`);
        setNoDataMessage("");
        if (res.status === 200) {
          const expenseDocuments = res.data;
          // Extract all unique tags
          const tagsSet = new Set();
          expenseDocuments.forEach((item) => {
            if (item.tags && Array.isArray(item.tags)) {
              item.tags.forEach((tag) => tagsSet.add(tag));
            }
          });
          setAllTags(Array.from(tagsSet).sort());
          const withMemberFilter =
            memberFilter === "all"
              ? expenseDocuments
              : expenseDocuments.filter(
                  (i) => i.createdBy?._id === memberFilter
                );
          // Apply tag filter
          let withTagAndMemberFilter = withMemberFilter;
          if (selectedTag) {
            withTagAndMemberFilter = withMemberFilter.filter(
              (item) => item.tags && item.tags.includes(selectedTag)
            );
          }
          setExpenseUI(withTagAndMemberFilter);
        }
      } catch (error) {
        console.error("Failed to fetch year data:", error);
      }
    };
    fetchExpenseData();
  }, [year, refreshKey, memberFilter, range, selectedTag]);

  const paginatedExpense =
    expenseUI?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  const totalPages = Math.ceil((expenseUI?.length || 0) / itemsPerPage);

  return (
    <>
      <div className='md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold text-gray-800'>
            Expense Transactions
          </h1>
          <AddSourceButton
            func={() => {
              setOpen(true);
              setType("addExpense");
            }}
            text='Add Expense'
          />
        </div>
        {/* Member filter */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm'>
          <div className='flex gap-4'>
            {members.length > 0 && (
              <div className='mb-4'>
                <label className='text-sm text-gray-600 mr-2'>
                  Filter by member:
                </label>
                <select
                  className='border rounded-md px-2 py-1 text-sm'
                  value={memberFilter}
                  onChange={(e) => setMemberFilter(e.target.value)}
                >
                  <option value='all'>All</option>
                  {members.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.fullName || m.email}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className='mb-4 flex gap-4 flex-wrap'>
              {allTags.length > 0 && (
                <div>
                  <label className='text-sm text-gray-600 mr-2'>
                    Filter by tag:
                  </label>
                  <select
                    className='border rounded-md px-2 py-1 text-sm'
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    <option value=''>All</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <ExportButtons
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            disabled={!expenseUI || expenseUI.length === 0}
          />
        </div>
        {/* setting date ranges */}
        <DateRangeSelector
          customSearch={customSearch}
          viewOptions={viewOptions}
          handleRangeSubmit={handleRangeSubmit}
          noDataMessage={noDataMessage}
          yesterdayStr={yesterdayStr}
          todayStr={todayStr}
          customEndDateUI={customEndDateUI}
          customStartDateUI={customStartDateUI}
          setCustomStartDateUI={setCustomStartDateUI}
          setCustomEndDateUI={setCustomEndDateUI}
          setCustomSearch={setCustomSearch}
        />
        <br />
        {open && (
          <AddExpense
            open={open}
            closeModal={() => {
              setOpen(false);
              setRefreshKey((prev) => prev + 1); // trigger re-fetch after modal close
            }}
            type={type}
            expenseData={selectedExpense}
          />
        )}
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='text-left text-gray-500 border-b'>
                <th className='pb-4'>Source</th>
                <th className='pb-4'>Date</th>
                <th className='pb-4'>Amount</th>
                <th className='pb-4'>Created By</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpense &&
                paginatedExpense.length > 0 &&
                paginatedExpense.map((item) => (
                  <tr
                    key={item._id}
                    className='border-b last:border-b-0 hover:bg-gray-50'
                  >
                    <td className='py-4'>
                      {item.category}
                      {item.tags && item.tags.length > 0 && (
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className='px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className='py-4'>{item.category}</td>
                    <td className='py-4'>
                      {item.date
                        ? new Date(
                            item.date.slice(0, 10) + "T00:00:00"
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </td>
                    <td className='py-4 font-medium'>
                      ${(item.amount / 100).toFixed(2)}
                    </td>
                    <td className='py-4'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm'>
                          {(
                            item.createdBy?.fullName ||
                            item.createdBy?.email ||
                            "You"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span className='text-sm text-gray-700'>
                          {item.createdBy?.fullName ||
                            item.createdBy?.email ||
                            "You"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className='flex justify-center gap-5'>
                        {(isOwner || item.createdBy?._id === user?._id) && (
                          <button
                            onClick={() => {
                              setOpen(true);
                              setType("editExpense");
                              setSelectedExpense(item);
                            }}
                          >
                            <MdModeEdit className='text-2xl text-green-500' />
                          </button>
                        )}
                        {(isOwner || item.createdBy?._id === user?._id) && (
                          <button
                            onClick={() => {
                              setOpen(true);
                              setType("deleteExpense");
                              setSelectedExpense(item);
                            }}
                          >
                            <FaTrashAlt className='text-2xl text-red-500' />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {expenseUI && expenseUI.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Expenses;
