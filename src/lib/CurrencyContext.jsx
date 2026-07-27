import React, { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext(null);
const STORAGE_KEY = "ej_currency";

function getInitial() {
  if (typeof window === "undefined") return "IDR";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "USD" ? "USD" : "IDR";
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(getInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const toggleCurrency = () => setCurrency((c) => (c === "IDR" ? "USD" : "IDR"));

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}