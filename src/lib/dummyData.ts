// Dummy data for SunSense AI MVP

export interface PowerDataPoint {
  time: string;
  predicted: number;
  actual: number;
}

export interface MaintenanceAlert {
  id: string;
  panelId: string;
  alertType: string;
  severity: "Low" | "Medium" | "High";
  timestamp: string;
}

export interface BatteryScheduleItem {
  timeRange: string;
  action: "Charge" | "Discharge" | "Idle";
  reason: string;
  powerKW: number;
}

// Current power output (kW)
export const currentPowerOutput = 45.2;

// Weather summary
export const weatherData = {
  temperature: 28,
  cloudCover: 15,
  irradiance: 850,
  conditions: "Mostly Sunny"
};

// KPIs
export const kpiData = {
  forecastAccuracy: 92,
  totalEnergyToday: 234.5,
  systemHealthScore: "Good"
};

// Generate 24-hour forecast data
export const generate24HourForecast = (): PowerDataPoint[] => {
  const data: PowerDataPoint[] = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Solar power curve (peaks at midday)
    let basePower = 0;
    if (hour >= 6 && hour <= 18) {
      const hoursSinceSunrise = hour - 6;
      basePower = Math.sin((hoursSinceSunrise / 12) * Math.PI) * 50;
    }
    
    // Add some variation
    const predicted = Math.max(0, basePower + (Math.random() - 0.5) * 5);
    const actual = Math.max(0, predicted + (Math.random() - 0.5) * 8);
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      predicted: parseFloat(predicted.toFixed(1)),
      actual: parseFloat(actual.toFixed(1))
    });
  }
  
  return data;
};

// Maintenance alerts
export const maintenanceAlerts: MaintenanceAlert[] = [
  {
    id: "1",
    panelId: "Panel-A-12",
    alertType: "Hotspot suspected",
    severity: "High",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    panelId: "Panel-B-07",
    alertType: "Soiling high",
    severity: "Medium",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    panelId: "Panel-C-19",
    alertType: "Connection weak",
    severity: "Low",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    panelId: "Panel-A-08",
    alertType: "Output below expected",
    severity: "Medium",
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "5",
    panelId: "Panel-D-15",
    alertType: "Temperature anomaly",
    severity: "High",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Battery optimization schedule
export const batterySchedule: BatteryScheduleItem[] = [
  {
    timeRange: "06:00 - 10:00",
    action: "Idle",
    reason: "Low solar generation",
    powerKW: 0
  },
  {
    timeRange: "10:00 - 15:00",
    action: "Charge",
    reason: "Peak solar production",
    powerKW: 8.5
  },
  {
    timeRange: "15:00 - 18:00",
    action: "Idle",
    reason: "Maintaining charge",
    powerKW: 0
  },
  {
    timeRange: "18:00 - 22:00",
    action: "Discharge",
    reason: "Peak electricity pricing",
    powerKW: 6.2
  },
  {
    timeRange: "22:00 - 06:00",
    action: "Idle",
    reason: "Off-peak hours",
    powerKW: 0
  }
];
