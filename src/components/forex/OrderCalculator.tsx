import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BinanceAd, calculateTransactionsNeeded } from "@/lib/binance-api";
import { Calculator, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface OrderCalculatorProps {
  buyAds: BinanceAd[];
  sellAds: BinanceAd[];
}

export function OrderCalculator({ buyAds, sellAds }: OrderCalculatorProps) {
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [sellAmount, setSellAmount] = useState<string>("");

  const buyResult = buyAmount 
    ? calculateTransactionsNeeded(parseFloat(buyAmount), sellAds)
    : null;

  const sellResult = sellAmount
    ? calculateTransactionsNeeded(parseFloat(sellAmount), buyAds)
    : null;

  return (
    <Card className="glass-card p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Panel de Órdenes</h3>
        </div>

        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Comprar USDT
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Vender USDT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="buy-amount">Cantidad de USDT a Comprar</Label>
              <Input
                id="buy-amount"
                type="number"
                placeholder="Ej: 100"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="font-mono"
              />
            </div>

            {buyResult && (
              <div className="space-y-3 p-4 rounded-lg bg-success/5 border border-success/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Precio Ejecución Promedio:</span>
                  <span className="font-mono font-semibold text-success">
                    {buyResult.avgPrice.toFixed(2)} VES
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Costo Total:</span>
                  <span className="font-mono font-semibold">
                    {buyResult.estimatedVES.toLocaleString('es-VE', { maximumFractionDigits: 2 })} VES
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transacciones Sugeridas:</span>
                  <span className="font-mono font-semibold">{buyResult.transactionsCount}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/40">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Impacto de Mercado:
                  </span>
                  <span className={`font-mono font-semibold ${buyResult.marketImpact > 1 ? 'text-warning' : 'text-success'}`}>
                    {buyResult.marketImpact.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="sell-amount">Cantidad de USDT a Vender</Label>
              <Input
                id="sell-amount"
                type="number"
                placeholder="Ej: 100"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="font-mono"
              />
            </div>

            {sellResult && (
              <div className="space-y-3 p-4 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Precio Ejecución Promedio:</span>
                  <span className="font-mono font-semibold text-warning">
                    {sellResult.avgPrice.toFixed(2)} VES
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ingreso Total:</span>
                  <span className="font-mono font-semibold">
                    {sellResult.estimatedVES.toLocaleString('es-VE', { maximumFractionDigits: 2 })} VES
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transacciones Sugeridas:</span>
                  <span className="font-mono font-semibold">{sellResult.transactionsCount}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/40">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Impacto de Mercado:
                  </span>
                  <span className={`font-mono font-semibold ${sellResult.marketImpact > 1 ? 'text-warning' : 'text-success'}`}>
                    {sellResult.marketImpact.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
