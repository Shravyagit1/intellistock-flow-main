// import { useState, useEffect, useCallback } from 'react';
// import { MainLayout } from '@/components/layout/MainLayout';
// import { InventoryTable } from '@/components/dashboard/InventoryTable';
// import { PredictionModal } from '@/components/dashboard/PredictionModal';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { inventoryItems } from '@/lib/warehouse-data';

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';
// import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
// import {
//   InventoryItem,
//   WeatherData,
//   DemandPrediction,
// } from '@/lib/warehouse-data';

// const REFRESH_INTERVAL = 60;
// const ITEMS_PER_PAGE = 25;

// const CATEGORY_OPTIONS = [
//   { value: 'all', label: 'All Categories' },
//   { value: '0', label: 'Beverages' },
//   { value: '1', label: 'Cleaning & Maintenance' },
//   { value: '2', label: 'Electronics' },
//   { value: '3', label: 'Grocery & Food' },
//   { value: '4', label: 'Health & Wellness' },
//   { value: '5', label: 'Personal Care' },
//   { value: '6', label: 'Stationery & Office' },
// ];

// const CATEGORY_NAMES: Record<number, string> = {
//   0: 'Beverages',
//   1: 'Cleaning & Maintenance',
//   2: 'Electronics',
//   3: 'Grocery & Food',
//   4: 'Health & Wellness',
//   5: 'Personal Care',
//   6: 'Stationery & Office',
// };

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

// export default function Inventory() {
//   const { toast } = useToast();
//   const [items, setItems] = useState<InventoryItem[]>([]);
//   const [weather, setWeather] = useState<WeatherData | null>(null);
//   const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [selectedSku, setSelectedSku] = useState<string | null>(null);
//   const [prediction, setPrediction] = useState<DemandPrediction | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
  
//   // Search and filter state
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchInput, setSearchInput] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');

//   const fetchData = useCallback(async (page: number = 1, search: string = '', category: string = '') => {
//     setIsRefreshing(true);
//     try {
      
//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(ITEMS_PER_PAGE),
//       });
//       if (search) params.set('search', search);
//       if (category && category !== 'all') params.set('category', category);
      
//       // Fetch with pagination and filter params
//       const response = await fetch(
//         `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weather-prediction?${params.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
//           },
//         }
//       );
      
//       if (!response.ok) throw new Error('Failed to fetch');
//       const paginatedData = await response.json();

//       if (paginatedData.success) {
//         const weatherData: WeatherData = {
//           city: paginatedData.weather.city,
//           temperature: paginatedData.weather.temperature,
//           humidity: paginatedData.weather.humidity,
//           condition: mapCondition(paginatedData.weather.condition),
//           windSpeed: paginatedData.weather.windSpeed,
//           feelsLike: paginatedData.weather.feelsLike,
//           icon: getWeatherIcon(paginatedData.weather.condition),
//         };
//         setWeather(weatherData);

//         const inventoryItems: InventoryItem[] = paginatedData.predictions.map((p: any, index: number) => ({
//           sku: p.sku,
//           name: p.name,
//           category: p.categoryName || CATEGORY_NAMES[p.category] || 'Other',
//           currentStock: p.currentStock,
//           reorderPoint: Math.round(p.currentStock * 0.2),
//           maxCapacity: Math.round(p.currentStock * 2),
//           unitPrice: p.unitPrice,
//           lastRestocked: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
//           demandRate: p.predictedDemand,
//           supplier: `Supplier ${String.fromCharCode(65 + (index % 10))}`,
//           location: `${String.fromCharCode(65 + (index % 5))}${index % 4 + 1}-R0${(index % 3) + 1}`,
//         }));
//         setItems(inventoryItems);
        
//         // Update pagination info
//         if (paginatedData.pagination) {
//           setTotalPages(paginatedData.pagination.totalPages);
//           setTotalItems(paginatedData.pagination.totalItems);
//           setCurrentPage(paginatedData.pagination.page);
//         }
        
