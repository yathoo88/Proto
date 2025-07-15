import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  className?: string;
  chart?: React.ReactNode;
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendType = 'neutral',
  className,
  chart
}: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center space-x-2 text-xs mt-1">
            <span 
              className={cn(
                "font-medium",
                trendType === 'positive' && "text-green-600",
                trendType === 'negative' && "text-red-600",
                trendType === 'neutral' && "text-gray-600"
              )}
            >
              {trend}
            </span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        )}
        {chart && (
          <div className="mt-4">
            {chart}
          </div>
        )}
      </CardContent>
    </Card>
  );
}