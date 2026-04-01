import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

function SendMoney({ account }) {
  const [loading, setLoading] = useState(false);
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  // 🔥 NEW STATES
  const [userPreview, setUserPreview] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // 🔍 VERIFY USER (manual button)
  const handleVerify = async () => {
    if (!toAccount) {
      toast.error("Enter username or email ⚠️");
      return;
    }

    try {
      setVerifying(true);

      const res = await API.get(`/api/user/getAccount?query=${toAccount}`);

      setUserPreview(res.data); // { accountId, name }

      toast.success("User found ✅");

    } catch (err) {
      setUserPreview(null);
      toast.error("User not found ❌");
    } finally {
      setVerifying(false);
    }
  };

  // 💸 SEND MONEY
  const handleSend = async () => {
    if (!account) {
      toast.error("Account not loaded yet");
      return;
    }

    if (!toAccount || !amount) {
      toast.error("Please fill all fields ⚠️");
      return;
    }

    if (!userPreview) {
      toast.error("Please verify user first ❗");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      await API.post("/api/transactions", {
        fromAccount: account._id,
        toAccount: userPreview.accountId, // ✅ verified account
        amount: Number(amount),
        idempotencyKey: Date.now().toString(),
      });

      toast.success("Money Sent Successfully 💸");

      // reset
      setToAccount("");
      setAmount("");
      setUserPreview(null);

    } catch (err) {
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

    {/* 🔍 Input + Verify */}
    <div className="flex gap-2 mb-2">
      <input
        className="flex-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter username or email"
        value={toAccount}
        onChange={(e) => {
          setToAccount(e.target.value);
          setUserPreview(null); // reset on change
        }}
      />

      <button
        onClick={handleVerify}
        disabled={verifying}
        className={`px-4 rounded-lg text-sm font-medium ${
          verifying
            ? "bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {verifying ? "..." : "Verify"}
      </button>
    </div>

    {/* ❌ Not verified */}
    {!userPreview && toAccount && (
      <p className="text-sm text-red-500 mb-2">
        ❌ User not verified
      </p>
    )}

    {/* ✅ Premium User Preview */}
    {userPreview && (
      <div className="flex items-center gap-3 p-3 mb-3 rounded-xl border 
        bg-green-50 dark:bg-green-900/30 
        border-green-200 dark:border-green-700">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center 
          bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
          {userPreview.name.charAt(0).toUpperCase()}
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <span className="font-medium text-gray-800 dark:text-white">
            {userPreview.name}
          </span>
          <span className="text-xs text-green-600 dark:text-green-400">
            ✔ Verified user
          </span>
        </div>
      </div>
    )}

    {/* Amount */}
    <input
      className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="number"
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />

    {/* Send Button */}
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