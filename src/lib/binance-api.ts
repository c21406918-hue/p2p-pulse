// Use the backend Edge Function instead of calling Binance directly (avoids CORS)
const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/binance-market`;

export interface BinanceAd {
  price: number;
  volume_usdt: number;
  minVES: number;
  maxVES: number;
  merchant: string;
  payments: string[];
}

export interface MarketData {
  buyAds: BinanceAd[];
  sellAds: BinanceAd[];
  timestamp?: string;
}

export async function fetchMarketData(): Promise<MarketData> {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}

export function calculateTotalVolume(ads: BinanceAd[]): number {
  return ads.reduce((sum, ad) => sum + ad.volume_usdt, 0);
}

export function calculateWeightedAveragePrice(ads: BinanceAd[]): number {
  const totalVolume = calculateTotalVolume(ads);
  if (totalVolume === 0) return 0;
  
  const weightedSum = ads.reduce((sum, ad) => {
    return sum + (ad.price * ad.volume_usdt);
  }, 0);
  
  return weightedSum / totalVolume;
}

export function calculateTransactionsNeeded(
  targetUSDT: number,
  ads: BinanceAd[]
): { transactionsCount: number; estimatedVES: number } {
  if (targetUSDT <= 0 || ads.length === 0) {
    return { transactionsCount: 0, estimatedVES: 0 };
  }

  let remainingUSDT = targetUSDT;
  let transactionsCount = 0;
  let totalVES = 0;

  // Sort ads by price (best price first)
  const sortedAds = [...ads].sort((a, b) => a.price - b.price);

  for (const ad of sortedAds) {
    if (remainingUSDT <= 0) break;

    const availableUSDT = ad.volume_usdt;
    const usedUSDT = Math.min(remainingUSDT, availableUSDT);

    totalVES += usedUSDT * ad.price;
    remainingUSDT -= usedUSDT;
    transactionsCount++;
  }

  return {
    transactionsCount,
    estimatedVES: totalVES
  };
}
