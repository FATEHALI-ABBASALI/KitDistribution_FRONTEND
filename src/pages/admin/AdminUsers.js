import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { apiRequest } from "../../api/api";
import UserFormModal from "../../components/UserFormModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import AdminUpload from "../../components/AdminUpload";

export default function AdminUsers() {
  const [users, setUsers] = useState({ beneficiaries: [], terminals: [] });
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteInfo, setDeleteInfo] = useState(null);

  /* ================= LOAD USERS ================= */
  const loadUsers = async () => {
    try {
      const data = await apiRequest("/api/admin/users");
      setUsers(data);
    } catch (err) {
      alert(err.message || "Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();

    const handleYearChange = () => loadUsers();
    window.addEventListener("yearChanged", handleYearChange);

    return () => {
      window.removeEventListener("yearChanged", handleYearChange);
    };
  }, []);

  /* ================= TOGGLE TERMINAL ================= */
  const toggleTerminal = async (id) => {
    try {
      if (!window.confirm("Change terminal status?")) return;

      await apiRequest(`/api/admin/toggle-terminal/${id}`, "PUT");
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const resetPassword = async (id, type) => {
    try {
      if (!window.confirm("Reset password?")) return;

      const endpoint =
        type === "beneficiary"
          ? "/api/admin/reset-beneficiary-password"
          : "/api/admin/reset-terminal-password";

      const res = await apiRequest(endpoint, "POST", { userId: id });

      alert(`New password: ${res.newPassword || res.password}`);
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= ADD / EDIT ================= */
  const submit = async (data) => {
    try {
      // 🔵 ADD BENEFICIARY
      if (modal === "beneficiary-add") {
        const res = await apiRequest("/api/admin/beneficiary", "POST", data);
        alert("Password: " + res.password);
      }

      // 🔵 ADD TERMINAL
      if (modal === "terminal-add") {
        const res = await apiRequest(
          "/api/admin/terminal-user?fullName=" + data.fullName,
          "POST"
        );
        alert("Password: " + res.password);
      }

      // 🟢 EDIT BENEFICIARY
      if (modal === "beneficiary-edit") {
        await apiRequest(
  `/api/admin/beneficiary/${editData.Beneficiary_ID}`,
  "PUT",
  {
    FullName: data.fullName,
    Mobile: data.mobile,
    State_City: data.state_City   // ✅ MUST MATCH BACKEND
  }
);
        alert("Beneficiary updated");
      }

      // 🟢 EDIT TERMINAL
if (modal === "terminal-edit") {
  await apiRequest(
    `/api/admin/terminal-user/${editData.terminal_ID}`,
    "PUT",
    data.fullName   // ✅ ONLY STRING
  );
  alert("Terminal updated");
}

      setModal(null);
      setEditData(null);
      loadUsers();

    } catch (err) {
      alert(err.message || "Operation failed");
    }
  };

  /* ================= EXPORT ================= */
const exportData = () => {
  try {
    const { beneficiaries, terminals } = users;

    /* ---------- BENEFICIARIES FILE ---------- */
    const bHeaders = [
      "ID",
      "Name",
      "Mobile",
      "Location",
      "Status",
      "Create Date",
      "Year"
    ];

    const bRows = beneficiaries.map(b => [
      b.beneficiary_ID,
      b.fullName,
      b.mobile,
      b.state_City,
      b.status,
      b.create_Date,   // 👈 added
      b.year           // 👈 added
    ]);

    const bCsv =
      [bHeaders.join(","), ...bRows.map(r => r.join(","))].join("\n");

    const bBlob = new Blob([bCsv], { type: "text/csv" });
    const bUrl = window.URL.createObjectURL(bBlob);

    const bLink = document.createElement("a");
    bLink.href = bUrl;
    bLink.download = "beneficiaries.csv";
    bLink.click();

    window.URL.revokeObjectURL(bUrl);


    /* ---------- TERMINALS FILE ---------- */
    const tHeaders = [
      "ID",
      "Name",
      "Status",
      "Create Date",
      "Year"
    ];

    const tRows = terminals.map(t => [
      t.terminal_ID,
      t.fullName,
      t.isActive ? "Active" : "Inactive",
      t.create_Date,   // 👈 added
      t.year           // 👈 added
    ]);

    const tCsv =
      [tHeaders.join(","), ...tRows.map(r => r.join(","))].join("\n");

    const tBlob = new Blob([tCsv], { type: "text/csv" });
    const tUrl = window.URL.createObjectURL(tBlob);

    const tLink = document.createElement("a");
    tLink.href = tUrl;
    tLink.download = "terminal_users.csv";
    tLink.click();

    window.URL.revokeObjectURL(tUrl);

  } catch (err) {
    alert("Export failed");
  }
};

  /* ================= DELETE ================= */
  const del = async () => {
    try {
      await apiRequest("/api/" + deleteInfo.url, "DELETE");
      alert("Deleted successfully");
      loadUsers();
    } catch (err) {
      alert(err.message); // 🔥 show backend error
    } finally {
      setDeleteInfo(null);
    }
  };

  return (
    <>
      <Navbar />

      <motion.div className="admin-page">
        <h1 className="admin-title">User Management</h1>

        {/* ACTIONS */}
        <div className="action-row" style={styles.row}>
          <div style={styles.left}>
            <button
              className="primary-btn"
              onClick={() => {
                setModal("beneficiary-add");
                setEditData(null);
              }}
            >
              ➕ Add Beneficiary
            </button>

            <button
              className="terminal-btn"
              onClick={() => {
                setModal("terminal-add");
                setEditData(null);
              }}
            >
              ➕ Add Terminal
            </button>

            <button
  className="export-btn"
  onClick={exportData}
>
  ⬇ Export Data
</button>
          </div>

          {/* UPLOAD */}
          <div className="table-card upload-card-wrapper">
            <h3>📤 Upload Excel Data</h3>
            <AdminUpload />
          </div>
        </div>

        {/* BENEFICIARIES */}
        <TableCard title="Beneficiaries">
          {users.beneficiaries.map((b) => (
            <DataRow
              key={b.beneficiary_ID}
              cells={[
                b.beneficiary_ID,
                b.fullName,
                b.mobile,
                b.state_City,
                b.status,
              ]}
             onEdit={() => {
  setEditData({
    Beneficiary_ID: b.beneficiary_ID,
    FullName: b.fullName,
    Mobile: b.mobile,
    State_City: b.state_City
  });
  setModal("beneficiary-edit");
}}
              onDelete={() =>
                setDeleteInfo({
                  url: "admin/beneficiary/" + b.beneficiary_ID,
                })
              }
              onReset={() =>
                resetPassword(b.beneficiary_ID, "beneficiary")
              }
            />
          ))}
        </TableCard>

        {/* TERMINALS */}
        <TableCard title="Terminal Users">
          {users.terminals.map((t) => (
            <motion.tr key={t.terminal_ID}>
              <td>{t.terminal_ID}</td>
              <td>{t.fullName}</td>

              <td className="row-actions">
                <button
                  className={`status-btn ${
                    t.isActive ? "active" : "inactive"
                  }`}
                  onClick={() => toggleTerminal(t.terminal_ID)}
                >
                  {t.isActive ? "Active" : "Inactive"}
                </button>

                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditData(t);
                    setModal("terminal-edit");
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    setDeleteInfo({
                      url: "admin/terminal-user/" + t.terminal_ID,
                    })
                  }
                >
                  Delete
                </button>

                <button
                  className="reset-btn-small"
                  onClick={() =>
                    resetPassword(t.terminal_ID, "terminal")
                  }
                >
                  Reset Password
                </button>
              </td>
            </motion.tr>
          ))}
        </TableCard>
      </motion.div>

      {/* MODAL */}
      <UserFormModal
        open={!!modal}
        type={modal?.includes("beneficiary") ? "beneficiary" : "terminal"}
        initialData={editData}
        onSubmit={submit}
        onClose={() => setModal(null)}
      />

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={!!deleteInfo}
        onConfirm={del}
        onCancel={() => setDeleteInfo(null)}
      />
    </>
  );
}

/* ================= UI HELPERS ================= */

function TableCard({ title, children }) {
  return (
    <div className="table-card">
      <h3>{title}</h3>
      <table>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function DataRow({ cells, onEdit, onDelete, onReset }) {
  return (
    <motion.tr whileHover={{ backgroundColor: "#f9fafb" }}>
      {cells.map((c, i) => (
        <td key={i}>{c}</td>
      ))}
      <td className="row-actions">
        <button className="edit-btn" onClick={onEdit}>Edit</button>
        <button className="delete-btn" onClick={onDelete}>Delete</button>
        <button className="reset-btn-small" onClick={onReset}>
          Reset Password
        </button>
      </td>
    </motion.tr>
  );
}

//* ================= STYLES ================= */

const styles = {
  row: {
    display: "flex",
    flexWrap: "wrap",       
    gap: "10px",            
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingRight: "20px"
  },
  left: {
    display: "flex",
    flexWrap: "wrap",       
    gap: "10px"
  }
};