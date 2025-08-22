
import React, { useState, useEffect } from "react";
import { AdminSetting } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Shield, 
  Database, 
  Bell,
  Save,
  AlertTriangle,
  CheckCircle,
  Server,
  Globe,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";
import _ from "lodash";

const defaultSettings = {
  security: {
    enableTwoFactor: true,
    sessionTimeout: 30,
    passwordPolicy: 'strict',
    enableAuditLog: true,
  },
  system: {
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: 'daily',
  },
  notifications: {
    emailNotifications: true,
    systemAlerts: true,
    errorReporting: true,
    reportingEmail: 'admin@example.com',
  },
  api: {
    rateLimitEnabled: true,
    maxRequestsPerMinute: 1000,
    apiVersioning: 'v1',
    corsEnabled: true
  }
};

export default function SystemSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [initialSettings, setInitialSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSystemSettings();
  }, []);

  const loadSystemSettings = async () => {
    const categories = ['security', 'system', 'notifications', 'api'];
    try {
      // Assuming AdminSetting.filter exists and can fetch by category
      const allSettings = await AdminSetting.filter({ category: { $in: categories } });
      if (allSettings.length > 0) {
        const loadedSettings = _.cloneDeep(defaultSettings); // Start with defaults
        allSettings.forEach(setting => {
          if (loadedSettings[setting.category] && Object.prototype.hasOwnProperty.call(loadedSettings[setting.category], setting.key)) {
            try {
              // Parse value from string, handling different types
              const parsedValue = JSON.parse(setting.value);
              // Ensure type consistency if needed, e.g., for numbers
              if (typeof loadedSettings[setting.category][setting.key] === 'number') {
                loadedSettings[setting.category][setting.key] = Number(parsedValue);
              } else if (typeof loadedSettings[setting.category][setting.key] === 'boolean') {
                loadedSettings[setting.category][setting.key] = Boolean(parsedValue);
              } else {
                loadedSettings[setting.category][setting.key] = parsedValue;
              }
            } catch (e) {
              console.warn(`Could not parse setting value for ${setting.category}.${setting.key}: ${setting.value}`);
              loadedSettings[setting.category][setting.key] = setting.value; // Fallback to raw string
            }
          }
        });
        setSettings(loadedSettings);
        setInitialSettings(loadedSettings);
      }
    } catch (error) {
      console.error('Error loading system settings:', error);
    }
  };
  
  const hasChanges = !_.isEqual(settings, initialSettings);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };
  
  const saveSettings = async () => {
    setIsLoading(true);
    const categories = ['security', 'system', 'notifications', 'api'];
    try {
      // Delete existing settings for these categories
      const existing = await AdminSetting.filter({ category: { $in: categories } });
      await Promise.all(existing.map(s => AdminSetting.delete(s.id)));

      // Prepare new settings to create
      const toCreate = [];
      for (const category in settings) {
        for (const key in settings[category]) {
          const value = settings[category][key];
          toCreate.push(AdminSetting.create({
            category,
            key,
            value: JSON.stringify(value), // Store all values as stringified JSON
            label: _.startCase(key),
            data_type: typeof value === 'boolean' ? 'boolean' : 
                       typeof value === 'number' ? 'number' : 'string', // Default to 'string' if not boolean/number
          }));
        }
      }
      await Promise.all(toCreate);
      setInitialSettings(settings); // Update initialSettings to reflect saved state
    } catch(error) {
      console.error("Error saving system settings", error);
      // Optionally, revert settings or show an error message
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent mb-2">
              System Settings
            </h1>
            <p className="text-muted-foreground text-lg">Configure security, system behavior, and notifications</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse">
                Unsaved Changes
              </Badge>
            )}
            <Button 
              onClick={saveSettings}
              disabled={!hasChanges || isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50 mb-8">
              <TabsTrigger value="security" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">Security</TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">System</TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">Notifications</TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">API</TabsTrigger>
            </TabsList>

            <TabsContent value="security" className="space-y-6">
              <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div>
                          <Label className="text-muted-foreground">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                        </div>
                        <Switch
                          checked={settings.security.enableTwoFactor}
                          onCheckedChange={(checked) => handleSettingChange('security', 'enableTwoFactor', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div>
                          <Label className="text-muted-foreground">Audit Logging</Label>
                          <p className="text-sm text-muted-foreground">Track all admin actions</p>
                        </div>
                        <Switch
                          checked={settings.security.enableAuditLog}
                          onCheckedChange={(checked) => handleSettingChange('security', 'enableAuditLog', checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Session Timeout (minutes)</Label>
                        <Input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Password Policy</Label>
                        <Select
                          value={settings.security.passwordPolicy}
                          onValueChange={(value) => handleSettingChange('security', 'passwordPolicy', value)}
                        >
                          <SelectTrigger className="bg-secondary border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="basic" className="text-foreground">Basic</SelectItem>
                            <SelectItem value="moderate" className="text-foreground">Moderate</SelectItem>
                            <SelectItem value="strict" className="text-foreground">Strict</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Server className="w-5 h-5 text-green-400" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div>
                          <Label className="text-muted-foreground flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                            Maintenance Mode
                          </Label>
                          <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
                        </div>
                        <Switch
                          checked={settings.system.maintenanceMode}
                          onCheckedChange={(checked) => handleSettingChange('system', 'maintenanceMode', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div>
                          <Label className="text-muted-foreground">Debug Mode</Label>
                          <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
                        </div>
                        <Switch
                          checked={settings.system.debugMode}
                          onCheckedChange={(checked) => handleSettingChange('system', 'debugMode', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div>
                          <Label className="text-muted-foreground">Cache System</Label>
                          <p className="text-sm text-muted-foreground">Enable application caching</p>
                        </div>
                        <Switch
                          checked={settings.system.cacheEnabled}
                          onCheckedChange={(checked) => handleSettingChange('system', 'cacheEnabled', checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Backup Frequency</Label>
                        <Select
                          value={settings.system.backupFrequency}
                          onValueChange={(value) => handleSettingChange('system', 'backupFrequency', value)}
                        >
                          <SelectTrigger className="bg-secondary border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="hourly" className="text-foreground">Hourly</SelectItem>
                            <SelectItem value="daily" className="text-foreground">Daily</SelectItem>
                            <SelectItem value="weekly" className="text-foreground">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* System Status */}
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <Label className="text-muted-foreground flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          System Status
                        </Label>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Database</span>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              Healthy
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cache</span>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              Active
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Storage</span>
                            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                              78% Full
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div>
                          <Label className="text-muted-foreground">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive admin notifications via email</p>
                        </div>
                        <Switch
                          checked={settings.notifications.emailNotifications}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'emailNotifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div>
                          <Label className="text-muted-foreground">System Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified of system issues</p>
                        </div>
                        <Switch
                          checked={settings.notifications.systemAlerts}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'systemAlerts', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div>
                          <Label className="text-muted-foreground">Error Reporting</Label>
                          <p className="text-sm text-muted-foreground">Automatic error notifications</p>
                        </div>
                        <Switch
                          checked={settings.notifications.errorReporting}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'errorReporting', checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Reporting Email</Label>
                        <Input
                          type="email"
                          value={settings.notifications.reportingEmail}
                          onChange={(e) => handleSettingChange('notifications', 'reportingEmail', e.target.value)}
                          className="bg-secondary border-border text-foreground"
                          placeholder="admin@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    API Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div>
                          <Label className="text-muted-foreground">Rate Limiting</Label>
                          <p className="text-sm text-muted-foreground">Enable API rate limiting</p>
                        </div>
                        <Switch
                          checked={settings.api.rateLimitEnabled}
                          onCheckedChange={(checked) => handleSettingChange('api', 'rateLimitEnabled', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div>
                          <Label className="text-muted-foreground">CORS</Label>
                          <p className="text-sm text-muted-foreground">Enable cross-origin requests</p>
                        </div>
                        <Switch
                          checked={settings.api.corsEnabled}
                          onCheckedChange={(checked) => handleSettingChange('api', 'corsEnabled', checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Max Requests Per Minute</Label>
                        <Input
                          type="number"
                          value={settings.api.maxRequestsPerMinute}
                          onChange={(e) => handleSettingChange('api', 'maxRequestsPerMinute', parseInt(e.target.value))}
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-muted-foreground">API Version</Label>
                        <Select
                          value={settings.api.apiVersioning}
                          onValueChange={(value) => handleSettingChange('api', 'apiVersioning', value)}
                        >
                          <SelectTrigger className="bg-secondary border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="v1" className="text-foreground">v1</SelectItem>
                            <SelectItem value="v2" className="text-foreground">v2</SelectItem>
                            <SelectItem value="beta" className="text-foreground">Beta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
