import { useParams, useLocation } from "react-router-dom";
import AddSourceButton from "../components/AddSourceButton";
import { useState, useEffect } from "react";
import EditSource from "../components/EditSource";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import api from "../src/Utils/api";
import { useAccount } from "../src/context/AccountContext.jsx";
import { parseDateToLocal } from "../src/Utils/dateFormatter.js";
import { exportIncomeToCSV, exportIncomeToPDF } from "../src/Utils/exportUtils";
import ExportButtons from "../src/components/ExportButtons";
import DateRangeSelector from "../components/DateRangeSelector.jsx";
import ViewOptions from "../src/Utils/ViewOptions.js";

export default function Income() {
  const { year } = useParams();
  const location = useLocation();
  const { income } = location.state || {};
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [incomeUI, setIncomeUI] = useState(null);
  const [selectedIncome, setSelectedIncome] = useState({});
  const { currentAccountId, user, isOwner } = useAccount();
  const [members, setMembers] = useState([]);
  const [memberFilter, setMemberFilter] = useState("all");
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
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  // Export handlers
  const handleExportCSV = () => {
    if (!incomeUI || incomeUI.length === 0) {
      return { success: false, message: "No data to export" };
    }
    return exportIncomeToCSV(incomeUI, year, memberFilter);
  };

  const handleExportPDF = () => {
    if (!incomeUI || incomeUI.length === 0) {
      return { success: false, message: "No data to export" };
    }
    return exportIncomeToPDF(incomeUI, year, memberFilter);
  };
  const handleRangeSubmit = async (e) => {
    e.preventDefault();
    try {
      setNoDataMessage("");
      const res = await api.get(
        `income/get?start=${customStartDateUI}&end=${customEndDateUI}`,
      );
      if (res.status === 200) {
        const incomeDocuments = res.data;
        if (incomeDocuments.length === 0) {
          setNoDataMessage("Nothing to show!");
        }
        const withFilter =
          memberFilter === "all"
            ? incomeDocuments
            : incomeDocuments.filter((i) => i.createdBy?._id === memberFilter);
        setIncomeUI(withFilter);
      }
    } catch (error) {
      setNoDataMessage(
        error.response?.data?.message || "An unexpected error occurred",
      );
    }
  };

  useEffect(() => {
    if (income) {
      setIncomeUI(income);
    }
  }, [income]);
  // Fetch account members for filter
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
  // Fetch year data on mount and when refreshKey or memberFilter changes
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        let res = await api.get(`income/get?range=${range}`);
        setNoDataMessage("");
        if (res.status === 200) {
          const incomeDocuments = res.data;
          // Extract all unique tags
          const tagsSet = new Set();
          incomeDocuments.forEach((item) => {
            if (item.tags && Array.isArray(item.tags)) {
              item.tags.forEach((tag) => tagsSet.add(tag));
            }
          });
          setAllTags(Array.from(tagsSet).sort());
          const withMemberFilter =
            memberFilter === "all"
              ? incomeDocuments
              : incomeDocuments.filter(
                  (i) => i.createdBy?._id === memberFilter,
                );
          // Apply tag filter
          let withTagAndMemberFilter = withMemberFilter;
          if (selectedTag) {
            withTagAndMemberFilter = withMemberFilter.filter(
              (item) => item.tags && item.tags.includes(selectedTag),
            );
          }
          setIncomeUI(withTagAndMemberFilter);
        }
      } catch (error) {
        console.error("Failed to fetch year data:", error);
      }
    };
    fetchIncomeData();
  }, [year, refreshKey, memberFilter, range, selectedTag]);
  return (
    <>
      <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Income Transactions
          </h1>
          <AddSourceButton
            func={() => {
              setOpen(true);
              setType("addIncome");
            }}
            text="Add Income"
          />
        </div>

        {/* Member filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex gap-4">
            {members.length > 0 && (
              <div className="mb-4">
                <label className="text-sm text-gray-600 mr-2">
                  Filter by member:
                </label>
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={memberFilter}
                  onChange={(e) => setMemberFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  {members.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.fullName || m.email}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Filters */}
            <div className="mb-4 flex gap-4 flex-wrap">
              {allTags.length > 0 && (
                <div>
                  <label className="text-sm text-gray-600 mr-2">
                    Filter by tag:
                  </label>
                  <select
                    className="border rounded-md px-2 py-1 text-sm"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    <option value="">All</option>
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
            disabled={!incomeUI || incomeUI.length === 0}
          />
        </div>
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
          <EditSource
            open={open}
            closeModal={() => {
              setOpen(false);
              setRefreshKey((prev) => prev + 1); // trigger re-fetch after modal close
            }}
            type={type}
            incomeData={selectedIncome}
          />
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-4">Source</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Created By</th>
              </tr>
            </thead>
            <tbody>
              {incomeUI &&
                incomeUI.length > 0 &&
                incomeUI.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-4">
                      {item.source}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-4">{item.source}</td>
                    <td className="py-4">
                      {item.date
                        ? new Date(
                            item.date.slice(0, 10) + "T00:00:00",
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </td>
                    <td className="py-4 font-medium">
                      ${(item.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
                          {(
                            item.createdBy?.fullName ||
                            item.createdBy?.email ||
                            "You"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700">
                          {item.createdBy?.fullName ||
                            item.createdBy?.email ||
                            "You"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center gap-5">
                        {(isOwner || item.createdBy?._id === user?._id) && (
                          <button
                            onClick={() => {
                              setOpen(true);
                              setType("editIncome");
                              setSelectedIncome(item);
                            }}
                          >
                            <MdModeEdit className="text-2xl text-green-500" />
                          </button>
                        )}
                        {(isOwner || item.createdBy?._id === user?._id) && (
                          <button
                            onClick={() => {
                              setOpen(true);
                              setType("deleteIncome");
                              setSelectedIncome(item);
                            }}
                          >
                            <FaTrashAlt className="text-2xl text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
