import React from "react";

export function Badge({ variant = "default", className = "", ...props }) {
  const base = "inline-flex items-center px-2 py-1 rounded-lg text-xs border whitespace-nowrap";
  const styles =
    variant === "secondary"
      ? "bg-gray-100 text-black"
      : variant === "outline"
      ? "bg-white text-black"
      : "bg-black text-white";
  return <span className={`${base} ${styles} ${className}`} {...props} />;
}
