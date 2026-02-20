'use client';

import { DashboardHeader } from '@/components/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAnalytics, mockTradeHistory } from '@/lib/mock-data';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Award,
  Target,
  BarChart3,
  Activity,
  Filter,
  Download,
} from 'lucide-react';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedSymbol, setSelectedSymbol] = useState('all');

  const MetricCard = ({ title, value, change, icon: Icon, isNegative = false }: any) => (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 hover:border-primary/30 transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground/70 mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${isNegative ? 'text-destructive' : 'text-primary'}`}>
                {value}
              </p>
              {change !== undefined && (
                <span className={`text-xs font-medium ${change >= 0 ? 'text-green-400' : 'text-destructive'}`}>
                  {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${isNegative ? 'bg-destructive/10' : 'bg-primary/10'}`}>
            <Icon className={`w-5 h-5 ${isNegative ? 'text-destructive' : 'text-primary'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <DashboardHeader
        title="Advanced Trading Analytics"
        subtitle="Comprehensive performance metrics and trading insights powered by Wickguard"
      />

      <div className="p-8 space-y-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['24h', '7d', '30d', '90d', 'All Time'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-foreground/70 hover:border-primary/50 hover:bg-card'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-border hover:bg-card transition-all">
              <Filter className="w-4 h-4 text-foreground/60" />
            </button>
            <button className="p-2 rounded-lg border border-border hover:bg-card transition-all">
              <Download className="w-4 h-4 text-foreground/60" />
            </button>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total PnL"
            value={`$${mockAnalytics.totalPnL.toLocaleString()}`}
            change={mockAnalytics.totalPnLPercent}
            icon={TrendingUp}
          />
          <MetricCard
            title="Win Rate"
            value={`${mockAnalytics.winRate.toFixed(1)}%`}
            change={mockAnalytics.winRate}
            icon={Award}
          />
          <MetricCard
            title="Max Drawdown"
            value={`${mockAnalytics.maxDrawdown.toFixed(1)}%`}
            isNegative
            icon={TrendingDown}
          />
          <MetricCard
            title="Total Trades"
            value={mockAnalytics.totalTrades}
            change={(mockAnalytics.winningTrades / mockAnalytics.totalTrades) * 100}
            icon={BarChart3}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          <MetricCard
            title="Avg Win / Loss"
            value={`$${mockAnalytics.averageWin.toFixed(2)}`}
            change={((mockAnalytics.averageWin / mockAnalytics.averageLoss) * 100) - 100}
            icon={Target}
          />
          <MetricCard
            title="Profit Factor"
            value={mockAnalytics.profitFactor.toFixed(2)}
            change={mockAnalytics.profitFactor * 10}
            icon={Zap}
          />
          <MetricCard
            title="Sharpe Ratio"
            value={mockAnalytics.sharpeRatio.toFixed(2)}
            change={mockAnalytics.sharpeRatio * 15}
            icon={Shield}
          />
        </div>

        {/* Trading Breakdown */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Win/Loss Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground/70">Winning Trades</span>
                  <span className="font-bold text-primary">{mockAnalytics.winningTrades}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{
                      width: `${(mockAnalytics.winningTrades / mockAnalytics.totalTrades) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground/70">Losing Trades</span>
                  <span className="font-bold text-destructive">{mockAnalytics.losingTrades}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-destructive h-full rounded-full"
                    style={{
                      width: `${(mockAnalytics.losingTrades / mockAnalytics.totalTrades) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-foreground/60">
                  Win/Loss Ratio: <span className="font-bold text-foreground">{mockAnalytics.winLossRatio.toFixed(2)}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Trade Direction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground/70">Long Positions</span>
                  <span className="font-bold text-primary">{(mockAnalytics.longRatio * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${mockAnalytics.longRatio * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground/70">Short Positions</span>
                  <span className="font-bold text-accent">{(mockAnalytics.shortRatio * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-accent h-full rounded-full"
                    style={{ width: `${mockAnalytics.shortRatio * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Trade Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/70">Largest Win</span>
                <span className="font-bold text-primary">${mockAnalytics.largestWin.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Largest Loss</span>
                <span className="font-bold text-destructive">${mockAnalytics.largestLoss.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Avg Trade Size</span>
                <span className="font-bold">${mockAnalytics.avgTradeSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 mt-3">
                <span className="text-foreground/70">Total Fees</span>
                <span className="font-bold">${mockAnalytics.totalFees.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Performance */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Daily Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalytics.daily.map((day, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg">
                  <span className="text-sm font-medium text-foreground/70 w-24">{day.date}</span>
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-2 max-w-xs">
                      <div
                        className={`${day.pnl >= 0 ? 'bg-primary' : 'bg-destructive'} h-full rounded-full`}
                        style={{
                          width: `${Math.min(Math.abs((day.pnl / mockAnalytics.largestWin) * 100), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right w-32">
                    <p className={`font-bold ${day.pnl >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      ${day.pnl.toFixed(2)}
                    </p>
                    <p className="text-xs text-foreground/60">{day.trades} trades</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trade History */}
        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Trade History</CardTitle>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="px-3 py-1 rounded-lg bg-secondary border border-border text-sm text-foreground"
            >
              <option value="all">All Symbols</option>
              <option value="SOL">SOL</option>
              <option value="JUP">JUP</option>
              <option value="RAY">RAY</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Pair</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Entry</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Exit</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Order Type</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Duration</th>
                    <th className="text-right py-3 px-4 font-medium text-foreground/70">PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTradeHistory.map((trade) => (
                    <tr key={trade.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{trade.symbol}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          trade.type === 'LONG' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                        }`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground/70">${trade.entryPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-foreground/70">${trade.exitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-foreground/70">{trade.orderType}</td>
                      <td className="py-3 px-4 text-foreground/70">
                        {trade.duration < 60 ? `${trade.duration}m` : `${(trade.duration / 60).toFixed(0)}h`}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${
                        trade.pnl >= 0 ? 'text-primary' : 'text-destructive'
                      }`}>
                        ${trade.pnl.toFixed(2)} ({trade.pnlPercent.toFixed(2)}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Key Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Your win rate of <strong>{mockAnalytics.winRate.toFixed(1)}%</strong> is above market average, indicating strong trade selection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Average trade duration of <strong>{mockAnalytics.averageTradeDuration} minutes</strong> suggests a balanced swing trading strategy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Your profit factor of <strong>{mockAnalytics.profitFactor.toFixed(2)}</strong> indicates strong risk management with winning trades outpacing losses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Long positions account for <strong>{(mockAnalytics.longRatio * 100).toFixed(0)}%</strong> of your trades, showing a bullish bias in current market conditions</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
