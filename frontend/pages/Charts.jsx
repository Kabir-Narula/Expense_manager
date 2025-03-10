// import React from "react";
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
  ScatterChart,
  Scatter
} from "recharts";

// Sample data - replace with your actual data source
const financialData = [
  { month: "Jan", income: 4500, expenses: 3200, savings: 1300 },
  { month: "Feb", income: 5200, expenses: 4100, savings: 1100 },
  { month: "Mar", income: 4800, expenses: 3800, savings: 1000 },
  { month: "Apr", income: 6200, expenses: 4200, savings: 2000 },
  { month: "May", income: 5800, expenses: 3900, savings: 1900 },
  { month: "Jun", income: 6500, expenses: 4300, savings: 2200 },
];

const expenseCategories = [
  { name: "Housing", value: 1200 },
  { name: "Food", value: 800 },
  { name: "Transport", value: 400 },
  { name: "Utilities", value: 300 },
  { name: "Entertainment", value: 200 },
];

const budgetComparison = [
  { category: "Housing", budget: 1500, actual: 1200 },
  { category: "Food", budget: 1000, actual: 800 },
  { category: "Transport", budget: 500, actual: 400 },
  { category: "Utilities", budget: 400, actual: 300 },
  { category: "Entertainment", budget: 300, actual: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

function FinancialCharts() {
  return (
    <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Financial Analytics</h1>
      
      {/* Income vs Expenses Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Income vs Expenses</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Monthly Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ff7300" 
                strokeWidth={2}
                name="Monthly Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget vs Actual Spending */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Budget vs Actual Spending</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#8884d8" name="Budgeted Amount" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual Spending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Savings Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Savings Progress</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
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

      {/* Budget Compliance Scatter Plot */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Budget Compliance</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="budget" 
                name="Budget" 
                unit="$" 
              />
              <YAxis 
                type="number" 
                dataKey="actual" 
                name="Actual" 
                unit="$" 
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter 
                name="Budget vs Actual" 
                data={budgetComparison} 
                fill="#8884d8" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default FinancialCharts;