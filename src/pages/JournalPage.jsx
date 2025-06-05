import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { parse, differenceInMinutes, format } from "date-fns";
import { TradesContext } from "../context/TradesContext";

export default function JournalPage() {
  const navigate = useNavigate();
  // ← pull trades + setTrades from context instead of local state
  const { trades, setTrades } = useContext(TradesContext);

  // local form state for one new/editing trade
  const [newTrade, setNewTrade] = useState({
    pair: "",
    strategy: "",
    entryDate: null,
    entryTime: "",
    entryPrice: "",
    stopLoss: "",
    target: "",
    closeDate: null,
    closeTime: "",
    closePrice: "",
    notes: "",
    setupScreenshot: "",
    resultScreenshot: "",
  });

  // Compute Win/Loss/BE + R:R ratio (decimal)
  const determineResult = (entry, stop, target, close) => {
    const e = parseFloat(entry);
    const s = parseFloat(stop);
    const t = parseFloat(target);
    const c = parseFloat(close);
    if ([e, s, t, c].some((v) => isNaN(v) || v === null)) {
      return { result: "", rr: "" };
    }
    const risk = Math.abs(e - s);
    const profit = c - e;
    const rawRatio = profit / risk;
    const ratio = isFinite(rawRatio) ? rawRatio.toFixed(2) : "";

    let result = "BE";
    if (profit > 0) result = "Win";
    else if (profit < 0) result = "Loss";

    return { result, rr: ratio };
  };

  // Compute “Xh Ym” between two date-time combos
  const calculateDuration = (entryDate, entryTime, closeDate, closeTime) => {
    if (!entryDate || !entryTime || !closeDate || !closeTime) return "";
    try {
      const openDT = parse(
        `${format(entryDate, "yyyy-MM-dd")} ${entryTime}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      const closeDT = parse(
        `${format(closeDate, "yyyy-MM-dd")} ${closeTime}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      const mins = differenceInMinutes(closeDT, openDT);
      if (isNaN(mins) || mins < 0) return "";
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hours}h ${remMins}m`;
    } catch {
      return "";
    }
  };

  // When user clicks “Add Trade”
  const addTrade = () => {
    const { result, rr } = determineResult(
      newTrade.entryPrice,
      newTrade.stopLoss,
      newTrade.target,
      newTrade.closePrice
    );

    // Append to context’s trades array
    setTrades([
      ...trades,
      {
        ...newTrade,
        result,
        rr,
        id: Date.now(),
      },
    ]);

    // Reset form
    setNewTrade({
      pair: "",
      strategy: "",
      entryDate: null,
      entryTime: "",
      entryPrice: "",
      stopLoss: "",
      target: "",
      closeDate: null,
      closeTime: "",
      closePrice: "",
      notes: "",
      setupScreenshot: "",
      resultScreenshot: "",
    });
  };

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

  const buttonStyle = {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "14px",
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

      {/* ─── 4-column input grid ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
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
          <option value="">Select Strategy</option>
          <option value="ORB">ORB</option>
          <option value="Power Trend">Power Trend</option>
          <option value="Breakout">Breakout</option>
          <option value="Phantom Flow">Phantom Flow</option>
          <option value="Pip Snatcher">Pip Snatcher</option>
        </select>

        <input
          type="date"
          value={
            newTrade.entryDate
              ? format(newTrade.entryDate, "yyyy-MM-dd")
              : ""
          }
          onChange={(e) =>
            setNewTrade((p) => ({
              ...p,
              entryDate: e.target.value ? new Date(e.target.value) : null,
            }))
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
          placeholder="Entry Price"
          type="number"
          value={newTrade.entryPrice}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, entryPrice: e.target.value }))
          }
          style={inputStyle}
        />
        <input
          placeholder="Stop Loss"
          type="number"
          value={newTrade.stopLoss}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, stopLoss: e.target.value }))
          }
          style={inputStyle}
        />
        <input
          placeholder="Target"
          type="number"
          value={newTrade.target}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, target: e.target.value }))
          }
          style={inputStyle}
        />
        <input
          placeholder="Close Price"
          type="number"
          value={newTrade.closePrice}
          onChange={(e) =>
            setNewTrade((p) => ({ ...p, closePrice: e.target.value }))
          }
          style={inputStyle}
        />

        {/* Row 3 */}
        <input
          type="date"
          value={
            newTrade.closeDate
              ? format(newTrade.closeDate, "yyyy-MM-dd")
              : ""
          }
          onChange={(e) =>
            setNewTrade((p) => ({
              ...p,
              closeDate: e.target.value ? new Date(e.target.value) : null,
            }))
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
          placeholder="Setup Screenshot URL"
          value={newTrade.setupScreenshot}
          onChange={(e) =>
            setNewTrade((p) => ({
              ...p,
              setupScreenshot: e.target.value,
            }))
          }
          style={inputStyle}
        />

        {/* Row 4 */}
        <input
          placeholder="Result Screenshot URL"
          value={newTrade.resultScreenshot}
          onChange={(e) =>
            setNewTrade((p) => ({
              ...p,
              resultScreenshot: e.target.value,
            }))
          }
          style={{
            gridColumn: "1 / span 4",
            padding: 8,
            backgroundColor: "#1e293b",
            color: "white",
            border: "1px solid #334155",
            borderRadius: 4,
            width: "100%",
          }}
        />
      </div>

      <button onClick={addTrade} style={buttonStyle}>
        Add Trade
      </button>

      {/* ─── Display all trades from context ─── */}
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: "16px" }}>
        {trades.map((trade, idx) => {
          const duration = calculateDuration(
            trade.entryDate,
            trade.entryTime,
            trade.closeDate,
            trade.closeTime
          );

          // Color‐code R:R text
          const rrColor =
            trade.result === "Win"
              ? "#34d399"
              : trade.result === "Loss"
              ? "#ef4444"
              : "#fbbf24";

          return (
            <div
              key={idx}
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
                <span style={{ color: rrColor }}>{trade.result || "—"}</span>
              </div>
              <div>
                <strong>Entry D/T:</strong>{" "}
                {trade.entryDate
                  ? `${format(trade.entryDate, "MM/dd/yyyy")} ${trade.entryTime}`
                  : "—"}
              </div>

              {/* Column 2 */}
              <div>
                <strong>Strategy:</strong> {trade.strategy || "—"}
              </div>
              <div>
                <strong>Stop:</strong> {trade.stopLoss || "—"}
              </div>
              <div>
                <strong>R:R:</strong>{" "}
                {trade.rr
                  ? `${trade.rr.startsWith("-") ? "" : "+"}${trade.rr} R:R`
                  : "—"}
              </div>
              <div>
                <strong>Close D/T:</strong>{" "}
                {trade.closeDate
                  ? `${format(trade.closeDate, "MM/dd/yyyy")} ${trade.closeTime}`
                  : "—"}
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
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Setup Thumbnail */}
                {trade.setupScreenshot ? (
                  <a href={trade.setupScreenshot} target="_blank" rel="noopener noreferrer">
                    <img
                      src={trade.setupScreenshot}
                      alt="Setup thumbnail"
                      style={{
                        width: "80px",
                        height: "50px",
                        objectFit: "cover",
                        border: "1px solid #334155",
                        borderRadius: "4px",
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

                {/* Result Thumbnail */}
                {trade.resultScreenshot ? (
                  <a href={trade.resultScreenshot} target="_blank" rel="noopener noreferrer">
                    <img
                      src={trade.resultScreenshot}
                      alt="Result thumbnail"
                      style={{
                        width: "80px",
                        height: "50px",
                        objectFit: "cover",
                        border: "1px solid #334155",
                        borderRadius: "4px",
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

                {/* Edit button just re-loads data into form for now */}
                <button
                  onClick={() => {
                    setNewTrade({ ...trade });
                    setTrades(trades.filter((_, i2) => i2 !== idx));
                  }}
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