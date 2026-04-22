import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "../../api/api";

function BeneficiaryDashboard() {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentStatus = await apiRequest("/api/beneficiary/distribution-status");
      setStatus(currentStatus);

      const historyData = await apiRequest("/api/beneficiary/history");
      setHistory(historyData);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <motion.div
      className="beneficiary-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* ===== Header ===== */}
      <div className="beneficiary-header">
        <h2>Beneficiary Dashboard</h2>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </motion.button>
      </div>

      {/* ===== CURRENT STATUS ===== */}
      <motion.div
        className="beneficiary-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <h3>Current Status</h3>

        {status ? (
          <div className="status-grid">
            <StatusBox label="Month" value={status.month} color="blue" />
            <StatusBox label="Amount" value={`₹${status.amount}`} color="green" />
            <StatusBox label="Status" value={status.status} color="indigo" />
          </div>
        ) : (
          <p className="empty-text">No distribution yet</p>
        )}
      </motion.div>

      {/* ===== HISTORY ===== */}
      <motion.div
        className="beneficiary-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.1 }}
      >
        <h3>Distribution History</h3>

        {history.length === 0 ? (
          <p className="empty-text">No history found</p>
        ) : (
          <ul className="history-list">
            <AnimatePresence>
              {history.map((x, i) => (
                <motion.li
                  key={i}
                  className="history-item"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <span className="month">{x.month}</span>
                  <span className="amount">₹{x.amount}</span>
                  <span className="status-tag">{x.status}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
}

export default BeneficiaryDashboard;

/* ===== SMALL COMPONENT ===== */

function StatusBox({ label, value, color }) {
  return (
    <motion.div
      className={`status-box ${color}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.18 }}
    >
      <p>{label}</p>
      <h4>{value}</h4>
    </motion.div>
  );
}