//         setLastUpdate(new Date());
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       toast({
//         title: 'Error',
//         description: 'Failed to fetch inventory data.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, [toast]);

//   useEffect(() => {
//     fetchData(1, searchQuery, categoryFilter);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => fetchData(currentPage, searchQuery, categoryFilter), REFRESH_INTERVAL * 1000);
//     return () => clearInterval(interval);
//   }, [fetchData, currentPage, searchQuery, categoryFilter]);

//   const handleSearch = () => {
//     setSearchQuery(searchInput);
//     setCurrentPage(1);
//     fetchData(1, searchInput, categoryFilter);
//   };

//   const handleClearSearch = () => {
//     setSearchInput('');
//     setSearchQuery('');
//     setCurrentPage(1);
//     fetchData(1, '', categoryFilter);
//   };

//   const handleCategoryChange = (value: string) => {
//     setCategoryFilter(value);
//     setCurrentPage(1);
//     fetchData(1, searchQuery, value);
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
//       setCurrentPage(newPage);
//       fetchData(newPage, searchQuery, categoryFilter);
//     }
//   };

//   const handleViewPrediction = async (sku: string) => {
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weather-prediction?sku=${sku}`,
//         {
//           headers: {
//             Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
//           },
//         }
//       );
//       if (!response.ok) throw new Error('Failed to fetch prediction');
//       const skuData = await response.json();

//       if (skuData.success && skuData.prediction) {
//         setPrediction({
//           sku: skuData.sku,
//           predictedDemand: skuData.prediction.predictedDemand,
//           stockoutProbability: skuData.prediction.stockoutProbability,
//           riskLevel: skuData.prediction.stockoutRisk.toLowerCase() as 'low' | 'medium' | 'high',
//           confidence: skuData.prediction.confidence,
//           timeFactors: {
//             hourOfDay: skuData.timeContext.hour,
//             dayOfWeek: skuData.timeContext.dayOfWeek,
//             isWeekend: skuData.timeContext.isWeekend,
//             season: skuData.timeContext.season,
//           },
//           weatherImpact: skuData.prediction.factors.temperature || 0,
//         });
//         setSelectedSku(sku);
//         setIsModalOpen(true);
//       }
//     } catch (err) {
//       console.error('Prediction fetch error:', err);
//       toast({
//         title: 'Prediction Error',
//         description: 'Failed to fetch prediction for this item.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const selectedItem = items.find((i) => i.sku === selectedSku) || null;

//   // Generate page numbers to display
//   const getPageNumbers = () => {
//     const pages: (number | string)[] = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 4; i++) pages.push(i);
//         pages.push('...');
//         pages.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1);
//         pages.push('...');
//         for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
//       } else {
//         pages.push(1);
//         pages.push('...');
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
//         pages.push('...');
//         pages.push(totalPages);
//       }
//     }
//     return pages;
//   };

//   return (
//     <MainLayout lastUpdate={lastUpdate} isRefreshing={isRefreshing} refreshInterval={REFRESH_INTERVAL}>
//       <div className="container mx-auto px-6 py-8 space-y-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gradient-primary">Inventory Management</h1>
//             <p className="text-muted-foreground">
//               Showing {items.length} of {totalItems.toLocaleString()} products with AI-powered predictions
//             </p>
//           </div>
//           <div className="text-sm text-muted-foreground">
//             Page {currentPage} of {totalPages}
//           </div>
//         </div>
        
//         {/* Search and Filter Controls */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex flex-1 gap-2">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by SKU or product name..."
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                 className="pl-10 pr-10"
//               />
//               {searchInput && (
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleClearSearch}
//                   className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
//                 >
//                   <X className="w-4 h-4" />
//                 </Button>
//               )}
//             </div>
//             <Button onClick={handleSearch} disabled={isRefreshing}>
//               Search
//             </Button>
//           </div>
          
//           <Select value={categoryFilter} onValueChange={handleCategoryChange}>
//             <SelectTrigger className="w-full sm:w-[200px]">
//               <SelectValue placeholder="All Categories" />
//             </SelectTrigger>
//             <SelectContent>
//               {CATEGORY_OPTIONS.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
        
//         {/* Active filters indicator */}
//         {(searchQuery || categoryFilter !== 'all') && (
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <span>Filters:</span>
//             {searchQuery && (
//               <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
//                 Search: "{searchQuery}"
//               </span>
//             )}
//             {categoryFilter !== 'all' && (
//               <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
//                 {CATEGORY_OPTIONS.find(c => c.value === categoryFilter)?.label}
//               </span>
//             )}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => {
//                 setSearchInput('');
//                 setSearchQuery('');
//                 setCategoryFilter('all');
//                 setCurrentPage(1);
//                 fetchData(1, '', 'all');
//               }}
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Clear all
//             </Button>
//           </div>
//         )}
        
//         <InventoryTable items={items} onViewPrediction={handleViewPrediction} />
        
//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 py-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1 || isRefreshing}
//             >
//               <ChevronLeft className="w-4 h-4 mr-1" />
//               Previous
//             </Button>
            
//             <div className="flex items-center gap-1">
//               {getPageNumbers().map((page, index) => (
//                 typeof page === 'number' ? (
//                   <Button
//                     key={index}
//                     variant={page === currentPage ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => handlePageChange(page)}
//                     disabled={isRefreshing}
//                     className="w-10"
//                   >
//                     {page}
//                   </Button>
//                 ) : (
//                   <span key={index} className="px-2 text-muted-foreground">...</span>
//                 )
//               ))}
//             </div>
            
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages || isRefreshing}
//             >
//               Next
//               <ChevronRight className="w-4 h-4 ml-1" />
//             </Button>
//           </div>
//         )}
//       </div>
//       <PredictionModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         item={selectedItem}
//         prediction={prediction}
//         weather={weather}
//       />
//     </MainLayout>
//   );
// }




import { useState, useEffect, useMemo, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { InventoryTable } from '@/components/dashboard/InventoryTable';
import { PredictionModal } from '@/components/dashboard/PredictionModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  inventoryItems,
  InventoryItem,
  WeatherData,
  DemandPrediction,
  simulateInventoryUpdate,
  calculateKPIs,
  getItemStatus,
  formatCurrency,
} from '@/lib/warehouse-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Search, X, Package, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const REFRESH_INTERVAL = 60;
const ITEMS_PER_PAGE = 25;

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'Beverages', label: 'Beverages' },
  { value: 'Cleaning & Maintenance', label: 'Cleaning & Maintenance' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Grocery & Food', label: 'Grocery & Food' },
  { value: 'Health & Wellness', label: 'Health & Wellness' },
  { value: 'Personal Care', label: 'Personal Care' },
  { value: 'Stationery & Office', label: 'Stationery & Office' },
];

export default function Inventory() {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [weather, setWeather] = useState<WeatherData | null>({
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
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<DemandPrediction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Calculate live KPIs
  const kpis = useMemo(() => calculateKPIs(items), [items]);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = searchQuery === '' || 
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, categoryFilter]);

  // Pagination calculations
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  // Simulate live updates
  const simulateLiveUpdate = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setItems(prev => simulateInventoryUpdate(prev));
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 500);
  }, []);

  useEffect(() => {
    const interval = setInterval(simulateLiveUpdate, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [simulateLiveUpdate]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const handleViewPrediction = async (sku: string) => {
    const item = items.find(i => i.sku === sku);
    if (!item) return;

    // Generate mock prediction data (since we're using local dataset)
    const mockPrediction: DemandPrediction = {
      sku,
      predictedDemand: Math.floor(item.demandRate * (0.8 + Math.random() * 0.4)),
      stockoutProbability: Math.max(0, Math.min(1, (item.reorderPoint - item.currentStock) / item.reorderPoint + Math.random() * 0.2)),
      riskLevel: item.currentStock <= item.reorderPoint * 0.5 ? 'high' : 
                 item.currentStock <= item.reorderPoint ? 'medium' : 'low',
      confidence: 0.75 + Math.random() * 0.2,
      timeFactors: {
        hourOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        isWeekend: [0, 6].includes(new Date().getDay()),
        season: getSeason(),
      },
      weatherImpact: (Math.random() * 0.2) - 0.1,
    };

    setPrediction(mockPrediction);
    setSelectedSku(sku);
    setIsModalOpen(true);

    toast({
      title: 'Prediction Generated',
      description: `AI prediction ready for ${item.name}`,
    });
  };

  const getSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
  };

  const selectedItem = items.find((i) => i.sku === selectedSku) || null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <MainLayout lastUpdate={lastUpdate} isRefreshing={isRefreshing} refreshInterval={REFRESH_INTERVAL}>
      <div className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">Inventory Management</h1>
            <p className="text-muted-foreground">
              Showing {paginatedItems.length} of {totalItems.toLocaleString()} products with AI-powered predictions
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Live KPI Cards */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/20">
                <Package className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpis.totalItems.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpis.healthyItems.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Healthy ({kpis.healthPercent}%)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpis.warningItems.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Low Stock ({kpis.warningPercent}%)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 rounded-xl border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-danger/20">
                <AlertCircle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpis.criticalItems.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Critical ({kpis.criticalPercent}%)</p>
              </div>
            </div>
          </motion.div>
        </div> */}
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by SKU or product name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-10"
              />
              {searchInput && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Button onClick={handleSearch} disabled={isRefreshing}>
              Search
            </Button>
          </div>
          
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Active filters indicator */}
        {(searchQuery || categoryFilter !== 'all') && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                Search: "{searchQuery}"
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                {categoryFilter}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
                setCategoryFilter('all');
                setCurrentPage(1);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}
        
        <InventoryTable items={paginatedItems} onViewPrediction={handleViewPrediction} />
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isRefreshing}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                  <Button
                    key={index}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={isRefreshing}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ) : (
                  <span key={index} className="px-2 text-muted-foreground">...</span>
                )
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isRefreshing}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
      <PredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        prediction={prediction}
        weather={weather}
      />
    </MainLayout>
  );
}
