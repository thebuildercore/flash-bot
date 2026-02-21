'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TerminalLog from '@/components/terminal-log'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield,
  TrendingUp,
  Zap,
  Lock,
  Eye,
  Gauge,
  ArrowRight,
  Sparkles,
  BarChart3,
  Activity,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Wickguard</span>
          </div>
          <div className="flex items-center gap-6">
 
  <Link href="/Technical_paper.pdf" target="_blank" className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hidden sm:block">
    Whitepaper
  </Link>
  <Link href="/execution_summary.pdf" target="_blank" className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors hidden sm:block">
    Execution Report
  </Link>
  {/* <Link href="/dashboard">

              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20">
                Launch App →
              </Button>
            </Link> */}

            <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20">
      Launch App →
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent className="border-border/50 bg-background/95 backdrop-blur-md">
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center gap-2">
        <span className="text-xl">🚧</span> Development Notice
      </AlertDialogTitle>
      <AlertDialogDescription className="text-foreground/70 leading-relaxed pt-2">
        WickGuard's core L2 execution engine is currently running on testnet. 
        The following dashboard visualizes the protocol's mechanics using <strong>mock data</strong> for demonstration purposes and does not yet reflect real-time on-chain state.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className="mt-6">
      <AlertDialogCancel className="border-border/50 hover:bg-secondary/50">Cancel</AlertDialogCancel>
      <Link href="/dashboard">
        <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
          Proceed to Dashboard
        </AlertDialogAction>
      </Link>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-8 hover:border-primary/50 transition-all">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/90 font-medium">
               Running on MagicBlock Ephemeral Rollups
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-bold mb-6 leading-tight">
            Your Margin Positions, 
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
              Always Protected
            </span>
          </h1>

          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-10 leading-relaxed">
            Wickguard uses continuous control theory loops running on MagicBlock L2 to detect and prevent liquidations 
            before they happen. 1014ms execution time. Jupiter price feeds. Zero RPC congestion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105 active:scale-95 transition-all group"
              >
                Wickguard Start Protection
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
              </Button>
            </Link>
            <Link href = "https://drive.google.com/file/d/1cclYtWghTHckaHXYo5hovb2lKjR0MjOC/view?usp=sharing">
            <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary/50 hover:bg-primary/5">
              View Demo (V 1.0)
            </Button>
            </Link>
             <a
    href="https://x.com/flash__bot?s=09"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button size="lg" className="bg-primary hover:bg-primary/90">
      Join Waitlist
    </Button>
  </a>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12 p-8 bg-card/30 rounded-2xl border border-border/50">
            <div>
              <p className="text-3xl font-bold text-primary mb-1">1014ms</p>
              <p className="text-xs text-foreground/60">L2 Execution</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent mb-1">∞</p>
              <p className="text-xs text-foreground/60">Liquidations Prevented</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-1">24/7</p>
              <p className="text-xs text-foreground/60">Monitoring</p>
            </div>
          </div>

          {/* Hero Showcase Card */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-card to-card/80 border border-primary/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
              <div className="space-y-4">
                {/* Position Card */}
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="font-medium text-sm">SOL/USDC Position</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-foreground/60">Health: 2.18x</span>
                      <div className="w-32 h-2 bg-secondary rounded-full">
                        <div className="w-2/3 h-full bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      </div>
                      <span className="text-xs text-primary font-bold">Safe</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-all">
                    Protected ✓
                  </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Collateral', value: '$3,633.75' },
                    { label: 'Borrowed', value: '$2,000' },
                    { label: 'Liquidation Price', value: '$118.42' },
                  ].map((metric) => (
                    <div key={metric.label} className="p-3 bg-secondary/10 rounded-lg border border-border/30">
                      <p className="text-xs text-foreground/60 mb-1">{metric.label}</p>
                      <p className="font-bold text-sm text-foreground">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Advanced Trading Intelligence</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Everything traders need in one unified platform with MagicBlock speed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="bg-card/60 border-border/50 hover:border-primary/50 hover:bg-card transition-all group cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 group-hover:bg-primary/20 rounded-lg transition-all">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Liquidation Protection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Control theory driven automation. Detects liquidation risk and executes protection 
                  instantly on MagicBlock L2 at 1014ms.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-card/60 border-border/50 hover:border-accent/50 hover:bg-card transition-all group cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-accent/10 group-hover:bg-accent/20 rounded-lg transition-all">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Jupiter Price Feeds</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time price data with sub-second updates. Never miss market movements with 
                  Jupiter's leading DEX aggregator.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-card/60 border-border/50 hover:border-primary/50 hover:bg-card transition-all group cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 group-hover:bg-primary/20 rounded-lg transition-all">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Advanced Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Total PnL tracking, win rates, drawdown analysis, fee breakdowns, trade history, 
                  and symbol-specific performance metrics.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-card/60 border-border/50 hover:border-accent/50 hover:bg-card transition-all group cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-accent/10 group-hover:bg-accent/20 rounded-lg transition-all">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Instant Execution</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  No RPC failures. No gas wars. MagicBlock Ephemeral Rollups ensure your protection 
                  activates instantly and reliably.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-card/60 border-border/50 hover:border-primary/50 hover:bg-card transition-all group cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 group-hover:bg-primary/20 rounded-lg transition-all">
                    <Gauge className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Health Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time health ratio tracking with alerts before reaching critical levels. Position 
                  visualization with liquidation price indicators.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-card/60 border-border/50 hover:border-accent/50 hover:bg-card transition-all group cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-accent/10 group-hover:bg-accent/20 rounded-lg transition-all">
                    <Lock className="w-5 h-5 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Non-Custodial</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your keys, your funds. Smart contract audited with MagicBlock validation. We never 
                  access your funds, only monitor your positions.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4">How Wickguard Works</h2>
          <p className="text-center text-foreground/70 text-lg mb-16 max-w-2xl mx-auto">
            Continuous monitoring powered by control theory equations, executed at lightning speed on MagicBlock
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { 
                num: '1', 
                title: 'Monitor', 
                desc: 'Continuous real-time monitoring of your margin positions and health ratios',
                icon: '👁️'
              },
              { 
                num: '2', 
                title: 'Detect', 
                desc: 'Hamilton-Jacobi-Bellman equations detect liquidation risk instantly',
                icon: '⚡'
              },
              { 
                num: '3', 
                title: 'Execute', 
                desc: 'Automatic execution on MagicBlock L2 in 1014ms with zero congestion',
                icon: '🚀'
              },
              { 
                num: '4', 
                title: 'Protect', 
                desc: 'Your position is secured before liquidators can react',
                icon: '🛡️'
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 text-2xl font-bold text-background transform hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-lg text-center mb-2">{step.title}</h3>
                  <p className="text-foreground/70 text-sm text-center">{step.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-7 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-accent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protection Highlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-secondary/10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 border border-primary/40 rounded-2xl p-12 backdrop-blur-sm">
            <div className="flex gap-6 items-start">
              <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-lg shrink-0">
                <Shield className="w-8 h-8 text-background" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-3">Wickguard Start Protection</h3>
                <p className="text-foreground/70 mb-8 leading-relaxed">
                  Our flagship feature automatically activates liquidation protection. Stop-loss orders, emergency withdrawals, 
                  and health ratio management all handled by control theory algorithms running on MagicBlock. 
                  One button. Instant protection. Peace of mind.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard">

                    <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transform hover:scale-105 active:scale-95 transition-all">
                      Wickguard Start Protection →
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-primary/30 hover:border-primary/50">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4">
            Stop Worrying About <span className="text-primary">Liquidations</span>
          </h2>
          <p className="text-foreground/70 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
            Wickguard handles the math. You focus on trading strategy. 
            Automatic protection powered by control theory and MagicBlock speed.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105 active:scale-95 transition-all text-lg"
            >
              Wickguard Start Protection →
            </Button>
          </Link>
        </div>
      </section>

{/* Proof of Execution Section (Terminal Log) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-[#09090b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm text-emerald-400 font-mono font-medium">
                Live Testnet Simulation Logs
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Proof of Execution</h2>
            <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
              Real terminal output demonstrating our HJB+PID controller filtering a flash crash and successfully executing 11 fractional deleveraging transactions on MagicBlock L2.
            </p>
          </div>
          
          {/* Your new terminal component! */}
          <TerminalLog />
          
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
                  <Shield className="w-4 h-4 text-background" />
                </div>
                <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Wickguard</span>
              </div>
              <p className="text-sm text-foreground/60">
                Liquidation protection for Solana margin traders on Marginifi
              </p>
            </div>
            <div>
              <p className="font-bold text-foreground mb-3">Product</p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-primary transition">Dashboard</a></li>
                <li><a href="#" className="hover:text-primary transition">Features</a></li>
                <li><a href="#" className="hover:text-primary transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-foreground mb-3">Resources</p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition">Status</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-foreground mb-3">Community</p>
              {/* <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="https://x.com/flash__bot?s=09" className="hover:text-primary transition">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition">GitHub</a></li>
              </ul> */}
              <ul className="space-y-2 text-sm text-foreground/60">
  <li>
    <a 
      href="https://x.com/flash__bot?s=09" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="hover:text-primary transition"
    >
      Twitter
    </a>
  </li>
  <li>
    <a 
      href="https://discord.gg/YOUR_DISCORD_INVITE" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="hover:text-primary transition"
    >
      Discord
    </a>
  </li>
  <li>
    <a 
      href="https://github.com/thebuildercore/flash-bot" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="hover:text-primary transition"
    >
      GitHub
    </a>
  </li>
</ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-foreground/60 text-sm">
            <p>Wickguard © 2026. Liquidation Protection on Solana. Powered by MagicBlock Ephemeral Rollups. </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
