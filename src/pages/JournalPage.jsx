import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  format,
  parse,
  differenceInMinutes,
} from "date-fns";

export default function JournalPage() {
  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState({
    pair: "",
    strategy: "",
    entry: "",
    stop: "",
    target: "",
    close: "",
    entryDate: null,
    entryTime: "",
    closeDate: null,
    closeTime: "",
    notes: "",
    setupScreenshot: "",
    resultScreenshot: "",
  });
  const navigate = useNavigate();

  const determineResult = (entry, stop, target, close) => {
    const e = parseFloat(entry);
    const s = parseFloat(stop);
    const t = parseFloat(target);
    const c = parseFloat(close);
    if ([e, s, t, c].some((v) => isNaN(v))) {
      return { result: "", rr: "" };
    }
    const risk = Math.abs(e - s);
    const reward = Math.abs(t - e);
    // if close reached stop or target, compute actual profit/loss
    const pnl = c - e;
    // sign: win or loss
    const result =
      (e < t && c >= t) || (e > t && c <= t)
        ? "Win"
        : (e < s && c <= s) || (e > s && c >= s)
        ? "Loss"
        : "BE";
    // compute R:R ratio as units of risk, with sign
    const r = risk !== 0 ? pnl / risk : 0;
    // e.g. +1.25 or -0.50
    const rr = r.toFixed(2);
    return { result, rr };
  };

  const calculateDuration = (ed, et, cd, ct) => {
    if (!ed || !cd || !et || !ct) return "";
    // ed, cd are Date objects; et, ct are "HH:mm a" strings
    const open = parse(
      `${format(ed, "yyyy-MM-dd")} ${et}`,
      "yyyy-MM-dd hh:mm a",
      new Date()
    );
    const close = parse(
      `${format(cd, "yyyy-MM-dd")} ${ct}`,
      "yyyy-MM-dd hh:mm a",
      new Date()
    );
    const mins = differenceInMinutes(close, open);
    if (isNaN(mins) || mins < 0) return "";
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  const addTrade = () => {
    const { result, rr } = determineResult(
      newTrade.entry,
      newTrade.stop,
      newTrade.target,
      newTrade.close
    );
    setTrades([
      ...trades,
      {
        ...newTrade,
        result,
        rr,
      },
    ]);
    setNewTrade({
      pair: "",
      strategy: "",
      entry: "",
      stop: "",
      target: "",
      close: "",
      entryDate: null,
      entryTime: "",
      closeDate: null,
      closeTime: "",
      notes: "",
      setupScreenshot: "",
      resultScreenshot: "",
    });
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
      <h1 style={{ color: "#ec4899" }}>Trading Journal</h1>
      <button
        onClick={() => navigate("/performance")}
        style={{
          marginBottom: 20,
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

      {/* ───── INPUT FORM: FOUR COLUMNS ───── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: 20,
        }}
      >
        {/* Row 1 */}
        <input
          placeholder="Pair"
          value={newTrade.pair}
          onChange={(e) =>
            setNewTrade({ ...newTrade, pair: e.target.value })
          }
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
          }}
        />
        <select
          value={newTrade.strategy}
          onChange={(e) =>
            setNewTrade({ ...newTrade, strategy: e.target.value })
          }
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
          }}
        >
          <option value="">Select Strategy</option>
          <option value="ORB">ORB</option>
          <option value="Power Trend">Power Trend</option>
          <option value="Breakout">Breakout</option>
          <option value="Phantom Flow">Phantom Flow</option>
          <option value="Pip Snatcher">Pip Snatcher</option>
        </select>
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            type="date"
            value={
              newTrade.entryDate
                ? format(newTrade.entryDate, "yyyy-MM-dd")
                : ""
            }
            onChange={(e) =>
              setNewTrade({
                ...newTrade,
                entryDate: e.target.value
                  ? new Date(e.target.value)
                  : null,
              })
            }
            style={{
              padding: 8,
              backgroundColor: "#1f2937",
              color: "white",
              border: "1px solid #374151",
              borderRadius: 4,
              width: "100%",
            }}
          />
        </div>
        <input
          type="time"
          value={newTrade.entryTime}
          onChange={(e) =>
            setNewTrade({ ...newTrade, entryTime: e.target.value })
          }
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
          }}
        />

        {/* Row 2 */}
        <input
          placeholder="Entry Price"
          type="number"
          value={newTrade.entry}
          onChange={(e) =>
            setNewTrade({ ...newTrade, entry: e.target.value })
          }
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
          }}
        />
        <input
          placeholder="Stop Loss"
          type="number"
          value={newTrade.stop}
          onChange={(e) =>
            setNewTrade({ ...newTrade, stop: e.target.value })
          }
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
          }}
        />
        <input
          placeholder="Target"
          type="number"
          value={newTrade.target}
          onChange={(e) =>
            setNewTrade({ ...newTrade, target: e.target.value })
          }
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
          }}
        />
        <input
          placeholder="Close Price"
          type="number"
          value={newTrade.close}
          onChange={(e) =>
            setNewTrade({ ...newTrade, close: e.target.value })
          }
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
          }}
        />

        {/* Row 3 */}
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            type="date"
            value={
              newTrade.closeDate
                ? format(newTrade.closeDate, "yyyy-MM-dd")
                : ""
            }
            onChange={(e) =>
              setNewTrade({
                ...newTrade,
                closeDate: e.target.value
                  ? new Date(e.target.value)
                  : null,
              })
            }
            style={{
              padding: 8,
              backgroundColor: "#1f2937",
              color: "white",
              border: "1px solid #374151",
              borderRadius: 4,
              width: "100%",
            }}
          />
        </div>
        <input
          type="time"
          value={newTrade.closeTime}
          onChange={(e) =>
            setNewTrade({ ...newTrade, closeTime: e.target.value })
          }
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
          }}
        />
        <input
          placeholder="Notes"
          value={newTrade.notes}
          onChange={(e) =>
            setNewTrade({ ...newTrade, notes: e.target.value })
          }
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
          }}
        />
        <input
          placeholder="Setup Screenshot URL"
          value={newTrade.setupScreenshot}
          onChange={(e) =>
            setNewTrade({
              ...newTrade,
              setupScreenshot: e.target.value,
            })
          }
          style={{
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
          }}
        />

        {/* Row 4 (only one field) */}
        <input
          placeholder="Result Screenshot URL"
          value={newTrade.resultScreenshot}
          onChange={(e) =>
            setNewTrade({
              ...newTrade,
              resultScreenshot: e.target.value,
            })
          }
          style={{
            gridColumn: "1 / span 4",
            padding: 8,
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: 4,
            width: "100%",
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
          marginBottom: 20,
        }}
      >
        Add Trade
      </button>

      {/* ───── TRADE LIST ───── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {trades.map((trade, i) => {
          const duration = calculateDuration(
            trade.entryDate,
            trade.entryTime,
            trade.closeDate,
            trade.closeTime
          );
          return (
            <div
              key={i}
              style={{
                backgroundColor: "#1f2937",
                padding: 16,
                borderRadius: 6,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
                alignItems: "start",
              }}
            >
              {/* Col 1: Pair / Strategy / Target */}
              <div style={{ color: "white" }}>
                <div>
                  <strong>Pair:</strong> {trade.pair || "—"}
                </div>
                <div>
                  <strong>Strategy:</strong> {trade.strategy || "—"}
                </div>
                <div>
                  <strong>Target:</strong> {trade.target || "—"}
                </div>
                {trade.setupScreenshot && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={trade.setupScreenshot}
                      alt="setup thumbnail"
                      style={{
                        width: 80,
                        height: 50,
                        objectFit: "cover",
                        border: "1px solid #374151",
                        borderRadius: 4,
                      }}
                    />
                    <div>
                      <a
                        href={trade.setupScreenshot}
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
                    </div>
                  </div>
                )}
              </div>

              {/* Col 2: Entry / Stop / Close */}
              <div style={{ color: "white" }}>
                <div>
                  <strong>Entry:</strong> {trade.entry || "—"}
                </div>
                <div>
                  <strong>Stop:</strong> {trade.stop || "—"}
                </div>
                <div>
                  <strong>Close:</strong> {trade.close || "—"}
                </div>
                {trade.resultScreenshot && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={trade.resultScreenshot}
                      alt="result thumbnail"
                      style={{
                        width: 80,
                        height: 50,
                        objectFit: "cover",
                        border: "1px solid #374151",
                        borderRadius: 4,
                      }}
                    />
                    <div>
                      <a
                        href={trade.resultScreenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#60a5fa",
                          textDecoration: "underline",
                          fontSize: "13px",
                        }}
                      >
                        View Result
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Col 3: Result / R:R / Duration */}
              <div style={{ color: "white" }}>
                <div>
                  <strong>Result:</strong>{" "}
                  <span
                    style={{
                      color:
                        trade.result === "Win"
                          ? "#34d399"
                          : trade.result === "Loss"
                          ? "#f87171"
                          : "#ffffff",
                    }}
                  >
                    {trade.result || "—"}
                  </span>
                </div>
                <div>
                  <strong>R:R:</strong>{" "}
                  {trade.rr
                    ? `${trade.rr.startsWith("-") ? "" : "+"}${trade.rr} R:R`
                    : "—"}
                </div>
                <div>
                  <strong>Duration:</strong> {duration || "—"}
                </div>
              </div>

              {/* Col 4: Entry D/T / Close D/T / Notes */}
              <div style={{ color: "white" }}>
                <div>
                  <strong>Entry D/T:</strong>{" "}
                  {trade.entryDate
                    ? `${format(trade.entryDate, "MM/dd/yyyy")} ${trade.entryTime}`
                    : "—"}
                </div>
                <div>
                  <strong>Close D/T:</strong>{" "}
                  {trade.closeDate
                    ? `${format(trade.closeDate, "MM/dd/yyyy")} ${trade.closeTime}`
                    : "—"}
                </div>
                <div>
                  <strong>Notes:</strong> {trade.notes || "—"}
                </div>
                <button
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fbbf24",
                    color: "#0b1120",
                    border: "none",
                    borderRadius: 4,
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: "13px",
                    alignSelf: "flex-start",
                  }}
                  onClick={() => {
                    // For now, “Edit” just populates back into the form.
                    setNewTrade({ ...trade });
                    // remove old trade before re-adding on “Add Trade”
                    setTrades(trades.filter((_, idx2) => idx2 !== i));
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