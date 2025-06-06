import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TradesContext } from "../context/TradesContext";

export default function JournalPage() {
  const { trades, setTrades } = useContext(TradesContext);
  const [newTrade, setNewTrade] = useState({
    pair: "",
    strategy: "",
    entry: "",
    stop: "",
    target: "",
    close: "",
    openDate: "",
    openTime: "",
    closeDate: "",
    closeTime: "",
    notes: "",
    setupScreenshot: "",
    resultScreenshot: "",
  });
  const navigate = useNavigate();

  const determineResultAndRR = (entry, stop, target, close) => {
    const e = parseFloat(entry);
    const s = parseFloat(stop);
    const t = parseFloat(target);
    const c = parseFloat(close);
    if (isNaN(e) || isNaN(s) || isNaN(t) || isNaN(c)) return { result: "", rr: "" };

    const risk = Math.abs(e - s);
    const reward = Math.abs(c - e);
    const rrValue = risk === 0 ? 0 : reward / risk;
    const rrString = (rrValue === 0 ? 0 : rrValue).toFixed(2);
    let result = "BE";
    if ((e < t && c >= t) || (e > t && c <= t)) result = "Win";
    else if ((e < s && c <= s) || (e > s && c >= s)) result = "Loss";
    return { result, rr: rrString };
  };

  const addTrade = () => {
    const { result, rr } = determineResultAndRR(
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
      openDate: "",
      openTime: "",
      closeDate: "",
      closeTime: "",
      notes: "",
      setupScreenshot: "",
      resultScreenshot: "",
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
          style={{ width: "23%", marginRight: "1%", padding: 8, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <select
          value={newTrade.strategy}
          onChange={(e) => setNewTrade({ ...newTrade, strategy: e.target.value })}
          style={{ width: "23%", marginRight: "1%", padding: 8, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        >
          <option value="">Select Strategy</option>
          <option value="ORB">ORB</option>
          <option value="Breakout">Breakout</option>
          <option value="Reversal">Reversal</option>
          {/* add more options as needed */}
        </select>

        <input
          type="date"
          value={newTrade.openDate}
          onChange={(e) => setNewTrade({ ...newTrade, openDate: e.target.value })}
          style={{ width: "23%", marginRight: "1%", padding: 8, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <input
          type="time"
          value={newTrade.openTime}
          onChange={(e) => setNewTrade({ ...newTrade, openTime: e.target.value })}
          style={{ width: "23%", marginBottom: 12, padding: 8, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <input
          type="number"
          placeholder="Entry Price"
          value={newTrade.entry}
          onChange={(e) => setNewTrade({ ...newTrade, entry: e.target.value })}
          style={{ width: "23%", marginRight: "1%", padding: 8, marginTop: 12, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <input
          type="number"
          placeholder="Stop Loss"
          value={newTrade.stop}
          onChange={(e) => setNewTrade({ ...newTrade, stop: e.target.value })}
          style={{ width: "23%", marginRight: "1%", padding: 8, marginTop: 12, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <input
          type="date"
          value={newTrade.closeDate}
          onChange={(e) => setNewTrade({ ...newTrade, closeDate: e.target.value })}
          style={{ width: "23%", marginRight: "1%", padding: 8, marginTop: 12, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <input
          type="time"
          value={newTrade.closeTime}
          onChange={(e) => setNewTrade({ ...newTrade, closeTime: e.target.value })}
          style={{ width: "23%", marginBottom: 12, padding: 8, marginTop: 12, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <input
          type="number"
          placeholder="Target"
          value={newTrade.target}
          onChange={(e) => setNewTrade({ ...newTrade, target: e.target.value })}
          style={{ width: "23%", marginRight: "1%", padding: 8, marginTop: 12, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <input
          type="number"
          placeholder="Close Price"
          value={newTrade.close}
          onChange={(e) => setNewTrade({ ...newTrade, close: e.target.value })}
          style={{ width: "23%", marginBottom: 12, padding: 8, marginTop: 12, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <input
          placeholder="Notes"
          value={newTrade.notes}
          onChange={(e) => setNewTrade({ ...newTrade, notes: e.target.value })}
          style={{ width: "48%", marginRight: "1%", padding: 8, marginTop: 12, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <input
          placeholder="Setup Screenshot URL"
          value={newTrade.setupScreenshot}
          onChange={(e) => setNewTrade({ ...newTrade, setupScreenshot: e.target.value })}
          style={{ width: "48%", padding: 8, marginTop: 12, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 4, color: "#e5e7eb" }}
        />

        <input
          placeholder="Result Screenshot URL"
          value={newTrade.resultScreenshot}
          onChange={(e) => setNewTrade({ ...newTrade, resultScreenshot: e.target.value })}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 12,
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: 4,
            color: "#e5e7eb",
          }}
        />

        <button
          onClick={addTrade}
          style={{
            marginTop: 16,
            backgroundColor: "#1d4ed8",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Add Trade
        </button>
      </div>

      <div style={{ marginTop: 32 }}>
        {trades.map((trade, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#1f2937",
              padding: 12,
              marginBottom: 12,
              borderRadius: 4,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            <div>
              <div><strong>Pair:</strong> {trade.pair}</div>
              <div><strong>Strategy:</strong> {trade.strategy}</div>
              <div><strong>Target:</strong> {trade.target}</div>
              <div><strong>Notes:</strong> {trade.notes}</div>
            </div>

            <div>
              <div><strong>Entry:</strong> {trade.entry}</div>
              <div><strong>Stop:</strong> {trade.stop}</div>
              <div><strong>Close:</strong> {trade.close}</div>
              <div>
                {trade.setupScreenshot && (
                  <img
                    src={trade.setupScreenshot}
                    alt="setup"
                    style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 4 }}
                  />
                )}
              </div>
            </div>

            <div>
              <div><strong>Result:</strong> {trade.result}</div>
              <div><strong>R:R:</strong> {trade.rr}</div>
              <div>
                <strong>Open D/T:</strong>{" "}
                {trade.openDate ? `${trade.openDate} ${trade.openTime}` : "—"}
              </div>
              <div>
                <strong>Close D/T:</strong>{" "}
                {trade.closeDate ? `${trade.closeDate} ${trade.closeTime}` : "—"}
              </div>
            </div>

            <div>
              <div>
                {trade.resultScreenshot && (
                  <img
                    src={trade.resultScreenshot}
                    alt="result"
                    style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 4 }}
                  />
                )}
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
                  fontSize: 13,
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}