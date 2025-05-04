import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ component: Component }) => {
  const { user } = useAuth();

  // Check if Component is undefined (which causes your exact error)
  if (!Component) {
    console.error("PrivateRoute received undefined component.");
    return <Navigate to="/login" />;
  }

  return user ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
