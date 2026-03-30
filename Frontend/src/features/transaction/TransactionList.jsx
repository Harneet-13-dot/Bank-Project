import { useEffect, useState } from "react";
import API from "../../api/axios";

function TransactionList({ account }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!account) return;

    const fetchTransactions = async () => {
      try {
        const res = await API.get("/api/transactions");
        setTransactions(res.data.transactions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, [account]);

  return (
  <div className="bg-white rounded-2xl shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>

    {transactions.map((tx) => {
  const isDebit = tx.fromAccount._id === account._id;

  const sender = tx.fromAccount?.user?.name || "Unknown";
  const receiver = tx.toAccount?.user?.name || "Unknown";

  return (
    <div
      key={tx._id}
      className="flex justify-between items-center py-3 border-b"
    >
      <div>
        <p className="font-medium">
          {isDebit
            ? `Sent to ${receiver}`
            : `Received from ${sender}`}
        </p>

        <p className="text-xs text-gray-500">
          {new Date(tx.createdAt).toLocaleString()}
        </p>
      </div>

      <span
        className={`font-semibold ${
          isDebit ? "text-red-500" : "text-green-600"
        }`}
      >
        {isDebit ? "- ₹" : "+ ₹"}
        {tx.amount}
      </span>
    </div>
  );
})}
  </div>
);
}

export default TransactionList;