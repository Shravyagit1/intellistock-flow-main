import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  value: number; // 0-100
  label: string;
  className?: string;
}

export function RiskGauge({ value, label, className }: RiskGaugeProps) {
  // Clamp value between 0-100
  const clampedValue = Math.max(0, Math.min(100, value));
  
  // Calculate rotation angle (-135 to 135 degrees = 270 degree arc)
  const angle = -135 + (clampedValue / 100) * 270;
  
  // Determine color based on risk level
  let color = 'hsl(var(--success))';
  let bgGradient = 'from-success/20 to-success/5';
  let riskLabel = 'Low Risk';
  
  if (clampedValue >= 75) {
    color = 'hsl(var(--danger))';
    bgGradient = 'from-danger/20 to-danger/5';
    riskLabel = 'Critical';
  } else if (clampedValue >= 50) {
    color = 'hsl(var(--warning))';
    bgGradient = 'from-warning/20 to-warning/5';
    riskLabel = 'High Risk';
  } else if (clampedValue >= 25) {
    color = 'hsl(160, 84%, 50%)';
    bgGradient = 'from-chart-2/20 to-chart-2/5';
    riskLabel = 'Medium';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'glass-card p-6 rounded-xl border border-border/50',
        className
      )}
    >
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        {label}
      </h3>
      
      <div className="relative w-48 h-28 mx-auto">
        {/* Background arc */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 110"
        >
          {/* Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Gradient stops */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--success))" />
              <stop offset="50%" stopColor="hsl(var(--warning))" />
              <stop offset="100%" stopColor="hsl(var(--danger))" />
            </linearGradient>
          </defs>
          
          {/* Progress arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 - (251.2 * clampedValue / 100) }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{ width: '4px', height: '70px', marginLeft: '-2px' }}
          initial={{ rotate: -135 }}
          animate={{ rotate: angle }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{ 
              background: `linear-gradient(to top, ${color}, transparent)`,
              boxShadow: `0 0 10px ${color}`
            }}
          />
          <div 
            className="absolute bottom-0 left-1/2 w-4 h-4 -ml-2 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
          />
        </motion.div>
        
        {/* Center value */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 text-center">
          <motion.span
            key={clampedValue}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-bold font-mono tabular-nums"
            style={{ color }}
          >
            {clampedValue.toFixed(1)}%
          </motion.span>
        </div>
      </div>
      
      {/* Risk label */}
      <div className={cn(
        'mt-6 text-center py-2 px-4 rounded-full bg-gradient-to-r mx-auto w-fit',
        bgGradient
      )}>
        <span className="text-sm font-medium" style={{ color }}>
          {riskLabel}
        </span>
      </div>
    </motion.div>
  );
}
