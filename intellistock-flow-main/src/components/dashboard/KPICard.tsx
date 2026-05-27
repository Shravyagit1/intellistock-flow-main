// import { motion } from 'framer-motion';
// import { LucideIcon } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface KPICardProps {
//   title: string;
//   value: string | number;
//   subtitle?: string;
//   icon: LucideIcon;
//   trend?: {
//     value: number;
//     isPositive: boolean;
//   };
//   status?: 'healthy' | 'warning' | 'critical' | 'neutral';
//   className?: string;
// }

// export function KPICard({
//   title,
//   value,
//   subtitle,
//   icon: Icon,
//   trend,
//   status = 'neutral',
//   className,
// }: KPICardProps) {
//   const statusStyles = {
//     healthy: 'border-success/30 shadow-[0_0_20px_hsla(160,84%,39%,0.15)]',
//     warning: 'border-warning/30 shadow-[0_0_20px_hsla(38,92%,50%,0.15)]',
//     critical: 'border-danger/30 shadow-[0_0_20px_hsla(0,84%,60%,0.15)]',
//     neutral: 'border-border/50',
//   };

//   const iconStyles = {
//     healthy: 'bg-success/20 text-success',
//     warning: 'bg-warning/20 text-warning',
//     critical: 'bg-danger/20 text-danger',
//     neutral: 'bg-primary/20 text-primary',
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className={cn(
//         'glass-card p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02]',
//         statusStyles[status],
//         className
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
//             {title}
//           </p>
//           <div className="mt-2 flex items-baseline gap-2 min-w-0">
//             <motion.span
//               key={String(value)}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-foreground truncate"
//             >
//               {value}
//             </motion.span>
//             {trend && (
//               <span
//                 className={cn(
//                   'text-sm font-medium',
//                   trend.isPositive ? 'text-success' : 'text-danger'
//                 )}
//               >
//                 {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
//               </span>
//             )}
//           </div>
//           {subtitle && (
//             <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
//           )}
//         </div>
//         <div className={cn('p-3 rounded-lg', iconStyles[status])}>
//           <Icon className="w-6 h-6" />
//         </div>
//       </div>
//     </motion.div>
//   );
// }


import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: 'healthy' | 'warning' | 'critical' | 'neutral';
  className?: string;
}

/** Indian number formatter */
const formatINR = (val: string | number) => {
  if (typeof val !== 'number') return val;
  return val.toLocaleString('en-IN');
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  status = 'neutral',
  className,
}: KPICardProps) {
  const statusStyles = {
    healthy: 'border-success/30 shadow-[0_0_20px_hsla(160,84%,39%,0.15)]',
    warning: 'border-warning/30 shadow-[0_0_20px_hsla(38,92%,50%,0.15)]',
    critical: 'border-danger/30 shadow-[0_0_20px_hsla(0,84%,60%,0.15)]',
    neutral: 'border-border/50',
  };

  const iconStyles = {
    healthy: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    critical: 'bg-danger/20 text-danger',
    neutral: 'bg-primary/20 text-primary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'glass-card p-6 rounded-xl border overflow-hidden transition-all duration-300 hover:scale-[1.02]',
        statusStyles[status],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* LEFT CONTENT */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>

          <div className="mt-2 flex items-baseline gap-2 min-w-0">
            {/* <motion.span
              key={String(value)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="block max-w-[85%] text-2xl sm:text-3xl font-bold font-mono tabular-nums text-foreground truncate"
              title={typeof value === 'number' ? `₹${formatINR(value)}` : String(value)}
            >
              {typeof value === 'number' ? `₹${formatINR(value)}` : value}
            </motion.span> */}

            <motion.span
  key={String(value)}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="block max-w-[85%] text-2xl sm:text-3xl font-bold font-mono tabular-nums text-foreground truncate cursor-default"
  title={
    typeof value === 'number'
      ? `₹${value.toLocaleString('en-IN')}`
      : String(value)
  }
>
  {typeof value === 'number'
    ? `₹${value.toLocaleString('en-IN')}`
    : value}
</motion.span>


            {trend && (
              <span
                className={cn(
                  'shrink-0 text-sm font-medium',
                  trend.isPositive ? 'text-success' : 'text-danger'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>

          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* ICON */}
        <div className={cn('shrink-0 p-3 rounded-lg', iconStyles[status])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
