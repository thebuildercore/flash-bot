'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Zap,
  Lock,
  Eye,
  TrendingDown,
  ArrowRight,
  Clock,
  DollarSign,
  Gauge,
} from 'lucide-react';
import { mockMarginPositions } from '@/lib/mock-data';

export default function ProtectionPage() {
  const [isProtectionActive, setIsProtectionActive] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    new Set(mockMarginPositions.filter((p) => p.isProtected).map((p) => p.id))
  );

  const togglePosition = (positionId: string) => {
    const newSelected = new Set(selectedPositions);
    if (newSelected.has(positionId)) {
      newSelected.delete(positionId);
    } else {
      newSelected.add(positionId);
    }
    setSelectedPositions(newSelected);
  };

  const protectedCount = selectedPositions.size;
  const criticalPositions = mockMarginPositions.filter((p) => p.protectionLevel === 'critical');
  const warningPositions = mockMarginPositions.filter((p) => p.protectionLevel === 'warning');

  const handleStartProtection = () => {
    setIsProtectionActive(true);
    // In real app, this would trigger protection activation
  };

  return (
    <>
      <DashboardHeader
        title="Liquidation Protection"
        subtitle="Automated monitoring and emergency actions for your positions"
      />

      <div className="p-8 space-y-8">
        {/* Status Alert */}
        {(criticalPositions.length > 0 || warningPositions.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6">
            {criticalPositions.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-1">Critical Alert</h3>
                    <p className="text-sm text-foreground/70 mb-3">
                      {criticalPositions.length} position{criticalPositions.length > 1 ? 's' : ''}{' '}
                      at risk of liquidation. Activate protection immediately.
                    </p>
                    <Button
                      onClick={handleStartProtection}
                      className="bg-destructive text-white hover:bg-destructive/90 text-sm"
                    >
                      Enable Protection Now
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {warningPositions.length > 0 && (
              <div className="bg-accent/10 border border-accent/50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-accent mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-accent mb-1">Warning</h3>
                    <p className="text-sm text-foreground/70 mb-3">
                      {warningPositions.length} position{warningPositions.length > 1 ? 's' : ''} with
                      declining health ratios. Consider increasing collateral or reducing borrowed
                      amount.
                    </p>
                    <Button variant="outline" className="border-accent text-accent text-sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Protection CTA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl"></div>
          <Card className="bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-primary/30 rounded-xl">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Wickguard Start Protection</CardTitle>
                    <p className="text-foreground/70">
                      Activate automated liquidation protection for your selected positions. We'll
                      monitor health ratios 24/7 and execute protective actions when needed.
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-card/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <p className="text-xs text-foreground/70">Monitoring</p>
                  </div>
                  <p className="font-semibold text-foreground">24/7 Health Check</p>
                </div>
                <div className="bg-card/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <p className="text-xs text-foreground/70">Emergency Action</p>
                  </div>
                  <p className="font-semibold text-foreground">Auto Withdraw</p>
                </div>
                <div className="bg-card/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <p className="text-xs text-foreground/70">Stop Loss</p>
                  </div>
                  <p className="font-semibold text-foreground">Automated Orders</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleStartProtection}
                  disabled={selectedPositions.size === 0}
                  size="lg"
                  className={`flex-1 ${
                    isProtectionActive
                      ? 'bg-primary/80 text-primary-foreground'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  {isProtectionActive ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Protection Active
                    </>
                  ) : (
                    <>Activate Protection</>
                  )}
                </Button>
                <Button variant="outline" className="border-border">
                  Configure Settings
                </Button>
              </div>

              {selectedPositions.size === 0 && (
                <p className="text-xs text-foreground/60 mt-4">
                  Select positions below to enable protection
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Protection Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protected Positions</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{protectedCount}</div>
              <p className="text-xs text-foreground/60 mt-1">
                Out of {mockMarginPositions.length} positions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Health Ratio</CardTitle>
              <Gauge className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  mockMarginPositions.reduce((sum, p) => sum + p.healthRatio, 0) /
                  mockMarginPositions.length
                ).toFixed(2)}
                x
              </div>
              <p className="text-xs text-foreground/60 mt-1">Safe: 1.5x+</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collateral</CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockMarginPositions.reduce((sum, p) => sum + p.collateral, 0).toFixed(0)}
              </div>
              <p className="text-xs text-foreground/60 mt-1">Protected value</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
              <TrendingDown className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockMarginPositions.reduce((sum, p) => sum + p.borrowed, 0).toFixed(0)}
              </div>
              <p className="text-xs text-foreground/60 mt-1">Active debt</p>
            </CardContent>
          </Card>
        </div>

        {/* Positions Grid */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Margin Positions</CardTitle>
                <p className="text-sm text-foreground/60 mt-1">
                  Select positions to enable Wickguard protection
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {mockMarginPositions.map((position) => {
                const isSelected = selectedPositions.has(position.id);
                const riskLevel =
                  position.healthRatio < 1.5
                    ? 'critical'
                    : position.healthRatio < 2
                      ? 'warning'
                      : 'safe';

                return (
                  <div
                    key={position.id}
                    onClick={() => togglePosition(position.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary'
                        : 'bg-card border-border hover:border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {position.token} Position
                        </h3>
                        <p className="text-xs text-foreground/60 mt-1">Marginifi</p>
                      </div>
                      {isSelected && (
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-4 p-4 bg-secondary/20 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground/70">Collateral</span>
                        <span className="font-semibold text-foreground">
                          ${position.collateral.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground/70">Borrowed</span>
                        <span className="font-semibold text-foreground">
                          ${position.borrowed.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground/70 text-sm">Health Ratio</span>
                          <span
                            className={`font-bold ${
                              riskLevel === 'safe'
                                ? 'text-primary'
                                : riskLevel === 'warning'
                                  ? 'text-accent'
                                  : 'text-destructive'
                            }`}
                          >
                            {position.healthRatio.toFixed(2)}x
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            riskLevel === 'safe'
                              ? 'bg-primary'
                              : riskLevel === 'warning'
                                ? 'bg-accent'
                                : 'bg-destructive'
                          }`}
                        ></div>
                        <span className="text-xs font-medium text-foreground/70">
                          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                        </span>
                      </div>
                      <span className="text-xs text-foreground/60">
                        Liquidation at ${position.liquidationPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>How Wickguard Protection Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  num: 1,
                  title: 'Continuous Monitoring',
                  desc: 'We monitor your position health 24/7, tracking collateral ratios and liquidation proximity.',
                  icon: Eye,
                },
                {
                  num: 2,
                  title: 'Smart Alerts',
                  desc: 'Get notified when health ratios approach dangerous levels with actionable recommendations.',
                  icon: Activity,
                },
                {
                  num: 3,
                  title: 'Automated Actions',
                  desc: 'Trigger stop-loss orders and emergency withdrawals based on your configured thresholds.',
                  icon: Zap,
                },
                {
                  num: 4,
                  title: 'Full Control',
                  desc: 'You maintain complete control - no funds at risk, only monitoring and alert capabilities.',
                  icon: Lock,
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Step {step.num}: {step.title}
                      </h4>
                      <p className="text-sm text-foreground/70">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Protection Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">
                    Health Ratio Alert Threshold
                  </label>
                  <span className="text-sm font-semibold text-primary">1.75x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  defaultValue="1.75"
                  className="w-full"
                />
                <p className="text-xs text-foreground/60 mt-2">
                  Alert triggered when health drops below this ratio
                </p>
              </div>

              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">
                    Auto Repay Enabled
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="mr-2" />
                  </label>
                </div>
                <p className="text-xs text-foreground/60">
                  Automatically repay borrowed amounts when health ratio is critical
                </p>
              </div>

              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">
                    Emergency Withdrawal Enabled
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="mr-2" />
                  </label>
                </div>
                <p className="text-xs text-foreground/60">
                  Withdraw excess collateral when positions become unbalanced
                </p>
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
