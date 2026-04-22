import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { apiRequest } from "../../api/api";

export default function AdminTerminalReports() {
  const [rows, setRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [activeYear, setActiveYear] = useState("");

  // ================= LOAD YEAR =================
  const loadYear = async () => {
    try {
      const data = await apiRequest("/api/year/active-year");
      setActiveYear(data.year);
    } catch {
      setActiveYear("Not available");
    }
  };

  // ================= LOAD REPORT =================
  const load = async () => {
    try {
      const data = await apiRequest(`/api/admin/report-terminal`);

      // 🔥 NORMALIZE DATA
      const formatted = data.map((r) => ({
        terminalId: r.Terminal_ID || r.terminal_ID,
        terminalName: r.TerminalName || r.terminalName,
        centerName: r.CenterName || r.centerName,
        totalAmount: r.TotalAmount || r.totalAmount,
        totalRecords: r.TotalRecords || r.totalRecords
      }));

      setRows(formatted);

      const total = formatted.reduce(
        (sum, r) => sum + Number(r.totalAmount || 0),
        0
      );

      setTotalAmount(total);
    } catch {
      alert("Failed to load report");
    }
  };

  // ================= LOAD YEAR INIT =================
  useEffect(() => {
    loadYear();
  }, []);

  // ================= YEAR CHANGE EVENT =================
  useEffect(() => {
    const handleYearChange = () => {
      loadYear();
      setRows([]);
      setTotalAmount(0);
    };

    window.addEventListener("yearChanged", handleYearChange);

    return () => {
      window.removeEventListener("yearChanged", handleYearChange);
    };
  }, []);

  // ================= DOWNLOAD =================
  const downloadFile = async (url, filename) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://kitdistributionapi-production.up.railway.app/api" + url, {
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
        <h1 style={styles.title}>🖥 Terminal-wise Reports</h1>

        {/* YEAR */}
        <p style={styles.year}>Active Year: <b>{activeYear || "Loading..."}</b></p>

        {/* ACTION BUTTONS */}
        <div style={styles.actions}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            style={styles.primaryBtn}
            onClick={load}
          >
            Load Report
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            style={styles.dangerBtn}
            onClick={() =>
              downloadFile("/admin/report-terminal/pdf", "TerminalReport.pdf")
            }
          >
            Download PDF
          </motion.button>
        </div>

        {/* SUMMARY */}
        <div style={styles.cards}>
          <SummaryCard label="Total Terminals" value={rows.length} />
          <SummaryCard label="Total Amount" value={`₹${totalAmount}`} />
        </div>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Terminal ID</th>
                <th style={styles.th}>Terminal Name</th>
                <th style={styles.th}>Center</th>
                <th style={styles.th}>Records</th>
                <th style={styles.th}>Amount</th>
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
                    <td>{r.terminalId}</td>
                    <td>{r.terminalName}</td>
                    <td>{r.centerName}</td>
                    <td>{r.totalRecords}</td>
                    <td style={styles.amount}>₹{r.totalAmount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

// ================= CARD =================
function SummaryCard({ label, value }) {
  return (
    <motion.div style={styles.card} whileHover={{ scale: 1.05 }}>
      <p>{label}</p>
      <h2>{value}</h2>
    </motion.div>
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
    marginBottom: "5px"
  },

  year: {
    marginBottom: "15px",
    color: "#555"
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  primaryBtn: {
    background: "#2563eb",
    color: "white",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  },

  dangerBtn: {
    background: "#dc2626",
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
    padding: "12px",
    textAlign: "left"
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
  }
};
