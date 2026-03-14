import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  // Check for the token directly from the Redux state
  const { authToken } = useSelector((state) => state.auth);

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
