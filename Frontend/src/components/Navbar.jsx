import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast"


function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const fetchUser=async () =>{
    try{
      const res=await API.get("/api/auth/me");
      setUser(res.data.user);
    }
    catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // 🔔 NEW: request states
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);

  // 🌙 Dark mode handler
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // 🔔 NEW: fetch incoming requests
  const fetchRequests = async () => {
    try {
      const res = await API.get("/api/request/incoming");
      setRequests(res.data.requests || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔁 fetch on load + auto refresh
  useEffect(() => {
    fetchRequests();

    const interval = setInterval(fetchRequests, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // ✅ Accept request
  const handleAccept = async (id) => {
    try {
      await API.post(`/api/request/${id}/accept`);
      toast.success("Request accepted 💸");
      fetchRequests(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  // ❌ Reject request
  const handleReject = async (id) => {
    try {
      await API.post(`/api/request/${id}/reject`);
      toast.error("Rejected ❌");
      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await API.post("/api/auth/logout");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl">💸</span>
        <h1 className="font-bold text-lg text-gray-800 dark:text-white tracking-wide">
          PayFlow
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* 🔔 NEW: Notification Bell */}
        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            🔔

            {/* 🔴 Badge count */}
            {requests.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1.5 rounded-full">
                {requests.length}
              </span>
            )}
          </button>

          {/* 📩 Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3 z-50">

              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Requests
                </h3>

                {/* 👉 Go to full page */}
                <button
                  onClick={() => {
                  navigate("/dashboard", { state: { tab: "requests" } });
                  setOpen(false);
                  }}
                  className="text-xs text-blue-500 hover:underline"
                >
                  View All
                </button>
              </div>

              {/* Empty state */}
              {requests.length === 0 ? (
                <p className="text-sm text-gray-500">No requests</p>
              ) : (
                requests.map((req) => (
                  <div
                    key={req._id}
                    className="border-b last:border-none py-2"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {req.from?.name || "User"} requested ₹{req.amount}
                    </p>

                    {/* ✅ Actions */}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="bg-green-500 text-white px-2 py-1 text-xs rounded"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => handleReject(req._id)}
                        className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}

            </div>
          )}
        </div>

        {/* User */}
        <div className="hidden sm:flex items-center gap-3">
          
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {/* alphabet displayed */}
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${user?.name || "User"}`}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
          
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {/* name displayed */}
            {user?.name
              ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
              : "User"
            }
          </p>
        
        </div>

        {/* Dark Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-800 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;