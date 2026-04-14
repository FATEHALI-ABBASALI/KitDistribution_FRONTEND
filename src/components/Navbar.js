import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">

        <span className="navbar-brand">Kit Distribution</span>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav me-auto">

            {role === "Admin" && (
              <>
                {/* FIXED */}
                <li className="nav-item">
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Users
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/admin/reports"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Reports
                  </NavLink>
                </li>
              </>
            )}

            {role === "Terminal" && (
              <li className="nav-item">
                <NavLink
                  to="/terminal"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Distribute
                </NavLink>
              </li>
            )}

            {role === "Beneficiary" && (
              <li className="nav-item">
                <NavLink
                  to="/beneficiary"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Status
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}