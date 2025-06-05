import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parse, differenceInMinutes, format } from "date-fns";

export default function JournalPage() {
  const navigate = useNavigate();

  // 1) List of strategies
  const strategies = ["ORB", "Power Trend", "Breakout", "Phantom Flow", "Pip Snatcher"];

  // 2) Initial “empty trade” factory
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

  // 3) Determine Win/Loss/BE and R/R ratio (as a number string)
  const determineResult = (entry, stop, target, close) => {
    const e = parseFloat(entry);
    const s = parseFloat(stop);
    const t = parseFloat(target);
    const c = parseFloat(close);
    if (isNaN(e) || isNaN(s) || isNaN(t) || isNaN(c)) {
      return { result: "", rr: "" };
    }

    let result = "BE";
    if ((e < t && c >= t) || (e > t && c <= t)) result = "Win";
    else if ((e < s && c <= s) || (e > s && c >= s)) result = "Loss";

    const risk = Math.abs(e - s);
    const reward = Math.abs(t - e);
    const rrValue = risk !== 0 ? reward / risk : 0;
    return { result, rr: rrValue.toFixed(2) };
  };

  // 4) Calculate “Xh Ym” between entryDate+entryTime and closeDate+closeTime
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

  // 5) “Save Trade” covers both add & edit
  const saveTrade = () => {
    const { result, rr } = determineResult(
      newTrade.entryPrice,
      newTrade.stopLoss,
      newTrade.target,
      newTrade.closePrice
    );

    if (editingId !== null) {
      // Updating an existing trade
      setTrades((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...newTrade, result, rr, id: editingId } : t
        )
      );
    } else {
      // Adding a brand‐new trade
      setTrades((prev) => [
        ...prev,
        { ...newTrade, result, rr, id: Date.now() },
      ]);
    }

    // Reset form
    setNewTrade(createEmptyTrade());
    setEditingId(null);
  };

  // 6) Start editing: populate form with trade data
  const startEditing = (trade) => {
    setNewTrade({ ...trade });
    setEditingId(trade.id);
  };

  // 7) Cancel editing
  const cancelEditing = () => {
    setNewTrade(createEmptyTrade());
    setEditingId(null);
  };

  // 8) Common input style
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

  // 9) Button style
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
      <h1 style={{ color: "#ec4899", marginBottom: "16px" }}>
        Trading Journal
      </h1>
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

      {/* ─────── 4-Column Grid of Inputs ─────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        {/* Row 1: Pair | Strategy ▼ | Entry Date | Entry Time */}
        <input
          placeholder="Pair"
          value={newTrade.pair}
          onChange={(e) => setNewTrade((p) => ({ ...p, pair: e.target.value }))}
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

        {/* Row 2: Entry Price | Stop Loss | Target | Close Price */}
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

        {/* Row 3: Close Date | Close Time | Notes | Screenshot URL */}
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

      {/* ─────── TradingView Link (full width) ─────── */}
      <input
        placeholder="TradingView Setup Link"
        value={newTrade.tradingViewLink}
        onChange={(e) =>
          setNewTrade((p) => ({ ...p, tradingViewLink: e.target.value }))
        }
        style={{ ...inputStyle, marginBottom: "24px" }}
      />

      {/* ─────── Save / Cancel Buttons ─────── */}
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

      {/* ─────── List of Logged Trades ─────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {trades.map((trade) => {
          // Recalculate result & rr
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

          // Convert R/R ratio to percentage with sign
          let rrPctDisplay = "";
          if (rr !== "" && !isNaN(parseFloat(rr))) {
            const pct = (parseFloat(rr) * 100).toFixed(0);
            if (result === "Win") rrPctDisplay = `+${pct}%`;
            else if (result === "Loss") rrPctDisplay = `-${pct}%`;
            else rrPctDisplay = "0%";
          }

          // Color‐coding: green=Win, red=Loss, gold=BE
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
                  ? format(parse(trade.entryDate, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")
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
                <span style={{ color: resultColor }}>{rrPctDisplay}</span>
              </div>
              <div>
                <strong>Close D/T:</strong>{" "}
                {trade.closeDate
                  ? format(parse(trade.closeDate, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")
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

              {/* Column 4: Screenshot thumbnail, TV link, and Edit */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {trade.screenshot ? (
                  <img
                    src={trade.screenshot}
                    alt="screenshot thumbnail"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "60px",
                      borderRadius: "4px",
                      objectFit: "cover",
                      border: "1px solid #334155",
                    }}
                  />
                ) : (
                  <div style={{ color: "#64748b" }}>No Image</div>
                )}

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