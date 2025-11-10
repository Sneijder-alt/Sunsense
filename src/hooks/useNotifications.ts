import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { MaintenanceAlert, BatteryScheduleItem } from "@/lib/dummyData";

interface NotificationOptions {
  maintenanceAlerts?: MaintenanceAlert[];
  forecastAccuracy?: number;
  batterySchedule?: BatteryScheduleItem[];
}

// Generate alert sound using Web Audio API
const playAlertSound = (priority: "high" | "medium" | "low") => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Different frequencies for different priorities
  const frequencies = {
    high: [800, 1000, 800], // Urgent beep pattern
    medium: [600, 800],
    low: [400],
  };

  const pattern = frequencies[priority];
  let time = audioContext.currentTime;

  pattern.forEach((freq, index) => {
    oscillator.frequency.setValueAtTime(freq, time);
    gainNode.gain.setValueAtTime(0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    time += 0.15;
  });

  oscillator.start(audioContext.currentTime);
  oscillator.stop(time);
};

export const useNotifications = ({
  maintenanceAlerts = [],
  forecastAccuracy,
  batterySchedule = [],
}: NotificationOptions) => {
  const notifiedAlerts = useRef(new Set<string>());
  const lastAccuracyCheck = useRef<number | null>(null);
  const lastBatteryCheck = useRef<string | null>(null);

  useEffect(() => {
    // Check for critical maintenance alerts
    maintenanceAlerts.forEach((alert) => {
      if (!notifiedAlerts.current.has(alert.id)) {
        notifiedAlerts.current.add(alert.id);

        if (alert.severity === "High") {
          playAlertSound("high");
          toast.error(`Critical Alert: ${alert.alertType}`, {
            description: `Panel ${alert.panelId} requires immediate attention`,
            duration: 10000,
            action: {
              label: "View Details",
              onClick: () => {
                window.location.href = "/maintenance";
              },
            },
          });
        } else if (alert.severity === "Medium") {
          playAlertSound("medium");
          toast.warning(`Maintenance Alert: ${alert.alertType}`, {
            description: `Panel ${alert.panelId} - ${alert.severity} priority`,
            duration: 6000,
          });
        }
      }
    });

    // Check forecast accuracy warnings
    if (forecastAccuracy !== undefined && forecastAccuracy !== lastAccuracyCheck.current) {
      lastAccuracyCheck.current = forecastAccuracy;

      if (forecastAccuracy < 85) {
        playAlertSound("medium");
        toast.warning("Forecast Accuracy Warning", {
          description: `Current accuracy: ${forecastAccuracy}% - Below optimal threshold`,
          duration: 5000,
        });
      } else if (forecastAccuracy < 75) {
        playAlertSound("high");
        toast.error("Low Forecast Accuracy", {
          description: `Current accuracy: ${forecastAccuracy}% - System recalibration recommended`,
          duration: 8000,
        });
      }
    }

    // Check battery optimization recommendations
    if (batterySchedule.length > 0) {
      const now = new Date();
      const currentHour = now.getHours();

      batterySchedule.forEach((schedule) => {
        const scheduleKey = `${schedule.action}-${schedule.timeRange}`;
        
        if (scheduleKey !== lastBatteryCheck.current) {
          const startHour = parseInt(schedule.timeRange.split(" - ")[0].split(":")[0]);
          
          // Notify when action is starting (simulated by checking hour match)
          if (startHour === currentHour && schedule.action !== "Idle") {
            lastBatteryCheck.current = scheduleKey;
            playAlertSound("low");
            toast.info("Battery Optimization Reminder", {
              description: `${schedule.action} battery during ${schedule.timeRange} - ${schedule.reason} (${schedule.powerKW} kW)`,
              duration: 7000,
              action: {
                label: "View Schedule",
                onClick: () => {
                  window.location.href = "/battery";
                },
              },
            });
          }
        }
      });
    }
  }, [maintenanceAlerts, forecastAccuracy, batterySchedule]);

  // Manual notification trigger function
  const triggerNotification = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    description: string,
    playSound = false
  ) => {
    if (playSound) {
      playAlertSound(type === "error" ? "high" : type === "warning" ? "medium" : "low");
    }
    toast[type](title, { description, duration: 5000 });
  };

  return { triggerNotification };
};
