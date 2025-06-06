import React, { useContext, useMemo } from "react";
import { TradesContext } from "../context/TradesContext";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";

export default function CalendarView() {
  const { trades } = useContext(TradesContext);

  const days = useMemo(() => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);

    return eachDayOfInterval({ start, end }).map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayTrades = trades.filter((t) => t.openDate === dateStr);
      const profit = dayTrades.reduce((sum, t) => {
        const entry = parseFloat(t.entry);
        const close = parseFloat(t.close);
        if (!isNaN(entry) && !isNaN(close)) {
          return sum + (close - entry);
        }
        return sum;
      }, 0);

      return { date: day, profit };
    });
  }, [trades]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 4,
        marginTop: 12
      }}
    >
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
        <div
          key={d}
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#9ca3af",
            paddingBottom: 4
          }}
        >
          {d}
        </div>
      ))}
      {days.map(({ date, profit }) => (
        <div
          key={format(date, "yyyy-MM-dd")}
          style={{
            height: 80,
            backgroundColor:
              profit > 0 ? "#34d399" : profit < 0 ? "#f87171" : "#1f2937",
            color: "#e5e7eb",
            borderRadius: 4,
            padding: 4
          }}
        >
          <div style={{ fontSize: 12 }}>{format(date, "d")}</div>
          {profit !== 0 && (
            <div style={{ fontSize: 11, marginTop: 4 }}>
              {profit > 0
                ? `+$${profit.toFixed(2)}`
                : `-$${Math.abs(profit).toFixed(2)}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}