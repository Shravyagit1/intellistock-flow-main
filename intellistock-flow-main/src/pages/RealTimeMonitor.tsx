// import { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import { Activity, Wifi, Database, Server, RefreshCw, AlertCircle } from 'lucide-react';
// import { MainLayout } from '@/components/layout/MainLayout';
// import { TimeDisplay } from '@/components/dashboard/TimeDisplay';
// import { WeatherPanel } from '@/components/dashboard/WeatherPanel';
// import { supabase } from '@/integrations/supabase/client';
// import { WeatherData } from '@/lib/warehouse-data';

// const REFRESH_INTERVAL = 10;

// function mapCondition(condition: string): 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' {
//   const lower = condition.toLowerCase();
//   if (lower.includes('clear') || lower.includes('sunny')) return 'clear';
//   if (lower.includes('cloud')) return 'cloudy';
//   if (lower.includes('rain') || lower.includes('drizzle')) return 'rain';
//   if (lower.includes('storm') || lower.includes('thunder')) return 'storm';
//   if (lower.includes('snow')) return 'snow';
//   return 'clear';
// }

// function getWeatherIcon(condition: string): string {
//   const mapped = mapCondition(condition);
//   const icons: Record<string, string> = {
//     clear: '☀️',
//     cloudy: '☁️',
//     rain: '🌧️',
//     storm: '⛈️',
//     snow: '❄️',
//   };
//   return icons[mapped];
// }

// export default function RealTimeMonitor() {
//   const [weather, setWeather] = useState<WeatherData | null>(null);
//   const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [apiConnected, setApiConnected] = useState(false);
//   const [requestCount, setRequestCount] = useState(0);

//   const fetchData = useCallback(async () => {
//     setIsRefreshing(true);
//     try {
//       const { data, error } = await supabase.functions.invoke('weather-prediction');
//       if (error) throw error;

//       if (data.success) {
//         setApiConnected(true);
//         setWeather({
//           city: data.weather.city,
//           temperature: data.weather.temperature,
//           humidity: data.weather.humidity,
//           condition: mapCondition(data.weather.condition),
//           windSpeed: data.weather.windSpeed,
//           feelsLike: data.weather.feelsLike,
//           icon: getWeatherIcon(data.weather.condition),
//         });
//         setLastUpdate(new Date());
//         setRequestCount(prev => prev + 1);
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setApiConnected(false);
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, REFRESH_INTERVAL * 1000);
//     return () => clearInterval(interval);
//   }, [fetchData]);

//   return (
//     <MainLayout lastUpdate={lastUpdate} isRefreshing={isRefreshing} refreshInterval={REFRESH_INTERVAL}>
//       <div className="container mx-auto px-6 py-8 space-y-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gradient-primary">Real-Time Monitor</h1>
//           <p className="text-muted-foreground">Live system status and data feeds</p>
//         </div>

//         {/* Live Time and Weather */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <TimeDisplay className="lg:col-span-2" />
//           {weather && <WeatherPanel weather={weather} />}
//         </div>

//         {/* System Status */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="glass-card p-6 rounded-xl border border-border/50"
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <div className={`p-2 rounded-lg ${apiConnected ? 'bg-success/20' : 'bg-danger/20'}`}>
//                 <Wifi className={`w-5 h-5 ${apiConnected ? 'text-success' : 'text-danger'}`} />
//               </div>
//               <div>
//                 <h3 className="font-semibold">Weather Live</h3>
//                 <p className={`text-sm ${apiConnected ? 'text-success' : 'text-danger'}`}>
//                   {apiConnected ? 'Connected' : 'Disconnected'}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-success pulse-live' : 'bg-danger'}`} />
//               <span className="text-sm text-muted-foreground">Bangalore Live</span>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="glass-card p-6 rounded-xl border border-border/50"
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 rounded-lg bg-success/20">
//                 <Database className="w-5 h-5 text-success" />
//               </div>
//               <div>
//                 <h3 className="font-semibold">ML Model</h3>
//                 <p className="text-sm text-success">Active</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="w-2 h-2 rounded-full bg-success pulse-live" />
//               <span className="text-sm text-muted-foreground">Random Forest</span>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="glass-card p-6 rounded-xl border border-border/50"
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 rounded-lg bg-success/20">
//                 <Server className="w-5 h-5 text-success" />
//               </div>
//               <div>
//                 <h3 className="font-semibold">Edge Function</h3>
//                 <p className="text-sm text-success">Running</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="w-2 h-2 rounded-full bg-success pulse-live" />
//               <span className="text-sm text-muted-foreground">weather-prediction</span>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="glass-card p-6 rounded-xl border border-border/50"
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 rounded-lg bg-chart-1/20">
//                 <RefreshCw className={`w-5 h-5 text-chart-1 ${isRefreshing ? 'animate-spin' : ''}`} />
//               </div>
//               <div>
//                 <h3 className="font-semibold">Refresh Rate</h3>
//                 <p className="text-sm text-muted-foreground">{REFRESH_INTERVAL}s interval</p>
//               </div>
//             </div>
//             <div className="text-2xl font-bold font-mono text-chart-1">{requestCount}</div>
//             <span className="text-xs text-muted-foreground">Requests this session</span>
//           </motion.div>
//         </div>

