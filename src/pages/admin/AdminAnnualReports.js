import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { apiRequest } from "../../api/api";

export default function AdminAnnualReports() {
  const [year, setYear] = useState("");
  const [rows, setRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ================= LOAD =================
  const load = async () => {
    if (!year) return alert("Select Year");

    try {
      setLoading(true);

      const data = await apiRequest(`/api/admin/report-annual?year=${year}`);

      setRows(data);

      const total = data.reduce(
        (sum, r) => sum + Number(r.totalAmount || 0),
        0
      );

      setTotalAmount(total);
    } catch {
      alert("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  // ================= DOWNLOAD =================
  const downloadFile = async () => {
    if (!year) return alert("Select Year");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/admin/report-annual/pdf?year=${year}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `AnnualReport_${year}.pdf`;
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
        <h1 style={styles.title}>📊 Annual Reports Dashboard</h1>

        {/* FILTER */}
        <div style={styles.filter}>
          <input
            type="number"
            placeholder="Enter Year (2025)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={styles.input}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            style={styles.primaryBtn}
            onClick={load}
          >
            {loading ? "Loading..." : "View Report"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            style={styles.dangerBtn}
            onClick={downloadFile}
          >
            ⬇ Download PDF
          </motion.button>
        </div>

        {/* CARDS */}
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
                <th style={styles.th}>Beneficiary ID</th>
                <th style={styles.th}>Beneficiary Name</th>
                <th style={styles.th}>Terminal</th>
                <th style={styles.th}>Center</th>
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
                    <td>{r.beneficiary_ID}</td>
                    <td>{r.beneficiaryName}</td>
                    <td>{r.terminalName}</td>
                    <td>{r.centerName}</td>
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
      <p style={{ opacity: 0.8 }}>{label}</p>
      <h2>{value}</h2>
    </motion.div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    padding: "25px",
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#111827",
  },

  filter: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    minWidth: "200px",
  },

  primaryBtn: {
    padding: "12px 18px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  dangerBtn: {
    padding: "12px 18px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  card: {
    background: "linear-gradient(135deg,#4f46e5,#06b6d4)",
    color: "white",
    padding: "20px",
    borderRadius: "14px",
    minWidth: "200px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },

  tableWrapper: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    background: "#111827",
    color: "white",
    padding: "12px",
    textAlign: "left",
    fontSize: "14px",
  },

  tr: {
    borderBottom: "1px solid #eee",
    transition: "0.2s",
  },

  amount: {
    fontWeight: "bold",
    color: "#16a34a",
  },

  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#777",
  },
};