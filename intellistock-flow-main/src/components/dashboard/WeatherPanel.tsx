import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
import { WeatherData } from '@/lib/warehouse-data';
import { cn } from '@/lib/utils';

interface WeatherPanelProps {
  weather: WeatherData;
  className?: string;
}

export function WeatherPanel({ weather, className }: WeatherPanelProps) {
  const conditionColors = {
    clear: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    cloudy: 'from-slate-400/20 to-slate-500/20 border-slate-400/30',
    rain: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    storm: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30',
    snow: 'from-cyan-200/20 to-blue-200/20 border-cyan-200/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'glass-card p-6 rounded-xl border bg-gradient-to-br',
        conditionColors[weather.condition],
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Weather Conditions
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{weather.city}</p>
        </div>
        <div className="relative">
          <span className="text-4xl">{weather.icon}</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full pulse-live" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Temperature</span>
          </div>
          <span className="text-2xl font-bold font-mono">{weather.temperature}°C</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-chart-1" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-mono font-medium">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-chart-2" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-mono font-medium">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm capitalize text-muted-foreground">
              {weather.condition}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              Feels like {weather.feelsLike}°C
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
