// src/components/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Welcome to DeepCoral</h1>
      <Link to="/register">Go to Register</Link>
      <br />
      <Link to="/login">Go to Login</Link>
    </div>
  );
}

export default HomePage;
