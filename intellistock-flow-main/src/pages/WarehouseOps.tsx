// import { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import { Warehouse, Package, Truck, MapPin, Clock, CheckCircle } from 'lucide-react';
// import { MainLayout } from '@/components/layout/MainLayout';
// import { supabase } from '@/integrations/supabase/client';

// const REFRESH_INTERVAL = 30;

// interface WarehouseZone {
//   id: string;
//   name: string;
//   capacity: number;
//   used: number;
//   items: number;
//   status: 'optimal' | 'warning' | 'critical';
// }

// const zones: WarehouseZone[] = [
//   { id: 'A', name: 'Zone A - Beverages', capacity: 5000, used: 3200, items: 450, status: 'optimal' },
//   { id: 'B', name: 'Zone B - Electronics', capacity: 3000, used: 2800, items: 280, status: 'warning' },
//   { id: 'C', name: 'Zone C - Grocery', capacity: 8000, used: 4500, items: 620, status: 'optimal' },
//   { id: 'D', name: 'Zone D - Personal Care', capacity: 4000, used: 3900, items: 380, status: 'critical' },
//   { id: 'E', name: 'Zone E - Office Supplies', capacity: 2500, used: 1200, items: 190, status: 'optimal' },
// ];

// export default function WarehouseOps() {
//   const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [totalItems, setTotalItems] = useState(0);

//   const fetchData = useCallback(async () => {
//     setIsRefreshing(true);
//     try {
//       const { data, error } = await supabase.functions.invoke('weather-prediction');
//       if (error) throw error;
//       if (data.success) {
//         setTotalItems(data.stats.totalItems);
//         setLastUpdate(new Date());
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, REFRESH_INTERVAL * 1000);
//     return () => clearInterval(interval);
//   }, [fetchData]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'optimal': return 'text-success';
//       case 'warning': return 'text-warning';
//       case 'critical': return 'text-danger';
//       default: return 'text-muted-foreground';
//     }
//   };

//   const getStatusBg = (status: string) => {
//     switch (status) {
//       case 'optimal': return 'bg-success/20';
//       case 'warning': return 'bg-warning/20';
//       case 'critical': return 'bg-danger/20';
//       default: return 'bg-muted/20';
//     }
//   };

//   return (
//     <MainLayout lastUpdate={lastUpdate} isRefreshing={isRefreshing} refreshInterval={REFRESH_INTERVAL}>
//       <div className="container mx-auto px-6 py-8 space-y-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gradient-primary">Warehouse Operations</h1>
//           <p className="text-muted-foreground">Monitor warehouse zones, capacity, and operations</p>
//         </div>

//         {/* Overview Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="glass-card p-6 rounded-xl border border-border/50"
//           >
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-lg bg-primary/20">
//                 <Warehouse className="w-5 h-5 text-primary" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold">{zones.length}</p>
//                 <p className="text-sm text-muted-foreground">Active Zones</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="glass-card p-6 rounded-xl border border-border/50"
//           >
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-lg bg-chart-2/20">
//                 <Package className="w-5 h-5 text-chart-2" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
//                 <p className="text-sm text-muted-foreground">Total Items</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="glass-card p-6 rounded-xl border border-border/50"
//           >
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-lg bg-chart-3/20">
//                 <Truck className="w-5 h-5 text-chart-3" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold">12</p>
//                 <p className="text-sm text-muted-foreground">Pending Shipments</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="glass-card p-6 rounded-xl border border-border/50"
//           >
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-lg bg-success/20">
//                 <CheckCircle className="w-5 h-5 text-success" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold">98%</p>
//                 <p className="text-sm text-muted-foreground">Fulfillment Rate</p>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Warehouse Zones */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold">Warehouse Zones</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {zones.map((zone, index) => (
//               <motion.div
//                 key={zone.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="glass-card p-5 rounded-xl border border-border/50"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-2">
//                     <MapPin className="w-4 h-4 text-muted-foreground" />
//                     <span className="font-medium">{zone.name}</span>
//                   </div>
//                   <span className={`text-xs px-2 py-1 rounded-full ${getStatusBg(zone.status)} ${getStatusColor(zone.status)}`}>
//                     {zone.status}
//                   </span>
//                 </div>

//                 <div className="space-y-3">
//                   <div>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span className="text-muted-foreground">Capacity</span>
//                       <span className="font-mono">{Math.round((zone.used / zone.capacity) * 100)}%</span>
//                     </div>
//                     <div className="h-2 bg-muted rounded-full overflow-hidden">
//                       <div
//                         className={`h-full transition-all ${
//                           zone.status === 'critical' ? 'bg-danger' :
//                           zone.status === 'warning' ? 'bg-warning' : 'bg-success'
//                         }`}
//                         style={{ width: `${(zone.used / zone.capacity) * 100}%` }}
//                       />
//                     </div>
//                   </div>

