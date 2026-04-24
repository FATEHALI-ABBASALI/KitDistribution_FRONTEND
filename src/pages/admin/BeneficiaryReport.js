import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";

export default function BeneficiaryReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [sortType, setSortType] = useState("latest");

  useEffect(() => {
    loadData();
  }, []);

  // ================= LOAD =================
  const loadData = async () => {
    try {
      setLoading(true);

      const res = await apiRequest("/api/admin/beneficiary-report");

      const formatted = (res || []).map((r) => ({
        beneficiaryName: r.beneficiaryName ?? r.BeneficiaryName ?? "-",
        state: r.state ?? r.State ?? "-",
        terminal: r.terminal ?? r.Terminal ?? "-",
        center: r.center ?? r.Center ?? "-",
        month: r.month ?? r.Month ?? "-",
        amount: Number(r.amount ?? r.Amount ?? 0)
      }));

      setData(formatted);
      setFilteredData(formatted);

      const total = formatted.reduce((sum, r) => sum + r.amount, 0);
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
          x.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
          x.center.toLowerCase().includes(search.toLowerCase()) ||
          x.state.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📅 MONTH FILTER
    if (monthFilter !== "All") {
      temp = temp.filter((x) => x.month === monthFilter);
    }

    // 🔥 SORT
    if (sortType === "amount") {
      temp.sort((a, b) => b.amount - a.amount);
    }

    setFilteredData(temp);
  }, [search, monthFilter, sortType, data]);

  // ================= PDF =================
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

        {/* 🔥 FILTER BAR */}
        <div style={styles.filterBar}>
          <input
            placeholder="🔍 Search beneficiary, center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />

          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            style={styles.select}
          >
            <option value="All">All Months</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            style={styles.select}
          >
            <option value="latest">Default</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        {/* SUMMARY */}
        <div style={styles.cards}>
          <Card label="Total Records" value={filteredData.length} />
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
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.empty}>
                    No data found
                  </td>
                </tr>
              ) : (
                filteredData.map((r, i) => (
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
