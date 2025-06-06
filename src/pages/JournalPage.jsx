// File: src/pages/JournalPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TradesContext } from "../context/TradesContext";
import { parseISO, format } from "date-fns";

export default function JournalPage() {
  const { trades, setTrades } = useContext(TradesContext);
  const [newTrade, setNewTrade] = useState({
    pair: "",
    strategy: "",
    entry: "",
    stop: "",
    target: "",
    close: "",
    result: "",
    rr: "",
    openDate: "",
    openTime: "",
    closeDate: "",
    closeTime: "",
    notes: "",
    setupUrl: "",
    screenshot: "",
  });
  const navigate = useNavigate();

  const determineResult = (entry, stop, target, close) => {
    const e = parseFloat(entry);
    const s = parseFloat(stop);
    const t = parseFloat(target);
    const c = parseFloat(close);
    if (isNaN(e) || isNaN(s) || isNaN(t) || isNaN(c)) return { result: "", rr: "" };
    const risk = Math.abs(e - s);
    const reward = Math.abs(t - e);
    const rrVal = reward / risk; // e.g. 1.0, 2.5, etc.
    const rr = rrVal.toFixed(2);
    let result = "BE";
    if ((e < t && c >= t) || (e > t && c <= t)) result = "Win";
    else if ((e < s && c <= s) || (e > s && c >= s)) result = "Loss";
    return { result, rr };
  };

  const addTrade = () => {
    const { result, rr } = determineResult(
      newTrade.entry,
      newTrade.stop,
      newTrade.target,
      newTrade.close
    );
    setTrades([...trades, { ...newTrade, result, rr }]);
    setNewTrade({
      pair: "",
      strategy: "",
      entry: "",
      stop: "",
      target: "",
      close: "",
      result: "",
      rr: "",
      openDate: "",
      openTime: "",
      closeDate: "",
      closeTime: "",
      notes: "",
      setupUrl: "",
      screenshot: "",
    });
  };

  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh", padding: 24 }}>
      <h1 style={{ color: "#ec4899" }}>Trading Journal</h1>
      <button
        onClick={() => navigate("/performance")}
        style={{
          marginBottom: 16,
          padding: "8px 12px",
          backgroundColor: "#60a5fa",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Go to Performance
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <input
          placeholder="Pair"
          value={newTrade.pair}
          onChange={(e) => setNewTrade({ ...newTrade, pair: e.target.value })}
          style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
        />
        <select
          value={newTrade.strategy}
          onChange={(e) => setNewTrade({ ...newTrade, strategy: e.target.value })}
          style={{ padding: 8, backgroundColor: "#1f2937", color: "white", border: "none", borderRadius: 4 }}
        >
          <option value="" disabled>
            Select Strategy
          </option>
          <option value="ORB">ORB</option>
          <option value="Power Trend">Power Trend</option>
          <option value="Breakout">Breakout</option>
          <option value="Phantom Flow">Phantom Flow</option>
          <option value="Pip Snatcher">Pip Snatcher</option>
        </select>
        <input
          placeholder="Entry Price"
          value={newTrade.entry}
          onChange={(e) => setNewTrade({ ...newTrade, entry: e.target.value })}
          style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
        />
        <input
          placeholder="Stop Loss"
          value={newTrade.stop}
          onChange={(e) => setNewTrade({ ...newTrade, stop: e.target.value })}
          style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
        />

        <input
          placeholder="Target"
          value={newTrade.target}
          onChange={(e) => setNewTrade({ ...newTrade, target: e.target.value })}
          style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
        />
        <input
          placeholder="Close Price"
          value={newTrade.close}
          onChange={(e) => setNewTrade({ ...newTrade, close: e.target.value })}
          style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="date"
            value={newTrade.openDate}
            onChange={(e) => setNewTrade({ ...newTrade, openDate: e.target.value })}
            style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
          />
          <input
            type="time"
            value={newTrade.openTime}
            onChange={(e) => setNewTrade({ ...newTrade, openTime: e.target.value })}
            style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="date"
            value={newTrade.closeDate}
            onChange={(e) => setNewTrade({ ...newTrade, closeDate: e.target.value })}
            style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
          />
          <input
            type="time"
            value={newTrade.closeTime}
            onChange={(e) => setNewTrade({ ...newTrade, closeTime: e.target.value })}
            style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <input
          placeholder="Setup Screenshot URL"
          value={newTrade.setupUrl}
          onChange={(e) => setNewTrade({ ...newTrade, setupUrl: e.target.value })}
          style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
        />
        <input
          placeholder="Trade Screenshot URL"
          value={newTrade.screenshot}
          onChange={(e) => setNewTrade({ ...newTrade, screenshot: e.target.value })}
          style={{ padding: 8, backgroundColor: "#1f2937", border: "none", borderRadius: 4 }}
        />
        <textarea
          placeholder="Notes"
          value={newTrade.notes}
          onChange={(e) => setNewTrade({ ...newTrade, notes: e.target.value })}
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: 4,
            gridColumn: "span 2",
            resize: "vertical",
            minHeight: 60,
          }}
        />
      </div>

      <button
        onClick={addTrade}
        style={{
          backgroundColor: "#1d4ed8",
          color: "white",
          border: "none",
          borderRadius: 4,
          padding: "8px 12px",
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        Add Trade
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {trades.map((trade, idx) => {
          const rrNum = parseFloat(trade.rr);
          const rrColor = rrNum >= 0 ? "#10b981" : "#ef4444";
          const direction =
            parseFloat(trade.close) > parseFloat(trade.entry) ? "L" : "S";
          const dirColor = direction === "L" ? "#10b981" : "#ef4444";
          const openFormatted =
            trade.openDate && format(parseISO(trade.openDate), "EEE, do MMM yyyy");
          const closeFormatted =
            trade.closeDate && format(parseISO(trade.closeDate), "EEE, do MMM yyyy");
          const dateRange =
            openFormatted && closeFormatted
              ? `${openFormatted} - ${closeFormatted}`
              : "";

          return (
            <div
              key={idx}
              style={{
                backgroundColor: "#1f2937",
                padding: 16,
                borderRadius: 6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{trade.pair}</div>
                <div style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>
                  {trade.strategy}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                  {dateRange}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    backgroundColor: dirColor,
                    color: "white",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {direction}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: rrColor }}>
                  {rrNum >= 0 ? "+" : "-"}
                  {Math.abs(rrNum).toFixed(2)} R:R
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}