import { useState, useEffect } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

export default function ManagerDashboard() {

  const [items, setItems] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");

  const [kitType, setKitType] = useState("Small");
  const [qty, setQty] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);

  // ================= LOAD =================
  useEffect(() => {
    loadCenters();
  }, []);

  useEffect(() => {
    if (selectedCenter) {
      loadInventory();
      loadHistory();
    }
  }, [selectedCenter]);

  // ================= LOAD CENTERS =================
  const loadCenters = async () => {
    try {
      setError("");

      const res = await apiRequest("/api/centers");

      const fixed = (res || []).map(c => ({
        id: Number(c.id || c.Id),
        name: c.name || c.Name
      }));

      if (fixed.length === 0) {
        setError("⚠️ No centers found");
        return;
      }

      setCenters(fixed);
      setSelectedCenter(fixed[0].id);

    } catch (err) {
      console.log(err);
      setError("❌ Failed to load centers");
    }
  };

  // ================= LOAD INVENTORY =================
  const loadInventory = async () => {
    try {
      setError("");

      const res = await apiRequest(`/api/manager/inventory/${selectedCenter}`);

      const fixed = (res || []).map(i => ({
        id: i.id || i.Id,
        itemName: i.itemName || i.ItemName || "",
        quantity: Number(i.quantity || i.Quantity || 0),
        kitType: i.kitType || i.KitType || "Small"
      }));

      setItems(fixed);

      const low = fixed.filter(i => i.quantity < 10);
      setLowStockItems(low);

    } catch (err) {
      console.log(err);
      setItems([]);
      setError("❌ Inventory load failed");
    }
  };

  // ================= LOAD HISTORY =================
  const loadHistory = async () => {
    try {
      const res = await apiRequest(`/api/manager/stock-history/${selectedCenter}`);

      const fixed = (res || []).map(h => ({
        itemName: h.itemName || h.ItemName || "",
        quantity: Number(h.quantity || h.Quantity || 0),
        purchaseDate: h.purchaseDate || h.PurchaseDate,
        kitType: h.kitType || h.KitType || "Small"
      }));

      setHistory(fixed);

    } catch (err) {
      console.log(err);
      setHistory([]);
    }
  };

  // ================= BUY STOCK (🔥 FINAL FIX) =================
  const buyStock = async () => {

    if (!selectedCenter) {
      setError("⚠️ Select center first");
      return;
    }

    if (!qty || qty <= 0) {
      setError("⚠️ Enter valid quantity");
      return;
    }

    setLoading(true);
    setError("");
    setMsg("");

    try {

      const payload = {
        quantity: Number(qty),
        centerId: Number(selectedCenter),
        kitType: kitType.trim()
      };

      console.log("SENDING DATA:", payload); // 🔥 DEBUG

      const res = await apiRequest("/api/manager/buy-stock", "POST", payload);

      // 🔥 IMPORTANT FIX
      if (!res || res.message?.toLowerCase().includes("error")) {
        throw new Error(res?.message || "Backend failed");
      }

      setMsg(`✅ ${kitType} kit added successfully`);
      setQty("");

      await loadInventory();
      await loadHistory();

    } catch (err) {
      console.log("BUY ERROR FULL:", err);
      setError("❌ Backend error while adding stock");
    } finally {
      setLoading(false);
    }
  };

  // ================= PDF =================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Center Stock Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Item", "Kit", "Quantity", "Date"]],
      body: history.map(h => [
        h.itemName,
        h.kitType,
        h.quantity,
        new Date(h.purchaseDate).toLocaleString()
      ])
    });

    doc.save("center-stock.pdf");
  };

  const totalStock = items.reduce((sum, i) => sum + i.quantity, 0);

  const chartData = items.map(i => ({
    name: `${i.itemName} (${i.kitType})`,
    quantity: i.quantity,
    fill: i.quantity < 10 ? "#ff4d4f" : "#4CAF50"
  }));

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4 text-primary fw-bold">
          🏢 Manager Dashboard
        </h2>

        <div className="card p-3 mb-3 shadow border-0">
          <label className="fw-bold">Select Center</label>
          <select
            className="form-control mt-2"
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(Number(e.target.value))} // 🔥 FIX
          >
            {centers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="alert alert-danger shadow-sm">{error}</div>}
        {msg && <div className="alert alert-success shadow-sm">{msg}</div>}

        {lowStockItems.length > 0 && (
          <div className="alert alert-warning shadow-sm">
            ⚠️ Low Stock:{" "}
            {lowStockItems.map(i => `${i.itemName} (${i.kitType})`).join(", ")}
          </div>
        )}

        <div className="row mb-4 text-center">
          <div className="col-md-6">
            <div className="card shadow border-0 p-3">
              <h6>Total Items</h6>
              <h2 className="text-primary">{items.length}</h2>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow border-0 p-3">
              <h6>Total Stock</h6>
              <h2 className="text-success">{totalStock}</h2>
            </div>
          </div>
        </div>

        <div className="card p-3 mb-4 shadow border-0">
          <h5 className="mb-3">📊 Inventory Chart</h5>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-3 mb-4 shadow border-0">
          <h5 className="mb-3">🛒 Add Kit Stock</h5>

          <select
            className="form-control mb-2"
            value={kitType}
            onChange={(e) => setKitType(e.target.value)}
          >
            <option value="Small">Small Kit</option>
            <option value="Medium">Medium Kit</option>
            <option value="Big">Big Kit</option>
          </select>

          <input
            className="form-control mb-3"
            type="number"
            placeholder="Enter Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <button
            className="btn btn-success w-100 fw-bold"
            onClick={buyStock}
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Stock"}
          </button>
        </div>

        <button className="btn btn-danger mb-3 shadow" onClick={exportPDF}>
          📄 Download Report
        </button>

        <div className="card shadow border-0">
          <div className="card-body">
            <h5>Purchase History</h5>

            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Kit</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No history
                    </td>
                  </tr>
                ) : (
                  history.map((h, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{h.itemName}</td>
                      <td>{h.quantity}</td>
                      <td>{h.kitType}</td>
                      <td>{new Date(h.purchaseDate).toLocaleString()}</td>
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