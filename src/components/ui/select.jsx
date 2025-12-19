import React from "react";

export function Select({ value, onValueChange, children }) {
  const items = [];
  React.Children.forEach(children, (child) => {
    if (!child) return;
    if (child.type?.name === "SelectContent") {
      React.Children.forEach(child.props.children, (it) => {
        if (it?.type?.name === "SelectItem") items.push(it.props);
      });
    }
  });

  return (
    <select
      className="w-full border rounded-xl px-3 py-2 text-sm"
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {items.map((it) => (
        <option key={it.value} value={it.value}>
          {it.children}
        </option>
      ))}
    </select>
  );
}

export function SelectTrigger({ children }) { return <>{children}</>; }
export function SelectValue() { return null; }
export function SelectContent({ children }) { return <>{children}</>; }
export function SelectItem({ children }) { return <>{children}</>; }
