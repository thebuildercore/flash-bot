import { CheckCircle2, AlertCircle, AlertTriangle, Activity } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'danger' | 'info';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  isAnimated?: boolean;
}

export function StatusBadge({ status, label, isAnimated = false }: StatusBadgeProps) {
  const styles = {
    success: {
      bg: 'bg-primary/20',
      border: 'border-primary/50',
      text: 'text-primary',
      icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-accent/20',
      border: 'border-accent/50',
      text: 'text-accent',
      icon: AlertTriangle,
    },
    danger: {
      bg: 'bg-destructive/20',
      border: 'border-destructive/50',
      text: 'text-destructive',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-primary/20',
      border: 'border-primary/50',
      text: 'text-primary',
      icon: Activity,
    },
  };

  const style = styles[status];
  const Icon = style.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${style.bg} ${style.border}`}>
      <Icon className={`w-4 h-4 ${style.text} ${isAnimated ? 'animate-pulse' : ''}`} />
      <span className={`text-xs font-medium ${style.text}`}>{label}</span>
    </div>
  );
}
