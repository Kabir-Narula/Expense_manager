import EditSource from "../components/EditSource";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEdit, MdAttachMoney } from "react-icons/md";
import { motion } from "framer-motion";
import Pagination from "../components/Pagination.jsx";
import CompactControlsBar from "../components/CompactControlsBar.jsx";
import { useIncome } from "../context/IncomeContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
export default function Income() {
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
    incomeUI,
    handleExportCSV,
    handleExportPDF,
    viewOptions,
    range,
    setRefreshKey, 
    type, 
    selectedIncome,
    paginatedIncome,
    isOwner,
    user, 
    setSelectedIncome,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useIncome();
  console.log("Transaction Option: " + JSON.stringify(transactionOption, null, 2));
  return (
    <>
      <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
        {/* Page Header */}
        <PageHeader
          title="Income"
          subtitle="Track your earnings and revenue"
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
          incomeUI={incomeUI}
          handleExportCSV={handleExportCSV}
          handleExportPDF={handleExportPDF}
          viewOptions={viewOptions}
          range={range}
        />

        {open && (
          <EditSource
            open={open}
            closeModal={() => {
              setOpen(false);
              setRefreshKey((prev) => prev + 1);
            }}
            type={type}
            incomeData={selectedIncome}
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
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
              {transactionOption === "All Transactions"
                ? "All Income Transactions"
                : "Upcoming Income Transactions"}
              {incomeUI && (
                <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">
                  {incomeUI.length}
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
                    Source
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
                {paginatedIncome && paginatedIncome.length > 0 ? (
                  paginatedIncome.map((item, index) => (
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
                            {item.source}
                          </p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700"
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
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm">
                          ${(item.amount / 100).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
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
                                    setType("editIncome");
                                    setSelectedIncome(item);
                                  }}
                                  className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Edit"
                                >
                                  <MdModeEdit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setOpen(true);
                                    setType("deleteIncome");
                                    setSelectedIncome(item);
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
                          <MdAttachMoney className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium mb-1">
                          No income transactions found
                        </p>
                        <p className="text-sm text-gray-400">
                          Add your first income to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {incomeUI && incomeUI.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
