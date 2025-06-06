// File: src/pages/PerformancePage.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { TradesContext } from "../context/TradesContext";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
  differenceInMinutes,
} from "date-fns";

export default function PerformancePage() {
  const { trades } = useContext(TradesContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Overall statistics
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.result === "Win").length;
  const losses = trades.filter((t) => t.result === "Loss").length;
  const avgRR =
    totalTrades > 0
      ? (
          trades.reduce((sum, t) => sum + parseFloat(t.rr || 0), 0) /
          totalTrades
        ).toFixed(2)
      : "0.00";
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : "0.0";

  // Per-strategy breakdown
  const strategyMap = {};
  trades.forEach((t) => {
    if (!strategyMap[t.strategy]) {
      strategyMap[t.strategy] = { total: 0, wins: 0, losses: 0, sumRR: 0 };
    }
    strategyMap[t.strategy].total += 1;
    if (t.result === "Win") strategyMap[t.strategy].wins += 1;
    if (t.result === "Loss") strategyMap[t.strategy].losses += 1;
    strategyMap[t.strategy].sumRR += parseFloat(t.rr || 0);
  });
  const strategyStats = Object.entries(strategyMap).map(([strategy, data]) => ({
    strategy,
    total: data.total,
    wins: data.wins,
    losses: data.losses,
    winRate:
      data.total > 0 ? ((data.wins / data.total) * 100).toFixed(1) : "0.0",
    avgRR: data.total > 0 ? (data.sumRR / data.total).toFixed(2) : "0.00",
  }));

  // Build daily map for calendar
  const dailyMap = {};
  trades.forEach((t) => {
    if (!t.closeDate) return;
    const dayKey = t.closeDate; // "yyyy-MM-dd"
    if (!dailyMap[dayKey]) dailyMap[dayKey] = { wins: 0, losses: 0 };
    if (t.result === "Win") dailyMap[dayKey].wins += 1;
    if (t.result === "Loss") dailyMap[dayKey].losses += 1;
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const monthTitle = format(currentMonth, "MMMM yyyy");

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

      <div style={{ backgroundColor: "#1f2937", padding: 16, borderRadius: 4, marginBottom: 24 }}>
        <p><strong>Total Trades:</strong> {totalTrades}</p>
        <p><strong>Wins:</strong> {wins}</p>
        <p><strong>Losses:</strong> {losses}</p>
        <p><strong>Win Rate:</strong> {winRate}%</p>
        <p><strong>Average R:R:</strong> {avgRR}</p>

        <h2 style={{ marginTop: 16 }}>By Strategy</h2>
        {strategyStats.map((s) => (
          <div
            key={s.strategy}
            style={{
              backgroundColor: "#111827",
              padding: 8,
              marginBottom: 8,
              borderRadius: 4,
            }}
          >
            <p><strong>{s.strategy}</strong></p>
            <p>Total: {s.total} | Wins: {s.wins} | Losses: {s.losses}</p>
            <p>Win Rate: {s.winRate}% | Avg R:R: {s.avgRR}</p>
          </div>
        ))}
      </div>

      <h2 style={{ color: "#ec4899" }}>{monthTitle} Calendar</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          marginTop: 16,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontWeight: "bold" }}>
            {d}
          </div>
        ))}

        {daysInMonth.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const stats = dailyMap[key] || { wins: 0, losses: 0 };
          let bgColor = "#374151";
          if (stats.wins > stats.losses) bgColor = "#10b981";
          else if (stats.losses > stats.wins) bgColor = "#ef4444";

          return (
            <div
              key={key}
              style={{
                height: 60,
                backgroundColor: bgColor,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}