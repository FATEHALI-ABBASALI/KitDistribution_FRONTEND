import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function LowStockReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await apiRequest("/api/admin/low-stock-report");
    setData(res);
  };

  // 🔥 PDF FUNCTION
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Low Stock Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Item", "Quantity", "Status"]],
      body: data.map((i) => [
        i.item,
        i.quantity,
        i.status
      ]),
    });

    doc.save("low-stock-report.pdf");
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2 className="mb-4">⚠️ Low Stock Report</h2>

        {/* 🔥 PDF BUTTON */}
        <button
          className="btn btn-danger mb-3"
          onClick={exportPDF}
        >
          📄 Download PDF
        </button>

        <div className="card shadow-sm">
          <div className="card-body">

            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      ✅ All items are sufficiently stocked
                    </td>
                  </tr>
                ) : (
                  data.map((i, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          i.quantity < 5
                            ? "#ffe5e5"   // 🔴 Critical
                            : "#fff3cd"   // 🟠 Low
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{i.item}</td>
                      <td>{i.quantity}</td>
                      <td>
                        <span
                          style={{
                            color: i.quantity < 5 ? "red" : "orange",
                            fontWeight: "bold"
                          }}
                        >
                          {i.status}
                        </span>
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