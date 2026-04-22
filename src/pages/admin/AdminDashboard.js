import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { apiRequest } from "../../api/api";

/* Charts */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AdminDashboard() {
  
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState({});
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    loadStats();
    loadYears();
    loadMonthlyChart(); // 👈 ADD THIS

  }, []);
  const loadMonthlyChart = async () => {
    try {
      const data = await apiRequest("/api/admin/monthly-chart");
      setMonthlyData(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load monthly chart");
    }
  };
  const monthlyChartData = monthlyData.map(x => ({
    name: "Month " + x.month,
    value: x.count
  }));
   
  // ================= LOAD STATS =================
  const loadStats = async () => {
    try {
      const data = await apiRequest("/api/admin/dashboard-stats");
      setStats(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard stats");
    }
  };

  // ================= LOAD YEARS =================
  const loadYears = async () => {
    try {
      const data = await apiRequest("/api/year");

      setYears(data);

      const active = data.find(y => y.isActive);

      if (active) {
        setSelectedYear(active.id);

        // 🔥 IMPORTANT
        localStorage.setItem("activeYearId", active.id);
      }

    } catch (err) {
      console.error(err);
      alert("Failed to load years");
    }
  };

  // ================= CHANGE YEAR =================
  const changeYear = async (id) => {
    try {
      await apiRequest(`/api/year/set-active/${id}`, "POST");

      setSelectedYear(id);

      // 🔥 VERY IMPORTANT
      localStorage.setItem("activeYearId", id);

      // 🔥 Trigger event manually (same tab fix)
      window.dispatchEvent(new Event("yearChanged"));

      loadStats();

      alert("Year changed successfully");

    } catch (err) {
      console.error(err);
      alert("Failed to change year");
    }
  };

  const barData = [
    { name: "Users", value: stats.totalUsers || 0 },
    { name: "Kits", value: stats.totalKits || 0 },
    { name: "Received", value: stats.received || 0 },
    { name: "Pending", value: stats.pending || 0 },
  ];

  const pieData = [
    { name: "Received", value: stats.received || 0 },
    { name: "Pending", value: stats.pending || 0 },
  ];

  const COLORS = ["#22c55e", "#f97316"];

  return (
    <>
      <Navbar />

      <motion.div
        className="admin-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
       
        
      
        {/* YEAR DROPDOWN */}
       
        {page === "dashboard" && (
        <>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>
            Select Year:
          </label>

          <select
            value={selectedYear}
            onChange={(e) => changeYear(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          >
            {years.map(y => (
              <option key={y.id} value={y.id}>
                {y.year}
              </option>
            ))}
          </select>
        </div>
        </>
            )}
        {/* STATS */}
        <div className="stats-gradient-grid">

          <GradientStat title="Total Users" value={stats.totalUsers} color="grad-purple" />
          <GradientStat title="Total Kits" value={stats.totalKits} color="grad-blue" />
          <GradientStat title="Received Kits" value={stats.received} color="grad-green" />
          <GradientStat title="Pending Kits" value={stats.pending} color="grad-pink" />

        </div>
            
        {/* CHARTS */}
        <div className="charts-grid">

          <div className="chart-card">
            <h3>System Overview</h3>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[10,10,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Kit Distribution</h3>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={90}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
                   <div className="chart-card">
                    <h3>Monthly Distribution</h3>

                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={monthlyChartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#22c55e" radius={[10,10,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
        </div>

      </motion.div>
    </>
  );
}

function GradientStat({ title, value, color }) {
  return (
    <motion.div className={`gradient-stat ${color}`} whileHover={{ scale: 1.05 }}>
      <h2>{value || 0}</h2>
      <p>{title}</p>
    </motion.div>
  );
}
const btnStyle = {
  marginRight: "10px",
  padding: "8px 16px",
  border: "none",
  borderRadius: "6px",
  background: "#6366f1",
  color: "#fff",
  cursor: "pointer"
};