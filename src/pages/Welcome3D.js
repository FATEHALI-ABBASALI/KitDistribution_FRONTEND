import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/welcome3d.css";

export default function Welcome() {

  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  return (
    <div className="welcome-container">

      {/* STEP PROGRESS */}
      <div className="stepper">

        <div className={`step ${step >= 1 ? "active" : ""}`}>
          <div className="circle">1</div>
          <span>Overview</span>
        </div>

        <div className="line"></div>

        <div className={`step ${step >= 2 ? "active" : ""}`}>
          <div className="circle">2</div>
          <span>Features</span>
        </div>

        <div className="line"></div>

        <div className={`step ${step >= 3 ? "active" : ""}`}>
          <div className="circle">3</div>
          <span>Process</span>
        </div>

      </div>

      {/* LOGO */}
      <div className="logo-wrapper">
        <img src={logo} alt="logo" className="logo-circle"/>
      </div>


      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h1 className="app-title">Kit Distribution System</h1>

          <div className="info-grid">

            <div className="info-card">
              <div className="icon">📦</div>
              <h3>Kit Distribution</h3>
              <p>Manage grain kit distribution efficiently.</p>
            </div>

            <div className="info-card">
              <div className="icon">👨‍👩‍👧</div>
              <h3>Beneficiaries</h3>
              <p>Maintain family records and eligibility.</p>
            </div>

            <div className="info-card">
              <div className="icon">📊</div>
              <h3>Reports</h3>
              <p>Generate distribution statistics.</p>
            </div>

          </div>

          <button className="next-btn" onClick={() => setStep(2)}>
            Next →
          </button>
        </>
      )}


      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h1 className="app-title">System Features</h1>

          <div className="features-grid">

            <div className="feature-card">📍 Track Distribution</div>
            <div className="feature-card">🧾 Manage Beneficiaries</div>
            <div className="feature-card">📦 Monitor Grain Stock</div>
            <div className="feature-card">📈 Generate Reports</div>
            <div className="feature-card">🔐 Secure Admin Access</div>

          </div>

          <div className="btn-group">

            <button className="prev-btn" onClick={() => setStep(1)}>
              Previous
            </button>

            <button className="next-btn" onClick={() => setStep(3)}>
              Next
            </button>

          </div>
        </>
      )}


      {/* STEP 3 */}
      {step === 3 && (
        <>
          <h1 className="app-title">Distribution Process</h1>

          <div className="process-grid">

            <div className="process-card">
              <span>1</span> Registration
            </div>

            <div className="process-card">
              <span>2</span> Verification
            </div>

            <div className="process-card">
              <span>3</span> Kit Allocation
            </div>

            <div className="process-card">
              <span>4</span> Distribution
            </div>

            <div className="process-card">
              <span>5</span> Record Storage
            </div>

          </div>

          <div className="btn-group">

            <button className="prev-btn" onClick={() => setStep(2)}>
              Previous
            </button>

            <button className="next-btn" onClick={() => navigate("/login")}>
              Login
            </button>

          </div>
        </>
      )}

      <div className="footer">
        © 2026 Kit Distribution System
      </div>

    </div>
  );
}