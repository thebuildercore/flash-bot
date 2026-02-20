'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { TokenPrice } from '@/lib/types';
import { mockTokenPrices } from '@/lib/mock-data';

export function PriceFeed() {
  const [prices, setPrices] = useState<TokenPrice[]>(mockTokenPrices);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate live price updates from Jupiter
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      setPrices((prevPrices) =>
        prevPrices.map((token) => {
          const priceChange = (Math.random() - 0.5) * 0.05 * token.price;
          const changePercent = token.change24h + (Math.random() - 0.5) * 2;

          return {
            ...token,
            price: Math.max(token.price + priceChange, 0.01),
            change24h: changePercent,
          };
        })
      );
      setIsUpdating(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Live Prices</CardTitle>
          <p className="text-xs text-foreground/60 mt-1">Powered by Jupiter DEX Aggregator</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs text-primary animate-pulse">Live</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {prices.map((token) => (
            <div
              key={token.id}
              className={`flex items-center justify-between p-3 rounded-lg border border-border transition-all ${
                isUpdating ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{token.symbol[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{token.symbol}</p>
                  <p className="text-xs text-foreground/60">{token.name}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium text-sm">${token.price.toFixed(4)}</p>
                <div
                  className={`flex items-center justify-end gap-1 text-xs font-medium ${
                    token.change24h >= 0 ? 'text-primary' : 'text-destructive'
                  }`}
                >
                  {token.change24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {token.change24h >= 0 ? '+' : ''}
                  {token.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
