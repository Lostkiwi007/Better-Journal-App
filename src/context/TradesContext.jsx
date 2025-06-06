// File: src/context/TradesContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const TradesContext = createContext();

export function TradesProvider({ children }) {
  const [trades, setTrades] = useState(() => {
    const stored = localStorage.getItem("trades");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  return (
    <TradesContext.Provider value={{ trades, setTrades }}>
      {children}
    </TradesContext.Provider>
  );
}