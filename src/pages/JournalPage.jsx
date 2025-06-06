// File: src/pages/JournalPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TradesContext } from "../context/TradesContext";
import { format, differenceInMinutes, parse } from "date-fns";

export default function JournalPage() {
  const { trades, addTrade, updateTrade } = useContext(TradesContext);
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
    screenshot: ""
  });
  const navigate = useNavigate();

  const determineResult = (e, s, t, c) => {
    const entry = parseFloat(e);
    const stop = parseFloat(s);
    const target = parseFloat(t);
    const close = parseFloat(c);
    if (isNaN(entry) || isNaN(stop) || isNaN(target) || isNaN(close)) return { result: "", rr: "" };
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    const rr = reward !== 0 ? parseFloat(((Math.abs(close - entry) / risk) * 100).toFixed(1)) : 0;
    let result = "BE";
    if ((entry < target && close >= target) || (entry > target && close <= target)) result = "Win";
    else if ((entry < stop && close <= stop) || (entry > stop && close >= stop)) result = "Loss";
    return { result, rr };
  };

  const calculateDuration = (od, ot, cd, ct) => {
    if (!od || !ot || !cd || !ct) return "";
    const open = parse(`${od} ${ot}`, "yyyy-MM-dd HH:mm", new Date());
    const close = parse(`${cd} ${ct}`, "yyyy-MM-dd HH:mm", new Date());
    const mins = differenceInMinutes(close, open);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const handleAdd = () => {
    const { result, rr } = determineResult(newTrade.entry, newTrade.stop, newTrade.target, newTrade.close);
    const duration = calculateDuration(newTrade.openDate, newTrade.openTime, newTrade.closeDate, newTrade.closeTime);
    addTrade({ ...newTrade, result, rr, duration });
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
      screenshot: ""
    });
  };

  return (
    <div style={{ backgroundColor: "#0b1120", color: "#e5e7eb", minHeight: "100vh", padding: 24 }}>
      <h1 style={{ color: "#ec4899" }}>Trading Journal</h1>
      <button onClick={() => navigate("/performance")} style={{ marginBottom: 16, padding: "8px 12px", backgroundColor: "#60a5fa", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
        Go to Performance
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <input placeholder="Pair" value={newTrade.pair} onChange={(e) => setNewTrade({ ...newTrade, pair: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <select value={newTrade.strategy} onChange={(e) => setNewTrade({ ...newTrade, strategy: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }}>
          <option value="">Select Strategy</option>
          <option value="ORB">ORB</option>
          <option value="Power Trend">Power Trend</option>
          <option value="Breakout">Breakout</option>
          <option value="Phantom Flow">Phantom Flow</option>
          <option value="Pip Snatcher">Pip Snatcher</option>
        </select>

        <input placeholder="Entry" value={newTrade.entry} onChange={(e) => setNewTrade({ ...newTrade, entry: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <input placeholder="Stop" value={newTrade.stop} onChange={(e) => setNewTrade({ ...newTrade, stop: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <input placeholder="Target" value={newTrade.target} onChange={(e) => setNewTrade({ ...newTrade, target: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <input placeholder="Close" value={newTrade.close} onChange={(e) => setNewTrade({ ...newTrade, close: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <input type="date" value={newTrade.openDate} onChange={(e) => setNewTrade({ ...newTrade, openDate: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <input type="time" value={newTrade.openTime} onChange={(e) => setNewTrade({ ...newTrade, openTime: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <input type="date" value={newTrade.closeDate} onChange={(e) => setNewTrade({ ...newTrade, closeDate: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <input type="time" value={newTrade.closeTime} onChange={(e) => setNewTrade({ ...newTrade, closeTime: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <input placeholder="Notes" value={newTrade.notes} onChange={(e) => setNewTrade({ ...newTrade, notes: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <input placeholder="Screenshot URL" value={newTrade.screenshot} onChange={(e) => setNewTrade({ ...newTrade, screenshot: e.target.value })} style={{ backgroundColor: "#1f2937", color: "#e5e7eb", border: "1px solid #374151", borderRadius: 4, padding: 8 }} />

        <button onClick={handleAdd} style={{ backgroundColor: "#fbbf24", color: "#0b1120", border: "none", borderRadius: 4, padding: "8px 12px", cursor: "pointer" }}>
          Add Trade
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {trades.map((trade, idx) => (
          <div key={idx} style={{ backgroundColor: "#1f2937", padding: 12, borderRadius: 4 }}>
            <div><strong>Pair:</strong> {trade.pair}</div>
            <div><strong>Strategy:</strong> {trade.strategy}</div>
            <div><strong>Entry:</strong> {trade.entry}</div>
            <div><strong>Stop:</strong> {trade.stop}</div>
            <div><strong>Target:</strong> {trade.target}</div>
            <div><strong>Close:</strong> {trade.close}</div>
            <div><strong>Result:</strong> {trade.result}</div>
            <div><strong>R:R:</strong> {trade.rr}%</div>
            <div><strong>Open:</strong> {trade.openDate} {trade.openTime}</div>
            <div><strong>Close:</strong> {trade.closeDate} {trade.closeTime}</div>
            <div><strong>Duration:</strong> {trade.duration}</div>
            <div><strong>Notes:</strong> {trade.notes}</div>
            {trade.screenshot && <img src={trade.screenshot} alt="" style={{ width: 80, marginTop: 8 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}