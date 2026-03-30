//Stores data inside the component
// Keeps UI and data in sync
import { useState } from "react";
import API from "../api/axios";

// navigating from login to dashboard
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
    //api calling time taking so async
  const handleLogin = async () => {
    try {
      const res = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);  // ADD THIS
      navigate("/dashboard");

    } catch (err) {
        console.log(err.response?.data);   // 👈 ADD THIS
        console.error(err);
      alert("Login failed");
    }
  };
  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
    
    <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl w-[90%] max-w-md border border-gray-200">
      
      {/* Logo / Title */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Welcome Back
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Login to your account
      </p>

      {/* Email */}
      <input
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <input
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Button */}
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition"
      >
        Login
      </button>

      {/* Footer */}
      <p className="text-sm text-center text-gray-500 mt-4">
        Don’t have an account?{" "}
        <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
        >
            Sign up
        </span>
      </p>

    </div>
  </div>
);
}

export default Login;
