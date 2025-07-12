// src/components/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/img/coralbg.jpg')" }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10 pointer-events-none"></div>

      {/* Content Wrapper with high z-index */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="w-full flex justify-between items-center px-8 py-4 bg-blue-900 bg-opacity-80 text-white shadow">
          <h1 className="text-2xl font-bold">🌊 DeepCoral</h1>
          <div className="space-x-4">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-grow flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Preserving Our Reefs, One Pixel at a Time
            </h1>
            <p className="text-lg md:text-xl font-light">
              AI-powered coral cover estimation for marine biologists and ocean lovers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-blue-950 text-white text-center py-4">
          <p>Made with 💙 by the DeepCoral Team | Capstone Project 2025</p>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
