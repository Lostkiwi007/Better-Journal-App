import React, { createContext, useState } from "react";

export const TradesContext = createContext();

export function TradesProvider({ children }) {
  const [trades, setTrades] = useState([]);

  return (
    <TradesContext.Provider value={{ trades, setTrades }}>
      {children}
    </TradesContext.Provider>
  );
}