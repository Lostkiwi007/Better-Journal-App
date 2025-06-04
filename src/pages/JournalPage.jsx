import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JournalPage() {
  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState({
    pair: "",
    strategy: "",
    entryPrice: "",
    stopLoss: "",
    target: "",
    closePrice: "",
    entryDate: "",
    entryTime: "",
    closeDate: "",
    closeTime: "",
    notes: "",
    screenshot: "",
  });
  const navigate = useNavigate();

  // Calculate Result & R:R automatically
  const determineResult = (entry, stop, target, close) => {
    const e = parseFloat(entry);
    const s = parseFloat(stop);
    const t = parseFloat(target);
    const c = parseFloat(close);
    if (isNaN(e) || isNaN(s) || isNaN(t) || isNaN(c)) {
      return { result: "", rr: "" };
    }
    const risk = Math.abs(e - s);
    const reward = Math.abs(t - e);
    const rr = risk !== 0 ? (Math.abs(c - e) / risk).toFixed(2) : "";
    let result = "BE";
    if ((e < t && c >= t) || (e > t && c <= t)) result = "Win";
    else if ((e < s && c <= s) || (e > s && c >= s)) result = "Loss";
    return { result, rr };
  };

  // When user clicks “Add Trade”
  const addTrade = () => {
    const { result, rr } = determineResult(
      newTrade.entryPrice,
      newTrade.stopLoss,
      newTrade.target,
      newTrade.closePrice
    );
    setTrades((prev) => [
      ...prev,
      { ...newTrade, result, rr, id: Date.now() },
    ]);
    // Reset form
    setNewTrade({
      pair: "",
      strategy: "",
      entryPrice: "",
      stopLoss: "",
      target: "",
      closePrice: "",
      entryDate: "",
      entryTime: "",
      closeDate: "",
      closeTime: "",
      notes: "",
      screenshot: "",
    });
  };

  // Shared input styling
  const inputStyle = {
    backgroundColor: "#1e293b",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: "4px",
    padding: "8px",
    width: "100%",
    boxSizing: "border-box",
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
      <h1 style={{ color: "#ec4899", marginBottom: "16px" }}>Trading Journal</h1>
      <button
        onClick={() => navigate("/performance")}
        style={{
          marginBottom: "24px",
          padding: "8px 12px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Go to Performance
      </button>

      {/* 4-column grid of inputs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <input
          placeholder="Pair"
          value={newTrade.pair}
          onChange={(e) => setNewTrade((p) => ({ ...p, pair: e.target.value }))}
          style={inputStyle}
        />
        <input
          placeholder="Strategy"
          value={newTrade.strategy}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, strategy: e.target.value }))
          }
          style={inputStyle}
        />
        <input
          type="date"
          value={newTrade.entryDate}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, entryDate: e.target.value }))
          }
          style={inputStyle}
        />
        <input
          type="time"
          value={newTrade.entryTime}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, entryTime: e.target.value }))
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Entry Price"
          value={newTrade.entryPrice}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, entryPrice: e.target.value }))
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Stop Loss"
          value={newTrade.stopLoss}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, stopLoss: e.target.value }))
          }
          style={inputStyle}
        />
        <input
          placeholder="Target"
          value={newTrade.target}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, target: e.target.value }))
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Close Price"
          value={newTrade.closePrice}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, closePrice: e.target.value }))
          }
          style={inputStyle}
        />

        <input
          type="date"
          value={newTrade.closeDate}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, closeDate: e.target.value }))
          }
          style={inputStyle}
        />
        <input
          type="time"
          value={newTrade.closeTime}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, closeTime: e.target.value }))
          }
          style={inputStyle}
        />
        <input
          placeholder="Notes"
          value={newTrade.notes}
          onChange={(e) => setNewTrade((p) => ({ ...p, notes: e.target.value }))}
          style={inputStyle}
        />
        <input
          placeholder="Screenshot URL"
          value={newTrade.screenshot}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, screenshot: e.target.value }))
          }
          style={inputStyle}
        />
      </div>

      <button
        onClick={addTrade}
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "10px 16px",
          cursor: "pointer",
          marginBottom: "32px",
        }}
      >
        Add Trade
      </button>

      {/* List of added trades */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {trades.map((trade) => {
          const { result, rr } = determineResult(
            trade.entryPrice,
            trade.stopLoss,
            trade.target,
            trade.closePrice
          );
          const resultColor =
            result === "Win"
              ? "#34d399"
              : result === "Loss"
              ? "#ef4444"
              : "#fbbf24";
          const rrColor =
            parseFloat(rr) > 1
              ? "#34d399"
              : parseFloat(rr) === 1
              ? "#fbbf24"
              : "#ef4444";

          return (
            <div
              key={trade.id}
              style={{
                backgroundColor: "#1f2937",
                padding: "16px",
                borderRadius: "6px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "12px",
                color: "#e5e7eb",
                fontSize: "14px",
              }}
            >
              <div>
                <strong>Pair:</strong> {trade.pair}
              </div>
              <div>
                <strong>Strategy:</strong> {trade.strategy}
              </div>
              <div>
                <strong>Entry:</strong> {trade.entryPrice}
              </div>
              <div>
                <strong>Stop:</strong> {trade.stopLoss}
              </div>
              <div>
                <strong>Target:</strong> {trade.target}
              </div>
              <div>
                <strong>Close:</strong> {trade.closePrice}
              </div>
              <div>
                <strong>Result:</strong>{" "}
                <span style={{ color: resultColor }}>{result}</span>
              </div>
              <div>
                <strong>R:R:</strong>{" "}
                <span style={{ color: rrColor }}>{rr}</span>
              </div>
              <div>
                <strong>Entry D/T:</strong> {trade.entryDate} {trade.entryTime}
              </div>
              <div>
                <strong>Close D/T:</strong> {trade.closeDate} {trade.closeTime}
              </div>
              <div>
                <strong>Notes:</strong> {trade.notes}
              </div>
              <div>
                {trade.screenshot && (
                  <a
                    href={trade.screenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#3b82f6", textDecoration: "underline" }}
                  >
                    View Screenshot
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}