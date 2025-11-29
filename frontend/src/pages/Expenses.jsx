import AddExpense from "../components/AddExpense.jsx";
import { FaTrashAlt, FaHandHoldingUsd } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { motion } from "framer-motion";

import Pagination from "../components/Pagination.jsx";
import { useExpense } from "../context/ExpenseContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
import CompactControlsBar from "../components/CompactControlsBar.jsx";

function Expenses() {
  const {
    open,
    setOpen,
    setType,
    members,
    memberFilter,
    setMemberFilter,
    allTags,
    selectedTag,
    setSelectedTag,
    handleClearFilters,
    transactionOption,
    setTransactionOption,
    transactionOptions,
    customSearch,
    setCustomSearch,
    yesterdayStr,
    todayStr,
    customStartDateUI,
    setCustomStartDateUI,
    customEndDateUI,
    setCustomEndDateUI,
    handleRangeSubmit,
    noDataMessage,
    expenseUI,
    handleExportCSV,
    handleExportPDF,
    viewOptions,
    range,
    setRefreshKey,
    type,
    selectedExpense,
    paginatedExpense,
    isOwner,
    user,
    setSelectedExpense,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useExpense();
  return (
    <>
      <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
        {/* Page Header */}
        <PageHeader
          title="Expenses"
          subtitle="Manage your spending and costs"
          setOpen={setOpen}
          setType={setType}
          location={location.pathname}
          text="Add Expense"
        />

        {/* Compact Controls Bar */}
        <CompactControlsBar
          members={members}
          memberFilter={memberFilter}
          setMemberFilter={setMemberFilter}
          allTags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          handleClearFilters={handleClearFilters}
          transactionOption={transactionOption}
          setTransactionOption={setTransactionOption}
          transactionOptions={transactionOptions}
          customSearch={customSearch}
          setCustomSearch={setCustomSearch}
          yesterdayStr={yesterdayStr}
          todayStr={todayStr}
          customStartDateUI={customStartDateUI}
          setCustomStartDateUI={setCustomStartDateUI}
          customEndDateUI={customEndDateUI}
          setCustomEndDateUI={setCustomEndDateUI}
          handleRangeSubmit={handleRangeSubmit}
          noDataMessage={noDataMessage}
          documentUI={expenseUI}
          handleExportCSV={handleExportCSV}
          handleExportPDF={handleExportPDF}
          viewOptions={viewOptions}
          range={range}
        />

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
