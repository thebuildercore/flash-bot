import { useState, useCallback } from 'react';
import { LiquidationProtection } from '@/lib/types';

const defaultProtection: LiquidationProtection = {
  isActive: false,
  autoRepayEnabled: true,
  emergencyWithdrawEnabled: true,
  healthRatioThreshold: 1.75,
};

export function useProtectionState() {
  const [protection, setProtection] = useState<LiquidationProtection>(defaultProtection);

  const startProtection = useCallback(() => {
    setProtection((prev) => ({
      ...prev,
      isActive: true,
      startedAt: new Date(),
    }));
  }, []);

  const stopProtection = useCallback(() => {
    setProtection((prev) => ({
      ...prev,
      isActive: false,
    }));
  }, []);

  const updateThreshold = useCallback((threshold: number) => {
    setProtection((prev) => ({
      ...prev,
      healthRatioThreshold: threshold,
    }));
  }, []);

  const toggleAutoRepay = useCallback(() => {
    setProtection((prev) => ({
      ...prev,
      autoRepayEnabled: !prev.autoRepayEnabled,
    }));
  }, []);

  const toggleEmergencyWithdraw = useCallback(() => {
    setProtection((prev) => ({
      ...prev,
      emergencyWithdrawEnabled: !prev.emergencyWithdrawEnabled,
    }));
  }, []);

  return {
    protection,
    startProtection,
    stopProtection,
    updateThreshold,
    toggleAutoRepay,
    toggleEmergencyWithdraw,
  };
}
