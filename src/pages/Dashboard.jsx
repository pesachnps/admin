
import React, { useState, useEffect } from "react";
import { AdminSetting } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Users, 
  Settings, 
  Shield, 
  TrendingUp, 
  Monitor,
  Palette,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

import StatsCards from "../components/dashboard/StatsCards";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import QuickActions from "../components/dashboard/QuickActions";
import SystemHealth from "../components/dashboard/SystemHealth";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSettings: 0,
    systemStatus: 'operational',
    uptime: '99.9%'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [users, settings] = await Promise.all([
        User.list(),
        AdminSetting.list()
      ]);
      
      setStats({
        totalUsers: users.length,
        activeSettings: settings.length,
        systemStatus: 'operational',
        uptime: '99.9%'
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">Monitor and control your system settings</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              System Online
            </Badge>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25">
              <Settings className="w-4 h-4 mr-2" />
              Quick Setup
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCards
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            gradient="from-blue-500 to-blue-600"
            trend="+12%"
            isLoading={isLoading}
          />
          <StatsCards
            title="Active Settings"
            value={stats.activeSettings}
            icon={Settings}
            gradient="from-purple-500 to-purple-600"
            trend="+8%"
            isLoading={isLoading}
          />
          <StatsCards
            title="System Uptime"
            value={stats.uptime}
            icon={Activity}
            gradient="from-emerald-500 to-emerald-600"
            trend="99.9%"
            isLoading={isLoading}
          />
          <StatsCards
            title="Security Status"
            value="Secure"
            icon={Shield}
            gradient="from-amber-500 to-amber-600"
            trend="All Clear"
            isLoading={isLoading}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions & Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <QuickActions />
            <ActivityFeed />
          </motion.div>

          {/* System Health */}
          <motion.div variants={itemVariants} className="space-y-6">
            <SystemHealth />
            
            {/* Recent Changes */}
            <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  Recent Changes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Theme updated</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">User permissions modified</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">System backup completed</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
