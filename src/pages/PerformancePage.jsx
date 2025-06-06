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
} from "date-fns";

export default function PerformancePage() {
  const { trades } = useContext(TradesContext);
  const [currentMonth] = useState(new Date());

  // Overall stats
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.result === "Win").length;
  const losses = trades.filter((t) => t.result === "Loss").length;
  const avgRR =
    totalTrades > 0
      ? (trades.reduce((sum, t) => sum + parseFloat(t.rr || 0), 0) / totalTrades).toFixed(2)
      : "0.00";
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : "0.0";

  // Strategy breakdown
  const strategyMap = {};
  trades.forEach((t) => {
    const strat = t.strategy || "Unspecified";
    if (!strategyMap[strat]) {
      strategyMap[strat] = { total: 0, wins: 0, losses: 0, sumRR: 0 };
    }
    strategyMap[strat].total += 1;
    if (t.result === "Win") strategyMap[strat].wins += 1;
    if (t.result === "Loss") strategyMap[strat].losses += 1;
    strategyMap[strat].sumRR += parseFloat(t.rr || 0);
  });
  const strategyStats = Object.entries(strategyMap).map(([strategy, data]) => {
    const avg = data.total > 0 ? (data.sumRR / data.total).toFixed(2) : "0.00";
    return {
      strategy,
      total: data.total,
      wins: data.wins,
      losses: data.losses,
      winRate: data.total > 0 ? ((data.wins / data.total) * 100).toFixed(1) : "0.0",
      avgRR: avg,
    };
  });

  // Build daily map for coloring
  const dailyMap = {};
  trades.forEach((t) => {
    if (!t.closeDate) return;
    const iso = parseISO(t.closeDate);
    const key = format(iso, "yyyy-MM-dd");
    if (!dailyMap[key]) {
      dailyMap[key] = { wins: 0, losses: 0 };
    }
    if (t.result === "Win") dailyMap[key].wins += 1;
    if (t.result === "Loss") dailyMap[key].losses += 1;
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
      </div>

      <h2 style={{ color: "#ec4899", marginBottom: 8 }}>By Strategy</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        {strategyStats.map((s) => {
          const rrValue = parseFloat(s.avgRR);
          const rrColor = rrValue >= 0 ? "#10b981" : "#ef4444";
          return (
            <div
              key={s.strategy}
              style={{
                backgroundColor: "#111827",
                padding: 12,
                borderRadius: 4,
                minWidth: 200,
                flex: "1 0 200px",
              }}
            >
              <p style={{ margin: 0, marginBottom: 4 }}><strong>{s.strategy}</strong></p>
              <p style={{ margin: 0, fontSize: 14 }}>
                Total: {s.total} | Wins: {s.wins} | Losses: {s.losses}
              </p>
              <p style={{ margin: 0, fontSize: 14 }}>
                Win Rate: {s.winRate}% |{" "}
                <span style={{ color: rrColor }}>Avg R:R: {s.avgRR}</span>
              </p>
            </div>
          );
        })}
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

          const tradesOnDay = trades.filter((t) => t.closeDate === key);

          return (
            <div
              key={key}
              style={{
                minHeight: 80,
                backgroundColor: bgColor,
                borderRadius: 4,
                color: "white",
                padding: 4,
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: 4, left: 4, fontSize: 12 }}>
                {format(day, "d")}
              </div>
              <div style={{ marginTop: 20, fontSize: 11 }}>
                {tradesOnDay.map((t, i) => {
                  const rrNum = parseFloat(t.rr);
                  const color = rrNum >= 0 ? "#10b981" : "#ef4444";
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 2,
                        color,
                      }}
                    >
                      <span>{t.strategy}</span>
                      <span>{t.rr}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}