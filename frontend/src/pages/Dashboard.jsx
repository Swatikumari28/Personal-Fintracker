import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import getCurrentUser from "../utils/getCurrentUser";
import { getMonthlyGoal, setMonthlyGoal } from "../utils/goalService";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [user, setUser] = useState(null);
  const [goal, setGoal] = useState({ incomeGoal: 0, expenseGoal: 0 });
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [incomeInput, setIncomeInput] = useState(0);
  const [expenseInput, setExpenseInput] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchSummary();
    fetchGoal();
  }, [month]);

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("User fetch error:", error?.response?.data || error.message);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (error) {
      console.error("Summary fetch error:", error?.response?.data || error.message);
    }
  };

  const fetchGoal = async () => {
    try {
      const data = await getMonthlyGoal(month);
      setGoal(data || { incomeGoal: 0, expenseGoal: 0 });
      setIncomeInput(data?.incomeGoal || 0);
      setExpenseInput(data?.expenseGoal || 0);
    } catch (error) {
      console.error("Goal fetch error:", error?.response?.data || error.message);
    }
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedGoal = await setMonthlyGoal({
        incomeGoal: incomeInput,
        expenseGoal: expenseInput,
        month,
      });
      setGoal(updatedGoal);
      alert("Monthly goals updated successfully!");
    } catch (error) {
      console.error("Goal update error:", error?.response?.data || error.message);
    }
  };

  const getFinancialTip = () => {
    const { income, expense } = summary;
    if (income === 0 && expense === 0) {
      return "Start tracking your income and expenses to see helpful insights!";
    } else if (income > 0 && expense === 0) {
      return "You're saving 100% of your income — consider investing!";
    } else if (income === 0 && expense > 0) {
      return "You're spending without income. Try finding income sources!";
    } else if (expense > income) {
      return "Your expenses are higher than income. Cut unnecessary costs!";
    } else if (expense === income) {
      return "You're breaking even. Aim to reduce spending and grow savings.";
    } else {
      const savings = income - expense;
      if (savings >= income * 0.3) {
        return "Awesome! You're saving a good portion of your income. Keep it up!";
      } else {
        return "You're saving, but there’s room to improve your spending habits.";
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* Welcome */}
        <section className="text-center">
          <h2 className="text-4xl font-bold text-slate-800">👋 Hello, {user?.name || "User"}!</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Welcome to your personal finance manager...
          </p>
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-green-100 p-5 rounded-xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-green-700">Income</h3>
            <p className="text-2xl font-bold text-green-900 mt-1">₹{summary.income}</p>
          </div>
          <div className="bg-red-100 p-5 rounded-xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-red-700">Expense</h3>
            <p className="text-2xl font-bold text-red-900 mt-1">₹{summary.expense}</p>
          </div>
          <div className="bg-blue-100 p-5 rounded-xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-blue-700">Balance</h3>
            <p className="text-2xl font-bold text-blue-900 mt-1">₹{summary.balance}</p>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => navigate("/add-transaction")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
          >
            ➕ Add Transaction
          </button>
          <button
            onClick={() => navigate("/all-transactions")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
          >
            📄 View All Transactions
          </button>
        </section>

        {/* Monthly Goals Section */}
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow space-y-8">
          <h3 className="text-2xl font-bold text-center text-indigo-600">🎯 Monthly Goals</h3>

          <form onSubmit={handleGoalSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Income Goal</label>
              <input
                type="number"
                value={incomeInput}
                onChange={(e) => setIncomeInput(Number(e.target.value))}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expense Limit</label>
              <input
                type="number"
                value={expenseInput}
                onChange={(e) => setExpenseInput(Number(e.target.value))}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </form>

          <div className="text-center">
            <button
              onClick={handleGoalSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow"
            >
              💾 Save Monthly Goals
            </button>
          </div>

          {/* Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-5 rounded shadow-sm">
              <h4 className="text-lg font-semibold text-green-700">📊 Income Progress</h4>
              <p className="text-sm mt-1">
                Current: ₹{summary.income} / Goal: ₹{goal.incomeGoal}
              </p>
              <div className="w-full bg-gray-200 h-4 rounded-full mt-2">
                <div
                  className="h-4 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (summary.income / (goal.incomeGoal || 1)) * 100)}%`,
                    backgroundColor: "#22c55e",
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {summary.income >= goal.incomeGoal
                  ? "✅ Goal achieved!"
                  : `🟢 ₹${goal.incomeGoal - summary.income} remaining`}
              </p>
            </div>

            <div className="bg-red-50 p-5 rounded shadow-sm">
              <h4 className="text-lg font-semibold text-red-700">📉 Expense Progress</h4>
              <p className="text-sm mt-1">
                Current: ₹{summary.expense} / Limit: ₹{goal.expenseGoal}
              </p>
              <div className="w-full bg-gray-200 h-4 rounded-full mt-2">
                <div
                  className="h-4 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (summary.expense / (goal.expenseGoal || 1)) * 100)}%`,
                    backgroundColor: "#ef4444",
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {summary.expense <= goal.expenseGoal
                  ? "✅ You're under budget!"
                  : `⚠️ ₹${summary.expense - goal.expenseGoal} over budget`}
              </p>
            </div>
          </div>
        </section>
<section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
  {/* Pie Chart */}
  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
    <h4 className="text-lg font-semibold text-center mb-4 text-indigo-600">
      Budget Usage
    </h4>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={[
            { name: "Income", value: summary.income || 0 },
            { name: "Expense", value: summary.expense || 0 },
          ]}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          <Cell fill="#10b981" />
          <Cell fill="#ef4444" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex justify-center mt-4 text-sm text-gray-600">
      <p className="mr-4">Total Income: ₹{summary.income}</p>
      <p>Total Expense: ₹{summary.expense}</p>
    </div>
  </div>

  {/* Financial Tip */}
  <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-indigo-100 p-6 rounded-lg shadow border border-yellow-200 flex items-start">
    <div className="text-4xl mr-4">💡</div>
    <div>
      <h4 className="text-lg font-bold text-yellow-900 mb-2">Smart Financial Tip</h4>
      <p className="text-base text-gray-800 leading-relaxed">
        {getFinancialTip()}
      </p>
    </div>
  </div>
</section>
      </main>
    </div>
  );
};

export default Dashboard;
