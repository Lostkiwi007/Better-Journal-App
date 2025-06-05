import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parse, differenceInMinutes, format } from "date-fns";

export default function JournalPage() {
  const navigate = useNavigate();

  const strategies = ["ORB", "Power Trend", "Breakout", "Phantom Flow", "Pip Snatcher"];

  function createEmptyTrade() {
    return {
      id: null,
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
      tradingViewLink: "",
    };
  }

  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState(createEmptyTrade());
  const [editingId, setEditingId] = useState(null);

  // Calculate profit/loss % relative to risk
  const determineResult = (entry, stop, close) => {
    const e = parseFloat(entry);
    const s = parseFloat(stop);
    const c = parseFloat(close);
    if (isNaN(e) || isNaN(s) || isNaN(c)) {
      return { result: "", rrPct: "" };
    }

    // Profit = close - entry
    const profit = c - e;
    // Risk = | entry - stop |
    const risk = Math.abs(e - s);
    if (risk === 0) {
      return { result: "", rrPct: "" };
    }

    // R/R ratio
    const rrRatio = profit / risk;
    // Convert to percentage (e.g. 0.5 → 50)
    const rawPct = (rrRatio * 100).toFixed(0);

    let result = "BE";
    if (profit > 0) result = "Win";
    else if (profit < 0) result = "Loss";

    const sign = profit > 0 ? "+" : profit < 0 ? "−" : "";
    const rrPct = profit === 0 ? "0%" : `${sign}${Math.abs(rawPct)}%`;

    return { result, rrPct };
  };

  // Compute duration string “Xh Ym”
  const calculateDuration = (entryDate, entryTime, closeDate, closeTime) => {
    if (!entryDate || !entryTime || !closeDate || !closeTime) return "";
    try {
      const openDT = parse(`${entryDate} ${entryTime}`, "yyyy-MM-dd HH:mm", new Date());
      const closeDT = parse(`${closeDate} ${closeTime}`, "yyyy-MM-dd HH:mm", new Date());
      const mins = differenceInMinutes(closeDT, openDT);
      if (isNaN(mins) || mins < 0) return "";
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hours}h ${remMins}m`;
    } catch {
      return "";
    }
  };

  // Add or update a trade
  const saveTrade = () => {
    const { result, rrPct } = determineResult(
      newTrade.entryPrice,
      newTrade.stopLoss,
      newTrade.closePrice
    );

    if (editingId !== null) {
      // Update existing
      setTrades((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...newTrade, result, rrPct, id: editingId } : t
        )
      );
    } else {
      // Add new
      setTrades((prev) => [
        ...prev,
        { ...newTrade, result, rrPct, id: Date.now() },
      ]);
    }

    setNewTrade(createEmptyTrade());
    setEditingId(null);
  };

  // Pre-fill form for editing
  const startEditing = (trade) => {
    setNewTrade({ ...trade });
    setEditingId(trade.id);
  };

  // Cancel edit
  const cancelEditing = () => {
    setNewTrade(createEmptyTrade());
    setEditingId(null);
  };

  // Common input style
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

  // Button style
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

      {/* ─── 4-Column Input Grid ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        {/* Row 1 */}
        <input
          placeholder="Pair"
          value={newTrade.pair}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, pair: e.target.value }))
          }
          style={inputStyle}
        />

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

        {/* Row 2 */}
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

        {/* Row 3 */}
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
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, notes: e.target.value }))
          }
          style={inputStyle}
        />

        <input
          placeholder="TradingView Setup Link"
          value={newTrade.tradingViewLink}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, tradingViewLink: e.target.value }))
          }
          style={inputStyle}
        />
      </div>

      {/* ─── Single “Screenshot URL” (full width) ─── */}
      <div style={{ marginBottom: "24px" }}>
        <input
          placeholder="Screenshot URL"
          value={newTrade.screenshot}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, screenshot: e.target.value }))
          }
          style={inputStyle}
        />
      </div>

      {/* ─── Add/Save & Cancel Buttons ─── */}
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

      {/* ─── Display Logged Trades ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {trades.map((trade) => {
          const { result, rrPct } = determineResult(
            trade.entryPrice,
            trade.stopLoss,
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
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
                color: "#e5e7eb",
                fontSize: "14px",
              }}
            >
              {/* Column 1 */}
              <div>
                <strong>Pair:</strong> {trade.pair || "—"}
              </div>
              <div>
                <strong>Entry:</strong> {trade.entryPrice || "—"}
              </div>
              <div>
                <strong>Result:</strong>{" "}
                <span style={{ color: resultColor }}>{result}</span>
              </div>
              <div>
                <strong>Entry D/T:</strong>{" "}
                {trade.entryDate
                  ? format(
                      parse(trade.entryDate, "yyyy-MM-dd", new Date()),
                      "dd/MM/yyyy"
                    )
                  : "—"}{" "}
                {trade.entryTime || "—"}
              </div>

              {/* Column 2 */}
              <div>
                <strong>Strategy:</strong> {trade.strategy || "—"}
              </div>
              <div>
                <strong>Stop:</strong> {trade.stopLoss || "—"}
              </div>
              <div>
                <strong>R/R %:</strong>{" "}
                <span style={{ color: resultColor }}>{rrPct}</span>
              </div>
              <div>
                <strong>Close D/T:</strong>{" "}
                {trade.closeDate
                  ? format(
                      parse(trade.closeDate, "yyyy-MM-dd", new Date()),
                      "dd/MM/yyyy"
                    )
                  : "—"}{" "}
                {trade.closeTime || "—"}
              </div>

              {/* Column 3 */}
              <div>
                <strong>Target:</strong> {trade.target || "—"}
              </div>
              <div>
                <strong>Close:</strong> {trade.closePrice || "—"}
              </div>
              <div>
                <strong>Duration:</strong> {duration || "—"}
              </div>
              <div>
                <strong>Notes:</strong> {trade.notes || "—"}
              </div>

              {/* Column 4 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {/* If there’s a screenshot URL, show a small clickable thumbnail */}
                {trade.screenshot ? (
                  <a href={trade.screenshot} target="_blank" rel="noopener noreferrer">
                    <img
                      src={trade.screenshot}
                      alt="Screenshot Thumbnail"
                      style={{
                        width: "80px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        border: "1px solid #334155",
                      }}
                    />
                  </a>
                ) : (
                  <div
                    style={{
                      width: "80px",
                      height: "50px",
                      backgroundColor: "#334155",
                      borderRadius: "4px",
                    }}
                  />
                )}

                {/* TradingView link (if provided) */}
                {trade.tradingViewLink ? (
                  <a
                    href={trade.tradingViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#60a5fa",
                      textDecoration: "underline",
                      fontSize: "13px",
                    }}
                  >
                    View Setup
                  </a>
                ) : (
                  <div style={{ color: "#64748b", fontSize: "13px" }}>
                    No Setup Link
                  </div>
                )}

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
                    alignSelf: "flex-start",
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