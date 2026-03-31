import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

function SendMoney({ account }) {
  const [loading, setLoading] = useState(false);
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = async () => {
    if (!account) {
      toast.error("Account not loaded yet");
      return;
    }

    if (!toAccount || !amount) {
      toast.error("Please fill all fields ⚠️");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      await API.post("/api/transactions", {
        fromAccount: account._id,
        toAccount: toAccount,
        amount: Number(amount),
        idempotencyKey: Date.now().toString(),
      });

      toast.success("Money Sent Successfully 💸");

      setToAccount("");
      setAmount("");

    } catch (err) {
      console.log(err.response?.data);

      toast.error(
        err.response?.data?.message || "Transaction Failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">

      <h3 className="text-lg font-semibold mb-4">
        Send Money
      </h3>

      {/* Input: Receiver */}
      <input
        className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Receiver Account ID"
        value={toAccount}
        onChange={(e) => setToAccount(e.target.value)}
      />

      {/* Input: Amount */}
      <input
        className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Button */}
      <button
        onClick={handleSend}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-medium transition flex justify-center items-center gap-2 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? (
          <>
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending...
          </>
        ) : (
          "Send Money"
        )}
      </button>

    </div>
  );
}

export default SendMoney;