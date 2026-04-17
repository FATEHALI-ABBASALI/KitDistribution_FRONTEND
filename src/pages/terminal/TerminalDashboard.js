// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Html5QrcodeScanner } from "html5-qrcode";
// import { apiRequest } from "../../api/api";

// function TerminalDashboard() {
//   const [beneficiaryId, setBeneficiaryId] = useState("");
//   const [beneficiaryData, setBeneficiaryData] = useState(null);
//   const [monthStatus, setMonthStatus] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [date, setDate] = useState("");
//   const [msg, setMsg] = useState("");
//   const [showScanner, setShowScanner] = useState(false);

//   // ================= AUTO DATE =================
//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     setDate(today);
//   }, []);

//   // ================= FETCH =================
//   const fetchBeneficiary = async (idParam) => {
//     const rawId = idParam || beneficiaryId;

//     // ✅ FIX: force string
//     const id = String(rawId || "").trim().toUpperCase();

//     console.log("FETCH ID:", id); // debug

//     if (!id) {
//       setMsg("❌ Enter Beneficiary ID");
//       return;
//     }

//     try {
//       // BENEFICIARY
//       const res = await apiRequest(
//         `/api/terminal/beneficiary/${id}`,
//         "GET"
//       );
//       setBeneficiaryData(res);

//       // MONTH STATUS
//       const months = await apiRequest(
//         `/api/terminal/beneficiary-status/${id}`,
//         "GET"
//       );

//       setMonthStatus(months);
//       setShowPopup(true);

//       setMsg("✅ Data loaded");
//     } catch (err) {
//       console.log("ERROR:", err);
//       setBeneficiaryData(null);
//       setMsg("❌ Not found or unauthorized");
//     }
//   };

//   // ================= CAMERA =================
//   const requestCameraPermission = async () => {
//     try {
//       await navigator.mediaDevices.getUserMedia({ video: true });
//       return true;
//     } catch {
//       setMsg("❌ Camera permission denied");
//       return false;
//     }
//   };

//   // ================= QR =================
//   useEffect(() => {
//     if (!showScanner) return;

//     let scanner;

//     const startScanner = async () => {
//       const allowed = await requestCameraPermission();
//       if (!allowed) {
//         setShowScanner(false);
//         return;
//       }

//       scanner = new Html5QrcodeScanner(
//         "qr-reader",
//         { fps: 10, qrbox: 220 },
//         false
//       );

//       scanner.render(
//         (text) => {
//           const match = text.match(/ID:([^,]+)/);

//           if (match) {
//             const id = String(match[1] || "").trim().toUpperCase();

//             setBeneficiaryId(id);
//             setMsg("✅ QR scanned");

//             setTimeout(() => fetchBeneficiary(id), 200);
//           } else {
//             setMsg("❌ Invalid QR");
//           }

//           setShowScanner(false);
//           scanner.clear().catch(() => {});
//         },
//         () => {}
//       );
//     };

//     startScanner();

//     return () => scanner?.clear().catch(() => {});
//   }, [showScanner]);

//   // ================= DISTRIBUTE =================
//   const distributeKit = async () => {
//     const id = String(beneficiaryId || "").trim().toUpperCase();

//     if (!id || !date) {
//       setMsg("❌ Enter details");
//       return;
//     }

//     try {
//       const res = await apiRequest(
//         "/api/terminal/distribute-kit",
//         "POST",
//         {
//           beneficiary_ID: id,
//           date: date,
//         }
//       );

//       setMsg(`✅ Kit distributed for ${res.month}`);
//       setBeneficiaryId("");
//       setBeneficiaryData(null);
//     } catch (e) {
//       setMsg(e.message || "❌ Already distributed");
//     }
//   };

//   // ================= LOGOUT =================
//   const logout = () => {
//     localStorage.clear();
//     window.location.href = "/";
//   };

//   return (
//     <motion.div className="terminal-page">
//       {/* HEADER */}
//       <div className="terminal-header">
//         <h2>Terminal Dashboard</h2>
//         <button className="logout-btn" onClick={logout}>
//           Logout
//         </button>
//       </div>

//       {/* CARD */}
//       <div className="terminal-card">
//         <h3>Distribute Kit</h3>

//         {/* INPUT + FETCH */}
//         <label>Beneficiary ID</label>
//         <div className="input-row">
//           <input
//             placeholder="BEN123"
//             value={beneficiaryId}
//             onChange={(e) =>
//               setBeneficiaryId(String(e.target.value || "").toUpperCase())
//             }
//           />

