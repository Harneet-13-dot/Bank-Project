import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn = document.cookie.includes("token");

  return isLoggedIn ? children : <Navigate to="/" />;
}

export default ProtectedRoute;