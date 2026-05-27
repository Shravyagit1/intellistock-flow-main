import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
//import { TrendingUp, Cloud, Zap, Target } from 'lucide-react';
import { Cloud, Target } from 'lucide-react';

import { MainLayout } from '@/components/layout/MainLayout';
import { WeatherPanel } from '@/components/dashboard/WeatherPanel';
import { InventoryChart } from '@/components/dashboard/InventoryChart';
// import { RiskGauge } from '@/components/dashboard/RiskGauge';
import { supabase } from '@/integrations/supabase/client';
import { generateSalesHistory, WeatherData, DashboardStats } from '@/lib/warehouse-data';

const REFRESH_INTERVAL = 30;

function mapCondition(condition: string): 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' {
  const lower = condition.toLowerCase();
  if (lower.includes('clear') || lower.includes('sunny')) return 'clear';
  if (lower.includes('cloud')) return 'cloudy';
  if (lower.includes('rain') || lower.includes('drizzle')) return 'rain';
  if (lower.includes('storm') || lower.includes('thunder')) return 'storm';
  if (lower.includes('snow')) return 'snow';
  return 'clear';
}

function getWeatherIcon(condition: string): string {
  const mapped = mapCondition(condition);
  const icons: Record<string, string> = {
    clear: '☀️',
    cloudy: '☁️',
    rain: '🌧️',
    storm: '⛈️',
    snow: '❄️',
  };
  return icons[mapped];
}

export default function DemandForecast() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState(generateSalesHistory(7));
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('weather-prediction');
      if (error) throw error;

      if (data.success) {
        setWeather({
          city: data.weather.city,
          temperature: data.weather.temperature,
          humidity: data.weather.humidity,
          condition: mapCondition(data.weather.condition),
          windSpeed: data.weather.windSpeed,
          feelsLike: data.weather.feelsLike,
          icon: getWeatherIcon(data.weather.condition),
        });

        setStats({
          totalItems: data.stats.totalItems,
          totalValue: data.stats.totalValue,
          lowStockItems: data.stats.highRiskItems + data.stats.mediumRiskItems,
          criticalItems: data.stats.highRiskItems,
          averageStockLevel: 100 - data.stats.stockoutRiskPercent,
          stockoutRisk: data.stats.stockoutRiskPercent,
          reorderNeeded: data.stats.highRiskItems,
          healthyItems: data.stats.lowRiskItems,
        });

        setSalesData(generateSalesHistory(7));
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <MainLayout lastUpdate={lastUpdate} isRefreshing={isRefreshing} refreshInterval={REFRESH_INTERVAL}>
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Demand Forecast</h1>
          <p className="text-muted-foreground">Weather-driven demand predictions using ML models</p>
        </div>

        {/* Weather Impact Section */}
        <div className="grid grid-cols-1 gap-6">
          {weather && <WeatherPanel weather={weather} />}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-1/20">
                <Cloud className="w-5 h-5 text-chart-1" />
              </div>
              <h3 className="font-semibold">Weather Impact</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Temperature Effect</span>
                <span className="font-mono font-medium text-chart-1">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Humidity Effect</span>
                <span className="font-mono font-medium text-chart-2">-5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Condition Effect</span>
                <span className="font-mono font-medium capitalize">{weather?.condition || '--'}</span>
              </div>
            </div>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-3/20">
                <Target className="w-5 h-5 text-chart-3" />
              </div>
              <h3 className="font-semibold">Model Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">R² Score</span>
                <span className="font-mono font-medium text-success">0.94</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Classification</span>
                <span className="font-mono font-medium text-success">92.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Top Feature</span>
                <span className="font-mono font-medium text-primary">Stock Ratio</span>
              </div>
            </div>
          </motion.div> */}
        </div>

        {/* Charts */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InventoryChart data={salesData} className="lg:col-span-2" />
          <RiskGauge value={stats?.stockoutRisk || 0} label="Overall Stockout Risk" />
        </div> */}
        <div className="grid grid-cols-1 gap-6">
  <InventoryChart data={salesData} />
</div>

        {/* Demand Insights */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Demand Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-3xl font-bold text-primary">{stats?.averageStockLevel || 0}%</p>
              <p className="text-sm text-muted-foreground mt-1">Average Stock Level</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-3xl font-bold text-warning">{stats?.lowStockItems || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Items Need Attention</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-3xl font-bold text-success">{stats?.healthyItems || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Healthy Stock Items</p>
            </div>
          </div>
        </motion.div> */}
      </div>
    </MainLayout>
  );
}
