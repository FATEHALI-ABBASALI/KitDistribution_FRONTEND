import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";

export default function MonthReport() {
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  // ================= LOAD =================
  const loadData = async () => {
    try {
      const res = await apiRequest("/api/admin/month-wise-report");

      // 🔥 NORMALIZE DATA
      const formatted = res.map((m) => ({
        month: m.month || m.Month,
        center: m.centerName || m.CenterName,
        totalKits: m.totalKits || m.TotalKits,
        totalAmount: m.totalAmount || m.TotalAmount
      }));

      setData(formatted);

      const total = formatted.reduce(
        (sum, r) => sum + Number(r.totalAmount || 0),
        0
      );

      setTotalAmount(total);
    } catch {
      alert("Failed to load report");
    }
  };

  // ================= DOWNLOAD PDF (BACKEND) =================
  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8080/api/admin/month-wise-report/pdf",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "MonthWiseReport.pdf";
      link.click();
    } catch {
      alert("Download failed");
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        
        {/* TITLE */}
        <h2 style={styles.title}>📅 Month-wise Report</h2>

        {/* ACTION */}
        <div style={styles.actions}>
          <button style={styles.dangerBtn} onClick={downloadPDF}>
            ⬇ Download PDF
          </button>
        </div>

        {/* SUMMARY */}
        <div style={styles.cards}>
          <Card label="Total Rows" value={data.length} />
          <Card label="Total Amount" value={`₹${totalAmount}`} />
        </div>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Month</th>
                <th style={styles.th}>Center</th>
                <th style={styles.th}>Total Kits</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.empty}>
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((m, i) => (
                  <tr key={i} style={styles.tr}>
                    <td>{i + 1}</td>
                    <td>{m.month}</td>
                    <td>{m.center}</td>
                    <td>{m.totalKits}</td>
                    <td style={styles.amount}>₹{m.totalAmount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ================= CARD =================
function Card({ label, value }) {
  return (
    <div style={styles.card}>
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
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
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "15px"
  },

  actions: {
    marginBottom: "15px"
  },

  dangerBtn: {
    background: "#dc2626",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
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
    padding: "15px",
    borderRadius: "10px",
    minWidth: "150px"
  },

  tableWrapper: {
    background: "white",
    borderRadius: "10px",
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
  }
};