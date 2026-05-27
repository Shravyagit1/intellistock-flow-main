

// export interface InventoryItem {
//   sku: string;
//   name: string;
//   category: string;
//   currentStock: number;
//   reorderPoint: number;
//   maxCapacity: number;
//   unitPrice: number;
//   lastRestocked: Date;
//   demandRate: number;
//   supplier: string;
//   location: string;
// }

// export interface WeatherData {
//   city: string;
//   temperature: number;
//   humidity: number;
//   condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow';
//   windSpeed: number;
//   feelsLike: number;
//   icon: string;
// }

// export interface DemandPrediction {
//   sku: string;
//   predictedDemand: number;
//   stockoutProbability: number;
//   riskLevel: 'low' | 'medium' | 'high' | 'critical';
//   confidence: number;
//   timeFactors: {
//     hourOfDay: number;
//     dayOfWeek: string;
//     isWeekend: boolean;
//     season: string;
//   };
//   weatherImpact: number;
// }

// export interface DashboardStats {
//   totalItems: number;
//   totalValue: number;
//   lowStockItems: number;
//   criticalItems: number;
//   averageStockLevel: number;
//   stockoutRisk: number;
//   reorderNeeded: number;
//   healthyItems: number;
// }

// export interface SalesData {
//   date: string;
//   sales: number;
//   inventory: number;
//   demand: number;
// }


// export const inventoryItems: InventoryItem[] = [
//   { sku: 'SKU-001', name: 'Industrial Bearings 6205', category: 'Components', currentStock: 1250, reorderPoint: 300, maxCapacity: 2000, unitPrice: 12.50, lastRestocked: new Date('2024-12-20'), demandRate: 45, supplier: 'Precision Parts Co.', location: 'A1-R01' },
//   { sku: 'SKU-002', name: 'Hydraulic Cylinders HC-50', category: 'Machinery', currentStock: 85, reorderPoint: 50, maxCapacity: 200, unitPrice: 245.00, lastRestocked: new Date('2024-12-18'), demandRate: 12, supplier: 'HydroTech Industries', location: 'B2-R03' },
//   { sku: 'SKU-003', name: 'Steel Plates 10mm', category: 'Raw Materials', currentStock: 320, reorderPoint: 200, maxCapacity: 500, unitPrice: 85.00, lastRestocked: new Date('2024-12-19'), demandRate: 28, supplier: 'MetalWorks Ltd', location: 'C1-R02' },
//   { sku: 'SKU-004', name: 'Electric Motors 5HP', category: 'Machinery', currentStock: 42, reorderPoint: 30, maxCapacity: 100, unitPrice: 520.00, lastRestocked: new Date('2024-12-15'), demandRate: 8, supplier: 'PowerDrive Systems', location: 'B1-R01' },
//   { sku: 'SKU-005', name: 'Control Valves CV-200', category: 'Components', currentStock: 156, reorderPoint: 100, maxCapacity: 300, unitPrice: 78.50, lastRestocked: new Date('2024-12-21'), demandRate: 22, supplier: 'FlowControl Inc.', location: 'A2-R04' },
//   { sku: 'SKU-006', name: 'Conveyor Belts 2m', category: 'Equipment', currentStock: 18, reorderPoint: 25, maxCapacity: 50, unitPrice: 180.00, lastRestocked: new Date('2024-12-10'), demandRate: 5, supplier: 'BeltMaster Corp', location: 'D1-R01' },
//   { sku: 'SKU-007', name: 'Safety Sensors IR-100', category: 'Electronics', currentStock: 245, reorderPoint: 150, maxCapacity: 400, unitPrice: 95.00, lastRestocked: new Date('2024-12-22'), demandRate: 35, supplier: 'SafeTech Solutions', location: 'A3-R02' },
//   { sku: 'SKU-008', name: 'Pneumatic Fittings Set', category: 'Components', currentStock: 890, reorderPoint: 400, maxCapacity: 1500, unitPrice: 15.00, lastRestocked: new Date('2024-12-21'), demandRate: 65, supplier: 'AirFlow Parts', location: 'A1-R03' },
//   { sku: 'SKU-009', name: 'Industrial Lubricant 20L', category: 'Consumables', currentStock: 67, reorderPoint: 80, maxCapacity: 150, unitPrice: 125.00, lastRestocked: new Date('2024-12-12'), demandRate: 18, supplier: 'LubeMax Industries', location: 'E1-R01' },
//   { sku: 'SKU-010', name: 'PLC Controllers S7-1200', category: 'Electronics', currentStock: 28, reorderPoint: 20, maxCapacity: 60, unitPrice: 850.00, lastRestocked: new Date('2024-12-17'), demandRate: 6, supplier: 'AutoControl Systems', location: 'A4-R01' },
//   { sku: 'SKU-011', name: 'Welding Wire 1.2mm', category: 'Consumables', currentStock: 425, reorderPoint: 300, maxCapacity: 800, unitPrice: 45.00, lastRestocked: new Date('2024-12-20'), demandRate: 55, supplier: 'WeldSupply Co.', location: 'E2-R02' },
//   { sku: 'SKU-012', name: 'Gearbox Assembly GB-300', category: 'Machinery', currentStock: 12, reorderPoint: 15, maxCapacity: 40, unitPrice: 1250.00, lastRestocked: new Date('2024-12-08'), demandRate: 3, supplier: 'GearTech Manufacturing', location: 'B3-R01' },
// ];


