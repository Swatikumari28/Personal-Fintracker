import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">All Transactions</h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{txn.title}</td>
                    <td className="py-2 px-4 border-b">₹{txn.amount}</td>
                    <td
                      className={`py-2 px-4 border-b ${
                        txn.type === "income"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {txn.type}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTransactions;
