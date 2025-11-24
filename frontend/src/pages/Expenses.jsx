import { useParams, useLocation } from "react-router-dom";
import AddSourceButton from "../components/AddSourceButton";
import { useState, useEffect } from "react";
import AddExpense from "../components/AddExpense.jsx";
import { FaTrashAlt, FaHandHoldingUsd } from "react-icons/fa";
import { MdModeEdit, MdFilterList, MdCalendarToday } from "react-icons/md";
import { motion } from "framer-motion";
import api from "../utils/api";
import { useAccount } from "../context/AccountContext.jsx";
import { parseDateToLocal } from "../utils/dateFormatter.js";
import {
  exportExpenseToCSV,
  exportExpenseToPDF,
} from "../utils/exportUtils.js";
import ExportButtons from "../components/ExportButtons.jsx";
import ViewOptions from "../utils/ViewOptions.js";
import Pagination from "../components/Pagination.jsx";
import { TransactionOptions } from "../utils/ViewOptions.js";

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
  const [transactionOption, setTransactionOption] =
    useState("All Transactions");
  const transactionOptions = TransactionOptions({ setTransactionOption });
  // Export handlers
  const handleExportCSV = () => {
    if (!expenseUI || expenseUI.length === 0) {
      return { success: false, message: "No data to export" };
    }
    return exportExpenseToCSV(expenseUI, year, memberFilter);
  };
  const handleClearFilters = () => {
    setMemberFilter("all");
    setSelectedTag("");
    setRange("4w");
    setCustomSearch(false);
    setCustomStartDateUI(yesterdayStr);
    setCustomEndDateUI(todayStr);
    setCurrentPage(1);
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
        `expense/get?start=${customStartDateUI}&end=${customEndDateUI}`,
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
        error.response?.data?.message || "An unexpected error occurred",
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
        let res;
        if (transactionOption === "Upcoming Transactions") {
          res = await api.get(`expense/upcomingExpenses?range=${range}`);
        } else {
          res = await api.get(`expense/get?range=${range}`);
        }
        setNoDataMessage("");
        if (res.status === 200) {
          const expenseDocuments = res.data;
          expenseDocuments.sort((a, b) => new Date(b.date) - new Date(a.date));
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
                  (i) => i.createdBy?._id === memberFilter,
                );
          // Apply tag filter
          let withTagAndMemberFilter = withMemberFilter;
          if (selectedTag) {
            withTagAndMemberFilter = withMemberFilter.filter(
              (item) => item.tags && item.tags.includes(selectedTag),
            );
          }
          setExpenseUI(withTagAndMemberFilter);
        }
      } catch (error) {
        console.error("Failed to fetch year data:", error);
      }
    };
    fetchExpenseData();
  }, [
    year,
    refreshKey,
    memberFilter,
    range,
    selectedTag,
    currentAccountId,
    transactionOption,
  ]);

  const paginatedExpense =
    expenseUI?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || [];

  const totalPages = Math.ceil((expenseUI?.length || 0) / itemsPerPage);

  return (
    <>
      <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <FaHandHoldingUsd className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Manage your spending and costs
              </p>
            </div>
          </div>
          <AddSourceButton
            func={() => {
              setOpen(true);
              setType("addExpense");
            }}
            text="Add Expense"
          />
        </motion.div>

        {/* Compact Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Side: Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Member Filter */}
              {members.length > 0 && (
                <div className="flex items-center gap-2">
                  <MdFilterList className="w-5 h-5 text-gray-400" />
                  <select
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 hover:border-gray-300 transition-all cursor-pointer bg-white"
                    value={memberFilter}
                    onChange={(e) => setMemberFilter(e.target.value)}
                  >
                    <option value="all">All Members</option>
                    {members.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        {m.fullName || m.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <select
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 hover:border-gray-300 transition-all cursor-pointer bg-white"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button
                onClick={handleClearFilters}
                disabled={
                  memberFilter === "all" &&
                  !selectedTag &&
                  range === "4w" &&
                  !customSearch
                }
                className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 hover:border-gray-300 transition-all cursor-pointer bg-white"
              >
                Clear Filters
              </button>
              <select
                className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 hover:border-gray-300 transition-all cursor-pointer bg-white"
                value={transactionOption}
                onChange={(e) => setTransactionOption(e.target.value)}
              >
                {transactionOptions.map((item) => (
                  <option key={item.label} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>

              {/* Custom Search Toggle */}
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-all"
                onClick={() => setCustomSearch(!customSearch)}
              >
                <MdCalendarToday className="w-4 h-4" />
                Custom Date
                {customSearch ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Right Side: View Options & Export */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  Period:
                </span>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  {viewOptions.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.setter}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-red-600 rounded-md hover:bg-white transition-all"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <ExportButtons
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
                disabled={!expenseUI || expenseUI.length === 0}
              />
            </div>
          </div>

          {/* Expandable Custom Date Range */}
          {customSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t-2 border-gray-100"
            >
              <form
                onSubmit={handleRangeSubmit}
                className="flex flex-col sm:flex-row items-end gap-3"
              >
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all text-sm"
                    max={yesterdayStr}
                    onChange={(e) => setCustomStartDateUI(e.target.value)}
                    value={customStartDateUI}
                  />
                </div>
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all text-sm"
                    max={todayStr}
                    onChange={(e) => setCustomEndDateUI(e.target.value)}
                    value={customEndDateUI}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap"
                >
                  Apply
                </button>
              </form>
              {noDataMessage && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm">
                  <svg
                    className="w-4 h-4 text-red-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 font-medium">{noDataMessage}</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
        {open && (
          <AddExpense
            open={open}
            closeModal={() => {
              setOpen(false);
              setRefreshKey((prev) => prev + 1);
            }}
            type={type}
            expenseData={selectedExpense}
          />
        )}

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-red-500 to-rose-600 rounded-full"></span>
              {transactionOption === "All Transactions"
                ? "All Transactions"
                : "Upcoming Transactions"}
              {expenseUI && (
                <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                  {expenseUI.length}
                </span>
              )}
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedExpense && paginatedExpense.length > 0 ? (
                  paginatedExpense.map((item, index) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.category}
                          </p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.date
                          ? new Date(
                              item.date.slice(0, 10) + "T00:00:00",
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-red-50 text-red-700 font-bold text-sm">
                          ${(item.amount / 100).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {(
                              item.createdBy?.fullName ||
                              item.createdBy?.email ||
                              "You"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {item.createdBy?.fullName ||
                              item.createdBy?.email ||
                              "You"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {(isOwner || item.createdBy?._id === user?._id) &&
                            transactionOption === "All Transactions" && (
                              <>
                                <button
                                  onClick={() => {
                                    setOpen(true);
                                    setType("editExpense");
                                    setSelectedExpense(item);
                                  }}
                                  className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                  title="Edit"
                                >
                                  <MdModeEdit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setOpen(true);
                                    setType("deleteExpense");
                                    setSelectedExpense(item);
                                  }}
                                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                  title="Delete"
                                >
                                  <FaTrashAlt className="w-4 h-4" />
                                </button>
                              </>
                            )}
                        </div>
                        {transactionOption === "Upcoming Transactions" && (
                          <span className="text-sm text-gray-500 italic">
                            Upcoming
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FaHandHoldingUsd className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium mb-1">
                          No expense transactions found
                        </p>
                        <p className="text-sm text-gray-400">
                          Add your first expense to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {expenseUI && expenseUI.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default Expenses;
