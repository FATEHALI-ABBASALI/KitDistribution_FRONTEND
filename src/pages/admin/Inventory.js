import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Center.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await apiRequest("/api/inventory");
    setItems(data);
  };

  // ================= STATUS COLOR =================
  const getStatus = (qty) => {
    if (qty < 5) return { text: "Critical", color: "danger" };
    if (qty < 10) return { text: "Low", color: "warning" };
    return { text: "Good", color: "success" };
  };

  // ================= FILTER =================
  const filtered = items.filter(i =>
    i.kitType.toLowerCase().includes(search.toLowerCase())
  );

  // ================= STATS =================
  const totalItems = items.length;
  const totalQty = items.reduce((sum, i) => sum + i.totalQuantity, 0);

  // ================= LOW STOCK =================
  const lowStockItems = items.filter(i => i.totalQuantity < 10);

  // ================= CHART =================
  const chartData = items.map(i => ({
    name: i.kitType.toUpperCase(),
    quantity: i.totalQuantity
  }));

  // ================= PDF =================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Inventory Report (Kit Wise)", 14, 10);

    autoTable(doc, {
      head: [["Kit Type", "Quantity", "Status"]],
      body: items.map(i => {
        const status = getStatus(i.totalQuantity);
        return [
          i.kitType.toUpperCase(),
          i.totalQuantity,
          status.text
        ];
      })
    });

    doc.save("inventory-report.pdf");
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4">📦 Inventory Dashboard (Kit Wise)</h2>

        {/* PDF BUTTON */}
        <button className="btn btn-success mb-3" onClick={exportPDF}>
          📄 Download PDF
        </button>

        {/* STATS */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card p-3 text-center shadow-sm border-primary">
              <h6>Total Kit Types</h6>
              <h2>{totalItems}</h2>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3 text-center shadow-sm border-success">
              <h6>Total Quantity</h6>
              <h2>{totalQty}</h2>
            </div>
          </div>
        </div>

        {/* LOW STOCK ALERT */}
        {lowStockItems.length > 0 && (
          <div className="alert alert-danger">
            ⚠️ Low Stock Alert:
            <ul>
              {lowStockItems.map((i, idx) => (
                <li key={idx}>
                  <b>{i.kitType.toUpperCase()}</b> (Qty: {i.totalQuantity})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CHART */}
        <div className="card p-3 mb-4 shadow-sm">
          <h5>📊 Inventory Chart</h5>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SEARCH */}
        <input
          className="form-control mb-3"
          placeholder="Search kit type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <div className="card shadow-lg">
          <div className="card-body">

            <table className="table table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Kit Type</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4">No data found</td>
                  </tr>
                ) : (
                  filtered.map((i, index) => {
                    const status = getStatus(i.totalQuantity);

                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <b>{i.kitType.toUpperCase()}</b>
                        </td>
                        <td>{i.totalQuantity}</td>
                        <td>
                          <span className={`badge bg-${status.color}`}>
                            {status.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>

          </div>
        </div>

      </div>
    </>
  );
}