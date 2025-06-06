// File: src/pages/PerformancePage.jsx
import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TradesContext } from "../context/TradesContext";

export default function PerformancePage() {
  const navigate = useNavigate();
  const { trades } = useContext(TradesContext);

  const stats = useMemo(() => {
    const total = trades.length;
    const wins = trades.filter((t) => t.result.toLowerCase() === "win").length;
    const losses = trades.filter((t) => t.result.toLowerCase() === "loss").length;
    const breakevens = trades.filter((t) => t.result.toLowerCase() === "be").length;
    const avgRR =
      total > 0
        ? (
            trades.reduce((sum, t) => sum + (parseFloat(t.rr) || 0), 0) / total
          ).toFixed(1)
        : "0.0";
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";

    const sortedByRR = [...trades]
      .map((t) => parseFloat(t.rr) || 0)
      .sort((a, b) => b - a);
    const best = sortedByRR.length ? sortedByRR[0] : 0;
    const worst = sortedByRR.length ? sortedByRR[sortedByRR.length - 1] : 0;

    return { total, wins, losses, breakevens, avgRR, winRate, best, worst };
  }, [trades]);

  const pieData = useMemo(() => {
    const { wins, losses, breakevens } = stats;
    return [
      { label: "Wins", value: wins },
      { label: "Losses", value: losses },
      { label: "Breakevens", value: breakevens },
    ];
  }, [stats]);

  return (
    <div style={{ backgroundColor: "#0b1120", color: "#e5e7eb", minHeight: "100vh", padding: 24 }}>
      <h1 style={{ color: "#34d399" }}>Performance Summary</h1>
      <button onClick={() => navigate("/")} style={{ marginBottom: 24, padding: "8px 12px", backgroundColor: "#60a5fa", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
        Back to Journal
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 40 }}>
        <div style={{ backgroundColor: "#1f2937", borderRadius: 6, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#9ca3af" }}>Total Trades</div>
          <div style={{ fontSize: 28, color: "#60a5fa" }}>{stats.total}</div>
        </div>
        <div style={{ backgroundColor: "#1f2937", borderRadius: 6, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#9ca3af" }}>Wins</div>
          <div style={{ fontSize: 28, color: "#34d399" }}>{stats.wins}</div>
        </div>
        <div style={{ backgroundColor: "#1f2937", borderRadius: 6, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#9ca3af" }}>Losses</div>
          <div style={{ fontSize: 28, color: "#f87171" }}>{stats.losses}</div>
        </div>
        <div style={{ backgroundColor: "#1f2937", borderRadius: 6, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#9ca3af" }}>Breakevens</div>
          <div style={{ fontSize: 28, color: "#fbbf24" }}>{stats.breakevens}</div>
        </div>
        <div style={{ backgroundColor: "#1f2937", borderRadius: 6, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#9ca3af" }}>Win Rate</div>
          <div style={{ fontSize: 28, color: "#60a5fa" }}>{stats.winRate}%</div>
        </div>
        <div style={{ backgroundColor: "#1f2937", borderRadius: 6, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#9ca3af" }}>Avg R:R</div>
          <div style={{ fontSize: 28, color: "#60a5fa" }}>{stats.avgRR}</div>
        </div>
        <div style={{ backgroundColor: "#1f2937", borderRadius: 6, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#9ca3af" }}>Best R:R</div>
          <div style={{ fontSize: 28, color: "#34d399" }}>{stats.best}</div>
        </div>
        <div style={{ backgroundColor: "#1f2937", borderRadius: 6, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#9ca3af" }}>Worst R:R</div>
          <div style={{ fontSize: 28, color: "#f87171" }}>{stats.worst}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {pieData.map((slice) => (
          <div key={slice.label} style={{ backgroundColor: "#1f2937", borderRadius: 6, padding: 16, flex: "1 1 120px", textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#9ca3af" }}>{slice.label}</div>
            <div style={{ fontSize: 24, color: slice.label === "Wins" ? "#34d399" : slice.label === "Losses" ? "#f87171" : "#fbbf24" }}>
              {slice.value}
            </div>
            <div style={{ height: 8, marginTop: 8, backgroundColor: "#374151", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${Math.round((slice.value / stats.total) * 100)}%`, height: "100%", backgroundColor: slice.label === "Wins" ? "#34d399" : slice.label === "Losses" ? "#f87171" : "#fbbf24" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}