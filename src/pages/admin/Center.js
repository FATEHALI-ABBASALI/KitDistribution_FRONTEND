import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Navbar from "../../components/Navbar";
import "./Center.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
 // 🔥 THIS IS IMPORTANT
export default function Center() {
  const [centers, setCenters] = useState([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCenters();
  }, []);

  // ================= NOTIFICATION =================
  const showNotification = (msg) => {
    if (Notification.permission === "granted") {
      new Notification(msg);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(p => {
        if (p === "granted") new Notification(msg);
      });
    }
  };

  // ================= LOAD =================
  const loadCenters = async () => {
    try {
      const data = await apiRequest("/api/centers");
      setCenters(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADD =================
  const addCenter = async () => {
    if (!name || !city) return alert("Fill all fields");

    try {
      await apiRequest("/api/centers", "POST", { name, city });

      showNotification("Center added ✅");

      setName("");
      setCity("");
      loadCenters();
    } catch (err) {
      alert("Error adding center");
    }
  };

  // ================= DELETE =================
  const deleteCenter = async (id) => {
    if (!window.confirm("Delete this center?")) return;

    try {
      await apiRequest(`/api/centers/${id}`, "DELETE");

      showNotification("Center deleted ❌");

      loadCenters();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ================= EDIT =================
  const editCenter = async (c) => {
    const newName = prompt("Enter new name", c.name);
    const newCity = prompt("Enter new city", c.city);

    if (!newName || !newCity) return;

    try {
      await apiRequest(`/api/centers/${c.id}`, "PUT", {
        name: newName,
        city: newCity
      });

      showNotification("Center updated ✏️");

      loadCenters();
    } catch (err) {
      alert("Update failed");
    }
  };

  // ================= FILTER =================
  const filteredCenters = centers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  // ================= PDF =================
  const exportPDF = () => {
  const doc = new jsPDF();

  doc.text("Center Report", 14, 10);

  const tableData = filteredCenters.map(c => [
    c.name,
    c.city
  ]);

  autoTable(doc, {
    head: [["Center Name", "City"]],
    body: tableData
  });

  doc.save("center-report.pdf");
};

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4">🏢 Centers Management</h2>

        {/* 📄 PDF BUTTON */}
        <button className="btn btn-success mb-3" onClick={exportPDF}>
          📄 Download PDF
        </button>

        {/* 🔍 SEARCH */}
        <input
          className="form-control mb-3"
          placeholder="Search center..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FORM */}
        <div className="card p-3 mb-4 shadow-sm">
          <div className="d-flex gap-2 flex-wrap">
            <input
              className="form-control"
              placeholder="Center Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <input
              className="form-control"
              placeholder="City"
              value={city}
              onChange={e => setCity(e.target.value)}
            />

            <button className="gradient-btn" onClick={addCenter}>
              ➕ Add Center
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="card shadow-sm">
          <div className="card-body">

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Center Name</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCenters.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  filteredCenters.map((c, i) => (
                    <tr key={c.id}>
                      <td>{i + 1}</td>
                      <td>{c.name}</td>
                      <td>{c.city}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => editCenter(c)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteCenter(c.id)}
                        >
                          Delete
                        </button>
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