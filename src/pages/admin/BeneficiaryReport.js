import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BeneficiaryReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await apiRequest("/api/admin/beneficiary-report");
    setData(res);
  };

  // 🔥 PDF FUNCTION
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Beneficiary Distribution Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Beneficiary", "State", "Terminal", "Center", "Month", "Amount"]],
      body: data.map((r) => [
        r.beneficiaryName,
        r.state,
        r.terminal,
        r.center,
        r.month,
        `₹${r.amount}`
      ]),
    });

    doc.save("beneficiary-report.pdf");
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2 className="mb-4">👤 Beneficiary Distribution Report</h2>

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
                  <th>Beneficiary</th>
                  <th>State</th>
                  <th>Terminal</th>
                  <th>Center</th>
                  <th>Month</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{r.beneficiaryName}</td>
                      <td>{r.state}</td>
                      <td>{r.terminal}</td>
                      <td>{r.center}</td>
                      <td>{r.month}</td>
                      <td>₹{r.amount}</td>
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