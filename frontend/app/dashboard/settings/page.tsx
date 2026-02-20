'use client';

import { DashboardHeader } from '@/components/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Lock,
  Wallet,
  Eye,
  Shield,
  Save,
  LogOut,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <div className="p-8 space-y-8 max-w-4xl">
        {/* Wallet Connection */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Connected Wallet</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-secondary/20 rounded-lg mb-4">
              <p className="text-sm text-foreground/70 mb-2">Primary Wallet</p>
              <p className="font-mono text-sm text-foreground">
                8j4K...7mQp
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-border">
                Change Wallet
              </Button>
              <Button variant="outline" className="border-border">
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Bell className="w-5 h-5 text-accent" />
              </div>
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Health Alerts</p>
                <p className="text-xs text-foreground/60">Get notified when health drops</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Protection Events</p>
                <p className="text-xs text-foreground/60">Stop-loss and emergency actions</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Price Movements</p>
                <p className="text-xs text-foreground/60">Major price changes in portfolio</p>
              </div>
              <input type="checkbox" />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-xs text-foreground/60">Send alerts via email</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <Lock className="w-5 h-5 text-destructive" />
              </div>
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-3">API Key Security</p>
              <p className="text-xs text-foreground/70 mb-4">
                Wickguard never stores your private keys. We only require read-only API access to
                monitor your positions.
              </p>
              <Button variant="outline" className="border-border">
                View Key Requirements
              </Button>
            </div>

            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-3">Two-Factor Authentication</p>
              <p className="text-xs text-foreground/70 mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" className="border-border">
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Protection Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Protection Defaults</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Default Health Ratio Threshold
              </label>
              <select className="w-full p-2 bg-secondary/20 border border-border rounded-lg text-foreground">
                <option>1.5x (Very Safe)</option>
                <option selected>1.75x (Safe)</option>
                <option>2.0x (Moderate)</option>
                <option>2.5x (Conservative)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Auto Repay Threshold
              </label>
              <select className="w-full p-2 bg-secondary/20 border border-border rounded-lg text-foreground">
                <option>1.3x</option>
                <option selected>1.5x</option>
                <option>1.7x</option>
              </select>
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
              <Save className="w-4 h-4 mr-2" />
              Save Defaults
            </Button>
          </CardContent>
        </Card>

        {/* Marginifi Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <CardTitle>Marginifi Integration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Connection Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <p className="text-sm text-foreground/70">Connected & Monitoring</p>
              </div>
            </div>

            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Monitored Positions</p>
              <p className="text-sm text-foreground/70 mb-4">
                You have 3 active margin positions being monitored
              </p>
              <Button variant="outline" className="border-border">
                Manage Positions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-destructive/5 border border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-foreground/70 mb-4">
                These actions cannot be undone. Please proceed with caution.
              </p>
              <Button variant="outline" className="border-destructive text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect & Clear Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-foreground/60">
          <p>Wickguard v0.1.0 • Built on Solana</p>
        </div>
      </div>
    </>
  );
}
