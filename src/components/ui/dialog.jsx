import React, { createContext, useContext, useState } from "react";

const DialogCtx = createContext(null);

export function Dialog({ children }) {
  const [open, setOpen] = useState(false);
  return <DialogCtx.Provider value={{ open, setOpen }}>{children}</DialogCtx.Provider>;
}

export function DialogTrigger({ asChild, children }) {
  const ctx = useContext(DialogCtx);
  // We expect children to be a button; clone it to attach onClick
  if (!ctx) return children;
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: (e) => {
      child.props.onClick?.(e);
      ctx.setOpen(true);
    },
  });
}

export function DialogContent({ children, className = "" }) {
  const ctx = useContext(DialogCtx);
  if (!ctx?.open) return null;
  return (
    <div className={`mt-3 border rounded-2xl p-4 bg-white ${className}`}>
      <div className="flex justify-end">
        <button className="text-xs border rounded-lg px-2 py-1" onClick={() => ctx.setOpen(false)}>
          Close
        </button>
      </div>
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}
export function DialogTitle({ children }) {
  return <div className="font-semibold">{children}</div>;
}
