import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveIndicatorProps {
  lastUpdate: Date;
  isRefreshing: boolean;
  refreshInterval: number;
  className?: string;
}

export function LiveIndicator({ 
  lastUpdate, 
  isRefreshing, 
  refreshInterval,
  className 
}: LiveIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-full bg-muted/50 border border-border/50',
        className
      )}
    >
      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-success" />
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping" />
      </div>
      
      <span className="text-sm text-muted-foreground">
        Last updated: <span className="font-mono">{formatTime(lastUpdate)}</span>
      </span>
      
      <div className="h-4 w-px bg-border" />
      
      <span className="text-xs text-muted-foreground">
        Refreshes every {refreshInterval}s
      </span>
      
      <RefreshCw 
        className={cn(
          'w-4 h-4 text-muted-foreground transition-transform',
          isRefreshing && 'animate-spin text-primary'
        )} 
      />
    </motion.div>
  );
}
