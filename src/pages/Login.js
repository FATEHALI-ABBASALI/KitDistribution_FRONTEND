import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiRequest } from "../api/api";
import logo from "../assets/logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 MOBILE BLOCK
  const [isMobile, setIsMobile] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [allowMobileAdmin, setAllowMobileAdmin] = useState(false);

  useEffect(() => {
    const checkMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  // ================= AUTO LOGIN =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "Admin") window.location.replace("/admin");
      else if (role === "Terminal") window.location.replace("/terminal");
      else if (role === "Beneficiary") window.location.replace("/beneficiary");
      else if (role === "Manager") window.location.replace("/manager");
    }
  }, []);

  // ================= SECRET TAP =================
  const handleSecretTap = () => {
    const count = tapCount + 1;
    setTapCount(count);

    if (count >= 10) {
      setAllowMobileAdmin(true);
      alert("Admin mobile access unlocked 🔓");
    }
  };

  // ================= LOGIN =================
  const login = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    // 🔥 BLOCK ADMIN ON MOBILE
    if (username.toLowerCase() === "admin" && isMobile && !allowMobileAdmin) {
      alert("Admin login only allowed on Desktop 💻");
      return;
    }

    setLoading(true);

    try {
      let res;

      if (username === "manager") {
        res = await apiRequest("/api/manager/login", "POST", { username, password });
      } else {
        res = await apiRequest("/api/auth/login", "POST", { username, password });
      }

      if (!res) throw new Error("Invalid response");

      localStorage.setItem("role", res.role || (username === "manager" ? "Manager" : ""));
      localStorage.setItem("token", res.token || "manager-token");

      setTimeout(() => {
        if (res.role === "Admin") window.location.replace("/admin");
        else if (res.role === "Terminal") window.location.replace("/terminal");
        else if (res.role === "Beneficiary") window.location.replace("/beneficiary");
        else if (res.role === "Manager" || username === "manager")
          window.location.replace("/manager");
        else {
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

  return (
    <div style={styles.bg}>
      
      {/* 🔥 MOBILE BLOCK SCREEN */}
      {isMobile && !allowMobileAdmin ? (
        <div style={styles.mobileBlock}>
          <h2>🚫 Desktop Only</h2>
          <p>Admin panel not allowed on mobile</p>

          {/* 🔥 SECRET TAP AREA */}
          <div onClick={handleSecretTap} style={styles.secret}></div>
        </div>
      ) : (
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* LOGO */}
          <img src={logo} alt="logo" style={styles.logo} />

          {/* TITLE */}
          <h2 style={styles.title}>Kit Distribution System</h2>
          <p style={styles.subtitle}>Secure Login Portal</p>

          {/* INPUTS */}
          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            style={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            style={styles.button}
            onClick={login}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default Login;

// ================= STYLES =================
const styles = {
  bg: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#1e3a8a,#06b6d4)"
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  logo: {
    width: "70px",
    marginBottom: "10px"
  },

  title: {
    marginBottom: "5px"
  },

  subtitle: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer"
  },

  mobileBlock: {
    textAlign: "center",
    color: "white"
  },

  secret: {
    marginTop: "20px",
    height: "40px",
    width: "40px",
    background: "transparent"
  }
};