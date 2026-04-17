import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiRequest } from "../api/api";
import logo from "../assets/logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= AUTO LOGIN =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "Admin") window.location.replace("/admin");
      else if (role === "Terminal") window.location.replace("/terminal");
      else if (role === "Beneficiary") window.location.replace("/beneficiary");
      else if (role === "Manager") window.location.replace("/manager"); // 🔥 ADD
    }
  }, []);

  // ================= LOGIN FUNCTION =================
  const login = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    setLoading(true);

    try {
      let res;

      // 🔥 MANAGER LOGIN API
      if (username === "manager") {
        res = await apiRequest(
          "/api/manager/login",
          "POST",
          { username, password }
        );
      } else {
        // 🔥 DEFAULT LOGIN (ADMIN / TERMINAL / BENEFICIARY)
        res = await apiRequest(
          "/api/auth/login",
          "POST",
          { username, password }
        );
      }

      if (!res) {
        throw new Error("Invalid server response");
      }

      // 🔥 SAVE ROLE
      localStorage.setItem("role", res.role || (username === "manager" ? "Manager" : ""));
      localStorage.setItem("token", res.token || "manager-token");

      setTimeout(() => {
        if (res.role === "Admin") window.location.replace("/admin");
        else if (res.role === "Terminal") window.location.replace("/terminal");
        else if (res.role === "Beneficiary") window.location.replace("/beneficiary");
        else if (res.role === "Manager" || username === "manager") {
          window.location.replace("/manager"); // 🔥 ADD
        } else {
          alert("Unknown role");
          localStorage.clear();
        }
      }, 300);

    } catch (err) {
      alert(err.message || "Invalid credentials");
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="login-bg">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* ===== LOGO ===== */}
        <img
          src={logo}
          alt="RMS Logo"
          className="login-logo"
        />

        {/* ===== TITLE ===== */}
        <div className="login-header">
          <h2>Kit Distribution System</h2>
          <p>Secure Login Portal</p>
        </div>

        {/* ===== USERNAME ===== */}
        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* ===== PASSWORD ===== */}
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ===== BUTTON ===== */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.15 }}
          onClick={login}
          disabled={loading}
          className="login-btn"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Login;