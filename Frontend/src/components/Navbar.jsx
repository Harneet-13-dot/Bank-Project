import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/api/auth/logout");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between">
      <h1 className="font-bold text-blue-600">💸 PayFlow</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;