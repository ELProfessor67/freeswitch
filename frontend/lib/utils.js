import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export async function measureDownloadSpeedAndCandle() {
  const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg"; // ~5MB
  const startTime = performance.now();
  const response = await fetch(imageUrl, { cache: "no-cache" });
  const blob = await response.blob();
  const endTime = performance.now();

  const duration = (endTime - startTime) / 1000; // seconds
  const bitsLoaded = blob.size * 8;
  const speedMbps = (bitsLoaded / duration / (1024 * 1024)); // Mbps

  // Decide candle length based on speed
  let candleLength = 1;
  if (speedMbps >= 2 && speedMbps < 5) {
    candleLength = 2;
  } else if (speedMbps >= 5 && speedMbps < 20) {
    candleLength = 3;
  } else if (speedMbps >= 20) {
    candleLength = 4;
  }

  
  return {candleLength,speedMbps};
}
