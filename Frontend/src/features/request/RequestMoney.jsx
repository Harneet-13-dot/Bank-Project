import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

function RequestMoney() {
  const [to, setTo] = useState(""); // username/email
  const [amount, setAmount] = useState("");

  // 🔥 NEW STATES
  const [userPreview, setUserPreview] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // 🔍 VERIFY USER
  const handleVerify = async () => {
    if (!to) {
      toast.error("Enter username or email ⚠️");
      return;
    }

    try {
      setVerifying(true);

      const res = await API.get(`/api/user/getAccount?query=${to}`);

      setUserPreview(res.data); // { accountId, name }

      toast.success("User found ✅");

    } catch (err) {
      setUserPreview(null);
      toast.error("User not found ❌");
    } finally {
      setVerifying(false);
    }
  };

  // 💰 SEND REQUEST
  const handleRequest = async () => {
    if (!to || !amount) {
      toast.error("Please fill all fields ⚠️");
      return;
    }

    if (!userPreview) {
      toast.error("Please verify user first ❗");
      return;
    }

    try {
      await API.post("/api/request", {
        to: userPreview.accountId, // ✅ verified account
        amount,
      });

      toast.success("Request sent 🚀");

      // reset
      setTo("");
      setAmount("");
      setUserPreview(null);

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Error sending request ❌"
      );
    }
  };

return (
  <div className="space-y-4">
    
    {/* Title */}
    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
      Request Money
    </h2>

    {/* 🔍 Username Input */}
    <input
      type="text"
      placeholder="Enter username or email"
      value={to}
      onChange={(e) => {
        setTo(e.target.value);
        setUserPreview(null); // reset on change
      }}
      className="w-full p-3 border rounded-lg 
      text-black dark:text-white 
      bg-white dark:bg-gray-700 
      placeholder-gray-400 dark:placeholder-gray-300 
      focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    {/* 🔥 VERIFY BUTTON (CENTERED) */}
    <div className="flex justify-center">
      <button
        onClick={handleVerify}
        disabled={verifying}
        className={`px-6 py-2 rounded-lg text-sm font-medium ${
          verifying
            ? "bg-gray-400"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {verifying ? "Verifying..." : "Verify User"}
      </button>
    </div>

    {/* ❌ Not verified */}
    {!userPreview && to && (
      <p className="text-sm text-red-500 text-center">
        ❌ User not verified
      </p>
    )}

    {/* ✅ USER PREVIEW */}
    {userPreview && (
      <div className="flex items-center gap-3 p-3 rounded-xl border 
        bg-green-50 dark:bg-green-900/30 
        border-green-200 dark:border-green-700">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center 
          bg-gradient-to-br from-green-400 to-emerald-600 text-white font-semibold">
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
      type="number"
      placeholder="Enter Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      className="w-full p-3 border rounded-lg 
      text-black dark:text-white 
      bg-white dark:bg-gray-700 
      placeholder-gray-400 dark:placeholder-gray-300 
      focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    {/* Button */}
    <button
      onClick={handleRequest}
      className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition w-full"
    >
      Send Request
    </button>

  </div>
);
}

export default RequestMoney;