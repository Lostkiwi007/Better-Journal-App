import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JournalPage() {
  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState({
    pair: "",
    strategy: "",
    entry: "",
    stop: "",
    target: "",
    close: "",
    result: "",
    rr: "",
    notes: "",
    screenshot: ""
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
    const rr = reward !== 0 ? (Math.abs(c - e) / risk).toFixed(2) : "";
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
      notes: "",
      screenshot: ""
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

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Pair"
          value={newTrade.pair}
          onChange={(e) => setNewTrade({ ...newTrade, pair: e.target.value })}
          style={{ display: "block", marginBottom: 12, padding: 8, width: "100%" }}
        />
        <input
          placeholder="Strategy"
          value={newTrade.strategy}
          onChange={(e) => setNewTrade({ ...newTrade, strategy: e.target.value })}
          style={{ display: "block", marginBottom: 12, padding: 8, width: "100%" }}
        />
        <input
          placeholder="Entry Price"
          value={newTrade.entry}
          onChange={(e) => setNewTrade({ ...newTrade, entry: e.target.value })}
          style={{ display: "block", marginBottom: 12, padding: 8, width: "100%" }}
        />
        <input
          placeholder="Stop Loss"
          value={newTrade.stop}
          onChange={(e) => setNewTrade({ ...newTrade, stop: e.target.value })}
          style={{ display: "block", marginBottom: 12, padding: 8, width: "100%" }}
        />
        <input
          placeholder="Target"
          value={newTrade.target}
          onChange={(e) => setNewTrade({ ...newTrade, target: e.target.value })}
          style={{ display: "block", marginBottom: 12, padding: 8, width: "100%" }}
        />
        <input
          placeholder="Close Price"
          value={newTrade.close}
          onChange={(e) => setNewTrade({ ...newTrade, close: e.target.value })}
          style={{ display: "block", marginBottom: 12, padding: 8, width: "100%" }}
        />
        <input
          placeholder="Notes"
          value={newTrade.notes}
          onChange={(e) => setNewTrade({ ...newTrade, notes: e.target.value })}
          style={{ display: "block", marginBottom: 12, padding: 8, width: "100%" }}
        />
        <input
          placeholder="Screenshot URL"
          value={newTrade.screenshot}
          onChange={(e) => setNewTrade({ ...newTrade, screenshot: e.target.value })}
          style={{ display: "block", marginBottom: 12, padding: 8, width: "100%" }}
        />
        <button
          onClick={addTrade}
          style={{
            backgroundColor: "#1d4ed8",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "8px 12px",
            cursor: "pointer"
          }}
        >
          Add Trade
        </button>
      </div>

      <div>
        {trades.map((trade, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#1f2937",
              padding: 12,
              marginBottom: 12,
              borderRadius: 4
            }}
          >
            <div><strong>Pair:</strong> {trade.pair}</div>
            <div><strong>Strategy:</strong> {trade.strategy}</div>
            <div><strong>Entry:</strong> {trade.entry}</div>
            <div><strong>Stop:</strong> {trade.stop}</div>
            <div><strong>Target:</strong> {trade.target}</div>
            <div><strong>Close:</strong> {trade.close}</div>
            <div><strong>Result:</strong> {trade.result}</div>
            <div><strong>R:R:</strong> {trade.rr}</div>
            <div><strong>Notes:</strong> {trade.notes}</div>
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
        ))}
      </div>
    </div>
  );
}