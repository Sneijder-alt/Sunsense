import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generate24HourForecast } from "@/lib/dummyData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Forecast = () => {
  const [timeHorizon, setTimeHorizon] = useState("24h");
  
  const allData = generate24HourForecast();
  
  // Filter data based on time horizon
  const getFilteredData = () => {
    switch (timeHorizon) {
      case "1h":
        return allData.slice(0, 1);
      case "6h":
        return allData.slice(0, 6);
      case "24h":
      default:
        return allData;
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="flex-1 p-8 space-y-8 bg-background">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Power Forecast</h1>
          <p className="text-muted-foreground">Predicted vs. Actual Power Generation</p>
        </div>
        
        <Select value={timeHorizon} onValueChange={setTimeHorizon}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="6h">6 Hours</SelectItem>
            <SelectItem value="24h">24 Hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Power Generation Comparison</h2>
          <p className="text-sm text-muted-foreground">
            Compare predicted solar power output against actual measurements
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={filteredData}>
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
            <Legend />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              name="Predicted Power"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--secondary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--secondary))", r: 4 }}
              name="Actual Power"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Predicted</h3>
          <p className="text-3xl font-bold text-foreground">
            {(filteredData.reduce((sum, d) => sum + d.predicted, 0) / filteredData.length).toFixed(1)} kW
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Actual</h3>
          <p className="text-3xl font-bold text-foreground">
            {(filteredData.reduce((sum, d) => sum + d.actual, 0) / filteredData.length).toFixed(1)} kW
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Accuracy</h3>
          <p className="text-3xl font-bold text-success">92.4%</p>
        </Card>
      </div>
    </div>
  );
};

export default Forecast;
