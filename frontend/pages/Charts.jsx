// import React from "react";
import { useState, useEffect } from "react";
import api from "../src/Utils/api";
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import calculateFinancialData from "../src/Utils/calculateFinancialData";
import DateRangeSelector from "../components/DateRangeSelector";
import { useAccount } from "../src/context/AccountContext";
import { parseDateToLocal } from "../src/Utils/dateFormatter";
import ViewOptions from "../src/Utils/ViewOptions";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#8884d8",
  "#82ca9d",
];

function FinancialCharts() {
  const [user, setUser] = useState(null);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("4w");
  const [memberFilter, setMemberFilter] = useState("all");
  const [members, setMembers] = useState([]);
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
  const [financialData, setFinancialData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    transactions: [],
  });
  const {
    isOwner,
    currentAccount,
    loadAccounts,
    setCurrentAccountId,
    currentAccountId,
  } = useAccount();
  const viewOptions = ViewOptions({ setRange });
  const handleRangeSubmit = async (e) => {
    e.preventDefault();
    try {
      setNoDataMessage("");
      const incomeResponse = await api.get(
        `income/get?start=${customStartDateUI}&end=${customEndDateUI}`,
      );
      const expenseResponse = await api.get(
        `expense/get?start=${customStartDateUI}&end=${customEndDateUI}`,
      );
      if (incomeResponse.status === 200 && expenseResponse.status === 200) {
        const incomeDocuments = incomeResponse.data;
        const expenseDocuments = expenseResponse.data;
        const filteredIncome =
          memberFilter === "all"
            ? incomeDocuments
            : incomeDocuments.filter((i) => i.createdBy?._id === memberFilter);
        const filteredExpense =
          memberFilter === "all"
            ? expenseDocuments
            : expenseDocuments.filter((i) => i.createdBy?._id === memberFilter);
        setIncomeData(filteredIncome);
        setExpenseData(filteredExpense);
      }
    } catch (error) {
      setNoDataMessage(
        error.response?.data?.message || "An unexpected error occurred",
      );
    }
  };
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await api.get("/auth/getUser");
        setUser(userResponse.data);

        const incomeResponse = await api.get(`/income/get?range=${range}`);
        const incomes = incomeResponse.data || [];

        const expenseResponse = await api.get(`/expense/get?range=${range}`);
        const expenses = expenseResponse.data || [];

        const filteredExpenses =
          memberFilter === "all"
            ? expenses
            : expenses.filter((i) => i.createdBy?._id === memberFilter);

        const filteredIncome =
          memberFilter === "all"
            ? incomes
            : incomes.filter((i) => i.createdBy?._id === memberFilter);
        setIncomeData(filteredIncome);
        setExpenseData(filteredExpenses);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memberFilter, range]); // Refetch when account changes

  useEffect(() => {
    if (incomeData.length > 0 || expenseData.length > 0) {
      generateMonthlyData();
      generateExpenseCategories();
    }
  }, [incomeData, expenseData, range]);

  const generateMonthlyData = () => {
    const monthlyMap = {};

    // Process income data
    incomeData.forEach((income) => {
      const date = new Date(income.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          month: monthName,
          income: 0,
          expenses: 0,
          savings: 0,
        };
      }
      monthlyMap[monthKey].income += income.amount / 100; // Convert from cents
    });

    // Process expense data
    expenseData.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          month: monthName,
          income: 0,
          expenses: 0,
          savings: 0,
        };
      }
      monthlyMap[monthKey].expenses += expense.amount / 100; // Convert from cents
    });

    // Calculate savings
    Object.keys(monthlyMap).forEach((key) => {
      monthlyMap[key].savings =
        monthlyMap[key].income - monthlyMap[key].expenses;
    });

    const sortedData = Object.values(monthlyMap).sort(
      (a, b) => new Date(`${a.month} 2024`) - new Date(`${b.month} 2024`),
    );

    setMonthlyData(sortedData);
  };

  const generateExpenseCategories = () => {
    const categoryMap = {};

    expenseData.forEach((expense) => {
      const category = expense.category || "Other";
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += expense.amount / 100; // Convert from cents
    });

    const categories = Object.keys(categoryMap)
      .map((name) => ({
        name,
        value: Math.round(categoryMap[name] * 100) / 100, // Round to 2 decimal places
      }))
      .sort((a, b) => b.value - a.value);

    setExpenseCategories(categories);
  };

  if (loading) {
    return (
      <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const totalIncome = incomeData.reduce(
    (sum, income) => sum + income.amount / 100,
    0,
  );
  const totalExpenses = expenseData.reduce(
    (sum, expense) => sum + expense.amount / 100,
    0,
  );
  const totalSavings = totalIncome - totalExpenses;

  return (
    <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Financial Analytics
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <div className="w-6 h-6 text-green-600">💰</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <div className="w-6 h-6 text-red-600">💸</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Net Savings</p>
              <p
                className={`text-2xl font-bold ${totalSavings >= 0 ? "text-blue-600" : "text-red-600"}`}
              >
                ${totalSavings.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <div className="w-6 h-6 text-blue-600">🏦</div>
            </div>
          </div>
        </div>
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
      {monthlyData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Monthly Income vs Expenses
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, ""]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#82ca9d"
                  strokeWidth={3}
                  name="Monthly Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ff7300"
                  strokeWidth={3}
                  name="Monthly Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Expense Category Breakdown and Savings Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {expenseCategories.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: $${value}`}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {monthlyData.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Savings Progress
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, ""]}
                  />
                  <Legend />
                  <Bar
                    dataKey="savings"
                    fill="#00C49F"
                    name="Monthly Savings"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* No Data Messages */}
      {incomeData.length === 0 && expenseData.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            No Financial Data Available
          </h2>
          <p className="text-gray-600 mb-4">
            Add some income and expense entries to see your analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/income"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Income
            </a>
            <a
              href="/expenses"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Add Expenses
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancialCharts;
