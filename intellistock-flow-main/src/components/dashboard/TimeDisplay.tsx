import { motion } from 'framer-motion';
import { Clock, Calendar, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeDisplayProps {
  className?: string;
}

export function TimeDisplay({ className }: TimeDisplayProps) {
  const now = new Date();
  const hour = now.getHours();
  
  let timeOfDay: string;
  let TimeIcon: typeof Sun;
  let bgGradient: string;
  
  if (hour >= 6 && hour < 12) {
    timeOfDay = 'Morning';
    TimeIcon = Sunrise;
    bgGradient = 'from-amber-500/20 to-orange-500/10';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'Afternoon';
    TimeIcon = Sun;
    bgGradient = 'from-yellow-500/20 to-amber-500/10';
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'Evening';
    TimeIcon = Sunset;
    bgGradient = 'from-purple-500/20 to-pink-500/10';
  } else {
    timeOfDay = 'Night';
    TimeIcon = Moon;
    bgGradient = 'from-indigo-500/20 to-blue-500/10';
  }

  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'glass-card p-4 rounded-xl border border-border/50 bg-gradient-to-br',
        bgGradient,
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-background/50">
          <TimeIcon className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
              {formattedTime}
            </span>
            <span className="text-sm text-muted-foreground">{timeOfDay}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
            {isWeekend && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                Weekend
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