// export function getTimeContext() {
//   const now = new Date();
//   const hour = now.getHours();
//   const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
//   const isWeekend = now.getDay() === 0 || now.getDay() === 6;
//   const month = now.getMonth();
  
//   let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
//   if (hour >= 6 && hour < 12) timeOfDay = 'morning';
//   else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
//   else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
//   else timeOfDay = 'night';

//   let season: 'spring' | 'summer' | 'fall' | 'winter';
//   if (month >= 2 && month <= 4) season = 'spring';
//   else if (month >= 5 && month <= 7) season = 'summer';
//   else if (month >= 8 && month <= 10) season = 'fall';
//   else season = 'winter';

//   return { hour, dayOfWeek, isWeekend, timeOfDay, season, timestamp: now };
// }


// export function getWeatherData(city: string = 'Industrial Zone'): WeatherData {
//   const conditions: Array<'clear' | 'cloudy' | 'rain' | 'storm' | 'snow'> = ['clear', 'cloudy', 'rain', 'storm', 'snow'];
//   const icons: Record<string, string> = {
//     clear: '☀️',
//     cloudy: '☁️',
//     rain: '🌧️',
//     storm: '⛈️',
//     snow: '❄️'
//   };
  
  
//   const hour = new Date().getHours();
//   const baseTemp = 15 + Math.sin((hour - 6) * Math.PI / 12) * 10; // Temperature curve
//   const tempVariation = (Math.random() - 0.5) * 5;
//   const temperature = Math.round(baseTemp + tempVariation);
  
  
//   const conditionWeights = [0.35, 0.30, 0.20, 0.10, 0.05];
//   const rand = Math.random();
//   let cumulative = 0;
//   let conditionIndex = 0;
//   for (let i = 0; i < conditionWeights.length; i++) {
//     cumulative += conditionWeights[i];
//     if (rand < cumulative) {
//       conditionIndex = i;
//       break;
//     }
//   }
//   const condition = conditions[conditionIndex];
  
//   return {
//     city,
//     temperature,
//     humidity: 40 + Math.round(Math.random() * 40),
//     condition,
//     windSpeed: Math.round(5 + Math.random() * 20),
//     feelsLike: temperature - Math.round(Math.random() * 3),
//     icon: icons[condition]
//   };
// }


