import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CenterReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await apiRequest("/api/admin/center-wise-report");
    setData(res);
  };

  // 🔥 PDF FUNCTION
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Center-wise Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Center Name", "City", "Total Kits", "Total Amount"]],
      body: data.map((c) => [
        c.centerName,
        c.city,
        c.totalKits,
        `₹${c.totalAmount}`
      ]),
    });

    doc.save("center-report.pdf");
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2 className="mb-4">🏢 Center-wise Report</h2>

        {/* 🔥 PDF BUTTON */}
        <button
          className="btn btn-danger mb-3"
          onClick={exportPDF}
        >
          📄 Download PDF
        </button>

        <div className="card shadow-sm">
          <div className="card-body">

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Center Name</th>
                  <th>City</th>
                  <th>Total Kits</th>
                  <th>Total Amount</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((c, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{c.centerName}</td>
                      <td>{c.city}</td>
                      <td>{c.totalKits}</td>
                      <td>₹{c.totalAmount}</td>
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