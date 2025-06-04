export default function JournalPage() { return <div>Journal Page</div>; // src/pages/JournalPage.jsx
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

  // When “Add Trade” is clicked, we push the newTrade into trades[] and reset newTrade back to initial empty values
  const addTrade = () => {
    setTrades([...trades, newTrade]);
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
        style={{ marginBottom: 16, color: "#60a5fa" }}
      >
        Go to Performance
      </button>

      {/* Input fields for all the trade properties */}
      <input
        placeholder="Pair"
        value={newTrade.pair}
        onChange={(e) => setNewTrade({ ...newTrade, pair: e.target.value })}
      />
      <input
        placeholder="Strategy"
        value={newTrade.strategy}
        onChange={(e) => setNewTrade({ ...newTrade, strategy: e.target.value })}
      />
      <input
        placeholder="Entry Price"
        value={newTrade.entry}
        onChange={(e) => setNewTrade({ ...newTrade, entry: e.target.value })}
      />
      <input
        placeholder="Stop Loss"
        value={newTrade.stop}
        onChange={(e) => setNewTrade({ ...newTrade, stop: e.target.value })}
      />
      <input
        placeholder="Target"
        value={newTrade.target}
        onChange={(e) => setNewTrade({ ...newTrade, target: e.target.value })}
      />
      <input
        placeholder="Close Price"
        value={newTrade.close}
        onChange={(e) => setNewTrade({ ...newTrade, close: e.target.value })}
      />
      <input
        placeholder="Notes"
        value={newTrade.notes}
        onChange={(e) => setNewTrade({ ...newTrade, notes: e.target.value })}
      />
      <input
        placeholder="Screenshot URL"
        value={newTrade.screenshot}
        onChange={(e) => setNewTrade({ ...newTrade, screenshot: e.target.value })}
      />

      <button onClick={addTrade}>Add Trade</button>

      {/* Display the list of completed trades */}
      <div style={{ marginTop: 20 }}>
        {trades.map((trade, i) => (
          <div key={i} style={{ border: "1px solid #555", marginBottom: 10, padding: 10 }}>
            <div><strong>Pair:</strong> {trade.pair}</div>
            <div><strong>Strategy:</strong> {trade.strategy}</div>
            <div><strong>Entry:</strong> {trade.entry}</div>
            <div><strong>Stop:</strong> {trade.stop}</div>
            <div><strong>Target:</strong> {trade.target}</div>
            <div><strong>Close:</strong> {trade.close}</div>
            <div><strong>Notes:</strong> {trade.notes}</div>
            {trade.screenshot && (
              <div style={{ marginTop: 8 }}>
                <img src={trade.screenshot} alt="screenshot" style={{ width: 200, border: "1px solid #333" }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}