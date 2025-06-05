import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { TradesContext } from "../context/TradesContext";

export default function PerformancePage() {
  // Pull the shared trades array from context
  const { trades } = useContext(TradesContext);

  // Compute stats
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.result === "Win").length;
  const losses = trades.filter((t) => t.result === "Loss").length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;
  const avgRR =
    totalTrades > 0
      ? (
          trades.reduce((acc, t) => acc + parseFloat(t.rr || 0), 0) /
          totalTrades
        ).toFixed(2)
      : 0;
  const bestTradeRR =
    trades.length > 0
      ? Math.max(...trades.map((t) => parseFloat(t.rr || "-Infinity")))
      : 0;
  const worstTradeRR =
    trades.length > 0
      ? Math.min(...trades.map((t) => parseFloat(t.rr || "Infinity")))
      : 0;

  const cardStyle = {
    backgroundColor: "#1f2937",
    borderRadius: "8px",
    padding: "16px",
    color: "#e5e7eb",
    boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
    flex: "1 1 200px",
    minWidth: "200px",
  };

  return (
    <div
      style={{
        backgroundColor: "#0b1120",
        color: "#e5e7eb",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <h1 style={{ color: "#ec4899", marginBottom: "16px" }}>
        Performance Summary
      </h1>

      <Link
        to="/"
        style={{
          display: "inline-block",
          marginBottom: "24px",
          padding: "8px 12px",
          backgroundColor: "#60a5fa",
          color: "white",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "14px",
        }}
      >
        ◀ Back to Journal
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {/* Total Trades */}
        <div style={cardStyle}>
          <h2 style={{ color: "#3b82f6", marginBottom: "8px" }}>
            Total Trades
          </h2>
          <p style={{ fontSize: "2rem", margin: 0 }}>{totalTrades}</p>
        </div>

        {/* Wins */}
        <div style={cardStyle}>
          <h2 style={{ color: "#34d399", marginBottom: "8px" }}>Wins</h2>
          <p style={{ fontSize: "2rem", margin: 0 }}>{wins}</p>
        </div>

        {/* Losses */}
        <div style={cardStyle}>
          <h2 style={{ color: "#ef4444", marginBottom: "8px" }}>Losses</h2>
          <p style={{ fontSize: "2rem", margin: 0 }}>{losses}</p>
        </div>

        {/* Win Rate */}
        <div style={cardStyle}>
          <h2 style={{ color: "#fbbf24", marginBottom: "8px" }}>Win Rate</h2>
          <p style={{ fontSize: "2rem", margin: 0 }}>{winRate}%</p>
        </div>

        {/* Average R:R */}
        <div style={cardStyle}>
          <h2 style={{ color: "#60a5fa", marginBottom: "8px" }}>Avg R:R</h2>
          <p style={{ fontSize: "2rem", margin: 0 }}>{avgRR}</p>
        </div>

        {/* Best Trade */}
        <div style={cardStyle}>
          <h2 style={{ color: "#34d399", marginBottom: "8px" }}>
            Best Trade
          </h2>
          <p style={{ fontSize: "2rem", margin: 0 }}>{bestTradeRR.toFixed(2)}</p>
        </div>

        {/* Worst Trade */}
        <div style={cardStyle}>
          <h2 style={{ color: "#ef4444", marginBottom: "8px" }}>
            Worst Trade
          </h2>
          <p style={{ fontSize: "2rem", margin: 0 }}>{worstTradeRR.toFixed(2)}</p>
        </div>
      </div>

      {/* Placeholder for an Equity Curve or future chart */}
      <div
        style={{
          backgroundColor: "#1f2937",
          borderRadius: "8px",
          padding: "16px",
          color: "#e5e7eb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
        }}
      >
        <h2 style={{ color: "#ec4899", marginBottom: "12px" }}>
          Equity Curve (coming soon)
        </h2>
        <div
          style={{
            backgroundColor: "#111827",
            height: "200px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: "1rem",
          }}
        >
          Chart placeholder
        </div>
      </div>
    </div>
  );
}