// export function calculateWeatherImpact(weather: WeatherData, category: string): number {
//   let impact = 1.0;
  
  
//   if (weather.condition === 'rain' || weather.condition === 'storm') {
//     if (category === 'Electronics' || category === 'Components') impact *= 1.15;
//     if (category === 'Raw Materials') impact *= 0.85;
//   }
  
 
//   if (weather.temperature < 10) {
//     if (category === 'Consumables') impact *= 1.25;
//     if (category === 'Machinery') impact *= 0.9;
//   }
  
//   // Hot weather increases cooling equipment demand
//   if (weather.temperature > 30) {
//     if (category === 'Electronics') impact *= 1.3;
//   }
  
//   return impact;
// }


// export function predictDemand(item: InventoryItem, weather: WeatherData): DemandPrediction {
//   const timeContext = getTimeContext();
  

//   let predictedDemand = item.demandRate;
  
  
//   if (timeContext.timeOfDay === 'morning') predictedDemand *= 1.2;
//   else if (timeContext.timeOfDay === 'afternoon') predictedDemand *= 1.1;
//   else if (timeContext.timeOfDay === 'evening') predictedDemand *= 0.8;
//   else predictedDemand *= 0.3;
  
 
//   if (timeContext.isWeekend) predictedDemand *= 0.6;
  
//   // Weather impact
//   const weatherImpact = calculateWeatherImpact(weather, item.category);
//   predictedDemand *= weatherImpact;
  
 
//   if (timeContext.season === 'winter') {
//     if (item.category === 'Consumables') predictedDemand *= 1.15;
//   }
  
  
//   const daysOfStock = item.currentStock / Math.max(predictedDemand, 1);
//   let stockoutProbability = 0;
//   if (daysOfStock <= 1) stockoutProbability = 0.95;
//   else if (daysOfStock <= 3) stockoutProbability = 0.7;
//   else if (daysOfStock <= 7) stockoutProbability = 0.4;
//   else if (daysOfStock <= 14) stockoutProbability = 0.15;
//   else stockoutProbability = 0.05;
  

//   let riskLevel: 'low' | 'medium' | 'high' | 'critical';
//   if (stockoutProbability >= 0.8) riskLevel = 'critical';
//   else if (stockoutProbability >= 0.5) riskLevel = 'high';
//   else if (stockoutProbability >= 0.25) riskLevel = 'medium';
//   else riskLevel = 'low';
  
//   return {
//     sku: item.sku,
//     predictedDemand: Math.round(predictedDemand * 10) / 10,
//     stockoutProbability: Math.round(stockoutProbability * 100) / 100,
//     riskLevel,
//     confidence: 0.75 + Math.random() * 0.2,
//     timeFactors: {
//       hourOfDay: timeContext.hour,
//       dayOfWeek: timeContext.dayOfWeek,
//       isWeekend: timeContext.isWeekend,
//       season: timeContext.season,
//     },
//     weatherImpact: Math.round((weatherImpact - 1) * 100),
//   };
// }


// export function calculateDashboardStats(items: InventoryItem[], weather: WeatherData): DashboardStats {
//   const totalItems = items.reduce((sum, item) => sum + item.currentStock, 0);
//   const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  
//   let lowStockItems = 0;
//   let criticalItems = 0;
//   let reorderNeeded = 0;
//   let totalStockPercentage = 0;
  
//   items.forEach(item => {
//     const stockPercentage = (item.currentStock / item.maxCapacity) * 100;
//     totalStockPercentage += stockPercentage;
    
//     if (item.currentStock <= item.reorderPoint) {
//       lowStockItems++;
//       if (item.currentStock <= item.reorderPoint * 0.5) {
//         criticalItems++;
//       }
//       reorderNeeded++;
//     }
//   });
  
//   const averageStockLevel = totalStockPercentage / items.length;
//   const stockoutRisk = (criticalItems / items.length) * 100;
//   const healthyItems = items.length - lowStockItems;
  
//   return {
//     totalItems,
//     totalValue,
//     lowStockItems,
//     criticalItems,
//     averageStockLevel: Math.round(averageStockLevel),
//     stockoutRisk: Math.round(stockoutRisk * 10) / 10,
//     reorderNeeded,
//     healthyItems,
//   };
// }


