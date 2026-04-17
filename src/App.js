import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Welcome3D from "./pages/Welcome3D";
import Login from "./pages/Login";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import Inventory from "./pages/admin/Inventory";
import Center from "./pages/admin/Center";
import MonthReport from "./pages/admin/MonthReport";
import CenterReport from "./pages/admin/CenterReport";
import LowStockReport from "./pages/admin/LowStockReport";
import BeneficiaryReport from "./pages/admin/BeneficiaryReport";

// ✅ NEW: Annual & Terminal Reports
import AdminAnnualReports from "./pages/admin/AdminAnnualReports";
import AdminTerminalReports from "./pages/admin/AdminTerminalReports";

// Terminal
import TerminalDashboard from "./pages/terminal/TerminalDashboard";
import ManagerLogin from "./pages/manager/ManagerLogin";
import ManagerDashboard from "./pages/manager/ManagerDashboard";

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
            <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute role="Admin">
                <Inventory />
              </ProtectedRoute>
            }
           />

          <Route
            path="/admin/centers"
            element={
              <ProtectedRoute role="Admin">
                <Center />
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
        <Route path="/admin/month-report" element={<MonthReport />} />
        <Route path="/admin/center-report" element={<CenterReport />} />
        <Route path="/admin/low-stock-report" element={<LowStockReport />} />
        <Route path="/admin/beneficiary-report" element={<BeneficiaryReport />} />
        <Route path="/manager-login" element={<ManagerLogin />} />
        <Route path="/manager" element={<ManagerDashboard />} />
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