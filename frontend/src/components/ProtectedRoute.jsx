// src/components/ProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  // If user not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role restriction exists and user role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  // Otherwise render child routes
  return <Outlet />;
};

export default ProtectedRoute;