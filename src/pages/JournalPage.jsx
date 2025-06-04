// src/pages/PerformancePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PerformancePage() {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh", padding: 24 }}>
      <h1 style={{ color: "#34d399" }}>Performance Summary</h1>
      <button onClick={() => navigate("/")} style={{ marginBottom: 16, color: "#60a5fa" }}>
        Back to Journal
      </button>
      <p>Performance metrics and charts will go here.</p>
    </div>
  );
}