import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MdAttachMoney } from "react-icons/md";
import { FaHandHoldingUsd, FaTrashAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import Pagination from "../components/Pagination.jsx";

export default function TransactionsTable({
  type, // type will be 'income' or 'expense'
  data,
  isOwner,
  user,
  onEdit,
  onDelete,
  itemsPerPage = 15,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const getSortKey = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!data) return [];
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const { key, direction } = sortConfig;
      let aVal;
      let bVal;

      if (key === "name") {
        aVal = type === "income" ? a.source : a.category;
        bVal = type === "income" ? b.source : b.category;
      } else if (key === "date") {
        aVal = a.date ? new Date(a.date) : new Date(0);
        bVal = b.date ? new Date(b.date) : new Date(0);
      } else if (key === "amount") {
        aVal = a.amount || 0;
        bVal = b.amount || 0;
      } else if (key === "createdBy") {
        const aName = a.createdBy?.fullName || a.createdBy?.email || "";
        const bName = b.createdBy?.fullName || b.createdBy?.email || "";
        aVal = aName.toLowerCase();
        bVal = bName.toLowerCase();
      } else {
        return 0;
      }

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig, type]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil((sortedData.length || 0) / itemsPerPage) || 1;

  const isIncome = type === "income";

  const headerGradient = isIncome
    ? "from-emerald-500 to-emerald-600"
    : "from-red-500 to-rose-600";

  const countBadgeClasses = isIncome
    ? "bg-emerald-100 text-emerald-700"
    : "bg-red-100 text-red-700";

  const amountClasses = isIncome
    ? "bg-emerald-50 text-emerald-700"
    : "bg-red-50 text-red-700";

  const tagClasses = isIncome
    ? "bg-emerald-100 text-emerald-700"
    : "bg-red-100 text-red-700";

  const emptyIcon = isIncome ? (
    <MdAttachMoney className="w-8 h-8 text-gray-400" />
  ) : (
    <FaHandHoldingUsd className="w-8 h-8 text-gray-400" />
  );

  const emptyTitle = isIncome
    ? "No income transactions found"
    : "No expense transactions found";

  const emptySubtitle = isIncome
    ? "Add your first income to get started"
    : "Add your first expense to get started";

  const handleEdit = (item) => {
    if (onEdit) onEdit(item);
  };

  const handleDelete = (item) => {
    if (onDelete) onDelete(item);
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="ml-1 text-[10px] align-middle">
        {sortConfig.direction === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  const hasData = data && data.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span
            className={`w-1 h-6 bg-gradient-to-b ${headerGradient} rounded-full`}
          ></span>
          {isIncome ? "Income Transactions" : "Expense Transactions"}
          {hasData && (
            <span
              className={`ml-2 px-3 py-1 ${countBadgeClasses} text-sm font-bold rounded-full`}
            >
              {data.length}
            </span>
          )}
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-50/50 border-b border-gray-100">
              <th
                className="px-6 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer select-none"
                onClick={() => getSortKey("name")}
              >
                {isIncome ? "Source" : "Category"}
                {renderSortIndicator("name")}
              </th>
              <th
                className="px-6 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer select-none"
                onClick={() => getSortKey("date")}
              >
                Date
                {renderSortIndicator("date")}
              </th>
              <th
                className="px-6 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer select-none"
                onClick={() => getSortKey("amount")}
              >
                Amount
                {renderSortIndicator("amount")}
              </th>
              <th
                className="px-6 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer select-none"
                onClick={() => getSortKey("createdBy")}
              >
                Created By
                {renderSortIndicator("createdBy")}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {hasData && paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
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
                        {isIncome ? item.source : item.category}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${tagClasses}`}
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
                          item.date.slice(0, 10) + "T00:00:00"
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg font-bold text-sm ${amountClasses}`}
                    >
                      ${(item.amount / 100).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${headerGradient} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                      >
                        {(item.createdBy?.fullName ||
                          item.createdBy?.email ||
                          "You")
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
                      {(isOwner || item.createdBy?._id === user?._id) && (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className={`p-2 rounded-lg transition-colors ${
                              isIncome
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-blue-600 hover:bg-blue-50"
                            }`}
                            title="Edit"
                          >
                            <MdModeEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <FaTrashAlt className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      {emptyIcon}
                    </div>
                    <p className="text-gray-600 font-medium mb-1">{emptyTitle}</p>
                    <p className="text-sm text-gray-400">{emptySubtitle}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {hasData && sortedData.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <Pagination
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </motion.div>
  );
}
