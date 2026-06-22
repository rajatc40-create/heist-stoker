"use client";

import { useEffect, useState } from "react";

interface ClientTimeProps {
  value?: string | number | Date | null;
  format?: "date" | "time" | "datetime";
  fallback?: string;
}

export function ClientTime({ value, format = "datetime", fallback = "--" }: ClientTimeProps) {
  const [label, setLabel] = useState(fallback);

  useEffect(() => {
    if (!value) {
      setLabel(fallback);
      return;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      setLabel(fallback);
      return;
    }

    if (format === "date") {
      setLabel(date.toLocaleDateString());
      return;
    }

    if (format === "time") {
      setLabel(date.toLocaleTimeString());
      return;
    }

    setLabel(date.toLocaleString());
  }, [fallback, format, value]);

  return <span suppressHydrationWarning>{label}</span>;
}
