import { useParams, useLocation } from "react-router-dom";
import AddSourceButton from "../components/AddSourceButton";
import { useState, useEffect } from "react";
import EditSource from "../components/EditSource";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import api from "../src/Utils/api";
import { useAccount } from "../src/context/AccountContext.jsx";
import { RxDividerVertical } from "react-icons/rx";
import { FaMagnifyingGlass } from "react-icons/fa6";

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
  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const [customStartDateUI, setCustomStartDateUI] = useState(yesterdayStr);
  const [customEndDateUI, setCustomEndDateUI] = useState(todayStr);
  const [refreshKey, setRefreshKey] = useState(0); // trigger re-fetch
  const [noDataMessage, setNoDataMessage] = useState("");
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
        console.log(incomeDocuments);
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
  const viewOptions = [
    {
      label: "4 Weeks",
      setter: () => setRange("4w"),
    },
    {
      label: " 3 Months",
      setter: () => setRange("3m"),
    },
    {
      label: "6 Months",
      setter: () => setRange("6m"),
    },
    {
      label: " 12 Months",
      setter: () => setRange("12m"),
    },
  ];
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
    const fetchYearData = async () => {
      try {
        let res = await api.get(`income/get?range=${range}`);
        setNoDataMessage("");
        if (res.status === 200) {
          const incomeDocuments = res.data;
          const withFilter =
            memberFilter === "all"
              ? incomeDocuments
              : incomeDocuments.filter(
                  (i) => i.createdBy?._id === memberFilter,
                );
          console.log(withFilter);
          setIncomeUI(withFilter);
        }
      } catch (error) {
        console.error("Failed to fetch year data:", error);
      }
    };
    fetchYearData();
  }, [year, refreshKey, memberFilter, range]);
  return (
    <>
      <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
        <div className="flex justify-between items-center mb-8">
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
        <div className="flex justify-between">
          <button
            className="flex items-center cursor-pointer underline"
            onClick={() => setCustomSearch(!customSearch)}
          >
            <FaMagnifyingGlass />
            <p className="cursor-pointer">Custom Search</p>
          </button>
          <div className="flex items-center">
            <p>View:&nbsp; &nbsp;</p>
            {viewOptions.map((item) => (
              <>
                <button key={item} onClick={item.setter}>
                  <p className="cursor-pointer">{item.label}</p>
                </button>
                <RxDividerVertical />
              </>
            ))}
          </div>
        </div>
        {customSearch && (
          <>
            <br />
            <hr className="border-gray-400 border-1" />
            <br />
            <form
              className="flex flex-col max-w-xs"
              onSubmit={handleRangeSubmit}
            >
              <label>From</label>
              <input
                type="date"
                className="border-1 h-10 rounded-lg p-2"
                max={yesterdayStr}
                onChange={(e) => setCustomStartDateUI(e.target.value)}
                value={customStartDateUI}
              />
              <label>To</label>
              <input
                type="date"
                className="border-1 h-10 rounded-lg p-2"
                max={todayStr}
                onChange={(e) => setCustomEndDateUI(e.target.value)}
                value={customEndDateUI}
              />
              <br />
              <div className="flex justify-center w-full">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg 
                    hover:bg-indigo-700 transition-colors flex items-center 
                    cursor-pointer justify-center max-w-xs w-full"
                >
                  Set Range
                </button>
              </div>
            </form>
            <br />
          </>
        )}
        {noDataMessage && <p className="text-red-600">{noDataMessage}</p>}
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
