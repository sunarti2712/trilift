import React, { createContext, useContext, useState } from "react";

const TabsCtx = createContext(null);

export function Tabs({ defaultValue, children, className = "" }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsCtx.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return <div className={`grid gap-2 ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className = "" }) {
  const ctx = useContext(TabsCtx);
  const active = ctx?.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={`px-3 py-2 rounded-xl border text-sm inline-flex items-center justify-center gap-2 ${
        active ? "bg-black text-white" : "bg-white text-black"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }) {
  const ctx = useContext(TabsCtx);
  if (ctx?.value !== value) return null;
  return <div className={className}>{children}</div>;
}
