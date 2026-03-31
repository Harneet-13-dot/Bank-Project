import { useEffect, useState } from "react";
import API from "../../api/axios";

function AccountList({ setAccount }) {
  const [localAccount, setLocalAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/accounts");
        const acc = res.data.accounts[0];

        setLocalAccount(acc);
        setAccount(acc);

        const balanceRes = await API.get(
          `/api/accounts/balance/${acc._id}`
        );

        setBalance(balanceRes.data.balance);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🔥 Skeleton Loader (dark mode added)
  if (!localAccount) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md p-6 relative overflow-hidden">

      {/* Top Section */}
      <div className="flex justify-between items-start">

        <div>
          <p className="text-sm opacity-80">Available Balance</p>

          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            {showBalance ? `₹${balance}` : "••••••"}
          </h2>

          <p className="text-xs opacity-70 mt-2">
            Updated just now
          </p>
        </div>

        {/* Eye Toggle */}
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="text-xl opacity-80 hover:opacity-100"
        >
          {showBalance ? "👁️" : "🙈"}
        </button>

      </div>

      {/* Bottom Actions */}
      <div className="flex gap-3 mt-6">

        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
          + Add Money
        </button>

        <button className="bg-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition">
          View Details
        </button>

      </div>

    </div>
  );
}

export default AccountList;