// export function generateSalesHistory(days: number = 7): SalesData[] {
//   const data: SalesData[] = [];
//   const now = new Date();
  
//   for (let i = days - 1; i >= 0; i--) {
//     const date = new Date(now);
//     date.setDate(date.getDate() - i);
    
//     const isWeekend = date.getDay() === 0 || date.getDay() === 6;
//     const baseSales = isWeekend ? 12000 : 18000;
//     const variation = (Math.random() - 0.5) * 6000;
    
//     data.push({
//       date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
//       sales: Math.round(baseSales + variation),
//       inventory: Math.round(45000 + (Math.random() - 0.5) * 10000),
//       demand: Math.round((baseSales + variation) * (0.9 + Math.random() * 0.2)),
//     });
//   }
  
//   return data;
// }


// export function simulateInventoryUpdate(items: InventoryItem[]): InventoryItem[] {
//   return items.map(item => {
//     // Small random fluctuation to simulate real-time activity
//     const fluctuation = Math.floor((Math.random() - 0.5) * 5);
//     const newStock = Math.max(0, Math.min(item.maxCapacity, item.currentStock + fluctuation));
    
//     return {
//       ...item,
//       currentStock: newStock,
//     };
//   });
// }


// export function getItemStatus(item: InventoryItem): 'healthy' | 'warning' | 'critical' {
//   if (item.currentStock <= item.reorderPoint * 0.5) return 'critical';
//   if (item.currentStock <= item.reorderPoint) return 'warning';
//   return 'healthy';
// }


// export function formatCurrency(value: number): string {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(value);
// }


// export function formatNumber(value: number): string {
//   if (value >= 1000000) {
//     return (value / 1000000).toFixed(1) + 'M';
//   }
//   if (value >= 1000) {
//     return (value / 1000).toFixed(1) + 'K';
//   }
//   return value.toLocaleString();
// }



// Warehouse data types and utilities

export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  mainCategory: string;
  fullProduct: string;
  currentStock: number;
  reorderPoint: number;
  maxCapacity: number;
  unitCost: number;
  unitPrice: number;
  profitPerUnit: number;
  dailySales: number;
  demandRate: number;
  stockCoverageDays: number;
  stockStatus: number;
  stockoutRisk: string;
  temperature: number;
  weatherType: string;
  season: string;
  leadTimeDays: number;
  expiryDate: string;
  daysToStockout: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow';
  windSpeed: number;
  feelsLike: number;
  icon: string;
}

export interface DemandPrediction {
  sku: string;
  predictedDemand: number;
  stockoutProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  timeFactors: {
    hourOfDay: number;
    dayOfWeek: number;
    isWeekend: boolean;
    season: string;
  };
  weatherImpact: number;
}

export interface SalesData {
  date: string;
  inventory: number;
  sales: number;
  demand: number;
}

// Category mapping from CSV
const CATEGORY_MAP: Record<string, string> = {
  '0': 'Beverages',
  '1': 'Cleaning & Maintenance',
  '2': 'Electronics',
  '3': 'Grocery & Food',
  '4': 'Health & Wellness',
  '5': 'Personal Care',
  '6': 'Stationery & Office',
};

export const CATEGORIES = [
  'Beverages',
  'Cleaning & Maintenance',
  'Electronics',
  'Grocery & Food',
  'Health & Wellness',
  'Personal Care',
  'Stationery & Office',
] as const;

// Parse CSV data embedded as string
const CSV_DATA = `SKU_ID,Product_Name,Category,Main_Category,Full_Product,Date,Year,Month,Day,Weekday,Quarter,Is_Weekend,Expiry_Date,Days_To_Stockout,Current_Stock_Units,Inbound_Qty,Outbound_Qty,Stock_Ratio_Real,Stock_Coverage_Days,Inventory_Turnover,Daily_Sales_Units,Demand_Volatility_Pct,Unit_Cost_INR,Unit_Price_INR,Profit_Per_Unit,Revenue_INR,Profit_INR,Profit_Margin_Pct,Profit_to_Cost_Ratio,Temperature_C,Inflation_Rate_Pct,Weather_Type,Season_Name,Lead_Time_Days,Stock_Status,Stockout_Risk`;

