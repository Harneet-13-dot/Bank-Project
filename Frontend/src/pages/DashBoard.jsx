import { useState } from "react";
import Navbar from "../components/Navbar";
import AccountList from "../features/account/AccountList";
import SendMoney from "../features/transaction/SendMoney";
import TransactionList from "../features/transaction/TransactionList";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [account, setAccount] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      <Navbar />

      <div className="p-4 sm:p-6 max-w-4xl mx-auto">

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b pb-2 overflow-x-auto">

          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("send")}
            className={`pb-2 whitespace-nowrap ${
              activeTab === "send"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Send Money
          </button>

          <button
            onClick={() => setActiveTab("transactions")}
            className={`pb-2 whitespace-nowrap ${
              activeTab === "transactions"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Transactions
          </button>

        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">

          {activeTab === "overview" && (
            <AccountList setAccount={setAccount} />
          )}

          {activeTab === "send" && (
            <SendMoney account={account} />
          )}

          {activeTab === "transactions" && (
            <TransactionList account={account} />
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;