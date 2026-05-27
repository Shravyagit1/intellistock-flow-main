import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InventoryItem, getItemStatus, formatCurrency } from '@/lib/warehouse-data';
import { cn } from '@/lib/utils';
import { TrendingUp, AlertTriangle, AlertCircle, Eye } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onViewPrediction: (sku: string) => void;
  className?: string;
}

export function InventoryTable({ items, onViewPrediction, className }: InventoryTableProps) {
  const getStatusBadge = (item: InventoryItem) => {
    const status = getItemStatus(item);
    const styles = {
      healthy: 'bg-success/20 text-success border-success/30 hover:bg-success/30',
      warning: 'bg-warning/20 text-warning border-warning/30 hover:bg-warning/30',
      critical: 'bg-danger/20 text-danger border-danger/30 hover:bg-danger/30 animate-pulse',
    };
    const labels = {
      healthy: 'Healthy',
      warning: 'Low Stock',
      critical: 'Critical',
    };
    const icons = {
      healthy: TrendingUp,
      warning: AlertTriangle,
      critical: AlertCircle,
    };
    const Icon = icons[status];
    
    return (
      <Badge variant="outline" className={cn('gap-1', styles[status])}>
        <Icon className="w-3 h-3" />
        {labels[status]}
      </Badge>
    );
  };

  const getStockPercentage = (item: InventoryItem) => {
    return Math.round((item.currentStock / item.maxCapacity) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn('glass-card rounded-xl border border-border/50 overflow-hidden', className)}
    >
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Inventory Monitor</h3>
          <p className="text-sm text-muted-foreground">Real-time stock levels and status</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success pulse-live" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">SKU</TableHead>
              <TableHead className="text-muted-foreground font-medium">Product</TableHead>
              <TableHead className="text-muted-foreground font-medium">Category</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Stock</TableHead>
              <TableHead className="text-muted-foreground font-medium">Level</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Value</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const stockPercentage = getStockPercentage(item);
              const status = getItemStatus(item);
              
              return (
                <motion.tr
                  key={item.sku}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    'border-border/30 transition-colors',
                    status === 'critical' && 'bg-danger/5',
                    status === 'warning' && 'bg-warning/5'
                  )}
                >
                  <TableCell className="font-mono text-sm text-primary">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    <motion.span
                      key={item.currentStock}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                    >
                      {item.currentStock.toLocaleString()}
                    </motion.span>
                    <span className="text-muted-foreground">/{item.maxCapacity}</span>
                  </TableCell>
                  <TableCell>
                    <div className="w-24 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            status === 'critical' && 'bg-danger',
                            status === 'warning' && 'bg-warning',
                            status === 'healthy' && 'bg-success'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${stockPercentage}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-8">
                        {stockPercentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatCurrency(item.currentStock * item.unitPrice)}
                  </TableCell>
                  <TableCell>{getStatusBadge(item)}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewPrediction(item.sku)}
                      className="hover:bg-primary/20 hover:text-primary"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Predict
                    </Button>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
