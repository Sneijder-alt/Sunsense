import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { KPICard } from "@/components/KPICard";
import { Activity, Zap, Shield, Cloud, Thermometer, Droplets } from "lucide-react";
import {
  currentPowerOutput,
  weatherData,
  kpiData,
  generate24HourForecast,
  maintenanceAlerts,
  batterySchedule,
} from "@/lib/dummyData";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const Dashboard = () => {
  const forecastData = generate24HourForecast();

  // Initialize notifications system
  const { triggerNotification } = useNotifications({
    maintenanceAlerts: maintenanceAlerts,
    forecastAccuracy: kpiData.forecastAccuracy,
    batterySchedule: batterySchedule,
  });

  // Simulate real-time notifications on mount
  useEffect(() => {
    // Welcome notification
    const welcomeTimer = setTimeout(() => {
      toast.success("SunSense AI Active", {
        description: "Real-time monitoring and alerts enabled",
        duration: 4000,
      });
    }, 1000);

    // Simulate a system check notification
    const systemCheckTimer = setTimeout(() => {
      triggerNotification(
        "info",
        "System Health Check Complete",
        "All systems operational. Monitoring 8 solar panels.",
        false
      );
    }, 3000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(systemCheckTimer);
    };
  }, [triggerNotification]);

  return (
    <div className="flex-1 p-8 space-y-8 bg-background">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Real-time solar power monitoring and forecasting</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Current Power Output"
          value={currentPowerOutput}
          unit="kW"
          icon={Zap}
          trend="up"
          iconBgClass="bg-primary/10"
        />
        <KPICard
          title="Forecast Accuracy"
          value={kpiData.forecastAccuracy}
          unit="%"
          icon={Activity}
          trend="up"
          iconBgClass="bg-secondary/10"
        />
        <KPICard
          title="Total Energy Today"
          value={kpiData.totalEnergyToday}
          unit="kWh"
          icon={Zap}
          trend="up"
          iconBgClass="bg-accent/10"
        />
        <KPICard
          title="System Health"
          value={kpiData.systemHealthScore}
          icon={Shield}
          trend="neutral"
          iconBgClass="bg-success/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 24-Hour Forecast Chart */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">24-Hour Power Forecast</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
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
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorPredicted)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Weather Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Weather Conditions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <span className="text-lg font-bold">{weatherData.temperature}°C</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">Cloud Cover</span>
              </div>
              <span className="text-lg font-bold">{weatherData.cloudCover}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">Irradiance</span>
              </div>
              <span className="text-lg font-bold">{weatherData.irradiance} W/m²</span>
            </div>
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg mt-4">
              <p className="text-sm font-medium text-center">{weatherData.conditions}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
