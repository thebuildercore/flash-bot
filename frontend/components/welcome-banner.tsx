'use client';

import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/50 rounded-full py-3 px-6 flex items-center gap-3 shadow-lg backdrop-blur-sm">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          Welcome to Wickguard - Protection for your margin positions
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 text-foreground/60 hover:text-foreground transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
