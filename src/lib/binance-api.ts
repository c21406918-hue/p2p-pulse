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

export interface ForexMetrics {
  bid: number;
  ask: number;
  spread: number;
  spreadPercent: number;
  volume24h: number;
  midPrice: number;
}

// Storage para valores del inicio del día
const STORAGE_KEY = 'binance_day_start_values';

interface DayStartValues {
  date: string;
  offerVolume: number;
  bidVolume: number;
  avgBuyPrice: number;
  avgSellPrice: number;
}

export function saveDayStartValues(data: MarketData) {
  const today = new Date().toDateString();
  const stored = localStorage.getItem(STORAGE_KEY);
  
  // Si no hay datos guardados o es un nuevo día, guardar valores actuales
  if (!stored) {
    const values: DayStartValues = {
      date: today,
      offerVolume: calculateTotalVolume(data.sellAds),
      bidVolume: calculateTotalVolume(data.buyAds),
      avgBuyPrice: calculateWeightedAveragePrice(data.buyAds),
      avgSellPrice: calculateWeightedAveragePrice(data.sellAds),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    return values;
  }
  
  const parsed: DayStartValues = JSON.parse(stored);
  
  // Si es un nuevo día, actualizar con valores actuales
  if (parsed.date !== today) {
    const values: DayStartValues = {
      date: today,
      offerVolume: calculateTotalVolume(data.sellAds),
      bidVolume: calculateTotalVolume(data.buyAds),
      avgBuyPrice: calculateWeightedAveragePrice(data.buyAds),
      avgSellPrice: calculateWeightedAveragePrice(data.sellAds),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    return values;
  }
  
  return parsed;
}

export function getDayStartValues(): DayStartValues | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  const parsed: DayStartValues = JSON.parse(stored);
  const today = new Date().toDateString();
  
  // Si los datos son de un día anterior, no son válidos
  if (parsed.date !== today) return null;
  
  return parsed;
}

export function calculateDayChanges(data: MarketData) {
  const dayStart = getDayStartValues();
  
  if (!dayStart) {
    // Si no hay datos del inicio del día, guardarlos ahora
    saveDayStartValues(data);
    return {
      offerVolumeChange: 0,
      bidVolumeChange: 0,
      buyPriceChange: 0,
      sellPriceChange: 0,
    };
  }
  
  const currentOfferVolume = calculateTotalVolume(data.sellAds);
  const currentBidVolume = calculateTotalVolume(data.buyAds);
  const currentBuyPrice = calculateWeightedAveragePrice(data.buyAds);
  const currentSellPrice = calculateWeightedAveragePrice(data.sellAds);
  
  return {
    offerVolumeChange: ((currentOfferVolume - dayStart.offerVolume) / dayStart.offerVolume) * 100,
    bidVolumeChange: ((currentBidVolume - dayStart.bidVolume) / dayStart.bidVolume) * 100,
    buyPriceChange: ((currentBuyPrice - dayStart.avgBuyPrice) / dayStart.avgBuyPrice) * 100,
    sellPriceChange: ((currentSellPrice - dayStart.avgSellPrice) / dayStart.avgSellPrice) * 100,
  };
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

export function calculateForexMetrics(data: MarketData): ForexMetrics {
  // ASK = mejor precio de venta (el más bajo que alguien vende USDT)
  const ask = data.sellAds.length > 0 
    ? Math.min(...data.sellAds.map(ad => ad.price))
    : 0;
  
  // BID = mejor precio de compra (el más alto que alguien compra USDT)
  const bid = data.buyAds.length > 0
    ? Math.max(...data.buyAds.map(ad => ad.price))
    : 0;
  
  const spread = ask - bid;
  const spreadPercent = bid > 0 ? (spread / bid) * 100 : 0;
  const volume24h = calculateTotalVolume(data.buyAds) + calculateTotalVolume(data.sellAds);
  const midPrice = (bid + ask) / 2;
  
  return { bid, ask, spread, spreadPercent, volume24h, midPrice };
}

export function getCumulativeDepth(ads: BinanceAd[]): Array<{ price: number; volume: number }> {
  const sorted = [...ads].sort((a, b) => a.price - b.price);
  let cumulative = 0;
  
  return sorted.map(ad => {
    cumulative += ad.volume_usdt;
    return { price: ad.price, volume: cumulative };
  });
}

export function getPaymentMethodDistribution(data: MarketData): Array<{ name: string; volume: number }> {
  const allAds = [...data.buyAds, ...data.sellAds];
  const methodMap = new Map<string, number>();
  
  allAds.forEach(ad => {
    ad.payments.forEach(payment => {
      const current = methodMap.get(payment) || 0;
      methodMap.set(payment, current + ad.volume_usdt);
    });
  });
  
  return Array.from(methodMap.entries())
    .map(([name, volume]) => ({ name, volume }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 8);
}

export function calculateTransactionsNeeded(
  targetUSDT: number,
  ads: BinanceAd[]
): { transactionsCount: number; estimatedVES: number; avgPrice: number; marketImpact: number } {
  if (targetUSDT <= 0 || ads.length === 0) {
    return { transactionsCount: 0, estimatedVES: 0, avgPrice: 0, marketImpact: 0 };
  }

  let remainingUSDT = targetUSDT;
  let transactionsCount = 0;
  let totalVES = 0;

  const sortedAds = [...ads].sort((a, b) => a.price - b.price);
  const initialPrice = sortedAds[0].price;

  for (const ad of sortedAds) {
    if (remainingUSDT <= 0) break;

    const availableUSDT = ad.volume_usdt;
    const usedUSDT = Math.min(remainingUSDT, availableUSDT);

    totalVES += usedUSDT * ad.price;
    remainingUSDT -= usedUSDT;
    transactionsCount++;
  }

  const avgPrice = targetUSDT > 0 ? totalVES / targetUSDT : 0;
  const marketImpact = initialPrice > 0 ? ((avgPrice - initialPrice) / initialPrice) * 100 : 0;

  return {
    transactionsCount,
    estimatedVES: totalVES,
    avgPrice,
    marketImpact
  };
}
