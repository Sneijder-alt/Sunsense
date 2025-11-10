import { Card } from "@/components/ui/card";
import { batterySchedule } from "@/lib/dummyData";
import { Battery as BatteryIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Battery = () => {
  const getActionColor = (action: string) => {
    switch (action) {
      case "Charge":
        return "hsl(var(--accent))";
      case "Discharge":
        return "hsl(var(--primary))";
      default:
        return "hsl(var(--muted))";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Charge":
        return <TrendingUp className="h-5 w-5 text-accent" />;
      case "Discharge":
        return <TrendingDown className="h-5 w-5 text-primary" />;
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex-1 p-8 space-y-8 bg-background">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Battery Optimization</h1>
        <p className="text-muted-foreground">Smart charging and discharging schedule</p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Current Charge</span>
            <BatteryIcon className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">78%</p>
          <p className="text-sm text-muted-foreground mt-2">12.4 kWh / 16 kWh</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Today's Savings</span>
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-accent">$12.40</p>
          <p className="text-sm text-muted-foreground mt-2">18% more than average</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Optimization Score</span>
            <BatteryIcon className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-success">94%</p>
          <p className="text-sm text-muted-foreground mt-2">Excellent performance</p>
        </Card>
      </div>

      {/* Schedule Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Power Schedule</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={batterySchedule}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="timeRange"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
              label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="powerKW" radius={[8, 8, 0, 0]}>
              {batterySchedule.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getActionColor(entry.action)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Schedule Details */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recommended Schedule</h2>
        <div className="space-y-4">
          {batterySchedule.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-background rounded-lg">
                  {getActionIcon(item.action)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.timeRange}</p>
                  <p className="text-sm text-muted-foreground">{item.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-foreground">{item.action}</p>
                {item.powerKW > 0 && (
                  <p className="text-sm text-muted-foreground">{item.powerKW} kW</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Battery;
