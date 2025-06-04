import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parse, differenceInMinutes, format } from "date-fns";

export default function JournalPage() {
  const navigate = useNavigate();

  // List of strategies for the dropdown
  const strategies = ["ORB", "Power Trend", "Breakout", "Phantom Flow", "Pip Snatcher"];

  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState(createEmptyTrade());
  const [editingId, setEditingId] = useState(null);

  // Helper to initialize/clear the form
  function createEmptyTrade() {
    return {
      pair: "",
      strategy: "",
      entryDate: "",
      entryTime: "",
      entryPrice: "",
      stopLoss: "",
      target: "",
      closeDate: "",
      closeTime: "",
      closePrice: "",
      notes: "",
      screenshot: "",
    };
  }

  // Compute Result and R:R ratio
  const determineResult = (entry, stop, target, close) => {
    const e = parseFloat(entry);
    const s = parseFloat(stop);
    const t = parseFloat(target);
    const c = parseFloat(close);
    if (isNaN(e) || isNaN(s) || isNaN(t) || isNaN(c)) {
      return { result: "", rr: "" };
    }

    // R:R = |(target - entry)| / |(entry - stop)|  → always positive
    const risk = Math.abs(e - s);
    const reward = Math.abs(t - e);
    const rr = risk !== 0 ? (reward / risk).toFixed(2) : "";

    // Determine Win/Loss/BE
    let result = "BE";
    if ((e < t && c >= t) || (e > t && c <= t)) result = "Win";
    else if ((e < s && c <= s) || (e > s && c >= s)) result = "Loss";

    return { result, rr };
  };

  // Computes “Xh Ym” between entryDate+entryTime and closeDate+closeTime
  const calculateDuration = (entryDate, entryTime, closeDate, closeTime) => {
    if (!entryDate || !entryTime || !closeDate || !closeTime) return "";
    try {
      const open = parse(
        `${entryDate} ${entryTime}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      const close = parse(
        `${closeDate} ${closeTime}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      const mins = differenceInMinutes(close, open);
      if (isNaN(mins) || mins < 0) return "";
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hours}h ${remMins}m`;
    } catch {
      return "";
    }
  };

  // Called when clicking “Add Trade” or “Save Edit”
  const saveTrade = () => {
    const { result, rr } = determineResult(
      newTrade.entryPrice,
      newTrade.stopLoss,
      newTrade.target,
      newTrade.closePrice
    );

    if (editingId !== null) {
      // Update existing trade
      setTrades((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...newTrade, result, rr, id: editingId } : t
        )
      );
    } else {
      // Add brand new
      setTrades((prev) => [
        ...prev,
        { ...newTrade, result, rr, id: Date.now() },
      ]);
    }

    // Clear form and exit editing mode
    setNewTrade(createEmptyTrade());
    setEditingId(null);
  };

  // Called when user clicks “Edit” on a trade
  const startEditing = (trade) => {
    setNewTrade({ ...trade });
    setEditingId(trade.id);
  };

  // Called when user clicks “Cancel” while editing
  const cancelEditing = () => {
    setNewTrade(createEmptyTrade());
    setEditingId(null);
  };

  // Shared styling for all inputs/selects
  const inputStyle = {
    backgroundColor: "#1e293b",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: "4px",
    padding: "8px",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "14px",
  };

  // “Add Trade” / “Save Edit” button style
  const buttonStyle = {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: editingId !== null ? "12px" : "0",
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
          fontSize: "14px",
        }}
      >
        Go to Performance
      </button>

      {/* 4-column input grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {/* Column 1 */}
        <input
          placeholder="Pair"
          value={newTrade.pair}
          onChange={(e) => setNewTrade((p) => ({ ...p, pair: e.target.value }))}
          style={inputStyle}
        />

        {/* Column 2: Strategy dropdown */}
        <select
          value={newTrade.strategy}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, strategy: e.target.value }))
          }
          style={{
            ...inputStyle,
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            color: newTrade.strategy ? "#e5e7eb" : "#64748b",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cpath fill='%23e5e7eb' d='M0 3l5 5 5-5z'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
          }}
        >
          <option value="" disabled>
            Select Strategy
          </option>
          {strategies.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Column 3 */}
        <input
          type="date"
          value={newTrade.entryDate}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, entryDate: e.target.value }))
          }
          style={inputStyle}
        />

        {/* Column 4 */}
        <input
          type="time"
          value={newTrade.entryTime}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, entryTime: e.target.value }))
          }
          style={inputStyle}
        />

        {/* Next row: Entry Price */}
        <input
          type="number"
          placeholder="Entry Price"
          value={newTrade.entryPrice}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, entryPrice: e.target.value }))
          }
          style={inputStyle}
        />

        {/* Stop Loss */}
        <input
          type="number"
          placeholder="Stop Loss"
          value={newTrade.stopLoss}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, stopLoss: e.target.value }))
          }
          style={inputStyle}
        />

        {/* Target */}
        <input
          placeholder="Target"
          value={newTrade.target}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, target: e.target.value }))
          }
          style={inputStyle}
        />

        {/* Close Price */}
        <input
          type="number"
          placeholder="Close Price"
          value={newTrade.closePrice}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, closePrice: e.target.value }))
          }
          style={inputStyle}
        />

        {/* Next row: Close Date */}
        <input
          type="date"
          value={newTrade.closeDate}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, closeDate: e.target.value }))
          }
          style={inputStyle}
        />

        {/* Close Time */}
        <input
          type="time"
          value={newTrade.closeTime}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, closeTime: e.target.value }))
          }
          style={inputStyle}
        />

        {/* Notes */}
        <input
          placeholder="Notes"
          value={newTrade.notes}
          onChange={(e) => setNewTrade((p) => ({ ...p, notes: e.target.value }))}
          style={inputStyle}
        />

        {/* Screenshot URL */}
        <input
          placeholder="Screenshot URL"
          value={newTrade.screenshot}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, screenshot: e.target.value }))
          }
          style={inputStyle}
        />
      </div>

      {/* Add / Save / Cancel buttons */}
      <div style={{ marginBottom: "32px" }}>
        <button onClick={saveTrade} style={buttonStyle}>
          {editingId !== null ? "Save Changes" : "Add Trade"}
        </button>
        {editingId !== null && (
          <button
            onClick={cancelEditing}
            style={{
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Display the trades in a 4-column grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {trades.map((trade) => {
          const { result, rr } = determineResult(
            trade.entryPrice,
            trade.stopLoss,
            trade.target,
            trade.closePrice
          );
          const duration = calculateDuration(
            trade.entryDate,
            trade.entryTime,
            trade.closeDate,
            trade.closeTime
          );

          const resultColor =
            result === "Win"
              ? "#34d399"
              : result === "Loss"
              ? "#ef4444"
              : "#fbbf24";

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
              {/* Col 1 */}
              <div>
                <strong>Pair:</strong> {trade.pair}
              </div>
              <div>
                <strong>Entry:</strong> {trade.entryPrice}
              </div>
              <div>
                <strong>Result:</strong>{" "}
                <span style={{ color: resultColor }}>{result}</span>
              </div>
              <div>
                <strong>Entry D/T:</strong>{" "}
                {trade.entryDate && format(parse(trade.entryDate, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")}{" "}
                {trade.entryTime}
              </div>

              {/* Col 2 */}
              <div>
                <strong>Strategy:</strong> {trade.strategy}
              </div>
              <div>
                <strong>Stop:</strong> {trade.stopLoss}
              </div>
              <div>
                <strong>R:R:</strong>{" "}
                <span style={{ color: resultColor }}>{rr}</span>
              </div>
              <div>
                <strong>Close D/T:</strong>{" "}
                {trade.closeDate && format(parse(trade.closeDate, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")}{" "}
                {trade.closeTime}
              </div>

              {/* Col 3 */}
              <div>
                <strong>Target:</strong> {trade.target}
              </div>
              <div>
                <strong>Close:</strong> {trade.closePrice}
              </div>
              <div>
                <strong>Duration:</strong> {duration}
              </div>
              <div>
                <strong>Notes:</strong> {trade.notes}
              </div>

              {/* Col 4 */}
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
              <div>
                <button
                  onClick={() => startEditing(trade)}
                  style={{
                    backgroundColor: "#fbbf24",
                    color: "#0b1120",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}