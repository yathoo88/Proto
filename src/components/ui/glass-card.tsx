import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function GlassCard({ 
  className, 
  children, 
  ...props 
}: React.ComponentProps<typeof Card>) {
  return (
    <Card 
      className={cn(
        "backdrop-blur-xl bg-white/10 border-white/20 shadow-xl",
        "dark:bg-gray-900/20 dark:border-gray-700/30",
        className
      )} 
      {...props}
    >
      {children}
    </Card>
  );
}