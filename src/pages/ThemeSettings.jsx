
import React from "react";
import { useTheme } from "../components/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Type, 
  Layers, 
  Eye, 
  Save,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

import ColorPicker from "../components/settings/ColorPicker";
import FontSelector from "../components/settings/FontSelector";
import PreviewPanel from "../components/settings/PreviewPanel";

export default function ThemeSettings() {
  const { settings, updateSetting, saveSettings, hasChanges, isLoading } = useTheme();

  const resetToDefaults = () => {
    updateSetting('primaryColor', "#6366f1");
    updateSetting('secondaryColor', "#8b5cf6");
    updateSetting('accentColor', "#06b6d4");
    updateSetting('backgroundColor', "#0f172a");
    updateSetting('textColor', "#f8fafc");
    updateSetting('fontFamily', "Inter");
    updateSetting('fontSize', 16);
    updateSetting('borderRadius', 8);
    updateSetting('spacing', 16);
    updateSetting('isDarkMode', true);
    updateSetting('animations', true);
    updateSetting('sidebarMode', "auto");
    updateSetting('sidebarState', "full");
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
              Theme Settings
            </h1>
            <p className="text-muted-foreground text-lg">Customize your application's visual appearance</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse">
                Unsaved Changes
              </Badge>
            )}
            <Button 
              variant="outline" 
              onClick={resetToDefaults}
              className="border-border text-muted-foreground hover:bg-secondary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={saveSettings}
              disabled={!hasChanges || isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
                  <TabsTrigger value="colors" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">Colors</TabsTrigger>
                  <TabsTrigger value="typography" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">Typography</TabsTrigger>
                  <TabsTrigger value="layout" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">Layout</TabsTrigger>
                  <TabsTrigger value="effects" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-primary-foreground">Effects</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="mt-6">
                  <Card className="bg-card/30 border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <Palette className="w-5 h-5" />
                        Color Scheme
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ColorPicker
                        label="Primary Color"
                        value={settings.primaryColor}
                        onChange={(color) => updateSetting('primaryColor', color)}
                      />
                      <ColorPicker
                        label="Secondary Color"
                        value={settings.secondaryColor}
                        onChange={(color) => updateSetting('secondaryColor', color)}
                      />
                      <ColorPicker
                        label="Accent Color"
                        value={settings.accentColor}
                        onChange={(color) => updateSetting('accentColor', color)}
                      />
                      <ColorPicker
                        label="Background Color"
                        value={settings.backgroundColor}
                        onChange={(color) => updateSetting('backgroundColor', color)}
                      />
                      <ColorPicker
                        label="Text Color"
                        value={settings.textColor}
                        onChange={(color) => updateSetting('textColor', color)}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="typography" className="mt-6">
                  <Card className="bg-card/30 border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <Type className="w-5 h-5" />
                        Typography
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FontSelector
                        value={settings.fontFamily}
                        onChange={(font) => updateSetting('fontFamily', font)}
                      />
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Font Size</Label>
                        <Slider
                          value={[settings.fontSize]}
                          onValueChange={(value) => updateSetting('fontSize', value[0])}
                          max={24}
                          min={12}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>12px</span>
                          <span className="text-foreground font-medium">{settings.fontSize}px</span>
                          <span>24px</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="layout" className="mt-6">
                  <Card className="bg-card/30 border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <Layers className="w-5 h-5" />
                        Layout & Spacing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Border Radius</Label>
                        <Slider
                          value={[settings.borderRadius]}
                          onValueChange={(value) => updateSetting('borderRadius', value[0])}
                          max={24}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>0px</span>
                          <span className="text-foreground font-medium">{settings.borderRadius}px</span>
                          <span>24px</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Spacing</Label>
                        <Slider
                          value={[settings.spacing]}
                          onValueChange={(value) => updateSetting('spacing', value[0])}
                          max={32}
                          min={8}
                          step={2}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>8px</span>
                          <span className="text-foreground font-medium">{settings.spacing}px</span>
                          <span>32px</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="effects" className="mt-6">
                  <Card className="bg-card/30 border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <Sparkles className="w-5 h-5" />
                        Visual Effects & Sidebar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Theme Effects */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Theme Options</h4>
                        <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                          <div>
                            <Label className="text-muted-foreground">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">Enable dark theme for main content</p>
                          </div>
                          <Switch
                            checked={settings.isDarkMode}
                            onCheckedChange={(checked) => updateSetting('isDarkMode', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                          <div>
                            <Label className="text-muted-foreground">Animations</Label>
                            <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
                          </div>
                          <Switch
                            checked={settings.animations}
                            onCheckedChange={(checked) => updateSetting('animations', checked)}
                          />
                        </div>
                      </div>

                      {/* Sidebar Theme */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Sidebar Theme</h4>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Sidebar Color Mode</Label>
                          <Select
                            value={settings.sidebarMode}
                            onValueChange={(value) => updateSetting('sidebarMode', value)}
                          >
                            <SelectTrigger className="bg-secondary border-border text-foreground">
                              <SelectValue placeholder="Select sidebar theme" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="auto" className="text-foreground">Auto (Follow Main Theme)</SelectItem>
                              <SelectItem value="light" className="text-foreground">Always Light</SelectItem>
                              <SelectItem value="dark" className="text-foreground">Always Dark</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Sidebar State */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Sidebar Layout</h4>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Sidebar State</Label>
                          <Select
                            value={settings.sidebarState}
                            onValueChange={(value) => updateSetting('sidebarState', value)}
                          >
                            <SelectTrigger className="bg-secondary border-border text-foreground">
                              <SelectValue placeholder="Select sidebar state" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="full" className="text-foreground">Full Size (Always Expanded)</SelectItem>
                              <SelectItem value="hybrid" className="text-foreground">Hybrid (Expand on Hover)</SelectItem>
                              <SelectItem value="compact" className="text-foreground">Compact (Icons Only)</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="text-xs text-muted-foreground mt-2">
                            {settings.sidebarState === 'full' && 'Sidebar will always show full navigation with text'}
                            {settings.sidebarState === 'hybrid' && 'Sidebar shows icons only, expands to full size on hover'}
                            {settings.sidebarState === 'compact' && 'Sidebar shows icons only, never expands'}
                          </div>
                        </div>
                      </div>

                      {/* Preview Info */}
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-medium text-foreground mb-2">Current Settings</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Main Theme:</span>
                            <Badge className={settings.isDarkMode ? "bg-slate-500/10 text-slate-400" : "bg-yellow-500/10 text-yellow-400"}>
                              {settings.isDarkMode ? 'Dark' : 'Light'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sidebar Theme:</span>
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                              {settings.sidebarMode === 'auto' ? 'Auto' : settings.sidebarMode}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sidebar State:</span>
                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                              {settings.sidebarState}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <PreviewPanel settings={settings} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
