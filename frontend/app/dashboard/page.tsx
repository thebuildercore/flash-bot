'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Activity,
  Eye,
} from 'lucide-react';
import { mockPortfolio, mockMarginPositions, mockTokenPrices } from '@/lib/mock-data';
import Link from 'next/link';

export default function DashboardOverview() {
  const [portfolioValue, setPortfolioValue] = useState(mockPortfolio.totalValue);
  const [protectionActive, setProtectionActive] = useState(false);

  const riskPositions = mockMarginPositions.filter(
    (p) => p.healthRatio < 2 && !p.isProtected
  ).length;
  const protectedPositions = mockMarginPositions.filter((p) => p.isProtected).length;

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue((prev) => {
        const change = (Math.random() - 0.5) * 50;
        return Math.max(prev + change, 8000);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        subtitle="Monitor your positions and liquidation status"
      />

      <div className="p-8 space-y-8">
        {/* Statistics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Portfolio Value */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioValue.toFixed(2)}</div>
              <p className="text-xs text-foreground/60 mt-1">
                <span className="text-primary">+8.45%</span> (24h)
              </p>
            </CardContent>
          </Card>

          {/* Total Positions */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
              <Activity className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMarginPositions.length}</div>
              <p className="text-xs text-foreground/60 mt-1">
                <span className="text-primary">{protectedPositions}</span> protected
              </p>
            </CardContent>
          </Card>

          {/* Avg Health Ratio */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Health Ratio</CardTitle>
              <Eye className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  mockMarginPositions.reduce((sum, p) => sum + p.healthRatio, 0) /
                  mockMarginPositions.length
                ).toFixed(2)}
              </div>
              <p className="text-xs text-foreground/60 mt-1">Healthy range: 1.5+</p>
            </CardContent>
          </Card>

          {/* At-Risk Positions */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At-Risk</CardTitle>
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{riskPositions}</div>
              <p className="text-xs text-foreground/60 mt-1">Need protection</p>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA Section */}
        <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/30 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Wickguard Protection</CardTitle>
                  <p className="text-sm text-foreground/70 mt-2">
                    Activate automated liquidation protection for all your positions. We'll monitor
                    your health ratios and execute emergency actions when needed.
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Link href="/dashboard/protection">
                <Button
                  size="lg"
                  className={`${
                    protectionActive
                      ? 'bg-primary/80 text-primary-foreground'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {protectionActive ? (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Protection Active
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Wickguard Start Protection
                    </>
                  )}
                </Button>
              </Link>
              <Link href="/dashboard/protection">
                <Button variant="outline" className="border-border">
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Overview Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Tokens */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Top Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPortfolio.tokens.slice(0, 4).map((token, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{token.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{token.symbol}</p>
                        <p className="text-xs text-foreground/60">${token.currentPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${token.totalValue.toFixed(2)}</p>
                      <p
                        className={`text-xs font-medium ${
                          token.percentageChange >= 0
                            ? 'text-primary'
                            : 'text-destructive'
                        }`}
                      >
                        {token.percentageChange >= 0 ? '+' : ''}
                        {token.percentageChange.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Margin Positions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Margin Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMarginPositions.map((position, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">{position.token}</p>
                      <p className="text-xs text-foreground/60">
                        Health: {position.healthRatio.toFixed(2)}x
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          position.protectionLevel === 'safe'
                            ? 'bg-primary/20 text-primary'
                            : position.protectionLevel === 'warning'
                              ? 'bg-accent/20 text-accent'
                              : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {position.protectionLevel === 'safe' && (
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                        )}
                        {position.protectionLevel === 'warning' && (
                          <span className="w-2 h-2 bg-accent rounded-full"></span>
                        )}
                        {position.protectionLevel === 'critical' && (
                          <span className="w-2 h-2 bg-destructive rounded-full"></span>
                        )}
                        {position.protectionLevel.charAt(0).toUpperCase() +
                          position.protectionLevel.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/dashboard/portfolio">
            <Card className="bg-card border-border hover:border-primary/50 cursor-pointer transition">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-sm">View Portfolio</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/protection">
            <Card className="bg-card border-border hover:border-primary/50 cursor-pointer transition">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <CardTitle className="text-sm">Protection Status</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/analytics">
            <Card className="bg-card border-border hover:border-primary/50 cursor-pointer transition">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-sm">Analytics</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}
