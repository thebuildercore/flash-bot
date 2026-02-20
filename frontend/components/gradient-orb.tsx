export function GradientOrb({
  color = 'primary',
  size = 'md',
  blur = '3xl',
  opacity = 'opacity-30',
  className = '',
}: {
  color?: 'primary' | 'accent' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  blur?: 'xl' | '2xl' | '3xl';
  opacity?: string;
  className?: string;
}) {
  const sizeMap = {
    sm: 'w-40 h-40',
    md: 'w-64 h-64',
    lg: 'w-80 h-80',
    xl: 'w-96 h-96',
  };

  const colorMap = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    secondary: 'bg-secondary',
  };

  return (
    <div
      className={`absolute rounded-full ${sizeMap[size]} ${colorMap[color]} blur-${blur} ${opacity} pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
