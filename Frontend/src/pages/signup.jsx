import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields ⚠️");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      await API.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const loginRes = await API.post("/api/auth/login", {
        email,
        password,
      });


      localStorage.setItem("token", loginRes.data.token);
      await API.post("/api/accounts");
      alert("Account created successfully ✅");
      navigate("/dashboard");
    } 
    
    catch (err) {
      console.log(err.response?.data);

      toast.error(
        err.response?.data?.message || "Signup failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200">
      <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl w-[90%] max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join PayFlow 🚀
        </p>
        <input
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full px-4 py-2 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 active:scale-95 transition"
        >
          Sign Up
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
export default Signup;
