import { useState } from "react";
import API from "../../api/axios";

function SendMoney({account}) {
  const [loading, setLoading] = useState(false);
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

const handleSend = async () => {
  if (!account) {
    alert("Account not loaded yet");
    return;
  }
  //already sending ;ignorre click
  if (loading) return;   // 🚫 prevent double click

  setLoading(true);

  try {
    await API.post("/api/transactions", {
      fromAccount: account._id,
      toAccount: toAccount,
      amount: Number(amount),
      idempotencyKey: Date.now().toString()
    });

    alert("Money Sent ✅");
    window.location.reload();

  } catch (err) {
    console.log(err.response?.data);
    alert("Transaction Failed ❌");
  }

  setLoading(false);
};

  return (
  <div className="bg-white rounded-2xl shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Send Money</h3>

    <input
      className="w-full border p-2 rounded-lg mb-3"
      placeholder="Receiver Account ID"
      onChange={(e) => setToAccount(e.target.value)}
    />

    <input
      className="w-full border p-2 rounded-lg mb-4"
      type="number"
      placeholder="Amount"
      onChange={(e) => setAmount(e.target.value)}
    />

    <button
      onClick={handleSend}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    >
      {loading ? "Sending..." : "Send Money"}
    </button>
  </div>
);
}

export default SendMoney;