//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Items</span>
//                     <span className="font-mono">{zone.items}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Space Used</span>
//                     <span className="font-mono">{zone.used.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="glass-card p-6 rounded-xl border border-border/50"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 rounded-lg bg-chart-4/20">
//               <Clock className="w-5 h-5 text-chart-4" />
//             </div>
//             <h3 className="font-semibold">Recent Operations</h3>
//           </div>
//           <div className="space-y-3">
//             {[
//               { action: 'Shipment #4521 dispatched', zone: 'Zone A', time: '2 min ago' },
//               { action: 'Restocked 150 units', zone: 'Zone C', time: '15 min ago' },
//               { action: 'Inventory audit completed', zone: 'Zone B', time: '1 hour ago' },
//               { action: 'New shipment received', zone: 'Zone E', time: '2 hours ago' },
//             ].map((activity, idx) => (
//               <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
//                 <div>
//                   <p className="text-sm font-medium">{activity.action}</p>
//                   <p className="text-xs text-muted-foreground">{activity.zone}</p>
//                 </div>
//                 <span className="text-xs text-muted-foreground">{activity.time}</span>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </MainLayout>
//   );
// }



import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Warehouse, Package, Truck, MapPin, Clock, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { inventoryItems, generateActivityLog, simulateInventoryUpdate, InventoryItem } from '@/lib/warehouse-data';

const REFRESH_INTERVAL = 15;

interface WarehouseZone {
  id: string;
  name: string;
  capacity: number;
  used: number;
  items: number;
  status: 'optimal' | 'warning' | 'critical';
}

export default function WarehouseOps() {
  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activityLog, setActivityLog] = useState(generateActivityLog());
  const [pendingShipments, setPendingShipments] = useState(12);
  const [fulfillmentRate, setFulfillmentRate] = useState(98);
  
  // Dynamic zones based on inventory
  const [zones, setZones] = useState<WarehouseZone[]>([
    { id: 'A', name: 'Zone A - Beverages', capacity: 5000, used: 3200, items: 450, status: 'optimal' },
    { id: 'B', name: 'Zone B - Electronics', capacity: 3000, used: 2800, items: 280, status: 'warning' },
    { id: 'C', name: 'Zone C - Grocery', capacity: 8000, used: 4500, items: 620, status: 'optimal' },
    { id: 'D', name: 'Zone D - Personal Care', capacity: 4000, used: 3900, items: 380, status: 'critical' },
    { id: 'E', name: 'Zone E - Office Supplies', capacity: 2500, used: 1200, items: 190, status: 'optimal' },
  ]);

  const totalItems = items.length;

  const fetchData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate live inventory update
      setItems(prev => simulateInventoryUpdate(prev));
      
      // Update activity log with new entries
      setActivityLog(generateActivityLog());
      
      // Simulate zone changes
      setZones(prev => prev.map(zone => {
        const change = Math.floor(Math.random() * 100) - 30;
        const newUsed = Math.max(500, Math.min(zone.capacity, zone.used + change));
        const ratio = newUsed / zone.capacity;
        let status: 'optimal' | 'warning' | 'critical' = 'optimal';
        if (ratio > 0.95) status = 'critical';
        else if (ratio > 0.85) status = 'warning';
        
        return {
          ...zone,
          used: newUsed,
          items: zone.items + Math.floor(Math.random() * 10) - 5,
          status,
        };
      }));
      
      // Simulate pending shipments and fulfillment rate
      setPendingShipments(prev => Math.max(5, Math.min(25, prev + Math.floor(Math.random() * 5) - 2)));
      setFulfillmentRate(prev => Math.max(94, Math.min(100, prev + (Math.random() * 2 - 1))));
      
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 300);
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchData, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-success/20';
      case 'warning': return 'bg-warning/20';
      case 'critical': return 'bg-danger/20';
      default: return 'bg-muted/20';
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <MainLayout lastUpdate={lastUpdate} isRefreshing={isRefreshing} refreshInterval={REFRESH_INTERVAL}>
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">Warehouse Operations</h1>
            <p className="text-muted-foreground">Monitor warehouse zones, capacity, and operations</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success pulse-live" />
            <span className="text-sm text-muted-foreground">Live Updates</span>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Warehouse className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{zones.length}</p>
                <p className="text-sm text-muted-foreground">Active Zones</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/20">
                <Package className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-3/20">
                <Truck className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingShipments}</p>
                <p className="text-sm text-muted-foreground">Pending Shipments</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{fulfillmentRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Fulfillment Rate</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Warehouse Zones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Warehouse Zones</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-success" /> Optimal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-warning" /> Warning
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-danger" /> Critical
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-5 rounded-xl border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{zone.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBg(zone.status)} ${getStatusColor(zone.status)}`}>
                    {zone.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-mono">{Math.round((zone.used / zone.capacity) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full transition-all ${
                          zone.status === 'critical' ? 'bg-danger' :
                          zone.status === 'warning' ? 'bg-warning' : 'bg-success'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(zone.used / zone.capacity) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-mono">{zone.items}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Space Used</span>
                    <span className="font-mono">{zone.used.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-chart-4/20">
              <Clock className="w-5 h-5 text-chart-4" />
            </div>
            <h3 className="font-semibold">Recent Operations</h3>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success pulse-live" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
            {activityLog.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded ${idx % 2 === 0 ? 'bg-success/20' : 'bg-chart-1/20'}`}>
                    {idx % 2 === 0 ? (
                      <ArrowUpRight className={`w-3 h-3 ${idx % 2 === 0 ? 'text-success' : 'text-chart-1'}`} />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-chart-1" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.zone} • {activity.units} units</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{formatTime(activity.time)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
