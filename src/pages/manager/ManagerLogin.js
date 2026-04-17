import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/api";

export default function ManagerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await apiRequest("/api/manager/login", "POST", {
        username,
        password
      });

      localStorage.setItem("role", "Manager");
      navigate("/manager");
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Manager Login</h2>

      <input
        className="form-control mb-2"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-primary" onClick={login}>
        Login
      </button>
    </div>
  );
}