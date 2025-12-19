import React from "react";

export function Table({ className = "", ...props }) {
  return <table className={`w-full text-sm border-collapse ${className}`} {...props} />;
}
export function TableHeader(props) { return <thead {...props} />; }
export function TableBody(props) { return <tbody {...props} />; }
export function TableRow({ className = "", ...props }) {
  return <tr className={`border-b ${className}`} {...props} />;
}
export function TableHead({ className = "", ...props }) {
  return <th className={`text-left p-2 font-medium ${className}`} {...props} />;
}
export function TableCell({ className = "", ...props }) {
  return <td className={`p-2 align-top ${className}`} {...props} />;
}
