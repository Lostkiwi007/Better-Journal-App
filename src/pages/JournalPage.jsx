import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JournalPage() {
  const navigate = useNavigate();

  // Pre‐defined strategies; “Add New…” will prompt the user
  const [strategies, setStrategies] = useState([
    "ORB",
    "Power Trend",
    "Breakout",
    "Phantom Flow",
    "Pip Snatcher",
  ]);

  // Form state for a new trade
  const [newTrade, setNewTrade] = useState({
    pair: "",
    strategy: "",
    entryDate: "",    // yyyy-mm-dd
    entryTime: "",    // hh:mm
    entry: "",
    stop: "",
    target: "",
    closeDate: "",
    closeTime: "",
    close: "",
    notes: "",
    screenshot: "",
  });

  // List of completed trades
  const [trades, setTrades] = useState([]);

  // Calculate R:R and Win/Loss/BE
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
    const rrValue = reward !== 0 ? (Math.abs(c - e) / risk).toFixed(2) : "";

    let result = "BE";
    if ((e < t && c >= t) || (e > t && c <= t)) {
      result = "Win";
    } else if ((e < s && c <= s) || (e > s && c >= s)) {
      result = "Loss";
    }
    return { result, rr: rrValue };
  };

  // When “Add Trade” is clicked:
  const addTrade = () => {
    const { result, rr } = determineResult(
      newTrade.entry,
      newTrade.stop,
      newTrade.target,
      newTrade.close
    );

    const fullTrade = { ...newTrade, result, rr };
    setTrades([...trades, fullTrade]);

    // Reset form
    setNewTrade({
      pair: "",
      strategy: "",
      entryDate: "",
      entryTime: "",
      entry: "",
      stop: "",
      target: "",
      closeDate: "",
      closeTime: "",
      close: "",
      notes: "",
      screenshot: "",
    });
  };

  // Handle “Add New” strategy
  const handleAddStrategy = () => {
    const name = prompt("Enter a new strategy name:");
    if (name && name.trim() !== "") {
      setStrategies([...strategies, name.trim()]);
      setNewTrade({ ...newTrade, strategy: name.trim() });
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <h1 style={{ color: "#ec4899", marginBottom: 16 }}>Trading Journal</h1>

      <button
        onClick={() => navigate("/performance")}
        style={{
          marginBottom: 24,
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

      {/* ---------- FORM INPUTS ---------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: 24,
        }}
      >
        {/* Pair */}
        <input
          placeholder="Pair"
          value={newTrade.pair}
          onChange={(e) =>
            setNewTrade({ ...newTrade, pair: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />

        {/* Strategy Dropdown */}
        <select
          value={newTrade.strategy}
          onChange={(e) => {
            if (e.target.value === "__add_new__") {
              handleAddStrategy();
            } else {
              setNewTrade({ ...newTrade, strategy: e.target.value });
            }
          }}
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: newTrade.strategy ? "#111827" : "#6b7280",
          }}
        >
          <option value="" disabled>
            Select Strategy
          </option>
          {strategies.map((s, idx) => (
            <option key={idx} value={s}>
              {s}
            </option>
          ))}
          <option value="__add_new__">Add New…</option>
        </select>

        {/* Entry Date */}
        <input
          type="date"
          value={newTrade.entryDate}
          onChange={(e) =>
            setNewTrade({ ...newTrade, entryDate: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />

        {/* Entry Time */}
        <input
          type="time"
          value={newTrade.entryTime}
          onChange={(e) =>
            setNewTrade({ ...newTrade, entryTime: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />

        {/* Entry Price */}
        <input
          placeholder="Entry Price"
          value={newTrade.entry}
          onChange={(e) =>
            setNewTrade({ ...newTrade, entry: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />

        {/* Stop Loss */}
        <input
          placeholder="Stop Loss"
          value={newTrade.stop}
          onChange={(e) =>
            setNewTrade({ ...newTrade, stop: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />

        {/* Target */}
        <input
          placeholder="Target"
          value={newTrade.target}
          onChange={(e) =>
            setNewTrade({ ...newTrade, target: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />

        {/* Close Date */}
        <input
          type="date"
          value={newTrade.closeDate}
          onChange={(e) =>
            setNewTrade({ ...newTrade, closeDate: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />

        {/* Close Time */}
        <input
          type="time"
          value={newTrade.closeTime}
          onChange={(e) =>
            setNewTrade({ ...newTrade, closeTime: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />

        {/* Close Price */}
        <input
          placeholder="Close Price"
          value={newTrade.close}
          onChange={(e) =>
            setNewTrade({ ...newTrade, close: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />

        {/* Notes */}
        <input
          placeholder="Notes"
          value={newTrade.notes}
          onChange={(e) =>
            setNewTrade({ ...newTrade, notes: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />

        {/* Screenshot URL */}
        <input
          placeholder="Screenshot URL"
          value={newTrade.screenshot}
          onChange={(e) =>
            setNewTrade({ ...newTrade, screenshot: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 4,
            border: "1px solid #374151",
            backgroundColor: "white",
            color: "#111827",
          }}
        />
      </div>

      {/* Add Trade Button */}
      <button
        onClick={addTrade}
        style={{
          backgroundColor: "#1d4ed8",
          color: "white",
          border: "none",
          borderRadius: 4,
          padding: "12px 16px",
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        Add Trade
      </button>

      {/* List of Completed Trades */}
      <div>
        {trades.map((trade, idx) => {
          const { result, rr } = determineResult(
            trade.entry,
            trade.stop,
            trade.target,
            trade.close
          );

          return (
            <div
              key={idx}
              style={{
                backgroundColor: "#1f2937",
                padding: 12,
                marginBottom: 12,
                borderRadius: 4,
              }}
            >
              <div>
                <strong>Pair:</strong> {trade.pair}
              </div>
              <div>
                <strong>Strategy:</strong> {trade.strategy}
              </div>
              <div>
                <strong>Entry:</strong> {trade.entry} @ {trade.entryDate}{" "}
                {trade.entryTime}
              </div>
              <div>
                <strong>Stop:</strong> {trade.stop}
              </div>
              <div>
                <strong>Target:</strong> {trade.target}
              </div>
              <div>
                <strong>Close:</strong> {trade.close} @ {trade.closeDate}{" "}
                {trade.closeTime}
              </div>
              <div>
                <strong>Result:</strong> {result}
              </div>
              <div>
                <strong>R:R:</strong> {rr}
              </div>
              <div>
                <strong>Notes:</strong> {trade.notes}
              </div>
              {trade.screenshot && (
                <div style={{ marginTop: 8 }}>
                  <a
                    href={trade.screenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#60a5fa", textDecoration: "underline" }}
                  >
                    View Screenshot
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}