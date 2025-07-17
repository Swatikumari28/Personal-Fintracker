// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import getCurrentUser from "../utils/getCurrentUser";

const Dashboard = () => {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSummary(res.data);
    } catch (error) {
      console.error("Summary fetch error:", error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl text-center font-bold mb-1">
          👋 Hello {user?.name || "User"}!
        </h2>
        <p className="text-gray-600 text-center text-base mt-1">
          Welcome to your personal finance manager dashboard..
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-8">
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700">Income</h3>
            <p className="text-2xl font-bold text-green-900">₹{summary.income}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-700">Expense</h3>
            <p className="text-2xl font-bold text-red-900">₹{summary.expense}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-700">Balance</h3>
            <p className="text-2xl font-bold text-blue-900">₹{summary.balance}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => navigate("/add-transaction")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
          >
            ➕ Add Transaction
          </button>
          <button
            onClick={() => navigate("/all-transactions")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
          >
            📄 View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
