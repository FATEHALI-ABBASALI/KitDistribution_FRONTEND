import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";

export default function CenterReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("kits");

  useEffect(() => {
    loadData();
  }, []);

  // ================= LOAD =================
  const loadData = async () => {
    try {
      setLoading(true);

      const res = await apiRequest("/api/admin/center-wise-report");

      const formatted = (res || []).map((c) => ({
        centerName: c.centerName ?? c.CenterName ?? "-",
        city: c.city ?? c.City ?? "-",
        totalKits: Number(c.totalKits ?? c.TotalKits ?? 0),
        totalAmount: Number(c.totalAmount ?? c.TotalAmount ?? 0)
      }));

      setData(formatted);
      setFilteredData(formatted);

      const total = formatted.reduce((sum, r) => sum + r.totalAmount, 0);
      setTotalAmount(total);

    } catch (err) {
      console.error(err);
      alert("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================
  useEffect(() => {
    let temp = [...data];

    // 🔍 SEARCH
    if (search) {
      temp = temp.filter(
        (x) =>
          x.centerName.toLowerCase().includes(search.toLowerCase()) ||
          x.city.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🔥 SORT
    if (sortType === "kits") {
      temp.sort((a, b) => b.totalKits - a.totalKits);
    } else {
      temp.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    setFilteredData(temp);
  }, [search, sortType, data]);

  // ================= DOWNLOAD PDF =================
  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8080/api/admin/center-wise-report/pdf",
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
      link.download = "CenterWiseReport.pdf";
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
          <h2 style={styles.title}>🏢 Center-wise Report</h2>

          <button style={styles.dangerBtn} onClick={downloadPDF}>
            ⬇ Download PDF
          </button>
        </div>

        {/* 🔥 FILTER BAR */}
        <div style={styles.filterBar}>
          <input
            placeholder="🔍 Search center or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            style={styles.select}
          >
            <option value="kits">Sort by Kits</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        {/* SUMMARY */}
        <div style={styles.cards}>
          <Card label="Total Centers" value={filteredData.length} />
          <Card label="Total Amount" value={`₹${totalAmount}`} />
        </div>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Center Name</th>
                <th style={styles.th}>City</th>
                <th style={styles.th}>Total Kits</th>
                <th style={styles.th}>Total Amount</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={styles.empty}>
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.empty}>
                    No data found
                  </td>
                </tr>
              ) : (
                filteredData.map((c, i) => (
                  <tr key={i} style={styles.tr}>
                    <td>{i + 1}</td>
                    <td>{c.centerName}</td>
                    <td>{c.city}</td>
                    <td>{c.totalKits}</td>
                    <td style={styles.amount}>₹{c.totalAmount}</td>
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

  // 🔥 NEW
  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },

  search: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  select: {
    padding: "10px",
    borderRadius: "8px"
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