import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields ⚠️");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);  // ADD THIS
      navigate("/dashboard");
    } catch (err) {
      console.log(err.response?.data);

      toast.error(
        err.response?.data?.message || "Login failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">

    {/* 🔥 Background blobs */}
    <div className="absolute top-[-120px] left-[-120px] w-72 h-72 bg-indigo-400 opacity-30 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-120px] right-[-120px] w-72 h-72 bg-purple-400 opacity-30 rounded-full blur-3xl"></div>

    {/* 🔥 Content */}
    <div className="w-full max-w-md px-6">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg">
          💸
        </div>
        <h1 className="mt-3 text-2xl font-bold text-gray-800 dark:text-white">
          PayFlow
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Smart payments made simple
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">

        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Welcome back
        </h2>

        {/* Email */}
        <input
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  </div>
);
}

export default Login;
