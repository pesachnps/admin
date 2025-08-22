import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Activity,
  User,
  Settings,
  Palette,
  Shield,
  Monitor,
  ArrowRight,
  Globe
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "user_registered",
    title: "New user registered",
    description: "john.doe@example.com joined the system",
    time: "5 minutes ago",
    icon: User,
    color: "blue",
    user_email: "john.doe@example.com",
    ip_address: "192.168.1.45"
  },
  {
    id: 2,
    type: "theme_updated",
    title: "Theme settings updated", 
    description: "Primary color changed to indigo",
    time: "1 hour ago",
    icon: Palette,
    color: "purple",
    user_email: "admin@example.com",
    ip_address: "10.0.0.12"
  },
  {
    id: 3,
    type: "security_scan",
    title: "Security scan completed",
    description: "All systems secure, no threats detected",
    time: "2 hours ago",
    icon: Shield,
    color: "emerald",
    user_email: "system@example.com",
    ip_address: "127.0.0.1"
  },
  {
    id: 4,
    type: "display_updated",
    title: "Display settings modified",
    description: "Mobile breakpoint updated",
    time: "4 hours ago",
    icon: Monitor,
    color: "orange",
    user_email: "admin@example.com",
    ip_address: "10.0.0.12"
  },
  {
    id: 5,
    type: "backup_created",
    title: "System backup created",
    description: "Automated backup completed successfully",
    time: "6 hours ago",
    icon: Settings,
    color: "slate",
    user_email: "system@example.com",
    ip_address: "127.0.0.1"
  }
];

const colorClasses = {
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  slate: "text-slate-400 bg-slate-500/10 border-slate-500/20"
};

export default function ActivityFeed() {
  return (
    <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Activity className="w-5 h-5 text-indigo-400" />
            Recent Activity
          </CardTitle>
          <Link to={createPageUrl("ActivityLog")}>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors duration-200">
              <div className={`p-2 rounded-lg ${colorClasses[activity.color]} border`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-foreground">{activity.title}</h4>
                  <Badge variant="secondary" className="bg-muted/50 text-muted-foreground text-xs">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{activity.time}</span>
                  {activity.user_email && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{activity.user_email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <code className="text-xs">{activity.ip_address}</code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}