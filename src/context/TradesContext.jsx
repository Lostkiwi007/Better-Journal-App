import React, { createContext, useState } from "react";

export const TradesContext = createContext({
  trades: [],
  setTrades: () => {},
});

export function TradesProvider({ children }) {
  const [trades, setTrades] = useState([]);
  return (
    <TradesContext.Provider value={{ trades, setTrades }}>
      {children}
    </TradesContext.Provider>
  );
}