//         {/* Activity Log */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="glass-card p-6 rounded-xl border border-border/50"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 rounded-lg bg-primary/20">
//               <Activity className="w-5 h-5 text-primary" />
//             </div>
//             <h3 className="font-semibold">Live Activity Log</h3>
//           </div>
//           <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
//             {[...Array(10)].map((_, idx) => {
//               const time = new Date(Date.now() - idx * 30000);
//               return (
//                 <div key={idx} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/20 text-sm">
//                   <span className="w-2 h-2 rounded-full bg-success" />
//                   <span className="font-mono text-muted-foreground">
//                     {time.toLocaleTimeString()}
//                   </span>
//                   <span>
//                     {idx === 0 ? 'Weather data refreshed' :
//                      idx === 1 ? 'Demand predictions updated' :
//                      idx === 2 ? 'Stockout risk recalculated' :
//                      `System heartbeat check #${10 - idx}`}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </motion.div>

//         {/* Alerts */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="glass-card p-6 rounded-xl border border-warning/30"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 rounded-lg bg-warning/20">
//               <AlertCircle className="w-5 h-5 text-warning" />
//             </div>
//             <h3 className="font-semibold">Active Alerts</h3>
//           </div>
//           <div className="space-y-2">
//             <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-warning/10 border border-warning/20">
//               <span className="text-sm">Zone D capacity at 97.5%</span>
//               <span className="text-xs text-warning">High Priority</span>
//             </div>
//             <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/20 border border-border/30">
//               <span className="text-sm">3 items below reorder point</span>
//               <span className="text-xs text-muted-foreground">Medium Priority</span>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </MainLayout>
//   );
// }


import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Wifi, Database, Server, RefreshCw, AlertCircle, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TimeDisplay } from '@/components/dashboard/TimeDisplay';
import { WeatherPanel } from '@/components/dashboard/WeatherPanel';
import { WeatherData, inventoryItems, simulateInventoryUpdate, calculateKPIs, generateDemandForecast, InventoryItem } from '@/lib/warehouse-data';

const REFRESH_INTERVAL = 10;

