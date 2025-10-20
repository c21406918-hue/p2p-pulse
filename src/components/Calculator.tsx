import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator as CalcIcon, TrendingUp, TrendingDown } from "lucide-react";
import { BinanceAd, calculateTransactionsNeeded } from "@/lib/binance-api";

interface CalculatorProps {
  buyAds: BinanceAd[];
  sellAds: BinanceAd[];
}

export function Calculator({ buyAds, sellAds }: CalculatorProps) {
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [sellAmount, setSellAmount] = useState<string>("");

  const buyResult = buyAmount 
    ? calculateTransactionsNeeded(parseFloat(buyAmount), buyAds)
    : null;

  const sellResult = sellAmount 
    ? calculateTransactionsNeeded(parseFloat(sellAmount), sellAds)
    : null;

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <CalcIcon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Calculadora de Transacciones</h2>
      </div>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Comprar USDT
          </TabsTrigger>
          <TabsTrigger value="sell" className="gap-2">
            <TrendingDown className="w-4 h-4" />
            Vender USDT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="buy-amount">Cantidad a Comprar (USDT)</Label>
            <Input
              id="buy-amount"
              type="number"
              placeholder="Ej: 1000"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="font-mono text-lg"
            />
          </div>

          {buyResult && (
            <div className="space-y-3 p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transacciones Necesarias:</span>
                <span className="text-2xl font-bold font-mono text-success">{buyResult.transactionsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Costo Estimado Total:</span>
                <span className="text-xl font-bold font-mono text-success-foreground">
                  {buyResult.estimatedVES.toLocaleString('es-VE', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })} VES
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-success/20">
                <span className="text-xs text-muted-foreground">Precio Promedio:</span>
                <span className="text-sm font-mono">
                  {(buyResult.estimatedVES / parseFloat(buyAmount)).toFixed(2)} VES/USDT
                </span>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sell" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="sell-amount">Cantidad a Vender (USDT)</Label>
            <Input
              id="sell-amount"
              type="number"
              placeholder="Ej: 1000"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="font-mono text-lg"
            />
          </div>

          {sellResult && (
            <div className="space-y-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transacciones Necesarias:</span>
                <span className="text-2xl font-bold font-mono text-warning">{sellResult.transactionsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ingreso Estimado Total:</span>
                <span className="text-xl font-bold font-mono text-warning-foreground">
                  {sellResult.estimatedVES.toLocaleString('es-VE', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })} VES
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-warning/20">
                <span className="text-xs text-muted-foreground">Precio Promedio:</span>
                <span className="text-sm font-mono">
                  {(sellResult.estimatedVES / parseFloat(sellAmount)).toFixed(2)} VES/USDT
                </span>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
