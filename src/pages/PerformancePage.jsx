// File: src/pages/PerformancePage.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { TradesContext } from "../context/TradesContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from "date-fns";

export default function PerformancePage() {
  const { trades } = useContext(TradesContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Build a map of date -> { wins, losses }
  const dailyMap = {};
  trades.forEach((t) => {
    if (!t.closeDate) return;
    const dayKey = t.closeDate; // format: "yyyy-MM-dd"
    if (!dailyMap[dayKey]) {
      dailyMap[dayKey] = { wins: 0, losses: 0 };
    }
    if (t.result === "Win") dailyMap[dayKey].wins += 1;
    else if (t.result === "Loss") dailyMap[dayKey].losses += 1;
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const monthTitle = format(currentMonth, "MMMM yyyy");

  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh", padding: 24 }}>
      <h1 style={{ color: "#ec4899" }}>{monthTitle} Calendar</h1>
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
          let bgColor = "#374151"; // default gray
          if (stats.wins > stats.losses) bgColor = "#10b981"; // green
          else if (stats.losses > stats.wins) bgColor = "#ef4444"; // red

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