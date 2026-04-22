import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Welcome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => navigate("/login"), 700);
  };

  return (
    <div style={styles.bg}>
      
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* TITLE */}
        <h1 style={styles.title}>Kit Distribution System</h1>
        <p style={styles.subtitle}>Fast • Secure • Efficient</p>

        {/* FEATURES */}
        <div style={styles.features}>
          <Feature icon="📦" text="Smart Distribution" />
          <Feature icon="👨‍👩‍👧" text="Beneficiary Management" />
          <Feature icon="📊" text="Advanced Reports" />
        </div>

        {/* 🔥 FIXED MARQUEE BOX */}
        <div style={styles.marqueeBox}>
          <motion.div
            style={styles.marqueeText}
            animate={{ x: ["100%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "linear"
            }}
          >
            🚀 Welcome to Kit Distribution System 🚀
          </motion.div>
        </div>

        {/* BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Started"}
        </motion.button>
      </motion.div>
    </div>
  );
}

// ================= FEATURE =================
function Feature({ icon, text }) {
  return (
    <div style={styles.featureBox}>
      <span style={styles.icon}>{icon}</span>
      <p>{text}</p>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  bg: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#1e3a8a,#06b6d4)",
    fontFamily: "Segoe UI"
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    width: "380px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px"
  },

  subtitle: {
    color: "#555",
    marginBottom: "25px"
  },

  features: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "25px"
  },

  featureBox: {
    background: "#f1f5f9",
    padding: "10px",
    borderRadius: "10px",
    width: "30%",
    fontSize: "12px"
  },

  icon: {
    fontSize: "20px"
  },

  // 🔥 MAIN FIX HERE
  marqueeBox: {
    width: "100%",
    overflow: "hidden",
    borderRadius: "10px",
    background: "#e0f2fe",
    padding: "10px",
    marginBottom: "20px",
    position: "relative"
  },

  marqueeText: {
    whiteSpace: "nowrap",
    fontWeight: "600",
    color: "#1e3a8a"
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#2563eb,#06b6d4)",
    color: "white",
    fontSize: "16px",
    cursor: "pointer"
  }
};