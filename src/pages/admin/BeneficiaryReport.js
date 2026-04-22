import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";

export default function BeneficiaryReport() {
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // ================= LOAD =================
  const loadData = async () => {
    try {
      setLoading(true);

      const res = await apiRequest("/api/admin/beneficiary-report");

      // 🔥 SAFE MAPPING
      const formatted = (res || []).map((r) => ({
        beneficiaryName: r.beneficiaryName ?? r.BeneficiaryName ?? "-",
        state: r.state ?? r.State ?? "-",
        terminal: r.terminal ?? r.Terminal ?? "-",
        center: r.center ?? r.Center ?? "-",
        month: r.month ?? r.Month ?? "-",
        amount: Number(r.amount ?? r.Amount ?? 0)
      }));

      setData(formatted);

      const total = formatted.reduce((sum, r) => sum + r.amount, 0);
      setTotalAmount(total);
    } catch (err) {
      console.error(err);
      alert("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  // ================= BACKEND PDF =================
  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://kit-distribution-api-production-6268.up.railway.app/api/admin/beneficiary-report/pdf",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "BeneficiaryReport.pdf";
      link.click();
    } catch {
      alert("Download failed");
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.title}>👤 Beneficiary Report</h2>

          <button style={styles.dangerBtn} onClick={downloadPDF}>
            ⬇ Download PDF
          </button>
        </div>

        {/* SUMMARY */}
        <div style={styles.cards}>
          <Card label="Total Records" value={data.length} />
          <Card label="Total Amount" value={`₹${totalAmount}`} />
        </div>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Beneficiary</th>
                <th style={styles.th}>State</th>
                <th style={styles.th}>Terminal</th>
                <th style={styles.th}>Center</th>
                <th style={styles.th}>Month</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={styles.empty}>
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.empty}>
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((r, i) => (
                  <tr key={i} style={styles.tr}>
                    <td>{i + 1}</td>
                    <td>{r.beneficiaryName}</td>
                    <td>{r.state}</td>
                    <td>{r.terminal}</td>
                    <td>{r.center}</td>
                    <td>{r.month}</td>
                    <td style={styles.amount}>₹{r.amount}</td>
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
      <p style={{ opacity: 0.9 }}>{label}</p>
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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },

  title: {
    fontSize: "26px",
    fontWeight: "700"
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
    borderRadius: "12px",
    minWidth: "160px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },

  tableWrapper: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
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
    color: "#16a34a"
  },

  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#666"
  }
};
