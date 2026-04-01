import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import AccountList from "../features/account/AccountList";
import SendMoney from "../features/transaction/SendMoney";
import TransactionList from "../features/transaction/TransactionList";
import RequestMoney from "../features/request/RequestMoney";
import RequestsList from "../features/request/RequestsList";



function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [account, setAccount] = useState(null);const location = useLocation();

  useEffect(() => {
  if (location.state?.tab) {
    setActiveTab(location.state.tab);
  }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      
      {/* Navbar */}
      <Navbar />

      <div className="p-4 sm:p-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
            Welcome back 👋
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">

          {[
            { label: "Send", icon: "💸", color: "bg-blue-100 text-blue-600", tab: "send" },
            { label: "Request", icon: "📥", color: "bg-green-100 text-green-600", tab: "request" },
            { label: "Add Money", icon: "🏦", color: "bg-purple-100 text-purple-600" },
            { label: "History", icon: "📜", color: "bg-orange-100 text-orange-600", tab: "transactions" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => item.tab && setActiveTab(item.tab)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md p-4 flex flex-col items-center transition"
            >
              <div className={`text-2xl p-3 rounded-full ${item.color}`}>
                {item.icon}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800 dark:text-white">
                {item.label}
              </p>
            </button>
          ))}

        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">

          {[
            { key: "overview", label: "📊 Overview" },
            { key: "send", label: "💸 Send Money" },
            { key: "request", label: "📥 Request Money" },
            { key: "requests", label: "🔔 Requests" },
            { key: "transactions", label: "📜 Transactions" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 whitespace-nowrap transition ${
                activeTab === tab.key
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}

        </div>

        {/* Section Title */}
        {activeTab === "overview" && (
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Account Overview
          </h2>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 transition">

          {activeTab === "overview" && (
            <AccountList setAccount={setAccount} />
          )}

          {activeTab === "send" && (
            <SendMoney account={account} />
          )}

          {activeTab === "request" && (
            <RequestMoney />
          )}

          {activeTab === "requests" && (
            <RequestsList />
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