//           {/* ✅ FIXED BUTTON */}
//           <button
//             className="fetch-btn"
//             onClick={() => fetchBeneficiary(beneficiaryId)}
//           >
//             Fetch
//           </button>
//         </div>

//         {/* QR BUTTON */}
//         <button
//           className="qr-btn"
//           onClick={() => setShowScanner(!showScanner)}
//         >
//           {showScanner ? "Close Scanner" : "Scan QR Code"}
//         </button>

//         {/* QR SCANNER */}
//         <AnimatePresence>
//           {showScanner && (
//             <motion.div className="qr-wrapper">
//               <div id="qr-reader" />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* DATA */}
//         {beneficiaryData && (
//           <div className="beneficiary-box">
//             <h4>Beneficiary Details</h4>
//             <p><b>ID:</b> {beneficiaryData.beneficiary_id}</p>
//             <p><b>Name:</b> {beneficiaryData.fullName}</p>
//             <p><b>Mobile:</b> {beneficiaryData.mobile}</p>
//             <p><b>City:</b> {beneficiaryData.state_city}</p>
//           </div>
//         )}

//         {/* DATE */}
//         <label>Date</label>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />

//         {/* DISTRIBUTE */}
//         <button className="success-btn full" onClick={distributeKit}>
//           Distribute Kit
//         </button>

//         {/* MESSAGE */}
//         {msg && <div className="info-box">{msg}</div>}
//       </div>

//       {/* POPUP */}
//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-box">
//             <h3>Monthly Kit Status</h3>

//             <div className="month-grid">
//               {monthStatus.map((m, i) => (
//                 <div key={i} className="month-item">
//                   <span>{m.month.slice(0, 3)}</span>
//                   <span className={m.received ? "tick" : "cross"}>
//                     {m.received ? "✔️" : "❌"}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <button onClick={() => setShowPopup(false)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// }

// export default TerminalDashboard;
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
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

  // ================= AUTO DATE =================
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  // ================= POPUP FIX =================
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
      const res = await apiRequest(`/api/terminal/beneficiary/${id}`, "GET");
      setBeneficiaryData(res);

      const months = await apiRequest(
        `/api/terminal/beneficiary-status/${id}`,
        "GET"
      );

      setMonthStatus(months); // popup will open via useEffect
      setMsg("✅ Data loaded");
    } catch {
      setBeneficiaryData(null);
      setMonthStatus([]); // reset
      setMsg("❌ Not found or unauthorized");
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

  // ================= SAFE STOP =================
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

  if (!id || !date) {
    setMsg("❌ Enter details");
    return;
  }

  if (!beneficiaryData) {
    setMsg("❌ Please fetch beneficiary first");
    return;
  }

  setLoading(true); // ✅ START LOADING

  try {
    const res = await apiRequest(
      "/api/terminal/distribute-kit",
      "POST",
      {
        beneficiary_ID: id,
        date: date,
      }
    );

    setMsg(`✅ Kit distributed for ${res.month} | Stock: ${res.remainingStock}`);

    if (res.remainingStock < 10) {
      alert("⚠️ Low Stock! Please refill inventory");
    }

    // ✅ AUTO CLEAR MESSAGE
    setTimeout(() => {
      setMsg("");
    }, 3000);

    setBeneficiaryId("");
    setBeneficiaryData(null);
    setMonthStatus([]);

  } catch (e) {
    setMsg(e.message || "❌ Already distributed");
  } finally {
    setLoading(false); // ✅ STOP LOADING
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

        <label>Beneficiary ID</label>
        <div className="input-row">
          <input
            placeholder="BEN123"
            value={beneficiaryId}
            onChange={(e) =>
              setBeneficiaryId(String(e.target.value || "").toUpperCase())
            }
          />

          <button
            className="fetch-btn"
            onClick={() => fetchBeneficiary(beneficiaryId)}
          >
            Fetch
          </button>
        </div>

        <button
          className="qr-btn"
          onClick={() => setShowScanner(!showScanner)}
        >
          {showScanner ? "Close Scanner" : "Scan QR Code"}
        </button>

        <button className="qr-btn" onClick={handleFileScan}>
          Upload QR Image
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
            <h4>Beneficiary Details</h4>
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

        <button className="success-btn full" onClick={distributeKit}>
          Distribute Kit
        </button>

        {msg && <div className="info-box">{msg}</div>}
      </div>

      {/* ✅ POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Monthly Kit Status</h3>

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