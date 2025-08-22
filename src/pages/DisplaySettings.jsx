
import React, { useState, useEffect } from "react";
import { AdminSetting } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Save,
  Grid,
  Layout,
  Maximize
} from "lucide-react";
import { motion } from "framer-motion";
import _ from "lodash";

const defaultSettings = {
  defaultScreenSize: "desktop",
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
  desktopBreakpoint: 1280,
  sidebarWidth: 280,
  headerHeight: 64,
  contentMaxWidth: 1200,
  gridColumns: 12,
  responsiveImages: true,
  stickyHeader: true,
  compactMode: false
};

export default function DisplaySettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [initialSettings, setInitialSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDisplaySettings();
  }, []);

  const loadDisplaySettings = async () => {
    try {
      const displaySettings = await AdminSetting.filter({ category: "display" });
      if (displaySettings.length > 0) {
        const loadedSettings = {};
        displaySettings.forEach(setting => {
          // Ensure value is parsed correctly, handle potential non-JSON strings or nulls
          try {
            loadedSettings[setting.key] = JSON.parse(setting.value);
          } catch (e) {
            console.warn(`Could not parse setting key '${setting.key}' with value '${setting.value}'. Using raw value.`);
            loadedSettings[setting.key] = setting.value;
          }
        });
        const newSettings = { ...defaultSettings, ...loadedSettings };
        setSettings(newSettings);
        setInitialSettings(newSettings);
      } else {
        // If no settings are found in DB, use default and set initial to default
        setSettings(defaultSettings);
        setInitialSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading display settings:', error);
      // Fallback to default settings if loading fails
      setSettings(defaultSettings);
      setInitialSettings(defaultSettings);
    }
  };

  const hasChanges = !_.isEqual(settings, initialSettings);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const existing = await AdminSetting.filter({ category: "display" });

      // Delete existing settings for the 'display' category
      const toDelete = existing.map(s => AdminSetting.delete(s.id));
      await Promise.all(toDelete);

      // Create new settings based on the current state
      const toCreate = Object.entries(settings).map(([key, value]) => {
        let dataType;
        if (typeof value === 'boolean') {
          dataType = 'boolean';
        } else if (typeof value === 'number') {
          dataType = 'number';
        } else if (typeof value === 'string') {
          dataType = 'string';
        } else {
          dataType = 'json'; // For objects/arrays if any
        }

        return AdminSetting.create({
          category: "display",
          key,
          value: JSON.stringify(value),
          label: _.startCase(key),
          data_type: dataType,
        });
      });
      await Promise.all(toCreate);

      // Update initialSettings to reflect the newly saved state
      setInitialSettings(settings);
    } catch (error) {
      console.error('Error saving display settings:', error);
      // Optionally, revert settings or show an error message
    }
    setIsLoading(false);
  };

  const screenSizes = [
    { value: "mobile", label: "Mobile First", icon: Smartphone, desc: "Start with mobile design" },
    { value: "tablet", label: "Tablet First", icon: Tablet, desc: "Start with tablet design" },
    { value: "desktop", label: "Desktop First", icon: Monitor, desc: "Start with desktop design" }
  ];

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
              Display Settings
            </h1>
            <p className="text-muted-foreground text-lg">Configure screen sizes, layouts, and responsive behavior</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              // Improved color contrast for the badge
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse">
                Unsaved Changes
              </Badge>
            )}
            <Button
              onClick={saveSettings}
              disabled={!hasChanges || isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="breakpoints" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/50 mb-8">
              <TabsTrigger value="breakpoints" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">Breakpoints</TabsTrigger>
              <TabsTrigger value="layout" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">Layout</TabsTrigger>
              <TabsTrigger value="responsive" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">Responsive</TabsTrigger>
            </TabsList>

            <TabsContent value="breakpoints" className="space-y-6">
              {/* Default Screen Size */}
              <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Monitor className="w-5 h-5" />
                    Default Screen Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {screenSizes.map((size) => (
                      <motion.div
                        key={size.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSettingChange('defaultScreenSize', size.value)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                          settings.defaultScreenSize === size.value
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-border hover:border-border/80 bg-secondary/20'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center space-y-3">
                          <size.icon className={`w-8 h-8 ${
                            settings.defaultScreenSize === size.value ? 'text-indigo-400' : 'text-muted-foreground'
                          }`} />
                          <div>
                            <h3 className={`font-medium ${
                              settings.defaultScreenSize === size.value ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {size.label}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{size.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Breakpoint Configuration */}
              <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Maximize className="w-5 h-5" />
                    Breakpoint Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Mobile Breakpoint
                      </Label>
                      <Slider
                        value={[settings.mobileBreakpoint]}
                        onValueChange={(value) => handleSettingChange('mobileBreakpoint', value[0])}
                        max={1200}
                        min={320}
                        step={8}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>320px</span>
                        <span className="text-foreground font-medium">{settings.mobileBreakpoint}px</span>
                        <span>1200px</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <Tablet className="w-4 h-4" />
                        Tablet Breakpoint
                      </Label>
                      <Slider
                        value={[settings.tabletBreakpoint]}
                        onValueChange={(value) => handleSettingChange('tabletBreakpoint', value[0])}
                        max={1400}
                        min={600}
                        step={8}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>600px</span>
                        <span className="text-foreground font-medium">{settings.tabletBreakpoint}px</span>
                        <span>1400px</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <Laptop className="w-4 h-4" />
                        Desktop Breakpoint
                      </Label>
                      <Slider
                        value={[settings.desktopBreakpoint]}
                        onValueChange={(value) => handleSettingChange('desktopBreakpoint', value[0])}
                        max={1920}
                        min={1000}
                        step={8}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1000px</span>
                        <span className="text-foreground font-medium">{settings.desktopBreakpoint}px</span>
                        <span>1920px</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6">
              <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Layout className="w-5 h-5" />
                    Layout Dimensions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Sidebar Width</Label>
                      <Slider
                        value={[settings.sidebarWidth]}
                        onValueChange={(value) => handleSettingChange('sidebarWidth', value[0])}
                        max={400}
                        min={200}
                        step={8}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>200px</span>
                        <span className="text-foreground font-medium">{settings.sidebarWidth}px</span>
                        <span>400px</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Header Height</Label>
                      <Slider
                        value={[settings.headerHeight]}
                        onValueChange={(value) => handleSettingChange('headerHeight', value[0])}
                        max={120}
                        min={40}
                        step={4}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>40px</span>
                        <span className="text-foreground font-medium">{settings.headerHeight}px</span>
                        <span>120px</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Content Max Width</Label>
                      <Slider
                        value={[settings.contentMaxWidth]}
                        onValueChange={(value) => handleSettingChange('contentMaxWidth', value[0])}
                        max={1600}
                        min={800}
                        step={16}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>800px</span>
                        <span className="text-foreground font-medium">{settings.contentMaxWidth}px</span>
                        <span>1600px</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Grid Columns</Label>
                      <Select
                        value={settings.gridColumns.toString()}
                        onValueChange={(value) => handleSettingChange('gridColumns', parseInt(value))}
                      >
                        <SelectTrigger className="bg-secondary border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {[8, 12, 16, 24].map((cols) => (
                            <SelectItem key={cols} value={cols.toString()} className="text-foreground">
                              {cols} columns
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responsive" className="space-y-6">
              <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Grid className="w-5 h-5" />
                    Responsive Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                      <div>
                        <Label className="text-muted-foreground">Responsive Images</Label>
                        <p className="text-sm text-muted-foreground">Automatically optimize images for different screen sizes</p>
                      </div>
                      <Switch
                        checked={settings.responsiveImages}
                        onCheckedChange={(checked) => handleSettingChange('responsiveImages', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                      <div>
                        <Label className="text-muted-foreground">Sticky Header</Label>
                        <p className="text-sm text-muted-foreground">Keep header visible while scrolling</p>
                      </div>
                      <Switch
                        checked={settings.stickyHeader}
                        onCheckedChange={(checked) => handleSettingChange('stickyHeader', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                      <div>
                        <Label className="text-muted-foreground">Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">Reduce spacing on smaller screens</p>
                      </div>
                      <Switch
                        checked={settings.compactMode}
                        onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Section */}
              <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Monitor className="w-5 h-5" />
                    Responsive Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-full h-32 bg-gradient-to-br from-secondary to-muted rounded-lg mb-2 p-3">
                        <div className="w-full h-6 bg-primary/20 rounded mb-2"></div>
                        <div className="grid grid-cols-1 gap-1">
                          <div className="h-3 bg-primary/20 rounded"></div>
                          <div className="h-3 bg-primary/20 rounded"></div>
                          <div className="h-3 bg-primary/20 rounded w-3/4"></div>
                        </div>
                      </div>
                      <p className="text-sm text-foreground">Mobile</p>
                      <p className="text-xs text-muted-foreground">&lt; {settings.mobileBreakpoint}px</p>
                    </div>

                    <div className="text-center">
                      <div className="w-full h-32 bg-gradient-to-br from-secondary to-muted rounded-lg mb-2 p-3">
                        <div className="w-full h-6 bg-primary/20 rounded mb-2"></div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="h-3 bg-primary/20 rounded"></div>
                          <div className="h-3 bg-primary/20 rounded"></div>
                          <div className="h-3 bg-primary/20 rounded"></div>
                          <div className="h-3 bg-primary/20 rounded"></div>
                        </div>
                      </div>
                      <p className="text-sm text-foreground">Tablet</p>
                      <p className="text-xs text-muted-foreground">{settings.mobileBreakpoint}px - {settings.tabletBreakpoint}px</p>
                    </div>

                    <div className="text-center">
                      <div className="w-full h-32 bg-gradient-to-br from-secondary to-muted rounded-lg mb-2 p-3 flex">
                        <div className="w-1/4 bg-primary/20 rounded mr-1"></div>
                        <div className="flex-1">
                          <div className="w-full h-4 bg-primary/20 rounded mb-1"></div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="h-2 bg-primary/20 rounded"></div>
                            <div className="h-2 bg-primary/20 rounded"></div>
                            <div className="h-2 bg-primary/20 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-foreground">Desktop</p>
                      <p className="text-xs text-muted-foreground">&gt; {settings.tabletBreakpoint}px</p>
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
