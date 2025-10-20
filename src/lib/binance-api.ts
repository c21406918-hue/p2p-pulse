const FRIENDLY_URL = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

const HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 Chrome/124 Safari/537.36",
  "Accept-Language": "es-VE,es;q=0.9,en;q=0.8",
  "Origin": "https://p2p.binance.com",
  "Referer": "https://p2p.binance.com/es"
};

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
}

async function fetchAds(tradeType: 'BUY' | 'SELL', maxPages = 50): Promise<BinanceAd[]> {
  const allAds: BinanceAd[] = [];
  
  for (let page = 1; page <= maxPages; page++) {
    const payload = {
      asset: "USDT",
      fiat: "VES",
      tradeType,
      page,
      rows: 20,
      payTypes: [],
      publisherType: null,
      merchantCheck: false
    };

    try {
      const response = await fetch(FRIENDLY_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`Error fetching page ${page} for ${tradeType}`);
        break;
      }

      const json = await response.json();
      const data = json.data || [];
      
      if (data.length === 0) break;

      for (const item of data) {
        const adv = item.adv || {};
        const advr = item.advertiser || {};
        
        const price = adv.price;
        const vol = adv.surplusAmount || adv.tradableQuantity;
        
        if (price && vol) {
          allAds.push({
            price: parseFloat(price),
            volume_usdt: parseFloat(vol),
            minVES: parseFloat(adv.minSingleTransAmount || 0),
            maxVES: parseFloat(adv.maxSingleTransAmount || 0),
            merchant: advr.nickName || advr.userNo || 'Unknown',
            payments: (adv.tradeMethods || []).map((m: any) => m.tradeMethodName).filter(Boolean),
          });
        }
      }

      // If we got less than 20 results, we've reached the end
      if (data.length < 20) break;
      
    } catch (error) {
      console.error(`Error on page ${page}:`, error);
      break;
    }
  }
  
  return allAds;
}

export async function fetchMarketData(): Promise<MarketData> {
  const [buyAds, sellAds] = await Promise.all([
    fetchAds('BUY'),
    fetchAds('SELL')
  ]);
  
  return { buyAds, sellAds };
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
