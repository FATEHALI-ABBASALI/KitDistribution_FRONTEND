import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";

export default function KitWiseReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/api/admin/kitwise-report");

      const formatted = (res || []).map(k => ({
        kitName: k.kitName ?? k.KitName,
        totalKits: k.totalKits ?? k.TotalKits,
        totalAmount: k.totalAmount ?? k.TotalAmount
      }));

      setData(formatted);

    } catch {
      alert("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://kit-distribution-api-production-6268.up.railway.app/api/admin/kitwise-report/pdf",
      {
        headers: { Authorization: "Bearer " + token }
      }
    );

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "KitWiseReport.pdf";
    link.click();
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <h2>📦 Kit-wise Report</h2>
          <button style={styles.btn} onClick={downloadPDF}>
            ⬇ Download
          </button>
        </div>

        <div style={styles.grid}>
          {data.map((k, i) => (
            <div key={i} style={styles.card}>
              <h3>{k.kitName}</h3>
              <p>Total Kits: {k.totalKits}</p>
              <p>Amount: ₹{k.totalAmount}</p>
            </div>
          ))}
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Kit</th>
              <th>Total Kits</th>
              <th>Total Amount</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="3">Loading...</td></tr>
            ) : (
              data.map((k, i) => (
                <tr key={i}>
                  <td>{k.kitName}</td>
                  <td>{k.totalKits}</td>
                  <td>₹{k.totalAmount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    padding: "25px",
    background: "#f3f4f6",
    minHeight: "100vh"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },

  btn: {
    background: "#2563eb",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    border: "none"
  },

  grid: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px"
  },

  card: {
    background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
    color: "white",
    padding: "15px",
    borderRadius: "12px",
    minWidth: "150px"
  },

  table: {
    width: "100%",
    background: "white",
    borderRadius: "10px",
    overflow: "hidden"
  }
};
