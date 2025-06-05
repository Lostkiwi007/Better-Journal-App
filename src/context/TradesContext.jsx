import React, { createContext, useState, useEffect } from "react";

export const TradesContext = createContext({
  trades: [],
  setTrades: () => {},
});

export function TradesProvider({ children }) {
  const [trades, setTrades] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("trades")) || [];
    } catch {
      return [];
    }
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
