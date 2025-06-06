import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TradesContext } from "../context/TradesContext";
import CalendarView from "./CalendarView";

export default function PerformancePage() {
  const { trades } = useContext(TradesContext);
  const navigate = useNavigate();

  // Compute overall P/L, average R:R, best trade, worst trade
  const computeStats = () => {
    if (trades.length === 0) {
      return {
        totalPL: 0,
        avgRR: 0,
        bestRR: 0,
        worstRR: 0
      };
    }

    const rrValues = trades
      .map((t) => {
        const entry = parseFloat(t.entry);
        const stop = parseFloat(t.stop);
        const close = parseFloat(t.close);
        if (isNaN(entry) || isNaN(stop) || isNaN(close)) return null;

        const risk = Math.abs(entry - stop);
        const reward = Math.abs(close - entry);
        if (risk === 0) return null;
        return (reward / risk) * (close >= entry ? 1 : -1);
      })
      .filter((v) => v !== null);

    const totalPL = trades.reduce((sum, t) => {
      const entry = parseFloat(t.entry);
      const close = parseFloat(t.close);
      if (!isNaN(entry) && !isNaN(close)) {
        return sum + (close - entry);
      }
      return sum;
    }, 0);

    const avgRR =
      rrValues.length > 0
        ? rrValues.reduce((a, b) => a + b, 0) / rrValues.length
        : 0;
    const bestRR = rrValues.length > 0 ? Math.max(...rrValues) : 0;
    const worstRR = rrValues.length > 0 ? Math.min(...rrValues) : 0;

    return { totalPL, avgRR, bestRR, worstRR };
  };

  const { totalPL, avgRR, bestRR, worstRR } = computeStats();

  // Compute per-strategy stats
  const strategyStats = () => {
    const byStrategy = {};
    trades.forEach((t) => {
      const strat = t.strategy || "—";
      const entry = parseFloat(t.entry);
      const stop = parseFloat(t.stop);
      const close = parseFloat(t.close);
      if (isNaN(entry) || isNaN(stop) || isNaN(close)) return;

      const risk = Math.abs(entry - stop);
      const reward = Math.abs(close - entry);
      const rr = risk === 0 ? 0 : (reward / risk) * (close >= entry ? 1 : -1);

      if (!byStrategy[strat]) {
        byStrategy[strat] = { count: 0, totalRR: 0, best: rr, worst: rr };
      }
      byStrategy[strat].count += 1;
      byStrategy[strat].totalRR += rr;
      if (rr > byStrategy[strat].best) byStrategy[strat].best = rr;
      if (rr < byStrategy[strat].worst) byStrategy[strat].worst = rr;
    });

    return Object.entries(byStrategy).map(([strat, data]) => ({
      strategy: strat,
      trades: data.count,
      avgRR: data.count > 0 ? data.totalRR / data.count : 0,
      bestRR: data.best,
      worstRR: data.worst
    }));
  };

  const perStrat = strategyStats();

  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh", padding: 24 }}>
      <h1 style={{ color: "#34d399" }}>Performance Summary</h1>
      <button
        onClick={() => navigate("/")}
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
      </button>

      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <strong>Total P/L:</strong> ${totalPL.toFixed(2)}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Average R:R:</strong> {avgRR.toFixed(2)}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Best R:R:</strong> {bestRR.toFixed(2)}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Worst R:R:</strong> {worstRR.toFixed(2)}
        </div>
      </div>

      {perStrat.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ color: "#ec4899" }}>By Strategy</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, color: "#9ca3af" }}>Strategy</th>
                <th style={{ textAlign: "right", padding: 8, color: "#9ca3af" }}>Trades</th>
                <th style={{ textAlign: "right", padding: 8, color: "#9ca3af" }}>Avg R:R</th>
                <th style={{ textAlign: "right", padding: 8, color: "#9ca3af" }}>Best R:R</th>
                <th style={{ textAlign: "right", padding: 8, color: "#9ca3af" }}>Worst R:R</th>
              </tr>
            </thead>
            <tbody>
              {perStrat.map(({ strategy, trades, avgRR, bestRR, worstRR }) => (
                <tr key={strategy}>
                  <td style={{ padding: 8 }}>{strategy}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{trades}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{avgRR.toFixed(2)}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{bestRR.toFixed(2)}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{worstRR.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 style={{ color: "#ec4899", marginTop: 32 }}>Calendar Performance View</h2>
      <CalendarView />
    </div>
  );
}