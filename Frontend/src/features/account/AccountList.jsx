import { useEffect, useState } from "react";
import API from "../../api/axios";

function AccountList({ setAccount }) {
  const [localAccount, setLocalAccount] = useState(null);  // ✅ renamed
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/accounts");
        const acc = res.data.accounts[0];

        setLocalAccount(acc);   // ✅ local state
        setAccount(acc);        // ✅ send to Dashboard

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

  if (!localAccount) return <p>Loading...</p>;

  return (
  <div className="bg-white rounded-2xl shadow p-6">
    <p className="text-gray-500">Available Balance</p>

    <h2 className="text-4xl font-bold text-green-600 mt-2">
      ₹{balance}
    </h2>

    <p className="text-sm text-gray-400 mt-2">
      Updated just now
    </p>
  </div>
);
}

export default AccountList;