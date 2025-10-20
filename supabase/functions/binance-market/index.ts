import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FRIENDLY_URL = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

const HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 Chrome/124 Safari/537.36",
  "Accept-Language": "es-VE,es;q=0.9,en;q=0.8",
  "Origin": "https://p2p.binance.com",
  "Referer": "https://p2p.binance.com/es"
};

interface BinanceAd {
  price: number;
  volume_usdt: number;
  minVES: number;
  maxVES: number;
  merchant: string;
  payments: string[];
}

async function fetchAds(tradeType: 'BUY' | 'SELL', maxPages = 50): Promise<BinanceAd[]> {
  const allAds: BinanceAd[] = [];
  
  console.log(`Fetching ${tradeType} ads...`);
  
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
        console.error(`Error fetching page ${page} for ${tradeType}: ${response.status}`);
        break;
      }

      const json = await response.json();
      const data = json.data || [];
      
      console.log(`Page ${page} for ${tradeType}: ${data.length} ads`);
      
      if (data.length === 0) {
        console.log(`No more data for ${tradeType} at page ${page}`);
        break;
      }

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
      if (data.length < 20) {
        console.log(`Reached end for ${tradeType} at page ${page}`);
        break;
      }
      
    } catch (error) {
      console.error(`Error on page ${page} for ${tradeType}:`, error);
      break;
    }
  }
  
  console.log(`Total ${tradeType} ads fetched: ${allAds.length}`);
  return allAds;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting market data fetch...');
    
    // Fetch both buy and sell ads in parallel
    const [buyAds, sellAds] = await Promise.all([
      fetchAds('BUY'),
      fetchAds('SELL')
    ]);

    console.log(`Market data fetched successfully. Buy: ${buyAds.length}, Sell: ${sellAds.length}`);

    return new Response(
      JSON.stringify({ 
        buyAds, 
        sellAds,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching market data:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        buyAds: [],
        sellAds: []
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
