import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { apiRequest } from "../../api/api";

export default function AdminReports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rows, setRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const navigate = useNavigate();

  // ================= LOAD =================
  const load = async () => {
    if (!from || !to) {
      alert("Select FROM and TO date");
      return;
    }

    try {
      const data = await apiRequest(
        `/api/admin/report-range?from=${from}&to=${to}`
      );

      // 🔥 NORMALIZE DATA (MOST IMPORTANT FIX)
      const formatted = data.map((r) => ({
        beneficiary: r.beneficiaryName || r.BeneficiaryName || r.beneficiary_ID || r.Beneficiary_ID,
        terminal: r.terminalName || r.TerminalName || r.terminal_ID || r.Terminal_ID,
        month: r.month || r.Month,
        amount: r.amount || r.Amount,
        status: r.status || r.Status
      }));

      setRows(formatted);

      const total = formatted.reduce(
        (sum, r) => sum + Number(r.amount || 0),
        0
      );

      setTotalAmount(total);
    } catch (err) {
      alert("Failed to load report");
      console.error(err);
    }
  };

  // ================= DOWNLOAD =================
  const downloadFile = async (url, filename) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api" + url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch {
      alert("Download failed");
    }
  };

  return (
    <>
      <Navbar />

      <motion.div style={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        
        {/* TITLE */}
        <h1 style={styles.title}>📊 Reports Dashboard</h1>

        {/* FILTER */}
        <div style={styles.filterBox}>
          <div style={styles.dateGroup}>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={styles.input}
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={styles.input}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            style={styles.primaryBtn}
            onClick={load}
          >
            View Report
          </motion.button>
        </div>

        {/* REPORT BUTTONS */}
        <div style={styles.buttonGrid}>
          <Button onClick={() => navigate("/admin/reports-annual")} label="📅 Annual" />
          <Button onClick={() => navigate("/admin/reports-terminal")} label="🖥 Terminal" />
          <Button onClick={() => navigate("/admin/month-report")} label="📆 Monthly" />
          <Button onClick={() => navigate("/admin/low-stock-report")} label="⚠️ Low Stock" />
          <Button onClick={() => navigate("/admin/center-report")} label="🏢 Center" />
          <Button onClick={() => navigate("/admin/beneficiary-report")} label="👤 Beneficiary" />
          <Button onClick={() => navigate("/admin/kitwise-report")} label="📦 Kit-wise" />
        </div>

        {/* SUMMARY */}
        <div style={styles.cards}>
          <SummaryCard label="Total Records" value={rows.length} />
          <SummaryCard label="Total Amount" value={`₹${totalAmount}`} />
        </div>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Beneficiary</th>
                <th style={styles.th}>Terminal</th>
                <th style={styles.th}>Month</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.empty}>
                    No data found
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={i} style={styles.tr}>
                    <td>{i + 1}</td>
                    <td>{r.beneficiary}</td>
                    <td>{r.terminal}</td>
                    <td>{r.month}</td>
                    <td style={styles.amount}>₹{r.amount}</td>
                    <td>{r.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* DOWNLOAD */}
        <div style={styles.actions}>
          <button
            style={styles.dangerBtn}
            onClick={() =>
              downloadFile("/admin/report/pdf", "KitReport.pdf")
            }
          >
            ⬇ Download PDF
          </button>

          <button
            style={styles.successBtn}
            onClick={() =>
              downloadFile("/admin/report/excel", "KitReport.xlsx")
            }
          >
            ⬇ Download Excel
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ================= SMALL COMPONENTS =================

function SummaryCard({ label, value }) {
  return (
    <motion.div style={styles.card} whileHover={{ scale: 1.05 }}>
      <p>{label}</p>
      <h2>{value}</h2>
    </motion.div>
  );
}

function Button({ label, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      style={styles.navBtn}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
}

// ================= STYLES =================

const styles = {
  container: {
    padding: "25px",
    background: "#f3f4f6",
    minHeight: "100vh"
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px"
  },

  filterBox: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },

  dateGroup: {
    display: "flex",
    gap: "10px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  primaryBtn: {
    background: "#2563eb",
    color: "white",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  },

  buttonGrid: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },

  navBtn: {
    background: "#1e293b",
    color: "white",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  },

  cards: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px"
  },

  card: {
    background: "linear-gradient(135deg,#4f46e5,#06b6d4)",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    minWidth: "180px"
  },

  tableWrapper: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    background: "#111827",
    color: "white",
    padding: "12px"
  },

  tr: {
    borderBottom: "1px solid #eee"
  },

  amount: {
    fontWeight: "bold",
    color: "green"
  },

  empty: {
    textAlign: "center",
    padding: "20px"
  },

  actions: {
    marginTop: "20px",
    display: "flex",
    gap: "10px"
  },

  dangerBtn: {
    background: "#dc2626",
    color: "white",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none"
  },

  successBtn: {
    background: "#16a34a",
    color: "white",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none"
  }
};