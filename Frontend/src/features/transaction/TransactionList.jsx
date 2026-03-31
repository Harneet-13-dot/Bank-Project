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

  // ✅ Empty state
  if (!transactions.length) {
    return (
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl p-6 text-center">
        📭 No transactions yet
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">

      <h3 className="text-lg font-semibold mb-4">
        Recent Transactions
      </h3>

      <div className="space-y-3">

        {transactions.map((tx) => {
          const isDebit = tx.fromAccount._id === account._id;

          const sender = tx.fromAccount?.user?.name || "Unknown";
          const receiver = tx.toAccount?.user?.name || "Unknown";

          return (
            <div
              key={tx._id}
              className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              {/* Left */}
              <div>
                <p className="font-medium">
                  {isDebit
                    ? `Sent to ${receiver}`
                    : `Received from ${sender}`}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Right */}
              <span
                className={`font-semibold ${
                  isDebit
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {isDebit ? "- ₹" : "+ ₹"}
                {Number(tx.amount).toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default TransactionList;