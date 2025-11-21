import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { MarketData, getCumulativeDepth } from "@/lib/binance-api";

interface DepthChartProps {
  data: MarketData;
}

export function DepthChart({ data }: DepthChartProps) {
  // Get cumulative depth for bids (reversed for proper display)
  const bidDepth = getCumulativeDepth(data.buyAds).reverse();
  // Get cumulative depth for asks
  const askDepth = getCumulativeDepth(data.sellAds);
  
  // Combine and sort all data points
  const chartData = [
    ...bidDepth.map(d => ({ price: d.price, bidVolume: d.volume, askVolume: 0 })),
    ...askDepth.map(d => ({ price: d.price, bidVolume: 0, askVolume: d.volume }))
  ].sort((a, b) => a.price - b.price);

  return (
    <Card className="glass-card p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Gráfico de Profundidad P2P</h3>
          <p className="text-xs text-muted-foreground">Libro de Órdenes - Volumen Acumulado</p>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="price" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                label={{ value: 'Precio (VES)', position: 'insideBottom', offset: -5, style: { fill: 'hsl(var(--muted-foreground))' } }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                label={{ value: 'Volumen Acumulado (USDT)', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => value.toFixed(2)}
              />
              <Area 
                type="stepAfter" 
                dataKey="bidVolume" 
                stroke="hsl(var(--success))" 
                fill="hsl(var(--success) / 0.2)" 
                name="BID"
              />
              <Area 
                type="stepAfter" 
                dataKey="askVolume" 
                stroke="hsl(var(--warning))" 
                fill="hsl(var(--warning) / 0.2)" 
                name="ASK"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span>BID (Compra)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span>ASK (Venta)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
