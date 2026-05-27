// import { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Package,
//   IndianRupee,
//   AlertTriangle,
//   TrendingUp,
//   ShoppingCart,
//   Activity,
// } from 'lucide-react';
// import { MainLayout } from '@/components/layout/MainLayout';
// import { KPICard } from '@/components/dashboard/KPICard';
// import { WeatherPanel } from '@/components/dashboard/WeatherPanel';

// import { TimeDisplay } from '@/components/dashboard/TimeDisplay';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';
// import {
//   formatCurrency,
//   formatNumber,
//   WeatherData,
//   DashboardStats,
// } from '@/lib/warehouse-data';

// const REFRESH_INTERVAL = 30;

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

// export default function Dashboard() {
//   const { toast } = useToast();
//   const [weather, setWeather] = useState<WeatherData | null>(null);
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [apiConnected, setApiConnected] = useState(false);

//   const fetchDashboardData = useCallback(async () => {
//     setIsRefreshing(true);
//     try {
//       const { data, error } = await supabase.functions.invoke('weather-prediction');
      
//       if (error) {
//         console.error('Edge function error:', error);
//         toast({
//           title: 'API Error',
//           description: 'Failed to fetch live data.',
//           variant: 'destructive',
//         });
//         setIsRefreshing(false);
//         return;
//       }

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
        
//         setStats({
//           totalItems: data.stats.totalItems,
//           totalValue: data.stats.totalValue,
//           lowStockItems: data.stats.highRiskItems + data.stats.mediumRiskItems,
//           criticalItems: data.stats.highRiskItems,
//           averageStockLevel: 100 - data.stats.stockoutRiskPercent,
//           stockoutRisk: data.stats.stockoutRiskPercent,
//           reorderNeeded: data.stats.highRiskItems,
//           healthyItems: data.stats.lowRiskItems,
//         });
        
