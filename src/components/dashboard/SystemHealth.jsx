
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart,
  Cpu,
  HardDrive,
  Wifi,
  Database
} from "lucide-react";

const healthMetrics = [
  {
    name: "CPU Usage",
    value: 34,
    status: "good",
    icon: Cpu
  },
  {
    name: "Memory",
    value: 67,
    status: "warning",
    icon: HardDrive
  },
  {
    name: "Network",
    value: 89,
    status: "good",
    icon: Wifi
  },
  {
    name: "Database",
    value: 23,
    status: "good",
    icon: Database
  }
];

const getStatusColor = (status, value) => {
  if (status === 'good') return 'text-emerald-400 bg-emerald-500/20';
  if (status === 'warning') return 'text-yellow-400 bg-yellow-500/20';
  return 'text-red-400 bg-red-500/20';
};

const getProgressColor = (value) => {
  if (value < 50) return 'bg-emerald-500';
  if (value < 80) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function SystemHealth() {
  return (
    <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Heart className="w-5 h-5 text-red-400" />
            System Health
          </CardTitle>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Healthy
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {healthMetrics.map((metric) => (
          <div key={metric.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{metric.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{metric.value}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={metric.value} 
                className="h-2 bg-secondary/50" 
              />
              <div 
                className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(metric.value)} transition-all duration-300`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
