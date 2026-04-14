import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ❌ Corrupted session → clear & go login
  if (token && !userRole) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // ❌ Role mismatch → redirect to correct dashboard
  if (role && userRole !== role) {
    if (userRole === "Admin") return <Navigate to="/admin" replace />;
    if (userRole === "Terminal") return <Navigate to="/terminal" replace />;
    if (userRole === "Beneficiary") return <Navigate to="/beneficiary" replace />;

    // unknown role safety
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return children;
}

export default ProtectedRoute;
