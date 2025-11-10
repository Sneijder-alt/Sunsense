import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  iconBgClass?: string;
}

export function KPICard({ title, value, unit, icon: Icon, trend, iconBgClass }: KPICardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
          </div>
        </div>
        <div className={cn("p-3 rounded-lg", iconBgClass || "bg-primary/10")}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className={cn(
            "text-xs font-medium",
            trend === "up" && "text-success",
            trend === "down" && "text-destructive",
            trend === "neutral" && "text-muted-foreground"
          )}>
            {trend === "up" && "↑ Trending up"}
            {trend === "down" && "↓ Trending down"}
            {trend === "neutral" && "→ Stable"}
          </span>
        </div>
      )}
    </Card>
  );
}
