import { useState } from "react";

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("terminal-users");
  const [loading, setLoading] = useState(false);

  // ================= UPLOAD =================
  const handleUpload = async () => {
    try {
      if (!file) {
        alert("Please select file");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const url =
        type === "terminal-users"
          ? "/api/upload/terminal-users"
          : "/api/upload/beneficiaries";

      const res = await fetch("https://kit-distribution-api-production-6268.up.railway.app" + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token // 🔥 IMPORTANT
        },
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const blob = await res.blob();

      // 🔥 DOWNLOAD RESULT FILE (WITH PASSWORDS)
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      link.download =
        type === "terminal-users"
          ? "TerminalUsers_WithPasswords.xlsx"
          : "Beneficiaries_WithPasswords.xlsx";

      link.click();

      alert("Upload successful 🎉");

      // 🔥 RESET FILE INPUT
      setFile(null);

    } catch (err) {
      console.error(err);
      alert(err.message || "Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form-row">
      
      {/* TYPE SELECT */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="upload-input"
      >
        <option value="terminal-users">Terminal Users</option>
        <option value="beneficiaries">Beneficiaries</option>
      </select>

      {/* FILE INPUT */}
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files[0])}
        className="upload-file"
      />

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="upload-btn"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default AdminUpload;