//         setLastUpdate(new Date());
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setApiConnected(false);
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, [toast]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   useEffect(() => {
//     const interval = setInterval(fetchDashboardData, REFRESH_INTERVAL * 1000);
//     return () => clearInterval(interval);
//   }, [fetchDashboardData]);

//   return (
//     <MainLayout lastUpdate={lastUpdate} isRefreshing={isRefreshing} refreshInterval={REFRESH_INTERVAL}>
//       <div className="container mx-auto px-6 py-8 space-y-8">
//         {/* Time and Weather Row */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <TimeDisplay className="lg:col-span-2" />
//           {weather && <WeatherPanel weather={weather} />}
//         </div>

//         {/* KPI Cards */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, staggerChildren: 0.1 }}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//         >
//           <KPICard
//             title="Total Inventory"
//             value={formatNumber(stats?.totalItems || 0)}
//             subtitle="items in stock"
//             icon={Package}
//             status="healthy"
//             trend={{ value: 2.5, isPositive: true }}
//           />
//           <KPICard
//             title="Inventory Value"
//             value={formatCurrency(stats?.totalValue || 0)}
//             subtitle="total warehouse value"
//             icon={IndianRupee}
//             status="neutral"
//             trend={{ value: 5.2, isPositive: true }}
//           />
//           <KPICard
//             title="Low Stock Items"
//             value={stats?.lowStockItems || 0}
//             subtitle={`${stats?.criticalItems || 0} critical`}
//             icon={AlertTriangle}
//             status={
//               (stats?.criticalItems || 0) > 0
//                 ? 'critical'
//                 : (stats?.lowStockItems || 0) > 0
//                 ? 'warning'
//                 : 'healthy'
//             }
//           />
//           <KPICard
//             title="Healthy Stock"
//             value={stats?.healthyItems || 0}
//             subtitle={`${stats?.averageStockLevel || 0}% avg level`}
//             icon={TrendingUp}
//             status="healthy"
//           />
//         </motion.div>

//         {/* Activity Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="glass-card p-6 rounded-xl border border-border/50"
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 rounded-lg bg-chart-1/20">
//                 <Activity className="w-5 h-5 text-chart-1" />
//               </div>
//               <h3 className="font-semibold">System Status</h3>
//             </div>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">ML Model</span>
//                 <span className="text-sm font-medium text-success flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-success" />
//                   Random Forest
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Weather API</span>
//                 <span className={`text-sm font-medium flex items-center gap-1 ${apiConnected ? 'text-success' : 'text-warning'}`}>
//                   <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-success' : 'bg-warning'}`} />
//                   {apiConnected ? 'Bangalore Live' : 'Connecting...'}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Dataset</span>
//                 <span className="text-sm font-medium text-success flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-success" />
//                   10,000 records
//                 </span>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="glass-card p-6 rounded-xl border border-border/50"
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 rounded-lg bg-chart-2/20">
//                 <ShoppingCart className="w-5 h-5 text-chart-2" />
//               </div>
//               <h3 className="font-semibold">Weather Impact</h3>
//             </div>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Temperature</span>
//                 <span className="font-mono font-medium">{weather?.temperature || '--'}°C</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Humidity</span>
//                 <span className="font-mono font-medium">{weather?.humidity || '--'}%</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Condition</span>
//                 <span className="font-mono font-medium capitalize">{weather?.condition || '--'}</span>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }



import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
// import { InventoryChart } from '@/components/dashboard/InventoryChart';
import { WeatherPanel } from '@/components/dashboard/WeatherPanel';
import { TimeDisplay } from '@/components/dashboard/TimeDisplay';
import { 
  inventoryItems, 
  WeatherData, 
  generateSalesData, 
  getItemStatus,
  formatCurrency,
  calculateKPIs,
  generateDemandForecast,
  simulateInventoryUpdate,
  InventoryItem,
} from '@/lib/warehouse-data';
import { Package,AlertTriangle, TrendingUp, DollarSign, BarChart3, TrendingDown, Activity } from 'lucide-react';

const REFRESH_INTERVAL = 30;

export default function Dashboard() {
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
  const [salesData, setSalesData] = useState(generateSalesData());
  const [demandForecast, setDemandForecast] = useState(generateDemandForecast());

  // Compute live KPIs from inventory data
  const kpis = useMemo(() => calculateKPIs(items), [items]);

  const fetchData = useCallback(() => {
    setIsRefreshing(true);
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
      
      // Update inventory with live simulation
      setItems(prev => simulateInventoryUpdate(prev));
      
      // Refresh sales data and demand forecast
      setSalesData(generateSalesData());
      setDemandForecast(generateDemandForecast());
      
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 300);
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchData, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <MainLayout lastUpdate={lastUpdate} isRefreshing={isRefreshing} refreshInterval={REFRESH_INTERVAL}>
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Dashboard</h1>
          {/* <p className="text-muted-foreground">Smart warehouse overview with AI-powered insights</p> */}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Products</span>
            </div>
            <p className="text-3xl font-bold">{kpis.totalItems.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-chart-2/20">
                <DollarSign className="w-5 h-5 text-chart-2" />
              </div>
              <span className="text-sm text-muted-foreground">Total Inventory Value</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(kpis.totalValue)}</p>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/20">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Low Stock Items</span>
            </div>
            <p className="text-3xl font-bold">{kpis.warningItems + kpis.criticalItems}</p>
          </motion.div> */}

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-danger/20">
                <AlertTriangle className="w-5 h-5 text-danger" />
              </div>
              <span className="text-sm text-muted-foreground">Critical Alerts</span>
            </div>
            <p className="text-3xl font-bold text-danger">{kpis.criticalItems}</p>
          </motion.div> */}
        </div>

        {/* Time and Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TimeDisplay className="lg:col-span-2" />
          <WeatherPanel weather={weather} />
        </div>

        {/* Demand Forecast Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-chart-1/20">
              <BarChart3 className="w-5 h-5 text-chart-1" />
            </div>
            <div>
              <h3 className="font-semibold">Live Demand Forecast</h3>
              <p className="text-sm text-muted-foreground">Predicted demand by category</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success pulse-live" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demandForecast.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-muted/20 border border-border/30"
              >
                <p className="text-sm text-muted-foreground mb-2 truncate">{item.category}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">{item.predicted.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Predicted Units</p>
                  </div>
                  <div className={`flex items-center gap-1 ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {item.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{item.change > 0 ? '+' : ''}{item.change}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stock Risk Distribution */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 rounded-xl border border-success/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Low Risk</h3>
                <p className="text-sm text-muted-foreground">Stable stock levels</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-success">{kpis.lowStockRisk.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round((kpis.lowStockRisk / kpis.totalItems) * 100)}% of inventory
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 rounded-xl border border-warning/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-warning/20">
                <Activity className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Medium Risk</h3>
                <p className="text-sm text-muted-foreground">Monitor closely</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-warning">{kpis.mediumStockRisk.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round((kpis.mediumStockRisk / kpis.totalItems) * 100)}% of inventory
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6 rounded-xl border border-danger/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-danger/20">
                <AlertTriangle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h3 className="font-semibold">High Risk</h3>
                <p className="text-sm text-muted-foreground">Immediate action needed</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-danger">{kpis.highStockRisk.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round((kpis.highStockRisk / kpis.totalItems) * 100)}% of inventory
            </p>
          </motion.div>
        </div> */}

        {/* Chart */}
        {/* <InventoryChart data={salesData} /> */}
      </div>
    </MainLayout>
  );
}
