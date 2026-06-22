import { mockMarketData } from "@/lib/mock-market-data";
import { scanBreakouts } from "@/lib/scanners/breakoutScanner";
import { scanRsiOverbought, scanRsiOversold } from "@/lib/scanners/rsiScanner";
import { scanTopGainers } from "@/lib/scanners/topGainerScanner";
import { scanTopLosers } from "@/lib/scanners/topLoserScanner";
import { scanVolumeSpikes } from "@/lib/scanners/volumeSpikeScanner";
import type { MarketAsset, ScannerResult } from "@/types/platform";

export function runAllScanners(data: MarketAsset[] = mockMarketData): ScannerResult[] {
  return [
    ...scanRsiOversold(data),
    ...scanRsiOverbought(data),
    ...scanTopGainers(data),
    ...scanTopLosers(data),
    ...scanVolumeSpikes(data),
    ...scanBreakouts(data)
  ];
}

export {
  scanBreakouts,
  scanRsiOverbought,
  scanRsiOversold,
  scanTopGainers,
  scanTopLosers,
  scanVolumeSpikes
};
