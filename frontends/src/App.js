import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import FolderDetails from "./components/FolderDetails";
import Navbar from "./components/Navbar"; // Import Navbar

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />

          <h1>My Drive</h1>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute component={Dashboard} />}
            />
            <Route
              path="/folder/:folderId"
              element={<PrivateRoute component={FolderDetails} />}
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
