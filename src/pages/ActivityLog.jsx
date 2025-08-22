import React, { useState, useEffect } from "react";
import { ActivityLog } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Calendar, 
  Search, 
  Filter,
  User,
  Settings,
  Palette,
  Shield,
  Monitor,
  Database,
  Globe,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

const actionIcons = {
  user_registered: User,
  theme_updated: Palette,
  display_updated: Monitor,
  system_updated: Settings,
  user_modified: User,
  security_scan: Shield,
  backup_created: Database,
  setting_changed: Settings
};

const actionColors = {
  user_registered: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  theme_updated: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  display_updated: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  system_updated: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  user_modified: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  security_scan: "text-red-400 bg-red-500/10 border-red-500/20",
  backup_created: "text-green-400 bg-green-500/10 border-green-500/20",
  setting_changed: "text-slate-400 bg-slate-500/10 border-slate-500/20"
};

export default function ActivityLogPage() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, selectedYear, selectedMonth, searchTerm, selectedAction]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const activityData = await ActivityLog.list('-created_date', 500);
      setActivities(activityData);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
    setIsLoading(false);
  };

  const filterActivities = () => {
    let filtered = activities;

    // Filter by year and month
    if (selectedYear && selectedMonth) {
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.created_date);
        return (
          activityDate.getFullYear().toString() === selectedYear &&
          (activityDate.getMonth() + 1).toString() === selectedMonth
        );
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.ip_address.includes(searchTerm)
      );
    }

    // Filter by action type
    if (selectedAction && selectedAction !== "all") {
      filtered = filtered.filter(activity => activity.action_type === selectedAction);
    }

    setFilteredActivities(filtered);
  };

  const exportActivities = () => {
    const csvContent = [
      ["Date", "User", "Action", "Description", "IP Address"].join(","),
      ...filteredActivities.map(activity => [
        new Date(activity.created_date).toLocaleString(),
        activity.user_email || "System",
        activity.action_type,
        activity.description.replace(/,/g, ";"),
        activity.ip_address
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${selectedYear}-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent mb-2">
              Activity Log
            </h1>
            <p className="text-muted-foreground text-lg">Complete audit trail of all system activities</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-2">
              {filteredActivities.length} Activities
            </Badge>
            <Button 
              variant="outline" 
              onClick={exportActivities}
              className="border-border text-muted-foreground hover:bg-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Filter className="w-5 h-5" />
                Filter Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()} className="text-foreground">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Month</label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {months.map(month => (
                        <SelectItem key={month.value} value={month.value} className="text-foreground">
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Action Type</label>
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all" className="text-foreground">All Actions</SelectItem>
                      <SelectItem value="user_registered" className="text-foreground">User Registered</SelectItem>
                      <SelectItem value="theme_updated" className="text-foreground">Theme Updated</SelectItem>
                      <SelectItem value="display_updated" className="text-foreground">Display Updated</SelectItem>
                      <SelectItem value="system_updated" className="text-foreground">System Updated</SelectItem>
                      <SelectItem value="security_scan" className="text-foreground">Security Scan</SelectItem>
                      <SelectItem value="backup_created" className="text-foreground">Backup Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by description, user, or IP..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-secondary/50 border-border text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="bg-card/30 border-border/50 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-secondary rounded w-3/4"></div>
                          <div className="h-3 bg-secondary rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            filteredActivities.map((activity, index) => {
              const Icon = actionIcons[activity.action_type] || Activity;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="bg-card/30 border-border/50 backdrop-blur-xl hover:bg-card/40 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${actionColors[activity.action_type]} border`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{activity.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>{formatDate(activity.created_date)}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                            {activity.user_email && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">{activity.user_name || activity.user_email}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-muted-foreground" />
                              <code className="px-2 py-1 bg-secondary rounded text-foreground font-mono text-xs">
                                {activity.ip_address}
                              </code>
                            </div>
                            <Badge className={`${actionColors[activity.action_type]} border text-xs`}>
                              {activity.action_type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}

          {!isLoading && filteredActivities.length === 0 && (
            <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
              <CardContent className="p-12 text-center">
                <Activity className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No activities found</h3>
                <p className="text-muted-foreground/80">Try adjusting your filters or search criteria.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}