import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, AlertTriangle, Clock, Cloud, Target, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DemandPrediction, InventoryItem, WeatherData } from '@/lib/warehouse-data';
import { cn } from '@/lib/utils';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  prediction: DemandPrediction | null;
  weather: WeatherData | null;
}

export function PredictionModal({
  isOpen,
  onClose,
  item,
  prediction,
  weather,
}: PredictionModalProps) {
  if (!item || !prediction) return null;

  const riskStyles = {
    low: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/30' },
    medium: { bg: 'bg-chart-2/20', text: 'text-chart-2', border: 'border-chart-2/30' },
    high: { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/30' },
    critical: { bg: 'bg-danger/20', text: 'text-danger', border: 'border-danger/30' },
  };

  const style = riskStyles[prediction.riskLevel];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="glass-card w-full max-w-lg rounded-2xl border border-border/50 shadow-2xl overflow-hidden relative my-auto max-h-[90vh] overflow-y-auto">
              {/* Close Button - Top Right */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 hover:bg-destructive/20 hover:text-destructive"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </Button>
              
              {/* Header */}
              <div className="p-6 border-b border-border/50 pr-14">
                <h2 className="text-xl font-semibold">Demand Prediction</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  AI-powered analysis for {item.sku}
                </p>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Product Info */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="font-mono text-primary text-sm">{item.sku}</p>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Current Stock</p>
                    <p className="font-mono text-2xl font-bold">{item.currentStock}</p>
                  </div>
                </div>
                
                {/* Prediction Results */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Predicted Demand</span>
                    </div>
                    <p className="font-mono text-3xl font-bold text-primary">
                      {prediction.predictedDemand}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">units/day</p>
                  </div>
                  
                  <div className={cn('p-4 rounded-lg border', style.bg, style.border)}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={cn('w-4 h-4', style.text)} />
                      <span className="text-sm text-muted-foreground">Stockout Risk</span>
                    </div>
                    <p className={cn('font-mono text-3xl font-bold', style.text)}>
                      {(prediction.stockoutProbability * 100).toFixed(0)}%
                    </p>
                    <p className={cn('text-xs mt-1 capitalize', style.text)}>
                      {prediction.riskLevel} risk
                    </p>
                  </div>
                </div>
                
                {/* Time Factors */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Time Factors Used</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hour of Day</span>
                      <span className="font-mono">{prediction.timeFactors.hourOfDay}:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Day</span>
                      <span className="font-mono">{prediction.timeFactors.dayOfWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weekend</span>
                      <span className="font-mono">{prediction.timeFactors.isWeekend ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Season</span>
                      <span className="font-mono capitalize">{prediction.timeFactors.season}</span>
                    </div>
                  </div>
                </div>
                
                {/* Weather Impact */}
                {weather && (
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Cloud className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Weather Impact</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{weather.icon}</span>
                        <div>
                          <p className="font-medium capitalize">{weather.condition}</p>
                          <p className="text-sm text-muted-foreground">
                            {weather.temperature}°C, {weather.humidity}% humidity
                          </p>
                        </div>
                      </div>
                      <div className={cn(
                        'px-3 py-1 rounded-full font-mono font-medium',
                        prediction.weatherImpact > 0 ? 'bg-success/20 text-success' :
                        prediction.weatherImpact < 0 ? 'bg-warning/20 text-warning' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {prediction.weatherImpact > 0 ? '+' : ''}{prediction.weatherImpact}%
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Confidence */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-accent" />
                    <span className="text-sm">Model Confidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                    <span className="font-mono text-sm">
                      {(prediction.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-border/50 bg-muted/30 flex items-center justify-between">
                {/* <p className="text-xs text-muted-foreground">
                  Prediction generated using Random Forest model
                </p> */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
