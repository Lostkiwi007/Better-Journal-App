// File: src/context/TradesContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const TradesContext = createContext([]);

export function TradesProvider({ children }) {
  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem("trades");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  const addTrade = (trade) => {
    setTrades((prev) => [...prev, trade]);
  };

  const updateTrade = (index, updated) => {
    setTrades((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  return (
    <TradesContext.Provider value={{ trades, addTrade, updateTrade }}>
      {children}
    </TradesContext.Provider>
  );
}