// Function to parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Generate inventory items from embedded data structure
function generateInventoryItems(): InventoryItem[] {
  const items: InventoryItem[] = [];
  
  // Generate 10,000 items based on product templates
  const productTemplates = [
    { name: 'Plug-in Freshener', category: 'Cleaning & Maintenance' },
    { name: 'Cookies', category: 'Grocery & Food' },
    { name: 'Facial Tissue', category: 'Personal Care' },
    { name: 'Laundry Detergent', category: 'Cleaning & Maintenance' },
    { name: 'Brown Rice', category: 'Grocery & Food' },
    { name: 'Face Wash', category: 'Personal Care' },
    { name: 'Shampoo', category: 'Personal Care' },
    { name: 'Sketchbook', category: 'Stationery & Office' },
    { name: 'Orange Juice', category: 'Beverages' },
    { name: 'Wooden Pencil', category: 'Stationery & Office' },
    { name: 'Fountain Pen', category: 'Stationery & Office' },
    { name: 'Hot Chocolate', category: 'Beverages' },
    { name: 'Ball Pen', category: 'Stationery & Office' },
    { name: 'Waffles', category: 'Grocery & Food' },
    { name: 'Lemon-Lime Soda', category: 'Beverages' },
    { name: 'Baby Formula', category: 'Health & Wellness' },
    { name: 'Watercolors', category: 'Stationery & Office' },
    { name: 'Eggs', category: 'Grocery & Food' },
    { name: 'Stain Remover', category: 'Cleaning & Maintenance' },
    { name: 'Antiseptic Wipes', category: 'Health & Wellness' },
    { name: 'Zinc Supplement', category: 'Health & Wellness' },
    { name: 'Coffee', category: 'Beverages' },
    { name: 'Bandages', category: 'Health & Wellness' },
    { name: 'Composition Notebook', category: 'Stationery & Office' },
    { name: 'Pen Holder', category: 'Stationery & Office' },
    { name: 'Room Spray', category: 'Cleaning & Maintenance' },
    { name: 'Double-Sided Tape', category: 'Stationery & Office' },
    { name: 'Hair Straightener', category: 'Electronics' },
    { name: 'Gel Pen', category: 'Stationery & Office' },
    { name: 'Nail Clipper', category: 'Personal Care' },
    { name: 'Hair Serum', category: 'Personal Care' },
    { name: 'Cotton Swabs', category: 'Personal Care' },
    { name: 'Spiral Notebook', category: 'Stationery & Office' },
    { name: 'Eraser', category: 'Stationery & Office' },
    { name: 'Toothpaste', category: 'Personal Care' },
    { name: 'Green Tea', category: 'Beverages' },
    { name: 'Bananas', category: 'Grocery & Food' },
    { name: 'Yeast', category: 'Grocery & Food' },
    { name: 'Cola', category: 'Beverages' },
    { name: 'USB Cable', category: 'Electronics' },
    { name: 'Power Bank', category: 'Electronics' },
    { name: 'Wireless Mouse', category: 'Electronics' },
    { name: 'Bluetooth Speaker', category: 'Electronics' },
    { name: 'LED Bulb', category: 'Electronics' },
    { name: 'Phone Charger', category: 'Electronics' },
    { name: 'Vitamin C', category: 'Health & Wellness' },
    { name: 'Hand Sanitizer', category: 'Health & Wellness' },
    { name: 'Face Mask', category: 'Health & Wellness' },
    { name: 'Body Lotion', category: 'Personal Care' },
    { name: 'Deodorant', category: 'Personal Care' },
  ];

  const weatherTypes = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy'];
  const seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
  const riskLevels = ['Low', 'Medium', 'High'];

  // Seeded random for consistency
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < 10000; i++) {
    const template = productTemplates[i % productTemplates.length];
    const variant = Math.floor(i / productTemplates.length);
    const seed = i;
    
    const maxCapacity = Math.floor(seededRandom(seed + 1) * 9000) + 1000;
    const currentStock = Math.floor(seededRandom(seed + 2) * maxCapacity);
    const reorderPoint = Math.floor(maxCapacity * 0.2);
    const unitCost = Math.floor(seededRandom(seed + 3) * 4500) + 100;
    const unitPrice = unitCost * (1.1 + seededRandom(seed + 4) * 0.5);
    const dailySales = Math.floor(seededRandom(seed + 5) * 900) + 10;
    const stockCoverageDays = currentStock / Math.max(dailySales, 1);
    const daysToStockout = Math.floor(seededRandom(seed + 6) * 80) + 1;
    
    // Determine stock status based on stock level
    let stockStatus = 2; // Normal
    if (currentStock <= reorderPoint * 0.5) stockStatus = 0; // Critical
    else if (currentStock <= reorderPoint) stockStatus = 1; // Warning

    items.push({
      sku: `SKU_${(10000 - i).toString().padStart(5, '0')}`,
      name: variant > 0 ? `${template.name} V${variant}` : template.name,
      category: template.category,
      mainCategory: template.category,
      fullProduct: `${template.category} - ${template.name}`,
      currentStock: Math.floor(currentStock),
      reorderPoint,
      maxCapacity,
      unitCost: Math.floor(unitCost * 100) / 100,
      unitPrice: Math.floor(unitPrice * 100) / 100,
      profitPerUnit: Math.floor((unitPrice - unitCost) * 100) / 100,
      dailySales: dailySales,
      demandRate: dailySales,
      stockCoverageDays: Math.floor(stockCoverageDays * 100) / 100,
      stockStatus,
      stockoutRisk: riskLevels[Math.floor(seededRandom(seed + 7) * 3)],
      temperature: Math.floor(10 + seededRandom(seed + 8) * 35),
      weatherType: weatherTypes[Math.floor(seededRandom(seed + 9) * weatherTypes.length)],
      season: seasons[Math.floor(seededRandom(seed + 10) * seasons.length)],
      leadTimeDays: Math.floor(14 + seededRandom(seed + 11) * 10),
      expiryDate: new Date(Date.now() + (90 + Math.floor(seededRandom(seed + 12) * 270)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysToStockout,
    });
  }

  return items;
}

// Export the generated inventory
export const inventoryItems: InventoryItem[] = generateInventoryItems();

// Get item status based on stock levels
export function getItemStatus(item: InventoryItem): 'healthy' | 'warning' | 'critical' {
  const stockPercentage = (item.currentStock / item.maxCapacity) * 100;
  
  if (item.currentStock <= item.reorderPoint * 0.5 || item.stockStatus === 0) {
    return 'critical';
  } else if (item.currentStock <= item.reorderPoint || item.stockStatus === 1) {
    return 'warning';
  }
  return 'healthy';
}

// Format currency in INR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Simulate inventory update (for live behavior)
export function simulateInventoryUpdate(items: InventoryItem[]): InventoryItem[] {
  return items.map(item => {
    const change = Math.floor(Math.random() * 10) - 3; // -3 to +6
    const newStock = Math.max(0, Math.min(item.maxCapacity, item.currentStock + change));
    
    // Recalculate stock status
    let newStockStatus = 2;
    if (newStock <= item.reorderPoint * 0.5) newStockStatus = 0;
    else if (newStock <= item.reorderPoint) newStockStatus = 1;
    
    return {
      ...item,
      currentStock: newStock,
      stockStatus: newStockStatus,
      demandRate: Math.max(5, item.demandRate + Math.floor(Math.random() * 6) - 2),
      stockCoverageDays: newStock / Math.max(item.dailySales, 1),
    };
  });
}

// Generate sample sales data for charts
export function generateSalesData(): SalesData[] {
  const data: SalesData[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  days.forEach((day) => {
    const baseInventory = 50000 + Math.random() * 30000;
    const baseSales = 15000 + Math.random() * 20000;
    const baseDemand = baseSales * (0.9 + Math.random() * 0.3);
    
    data.push({
      date: day,
      inventory: Math.floor(baseInventory),
      sales: Math.floor(baseSales),
      demand: Math.floor(baseDemand),
    });
  });
  
  return data;
}

// Calculate KPIs from inventory
export function calculateKPIs(items: InventoryItem[]) {
  const totalItems = items.length;
  const criticalItems = items.filter(i => getItemStatus(i) === 'critical').length;
  const warningItems = items.filter(i => getItemStatus(i) === 'warning').length;
  const healthyItems = items.filter(i => getItemStatus(i) === 'healthy').length;
  
  const totalValue = items.reduce((sum, i) => sum + (i.currentStock * i.unitPrice), 0);
  const totalCost = items.reduce((sum, i) => sum + (i.currentStock * i.unitCost), 0);
  const avgStockCoverage = items.reduce((sum, i) => sum + i.stockCoverageDays, 0) / totalItems;
  const avgDemandRate = items.reduce((sum, i) => sum + i.demandRate, 0) / totalItems;
  
  const lowStockRisk = items.filter(i => i.stockoutRisk === 'Low').length;
  const mediumStockRisk = items.filter(i => i.stockoutRisk === 'Medium').length;
  const highStockRisk = items.filter(i => i.stockoutRisk === 'High').length;
  
  return {
    totalItems,
    criticalItems,
    warningItems,
    healthyItems,
    totalValue,
    totalCost,
    avgStockCoverage,
    avgDemandRate,
    lowStockRisk,
    mediumStockRisk,
    highStockRisk,
    healthPercent: Math.round((healthyItems / totalItems) * 100),
    warningPercent: Math.round((warningItems / totalItems) * 100),
    criticalPercent: Math.round((criticalItems / totalItems) * 100),
  };
}

// Simulate demand forecast data
export function generateDemandForecast() {
  const categories = CATEGORIES;
  const forecast: Array<{ category: string; current: number; predicted: number; change: number }> = [];
  
  categories.forEach(category => {
    const current = Math.floor(5000 + Math.random() * 15000);
    const predicted = Math.floor(current * (0.85 + Math.random() * 0.35));
    const change = Math.round(((predicted - current) / current) * 100);
    
    forecast.push({ category, current, predicted, change });
  });
  
  return forecast;
}

// Generate warehouse activity log
export function generateActivityLog() {
  const activities = [
    'Shipment dispatched',
    'Stock restocked',
    'Inventory audit completed',
    'New shipment received',
    'Stock transfer completed',
    'Quality check passed',
    'Order fulfilled',
    'Returns processed',
  ];
  
  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];
  
  return Array.from({ length: 10 }, (_, i) => ({
    action: `${activities[Math.floor(Math.random() * activities.length)]} #${Math.floor(1000 + Math.random() * 9000)}`,
    zone: zones[Math.floor(Math.random() * zones.length)],
    time: new Date(Date.now() - i * 30000 * (1 + Math.random())),
    units: Math.floor(10 + Math.random() * 200),
  }));
}
export interface DashboardStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  criticalItems: number;
  averageStockLevel: number;
  stockoutRisk: number;
  reorderNeeded: number;
  healthyItems: number;
}
export function generateSalesHistory(days: number = 7) {
  const data: {
    date: string;
    sales: number;
    inventory: number;
    demand: number;
  }[] = [];

  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseSales = isWeekend ? 12000 : 18000;
    const variation = (Math.random() - 0.5) * 6000;

    data.push({
      date: date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      sales: Math.round(baseSales + variation),
      inventory: Math.round(45000 + (Math.random() - 0.5) * 10000),
      demand: Math.round((baseSales + variation) * (0.9 + Math.random() * 0.2)),
    });
  }

  return data;
}
