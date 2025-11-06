import { useParams, useLocation } from "react-router-dom"
import AddSourceButton from "../components/AddSourceButton";
import { useState, useEffect } from "react";
import EditSource from "../components/EditSource";
import { IoIosArrowForward } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import api from "../src/Utils/api";
import { parseDateToLocal } from "../src/Utils/dateFormatter";
import { useAccount } from "../src/context/AccountContext.jsx";

export default function IncomeByYear() {
    const { year } = useParams();
    const location = useLocation();
    const {income} = location.state || {};
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("");
    const [incomeUI, setIncomeUI] = useState(null);
    const [expandedMonth, setExpandedMonth] = useState(null);
    const [selectedIncome, setSelectedIncome] = useState({})
    const { currentAccountId, user, isOwner } = useAccount();
    const [members, setMembers] = useState([]);
    const [memberFilter, setMemberFilter] = useState("all");
    const [allTags, setAllTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");

    const [refreshKey, setRefreshKey] = useState(0); // trigger re-fetch

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

    // Fetch year data on mount and when refreshKey or memberFilter/selectedTag changes
    useEffect(() => {
        const fetchYearData = async () => {
            try {
                let res = await api.get("/income/get")
                if (res.status === 200) {
                    const incomeDocuments = res.data;
                    
                    // Extract all unique tags
                    const tagsSet = new Set();
                    incomeDocuments.forEach(item => {
                        if (item.tags && Array.isArray(item.tags)) {
                            item.tags.forEach(tag => tagsSet.add(tag));
                        }
                    });
                    setAllTags(Array.from(tagsSet).sort());
                    
                    // Apply member filter
                    const withMemberFilter = memberFilter === "all"
                        ? incomeDocuments
                        : incomeDocuments.filter((i) => i.createdBy?._id === memberFilter);
                    
                    // Apply tag filter
                    let tagFiltered = withMemberFilter;
                    if (selectedTag) {
                        tagFiltered = withMemberFilter.filter(item => 
                            item.tags && item.tags.includes(selectedTag)
                        );
                    }
                    
                    // Apply year filter
                    const filtered = tagFiltered.filter(item => {
                        const itemDate = parseDateToLocal(item.date);
                        return itemDate.getFullYear() === Number(year);
                    });
                    
                    const groupedData = filtered.reduce((acc, item) => {
                        const date = parseDateToLocal(item.date);
                        const month = date.toLocaleDateString("default", { month: "long" });
                        if (!acc[month]) acc[month] = { income: [] };
                        acc[month].income.push(item);
                        return acc;
                    }, {});
                    setIncomeUI(groupedData);
                }
            } catch (error) {
                console.error('Failed to fetch year data:', error);
            }
        };
        fetchYearData();
    }, [year, refreshKey, memberFilter, selectedTag]);

    return (
        <>
            <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Income for {year}</h1>
                    <AddSourceButton func={() => { setOpen(true); setType("addIncome") }} text="Add Income"/>
                </div>
                                {/* Filters */}
                                <div className="mb-4 flex gap-4 flex-wrap">
                                    {allTags.length > 0 && (
                                        <div>
                                            <label className="text-sm text-gray-600 mr-2">Filter by tag:</label>
                                            <select
                                                className="border rounded-md px-2 py-1 text-sm"
                                                value={selectedTag}
                                                onChange={(e) => setSelectedTag(e.target.value)}
                                            >
                                                <option value="">All</option>
                                                {allTags.map((tag) => (
                                                    <option key={tag} value={tag}>{tag}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    {members.length > 0 && (
                                        <div>
                                            <label className="text-sm text-gray-600 mr-2">Filter by member:</label>
                                            <select
                                                className="border rounded-md px-2 py-1 text-sm"
                                                value={memberFilter}
                                                onChange={(e) => setMemberFilter(e.target.value)}
                                            >
                                                <option value="all">All</option>
                                                {members.map((m) => (
                                                    <option key={m.userId} value={m.userId}>{m.fullName || m.email}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                {open &&
                    <EditSource
                        open={open}
                        closeModal={() => {
                            setOpen(false);
                            setRefreshKey(prev => prev + 1); // trigger re-fetch after modal close
                        }}
                        type={type}
                        incomeData={selectedIncome}
                    />
                }
                {
                    incomeUI && Object.entries(incomeUI).map(([month, incomeData]) => (
                        <div
                            key={month}
                            className="flex flex-col border-1 rounded-xl shadow-sm p-2 m-4 bg-white"
                            onClick={() => setExpandedMonth(expandedMonth === month ? null : month)}
                        >
                            <div
                                className="flex justify-between items-center"
                            >
                                <p>{month}</p>
                                <IoIosArrowForward />
                            </div>
                                {
                                    expandedMonth === month && (
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
                                                    {incomeData.income.map((item) => (
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
                                                            <td className="py-4">
                                                                {/* Format date as a human-readable string */}
                                                                {item.date ? new Date(item.date.slice(0, 10) + 'T00:00:00').toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric"
                                                                }) : ""}
                                                            </td>
                                                             <td className="py-4 font-medium">${(item.amount / 100).toFixed(2)}</td>
                                                             <td className="py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
                                                                        {(item.createdBy?.fullName || item.createdBy?.email || "You").charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span className="text-sm text-gray-700">
                                                                        {item.createdBy?.fullName || item.createdBy?.email || "You"}
                                                                    </span>
                                                                </div>
                                                             </td>
                                                             <td>
                                                                <div className="flex justify-center gap-5">
                                                                    { (isOwner || item.createdBy?._id === user?._id) && (
                                                                    <button onClick={() => {
                                                                        setOpen(true); 
                                                                        setType("editIncome");
                                                                        setSelectedIncome(item);
                                                                    }}>
                                                                        <MdModeEdit className="text-2xl text-green-500"/>
                                                                    </button>
                                                                    )}
                                                                    { (isOwner || item.createdBy?._id === user?._id) && (
                                                                    <button onClick={() => {
                                                                        setOpen(true);
                                                                        setType("deleteIncome");
                                                                        setSelectedIncome(item);
                                                                    }}
                                                                    >
                                                                        <FaTrashAlt className="text-2xl text-red-500"/>
                                                                    </button>
                                                                    )}
                                                                </div>
                                                             </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>  
                                        </div>
                                    )
                                }
                        </div>
                    ))
                }
            </div>
        </>
    )
}
