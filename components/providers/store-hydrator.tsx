"use client";

import { useEffect } from "react";
import { useTradingStore } from "@/store/trading-store";

export function StoreHydrator() {
  useEffect(() => {
    void useTradingStore.persist.rehydrate();
  }, []);

  return null;
}
