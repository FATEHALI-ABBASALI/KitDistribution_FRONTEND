import { useState, useEffect } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 📊 CHART
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function ManagerDashboard() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [qty, setQty] = useState("");
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD DATA =================
  useEffect(() => {
    loadInventory();
    loadHistory();
  }, []);

  const loadInventory = async () => {
    try {
const res = await apiRequest("/api/manager/inventory");
      if (res && res.length > 0) {
        setItems(res);
      } else {
        // fallback
        setItems([
          { id: 1, itemName: "Rice", quantity: 0 },
          { id: 2, itemName: "Wheat", quantity: 0 },
          { id: 3, itemName: "Bajri", quantity: 0 },
          { id: 4, itemName: "Sugar", quantity: 0 },
          { id: 5, itemName: "Salt", quantity: 0 },
          { id: 6, itemName: "Oil", quantity: 0 }
        ]);
      }
    } catch {
      setItems([
        { id: 1, itemName: "Rice", quantity: 0 },
        { id: 2, itemName: "Wheat", quantity: 0 },
        { id: 3, itemName: "Bajri", quantity: 0 },
        { id: 4, itemName: "Sugar", quantity: 0 },
        { id: 5, itemName: "Salt", quantity: 0 },
        { id: 6, itemName: "Oil", quantity: 0 }
      ]);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await apiRequest("/api/manager/stock-history");
      setHistory(res || []);
    } catch {
      setHistory([]);
    }
  };

  // ================= BUY STOCK =================
  const buyStock = async () => {
    if (!selectedItem || !qty) {
      alert("Select item and quantity");
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest("/api/manager/buy-stock", "POST", {
        itemName: selectedItem,
        quantity: Number(qty)      
      });

      setMsg(`✅ Stock Updated: ${res.newStock}`);
      setQty("");

      await loadInventory();
      await loadHistory();

      setTimeout(() => setMsg(""), 3000);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= PDF =================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Stock Purchase Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Item", "Quantity", "Date"]],
      body: history.map((h) => [
        h.itemName,
        h.quantity,
        new Date(h.purchaseDate).toLocaleString(),
      ]),
    });

    doc.save("stock-history.pdf");
  };

  // ================= TOTAL =================
  const totalStock = items.reduce(
    (sum, i) => sum + Number(i.quantity || 0),
    0
  );

  // ================= CHART DATA =================
  const chartData = items.map((i) => ({
    name: i.itemName,
    quantity: i.quantity || 0
  }));

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2>🛒 Manager Dashboard</h2>

        {/* 📊 SUMMARY */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>Total Items</h5>
              <h3>{items.length}</h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>Total Stock</h5>
              <h3>{totalStock}</h3>
            </div>
          </div>
        </div>

        {/* 📊 CHART */}
        <div className="card p-3 mb-4 shadow-sm">
          <h5>📊 Inventory Chart</h5>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🛒 BUY STOCK */}
        <div className="card p-3 mb-4 shadow-sm">
          <h5>Buy Stock</h5>

          <select
            className="form-control mb-2"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i.id} value={i.itemName}>
                {i.itemName}
              </option>
            ))}
          </select>

          <input
            className="form-control mb-2"
            type="number"
            placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <button
            className="btn btn-success"
            onClick={buyStock}
            disabled={loading}
          >
            {loading ? "Processing..." : "Buy Stock"}
          </button>

          {msg && <p className="mt-2 text-success">{msg}</p>}
        </div>

        {/* 📄 PDF */}
        <button className="btn btn-danger mb-3" onClick={exportPDF}>
          📄 Download Purchase Report
        </button>

        {/* 📊 HISTORY */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Purchase History</h5>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No history found
                    </td>
                  </tr>
                ) : (
                  history.map((h, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{h.itemName}</td>
                      <td>{h.quantity}</td>
                      <td>
                        {new Date(h.purchaseDate).toLocaleString()}
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