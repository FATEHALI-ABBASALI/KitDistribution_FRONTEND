import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function MonthReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await apiRequest("/api/admin/month-wise-report");
    setData(res);
  };

  // 🔥 PDF FUNCTION
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Month-wise Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Month", "Total Kits", "Total Amount"]],
      body: data.map((m) => [
        m.month,
        m.totalKits,
        `₹${m.totalAmount}`
      ]),
    });

    doc.save("month-report.pdf");
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2 className="mb-4">📅 Month-wise Report</h2>

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
                  <th>Month</th>
                  <th>Total Kits</th>
                  <th>Total Amount</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((m, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{m.month}</td>
                      <td>{m.totalKits}</td>
                      <td>₹{m.totalAmount}</td>
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