export default function RealTimeMonitor() {
  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [weather, setWeather] = useState<WeatherData>({
    city: 'Bangalore',
    temperature: 28,
    humidity: 65,
    condition: 'cloudy',
    windSpeed: 12,
    feelsLike: 30,
    icon: '☁️',
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);
  const [requestCount, setRequestCount] = useState(0);
  const [demandForecast, setDemandForecast] = useState(generateDemandForecast());
  
  // Live KPIs
  const kpis = useMemo(() => calculateKPIs(items), [items]);

  const fetchData = useCallback(() => {
    setIsRefreshing(true);
    // Simulate API call with random weather variation
    setTimeout(() => {
      const conditions: Array<{ condition: WeatherData['condition']; icon: string }> = [
        { condition: 'clear', icon: '☀️' },
        { condition: 'cloudy', icon: '☁️' },
        { condition: 'rain', icon: '🌧️' },
      ];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      setWeather(prev => ({
        ...prev,
        temperature: Math.round(25 + Math.random() * 10),
        humidity: Math.round(50 + Math.random() * 30),
        windSpeed: Math.round(5 + Math.random() * 15),
        feelsLike: Math.round(26 + Math.random() * 8),
        ...randomCondition,
      }));
      
      // Simulate live inventory updates
      setItems(prev => simulateInventoryUpdate(prev));
      
      // Update demand forecast
      setDemandForecast(generateDemandForecast());
      
      setLastUpdate(new Date());
      setRequestCount(prev => prev + 1);
      setIsRefreshing(false);
    }, 300);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Generate live activity log
  const activityLog = useMemo(() => {
    return Array.from({ length: 10 }, (_, idx) => {
      const time = new Date(Date.now() - idx * 30000);
      const activities = [
        'Weather data refreshed',
        'Demand predictions updated',
        'Stockout risk recalculated',
        'Inventory levels synced',
        'ML model inference complete',
        'Alert thresholds checked',
      ];
      return {
        time,
        message: idx < 3 ? activities[idx] : `System heartbeat check #${10 - idx}`,
      };
    });
  }, [requestCount]);

  return (
    <MainLayout lastUpdate={lastUpdate} isRefreshing={isRefreshing} refreshInterval={REFRESH_INTERVAL}>
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">Real-Time Monitor</h1>
            <p className="text-muted-foreground">Live system status and data feeds</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success pulse-live" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Live Time and Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TimeDisplay className="lg:col-span-2" />
          <WeatherPanel weather={weather} />
        </div>

        {/* Live KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-chart-1" />
              <span className="text-xs text-muted-foreground">Healthy Items</span>
            </div>
            <p className="text-2xl font-bold text-success">{kpis.healthyItems.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{kpis.healthPercent}% of total</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Low Stock</span>
            </div>
            <p className="text-2xl font-bold text-warning">{kpis.warningItems.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{kpis.warningPercent}% of total</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-danger" />
              <span className="text-xs text-muted-foreground">Critical</span>
            </div>
            <p className="text-2xl font-bold text-danger">{kpis.criticalItems.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{kpis.criticalPercent}% of total</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-chart-2" />
              <span className="text-xs text-muted-foreground">Avg Demand</span>
            </div>
            <p className="text-2xl font-bold">{Math.round(kpis.avgDemandRate)}</p>
            <p className="text-xs text-muted-foreground">units/day</p>
          </motion.div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 gap-6">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${apiConnected ? 'bg-success/20' : 'bg-danger/20'}`}>
                <Wifi className={`w-5 h-5 ${apiConnected ? 'text-success' : 'text-danger'}`} />
              </div>
              <div>
                <h3 className="font-semibold">Weather Live</h3>
                <p className={`text-sm ${apiConnected ? 'text-success' : 'text-danger'}`}>
                  {apiConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-success pulse-live' : 'bg-danger'}`} />
              <span className="text-sm text-muted-foreground">Bangalore Live</span>
            </div>
          </motion.div> */}

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-success/20">
                <Database className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">ML Model</h3>
                <p className="text-sm text-success">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success pulse-live" />
              <span className="text-sm text-muted-foreground">Random Forest</span>
            </div>
          </motion.div> */}

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-success/20">
                <Server className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Edge Function</h3>
                <p className="text-sm text-success">Running</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success pulse-live" />
              <span className="text-sm text-muted-foreground">weather-prediction</span>
            </div>
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-1/20">
                <RefreshCw className={`w-5 h-5 text-chart-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h3 className="font-semibold">Refresh Rate</h3>
                <p className="text-sm text-muted-foreground">{REFRESH_INTERVAL}s interval</p>
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-chart-1">{requestCount}</div>
            <span className="text-xs text-muted-foreground">Requests this session</span>
          </motion.div>
        </div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Live Activity Log</h3>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success pulse-live" />
              <span className="text-xs text-muted-foreground">Streaming</span>
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {activityLog.map((entry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/20 text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="font-mono text-muted-foreground">
                  {entry.time.toLocaleTimeString()}
                </span>
                <span>{entry.message}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-xl border border-warning/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-warning/20">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-semibold">Active Alerts</h3>
            <span className="ml-auto text-sm text-warning">{kpis.criticalItems + kpis.warningItems} active</span>
          </div>
          <div className="space-y-2">
            {kpis.criticalItems > 0 && (
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-danger/10 border border-danger/20">
                <span className="text-sm">{kpis.criticalItems} items at critical stock level</span>
                <span className="text-xs text-danger">High Priority</span>
              </div>
            )}
            {kpis.warningItems > 0 && (
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-warning/10 border border-warning/20">
                <span className="text-sm">{kpis.warningItems} items below reorder point</span>
                <span className="text-xs text-warning">Medium Priority</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/20 border border-border/30">
              <span className="text-sm">High risk items: {kpis.highStockRisk}</span>
              <span className="text-xs text-muted-foreground">Monitor</span>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}

