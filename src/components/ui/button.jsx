import React from "react";

export function Button({ variant = "default", className = "", ...props }) {
  const base = "px-3 py-2 rounded-xl text-sm border inline-flex items-center justify-center gap-2";
  const styles =
    variant === "secondary"
      ? "bg-gray-100 text-black"
      : variant === "outline"
      ? "bg-white text-black"
      : "bg-black text-white";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
