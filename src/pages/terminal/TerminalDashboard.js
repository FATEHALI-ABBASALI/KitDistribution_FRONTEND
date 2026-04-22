import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import { apiRequest } from "../../api/api";

function TerminalDashboard() {
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [beneficiaryData, setBeneficiaryData] = useState(null);
  const [monthStatus, setMonthStatus] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [date, setDate] = useState("");
  const [msg, setMsg] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 KIT TYPE
  const [kitType, setKitType] = useState("Small");

  // 🔥 NEW CENTER STATES
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");

  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

  // ================= LOAD CENTERS =================
  useEffect(() => {
    const loadCenters = async () => {
      try {
        const res = await apiRequest("/api/centers");

        const fixed = (res || []).map(c => ({
          id: c.id || c.Id,
          name: c.name || c.Name
        }));

        setCenters(fixed);

        if (fixed.length > 0) {
          setSelectedCenter(fixed[0].id);
        }
      } catch {
        setMsg("❌ Failed to load centers");
      }
    };

    loadCenters();
  }, []);

  // ================= AUTO DATE =================
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  // ================= POPUP =================
  useEffect(() => {
    if (monthStatus && monthStatus.length > 0) {
      setShowPopup(true);
    }
  }, [monthStatus]);

  // ================= FETCH =================
  const fetchBeneficiary = async (idParam) => {
    const id = String(idParam || beneficiaryId || "").trim().toUpperCase();

    if (!id) {
      setMsg("❌ Enter Beneficiary ID");
      return;
    }

    try {
      const res = await apiRequest(`/api/terminal/beneficiary/${id}`);
      setBeneficiaryData(res);

      const months = await apiRequest(
        `/api/terminal/beneficiary-status/${id}`
      );

      setMonthStatus(months);
      setMsg("✅ Data loaded");

    } catch (err) {
      setBeneficiaryData(null);
      setMonthStatus([]);
      setMsg(err.message || "❌ Not found");
    }
  };

  // ================= CAMERA =================
  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      return true;
    } catch {
      setMsg("❌ Camera permission denied");
      return false;
    }
  };

  // ================= SCANNER =================
  useEffect(() => {
    if (!showScanner) return;

    const startScanner = async () => {
      const allowed = await requestCameraPermission();
      if (!allowed) {
        setShowScanner(false);
        return;
      }

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 15, qrbox: 250 },
          (text) => {
            const match = text.match(/ID:([^,]+)/);

            if (match) {
              const id = String(match[1]).trim().toUpperCase();

              setBeneficiaryId(id);
              setMsg("✅ QR scanned");

              navigator.vibrate?.(150);

              setTimeout(() => fetchBeneficiary(id), 200);
            } else {
              setMsg("❌ Invalid QR");
            }

            stopScanner();
          }
        );

        isRunningRef.current = true;
      } catch {
        setMsg("❌ Camera start failed");
        setShowScanner(false);
      }
    };

    startScanner();

    return () => stopScanner();
  }, [showScanner]);

  const stopScanner = async () => {
    if (scannerRef.current && isRunningRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
      isRunningRef.current = false;
      setShowScanner(false);
    }
  };

  // ================= FILE SCAN =================
  const handleFileScan = () => {
    document.getElementById("qr-file-input").click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("qr-reader-file");

    try {
      const text = await html5QrCode.scanFile(file, true);

      const match = text.match(/ID:([^,]+)/);

      if (match) {
        const id = String(match[1]).trim().toUpperCase();

        setBeneficiaryId(id);
        setMsg("✅ QR scanned from file");

        setTimeout(() => fetchBeneficiary(id), 200);
      } else {
        setMsg("❌ Invalid QR");
      }
    } catch {
      setMsg("❌ File scan failed");
    }

    e.target.value = "";
  };

  // ================= DISTRIBUTE =================
  const distributeKit = async () => {
    const id = String(beneficiaryId || "").trim().toUpperCase();

    if (!id || !date || !selectedCenter) {
      setMsg("❌ Enter details");
      return;
    }

    if (!beneficiaryData) {
      setMsg("❌ Fetch beneficiary first");
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest(
        "/api/terminal/distribute-kit",
        "POST",
        {
          beneficiary_ID: id,
          date: date,
          kitType: kitType,
          centerId: Number(selectedCenter) // 🔥 IMPORTANT FIX
        }
      );

      setMsg(`✅ ${kitType} Kit Distributed | Remaining: ${res.remainingStock}`);

      if (res.remainingStock <= 10) {
        setMsg(prev => prev + " ⚠️ Low Stock!");
        alert("⚠️ Low Stock! Inform manager");
      }

      setBeneficiaryId("");
      setBeneficiaryData(null);
      setMonthStatus([]);
      setKitType("Small");

      setTimeout(() => setMsg(""), 3000);

    } catch (e) {
      setMsg(e.message || "❌ Distribution failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <motion.div className="terminal-page">

      <div className="terminal-header">
        <h2>Terminal Dashboard</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="terminal-card">
        <h3>Distribute Kit</h3>

        {/* 🔥 CENTER DROPDOWN */}
        <label>Select Center</label>
        <select
          className="form-control mb-2"
          value={selectedCenter}
          onChange={(e) => setSelectedCenter(e.target.value)}
        >
          {centers.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Beneficiary ID</label>
        <div className="input-row">
          <input
            placeholder="BEN123"
            value={beneficiaryId}
            onChange={(e) =>
              setBeneficiaryId(e.target.value.toUpperCase())
            }
          />

          <button
            className="fetch-btn"
            onClick={() => fetchBeneficiary(beneficiaryId)}
          >
            Fetch
          </button>
        </div>

        {/* KIT TYPE */}
        <label>Kit Type</label>
        <select
          className="form-control mb-2"
          value={kitType}
          onChange={(e) => setKitType(e.target.value)}
        >
          <option value="Small">Small Kit</option>
          <option value="Medium">Medium Kit</option>
          <option value="Big">Big Kit</option>
        </select>

        <button className="qr-btn" onClick={() => setShowScanner(!showScanner)}>
          {showScanner ? "Close Scanner" : "Scan QR"}
        </button>

        <button className="qr-btn" onClick={handleFileScan}>
          Upload QR
        </button>

        <input
          type="file"
          accept="image/*"
          id="qr-file-input"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <AnimatePresence>
          {showScanner && (
            <motion.div className="qr-wrapper">
              <div id="qr-reader" />
            </motion.div>
          )}
        </AnimatePresence>

        <div id="qr-reader-file" style={{ display: "none" }}></div>

        {beneficiaryData && (
          <div className="beneficiary-box">
            <h4>Details</h4>
            <p><b>ID:</b> {beneficiaryData.beneficiary_id}</p>
            <p><b>Name:</b> {beneficiaryData.fullName}</p>
            <p><b>Mobile:</b> {beneficiaryData.mobile}</p>
            <p><b>City:</b> {beneficiaryData.state_city}</p>
          </div>
        )}

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          className="success-btn full"
          onClick={distributeKit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Distribute Kit"}
        </button>

        {msg && <div className="info-box">{msg}</div>}
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Monthly Status</h3>

            <div className="month-grid">
              {monthStatus.map((m, i) => (
                <div key={i} className="month-item">
                  <span>{m.month.slice(0, 3)}</span>
                  <span className={m.received ? "tick" : "cross"}>
                    {m.received ? "✔️" : "❌"}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowPopup(false);
                setMonthStatus([]);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </motion.div>
  );
}

export default TerminalDashboard;