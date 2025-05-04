import React, { useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../css/Login.css"; // Import the CSS file

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      const response = await API.post("accounts/login/", { email, password });
      login(response.data); // Assuming response contains user data
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign in to My Drive</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
