import React from "react";
import { Link } from "react-router-dom";

export default function PerformancePage() {
  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh", padding: 24 }}>
      <h1 style={{ color: "#34d399" }}>Performance Summary</h1>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginBottom: 16,
          padding: "8px 12px",
          backgroundColor: "#60a5fa",
          color: "white",
          borderRadius: 4,
          textDecoration: "none",
        }}
      >
        Back to Journal
      </Link>
      <p>Performance metrics and charts will go here.</p>
    </div>
  );
}