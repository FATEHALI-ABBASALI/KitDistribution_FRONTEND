import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Welcome3D from "./pages/Welcome3D";
import Login from "./pages/Login";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";

// ✅ NEW: Annual & Terminal Reports
import AdminAnnualReports from "./pages/admin/AdminAnnualReports";
import AdminTerminalReports from "./pages/admin/AdminTerminalReports";

// Terminal
import TerminalDashboard from "./pages/terminal/TerminalDashboard";

// Beneficiary
import BeneficiaryDashboard from "./pages/beneficiary/BeneficiaryDashboard";

// Auth Guard
import ProtectedRoute from "./auth/ProtectedRoute";

function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "Admin") setRedirectPath("/admin");
      else if (role === "Terminal") setRedirectPath("/terminal");
      else if (role === "Beneficiary") setRedirectPath("/beneficiary");
    }

    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <BrowserRouter>
      <Routes>

        {/* ⭐ FIRST SCREEN */}
        <Route
          path="/"
          element={
            redirectPath ? <Navigate to={redirectPath} replace /> : <Welcome3D />
          }
        />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="Admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute role="Admin">
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW: Annual Report */}
        <Route
          path="/admin/reports-annual"
          element={
            <ProtectedRoute role="Admin">
              <AdminAnnualReports />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW: Terminal-wise Report */}
        <Route
          path="/admin/reports-terminal"
          element={
            <ProtectedRoute role="Admin">
              <AdminTerminalReports />
            </ProtectedRoute>
          }
        />

        {/* TERMINAL */}
        <Route
          path="/terminal"
          element={
            <ProtectedRoute role="Terminal">
              <TerminalDashboard />
            </ProtectedRoute>
          }
        />

        {/* BENEFICIARY */}
        <Route
          path="/beneficiary"
          element={
            <ProtectedRoute role="Beneficiary">
              <BeneficiaryDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}