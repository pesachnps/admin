import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ActivityLog } from "@/api/entities";
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

const actionIcons = {
  user_registered: User,
  theme_updated: Palette,
  display_updated: Monitor,
  system_updated: Settings,
  user_modified: User,
  security_scan: Shield,
  backup_created: Settings,
  setting_changed: Settings
};

const colorClasses = {
  user_registered: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  theme_updated: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  display_updated: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  system_updated: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  user_modified: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  security_scan: "text-red-400 bg-red-500/10 border-red-500/20",
  backup_created: "text-green-400 bg-green-500/10 border-green-500/20",
  setting_changed: "text-slate-400 bg-slate-500/10 border-slate-500/20"
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = async () => {
    setIsLoading(true);
    try {
      const recentActivities = await ActivityLog.list('-created_date', 5);
      setActivities(recentActivities);
    } catch (error) {
      console.error('Error loading recent activities:', error);
    }
    setIsLoading(false);
  };

  const formatTime = (dateString) => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

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
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/20">
                  <div className="w-8 h-8 bg-secondary rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-secondary rounded w-3/4"></div>
                    <div className="h-3 bg-secondary rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = actionIcons[activity.action_type] || Activity;
              return (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors duration-200">
                  <div className={`p-2 rounded-lg ${colorClasses[activity.action_type]} border`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-foreground">{activity.title}</h4>
                      <Badge variant="secondary" className="bg-muted/50 text-muted-foreground text-xs">
                        {activity.action_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatTime(activity.created_date)}</span>
                      {activity.user_email && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{activity.user_name || activity.user_email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <code className="text-xs">{activity.ip_address}</code>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground/70">Activity will appear here when users perform actions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}