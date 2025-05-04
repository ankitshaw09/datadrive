// src/components/Register.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Register.css"; // Import the CSS file

const Register = () => {
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            name: name,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful!");
        // Optionally redirect to login page
        // navigate('/login');
      } else {
        setError(data?.detail || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label htmlFor="username">name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
          </div>
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
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <div className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
