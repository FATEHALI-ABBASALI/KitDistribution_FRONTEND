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

  // ================= FILTER =================
  const filtered = items.filter(i =>
    i.itemName.toLowerCase().includes(search.toLowerCase())
  );

  // ================= STATS =================
  const totalItems = items.length;
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  // ================= LOW STOCK =================
  const lowStockItems = items.filter(i => i.quantity < 5);

  // ================= CHART =================
  const chartData = items.map(i => ({
    name: i.itemName,
    quantity: i.quantity
  }));

  // ================= PDF =================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Inventory Report", 14, 10);

    autoTable(doc, {
      head: [["Item", "Quantity", "Last Updated"]],
      body: items.map(i => [
        i.itemName,
        i.quantity,
        new Date(i.lastUpdated).toLocaleString()
      ])
    });

    doc.save("inventory-report.pdf");
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4">📦 Inventory Report</h2>

        {/* 📄 PDF BUTTON */}
        <button className="btn btn-success mb-3" onClick={exportPDF}>
          📄 Download PDF
        </button>

        {/* 📊 STATS */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card p-3 text-center shadow-sm">
              <h5>Total Items</h5>
              <h3>{totalItems}</h3>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3 text-center shadow-sm">
              <h5>Total Quantity</h5>
              <h3>{totalQty}</h3>
            </div>
          </div>
        </div>

        {/* ⚠️ LOW STOCK ALERT */}
        {lowStockItems.length > 0 && (
          <div className="alert alert-danger">
            ⚠️ Low Stock Alert:
            <ul>
              {lowStockItems.map(i => (
                <li key={i.id}>
                  {i.itemName} (Qty: {i.quantity})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 📈 CHART */}
        <div className="card p-3 mb-4 shadow-sm">
          <h5>Inventory Chart</h5>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🔍 SEARCH */}
        <input
          className="form-control mb-3"
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <div className="card shadow-sm">
          <div className="card-body">

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Last Updated</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  filtered.map((i, index) => (
                    <tr key={i.id}>
                      <td>{index + 1}</td>
                      <td>{i.itemName}</td>
                      <td>{i.quantity}</td>
                      <td>
                        {new Date(i.lastUpdated).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>

          </div>
        </div>

      </div>
    </>
  );
}