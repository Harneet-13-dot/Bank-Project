import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

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

        {/* User */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            U
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            User
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