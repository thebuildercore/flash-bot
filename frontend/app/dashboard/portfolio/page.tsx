'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { PriceFeed } from '@/components/price-feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  BarChart3,
  Zap,
} from 'lucide-react';
import { mockPortfolio } from '@/lib/mock-data';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [totalValue, setTotalValue] = useState(mockPortfolio.totalValue);

  // Simulate portfolio value changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalValue((prev) => {
        const change = (Math.random() - 0.5) * 100;
        return Math.max(prev + change, 8000);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const topGainer = portfolio.tokens.reduce((max, token) =>
    token.percentageChange > max.percentageChange ? token : max
  );
  const topLoser = portfolio.tokens.reduce((min, token) =>
    token.percentageChange < min.percentageChange ? token : min
  );

  return (
    <>
      <DashboardHeader
        title="Portfolio"
        subtitle="Manage your assets and track performance"
      />

      <div className="p-8 space-y-8">
        {/* Portfolio Summary */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Total Value */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle>Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Total Balance</p>
                <h2 className="text-4xl font-bold text-foreground">
                  ${totalValue.toFixed(2)}
                </h2>
                <p className="text-sm text-primary mt-2">
                  +$843.75 (+8.45%) last 24 hours
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-xs text-foreground/60 mb-1">All Time High</p>
                  <p className="font-semibold text-foreground">$11,580.00</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-xs text-foreground/60 mb-1">Realized Gains</p>
                  <p className="font-semibold text-foreground">$1,245.50</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Top Gainer</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{topGainer.symbol}</span>
                    <span className="text-xs text-primary font-medium">
                      +{topGainer.percentageChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="h-1 bg-border rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${Math.min((topGainer.percentageChange / 50) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Top Loser</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{topLoser.symbol}</span>
                    <span className="text-xs text-destructive font-medium">
                      {topLoser.percentageChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="h-1 bg-border rounded-full">
                  <div
                    className="h-full bg-destructive rounded-full"
                    style={{
                      width: `${Math.min(Math.abs((topLoser.percentageChange / 50) * 100), 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Holdings</CardTitle>
              <Button variant="outline" size="sm" className="border-border">
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground/70">
                      Asset
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground/70">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground/70">
                      Price
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground/70">
                      Value
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground/70">
                      24h Change
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground/70">
                      % Portfolio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.tokens.map((token) => {
                    const percentOfPortfolio = (token.totalValue / totalValue) * 100;
                    return (
                      <tr
                        key={token.symbol}
                        className="border-b border-border hover:bg-secondary/10 transition"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">
                                {token.symbol[0]}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">{token.symbol}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-foreground">
                          {token.amount.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-right text-foreground">
                          ${token.currentPrice.toFixed(4)}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-foreground">
                          ${token.totalValue.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`flex items-center justify-end gap-1 font-medium ${
                              token.percentageChange >= 0
                                ? 'text-primary'
                                : 'text-destructive'
                            }`}
                          >
                            {token.percentageChange >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {token.percentageChange >= 0 ? '+' : ''}
                            {token.percentageChange.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-foreground">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-border rounded-full">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${percentOfPortfolio}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-foreground/60 w-10 text-right">
                              {percentOfPortfolio.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Price Feed */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PriceFeed />
          </div>

          {/* Jupiter Integration Info */}
          <Card className="bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/50">
            <CardHeader>
              <CardTitle className="text-base">Jupiter Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/70">
                Wickguard pulls live price data from Jupiter, the leading DEX aggregator on Solana.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <p className="text-xs text-foreground/70">
                    <span className="font-semibold">Real-time Updates</span> - Prices update every 5
                    seconds
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <p className="text-xs text-foreground/70">
                    <span className="font-semibold">Low Latency</span> - Direct integration with
                    Jupiter APIs
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <p className="text-xs text-foreground/70">
                    <span className="font-semibold">Multiple Tokens</span> - 50+ major Solana tokens
                    supported
                  </p>
                </div>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4">
                View Jupiter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
