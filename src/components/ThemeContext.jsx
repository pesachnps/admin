
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { AdminSetting } from '@/api/entities';
import _ from 'lodash';
import { logActivity } from './activityLogger';

const defaultSettings = {
  primaryColor: "#6366f1",
  secondaryColor: "#8b5cf6",
  accentColor: "#06b6d4",
  backgroundColor: "#0f172a",
  textColor: "#f8fafc",
  fontFamily: "Inter",
  fontSize: 16,
  borderRadius: 8,
  spacing: 16,
  isDarkMode: true,
  animations: true,
  sidebarMode: "auto", // "auto", "light", "dark"
  sidebarState: "full" // "compact", "hybrid", "full"
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [settings, setSettings] = useState(defaultSettings);
    const [initialSettings, setInitialSettings] = useState(defaultSettings);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        loadThemeSettings();
    }, []);

    // Apply dark/light mode to document
    useEffect(() => {
        const root = document.documentElement;
        if (settings.isDarkMode) {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    }, [settings.isDarkMode]);

    const loadThemeSettings = async () => {
        try {
            const themeSettings = await AdminSetting.filter({ category: "theme" });
            if (themeSettings.length > 0) {
                const loadedSettings = {};
                themeSettings.forEach(setting => {
                    try {
                        loadedSettings[setting.key] = JSON.parse(setting.value);
                    } catch (e) {
                        console.error(`Error parsing setting ${setting.key}:`, e);
                    }
                });
                const newSettings = { ...defaultSettings, ...loadedSettings };
                setSettings(newSettings);
                setInitialSettings(newSettings);
            }
        } catch (error) {
            console.error('Error loading theme settings:', error);
        }
    };

    const updateSetting = useCallback((key, value) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };
            
            // Auto-adjust colors based on dark/light mode
            if (key === 'isDarkMode') {
                if (value) {
                    // Dark mode colors
                    newSettings.backgroundColor = "hsl(222 47% 11%)";
                    newSettings.textColor = "hsl(210 40% 98%)";
                } else {
                    // Light mode colors
                    newSettings.backgroundColor = "hsl(0 0% 100%)";
                    newSettings.textColor = "hsl(224 71% 4%)";
                }
            }
            
            return newSettings;
        });
    }, []);

    const saveSettings = async () => {
        setIsLoading(true);
        try {
            const existing = await AdminSetting.filter({ category: "theme" });
            const existingByKey = _.keyBy(existing, 'key');
            
            const promises = Object.entries(settings).map(async ([key, value]) => {
                const existingSetting = existingByKey[key];
                const valueString = JSON.stringify(value);
                
                if (existingSetting) {
                    if (existingSetting.value !== valueString) {
                        return AdminSetting.update(existingSetting.id, { value: valueString });
                    }
                } else {
                    return AdminSetting.create({
                        category: "theme",
                        key,
                        value: valueString,
                        label: _.startCase(key),
                        data_type: typeof value === 'boolean' ? 'boolean' : 
                                   typeof value === 'number' ? 'number' : 
                                   key.includes('Color') ? 'color' : 'string',
                    });
                }
            });

            await Promise.all(promises);
            setInitialSettings(settings);
            
            // Log the activity
            await logActivity(
                'theme_updated',
                'Theme settings updated',
                `Updated theme settings including colors, typography, and layout preferences`,
                { updatedSettings: settings }
            );
            
        } catch (error) {
            console.error('Error saving settings:', error);
        }
        setIsLoading(false);
    };

    const hasChanges = useMemo(() => {
        return !_.isEqual(settings, initialSettings);
    }, [settings, initialSettings]);

    const themeStyles = useMemo(() => {
        const lightColors = {
            background: "hsl(0 0% 100%)",
            foreground: "hsl(224 71% 4%)",
            card: "hsl(0 0% 100%)",
            cardForeground: "hsl(224 71% 4%)",
            popover: "hsl(0 0% 100%)",
            popoverForeground: "hsl(224 71% 4%)",
            primary: settings.primaryColor,
            primaryForeground: "hsl(0 0% 100%)",
            secondary: "hsl(220 14% 92%)",
            secondaryForeground: "hsl(224 71% 4%)",
            muted: "hsl(220 14% 96%)",
            mutedForeground: "hsl(220 8% 46%)",
            accent: "hsl(220 14% 96%)",
            accentForeground: "hsl(224 71% 4%)",
            destructive: "hsl(0 84% 60%)",
            destructiveForeground: "hsl(0 0% 100%)",
            border: "hsl(220 13% 85%)",
            input: "hsl(220 13% 85%)",
            ring: settings.primaryColor,
        };

        const darkColors = {
            background: "hsl(224 71% 4%)",
            foreground: "hsl(0 0% 98%)",
            card: "hsl(224 63% 8%)",
            cardForeground: "hsl(0 0% 98%)",
            popover: "hsl(224 63% 8%)", // Changed from background color to card color
            popoverForeground: "hsl(0 0% 98%)",
            primary: settings.primaryColor,
            primaryForeground: "hsl(0 0% 98%)",
            secondary: "hsl(215 27% 16%)",
            secondaryForeground: "hsl(0 0% 98%)",
            muted: "hsl(215 27% 17%)",
            mutedForeground: "hsl(217 10% 65%)",
            accent: "hsl(215 27% 17%)",
            accentForeground: "hsl(0 0% 98%)",
            destructive: "hsl(0 62% 30%)",
            destructiveForeground: "hsl(0 85% 97%)",
            border: "hsl(215 27% 20%)",
            input: "hsl(215 27% 20%)",
            ring: settings.primaryColor,
        };

        const sidebarColors = (() => {
          if (settings.sidebarMode === "light") {
            return {
              background: "hsl(0 0% 100%)",
              foreground: "hsl(224 71% 4%)",
              border: "hsl(220 13% 88%)",
              secondary: "hsl(220 14% 90%)",
              muted: "hsl(220 8% 46%)"
            };
          } else if (settings.sidebarMode === "dark") {
            return {
              background: "hsl(224 71% 4%)",
              foreground: "hsl(0 0% 98%)",
              border: "hsl(215 27% 25%)",
              secondary: "hsl(215 27% 25%)",
              muted: "hsl(217 10% 65%)"
            };
          } else {
            // Auto mode - follows main theme
            return settings.isDarkMode ? {
              background: "hsl(224 71% 4%)",
              foreground: "hsl(0 0% 98%)",
              border: "hsl(215 27% 25%)",
              secondary: "hsl(215 27% 25%)",
              muted: "hsl(217 10% 65%)"
            } : {
              background: "hsl(0 0% 100%)",
              foreground: "hsl(224 71% 4%)",
              border: "hsl(220 13% 88%)",
              secondary: "hsl(220 14% 90%)",
              muted: "hsl(220 8% 46%)"
            };
          }
        })();

        const colors = settings.isDarkMode ? darkColors : lightColors;

        return `
            :root {
                --background: ${colors.background};
                --foreground: ${colors.foreground};
                --card: ${colors.card};
                --card-foreground: ${colors.cardForeground};
                --popover: ${colors.popover};
                --popover-foreground: ${colors.popoverForeground};
                --primary: ${settings.primaryColor};
                --primary-foreground: ${colors.primaryForeground};
                --secondary: ${colors.secondary};
                --secondary-foreground: ${colors.secondaryForeground};
                --muted: ${colors.muted};
                --muted-foreground: ${colors.mutedForeground};
                --accent: ${colors.accent};
                --accent-foreground: ${colors.accentForeground};
                --destructive: ${colors.destructive};
                --destructive-foreground: ${colors.destructiveForeground};
                --border: ${colors.border};
                --input: ${colors.input};
                --ring: ${settings.primaryColor};
                --radius: ${settings.borderRadius}px;
                --spacing: ${settings.spacing}px;
                
                /* Sidebar specific colors */
                --sidebar-background: ${sidebarColors.background};
                --sidebar-foreground: ${sidebarColors.foreground};
                --sidebar-border: ${sidebarColors.border};
                --sidebar-secondary: ${sidebarColors.secondary};
                --sidebar-muted: ${sidebarColors.muted};
            }
            
            body {
                background-color: hsl(var(--background)) !important;
                color: hsl(var(--foreground)) !important;
                font-family: '${settings.fontFamily}', sans-serif;
                font-size: ${settings.fontSize}px;
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            /* Sidebar styling */
            [data-sidebar] {
              background-color: hsl(var(--sidebar-background)) !important;
              border-color: hsl(var(--sidebar-border)) !important;
              ${settings.sidebarState === 'compact' ? 'width: 64px !important;' : ''}
              transition: all 0.3s ease;
            }

            [data-sidebar] * {
              color: hsl(var(--sidebar-foreground)) !important;
            }

            [data-sidebar] [data-sidebar-header] {
              border-color: hsl(var(--sidebar-border)) !important;
            }

            [data-sidebar] [data-sidebar-footer] {
              border-color: hsl(var(--sidebar-border)) !important;
            }

            /* Hybrid sidebar state */
            ${settings.sidebarState === 'hybrid' ? `
              [data-sidebar] {
                width: 64px !important;
              }
              
              [data-sidebar]:hover {
                width: 280px !important;
              }
              
              [data-sidebar]:not(:hover) .sidebar-text {
                opacity: 0;
                width: 0;
                overflow: hidden;
              }
              
              [data-sidebar]:hover .sidebar-text {
                opacity: 1;
                width: auto;
              }

              /* Remove borders in hybrid mode */
              div[data-side] > div:nth-child(2) { border: 0 !important; }
              [data-sidebar-header], [data-sidebar-footer] { border: 0 !important; }
              [data-sidebar] [data-sidebar="menu-sub"] { border: 0 !important; }

              /* Center icons when collapsed (not hovered) */
              [data-sidebar]:not(:hover) [data-sidebar-menu-button] {
                justify-content: center !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
              }

              /* Center header and footer content when collapsed */
              [data-sidebar]:not(:hover) [data-sidebar-header] > div,
              [data-sidebar]:not(:hover) [data-sidebar-footer] > div {
                justify-content: center !important;
              }
            ` : ''}

            /* Compact sidebar state */
            ${settings.sidebarState === 'compact' ? `
              [data-sidebar] .sidebar-text {
                display: none;
              }
              
              [data-sidebar] [data-sidebar-header] h2,
              [data-sidebar] [data-sidebar-header] p {
                display: none;
              }
              
              [data-sidebar] [data-sidebar-footer] .flex-1 {
                display: none;
              }

              /* Remove borders in compact mode */
              div[data-side] > div:nth-child(2) { border: 0 !important; }
              [data-sidebar-header], [data-sidebar-footer] { border: 0 !important; }
              [data-sidebar] [data-sidebar="menu-sub"] { border: 0 !important; }

              /* Center icons in compact mode */
              [data-sidebar] [data-sidebar-menu-button] {
                justify-content: center !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
              }

              /* Center header and footer content in compact mode */
              [data-sidebar] [data-sidebar-header] > div,
              [data-sidebar] [data-sidebar-footer] > div {
                justify-content: center !important;
              }

              /* Hide badges in compact mode for cleaner look */
              [data-sidebar] [data-sidebar="menu-badge"] {
                display: none !important;
              }
            ` : ''}

            /* Sidebar menu button styling */
            [data-sidebar] [data-sidebar-menu-button] {
              background: transparent !important;
              transition: all 0.2s ease;
            }

            [data-sidebar] [data-sidebar-menu-button]:hover {
              background-color: hsl(var(--sidebar-secondary)) !important;
            }

            [data-sidebar] [data-sidebar-menu-button][data-active="true"] {
              background: linear-gradient(to right, #6366f1, #8b5cf6) !important;
              color: white !important;
            }

            [data-sidebar] [data-sidebar-menu-button][data-active="true"] * {
              color: white !important;
            }

            /* Slider track styling */
            [data-slider-track] {
                background-color: hsl(var(--secondary)) !important;
                border: 1px solid hsl(var(--border)) !important;
                height: 8px !important;
            }

            [data-slider-range] {
                background-color: hsl(var(--primary)) !important;
            }

            [data-slider-thumb] {
                background-color: hsl(var(--background)) !important;
                border: 2px solid hsl(var(--primary)) !important;
                width: 20px !important;
                height: 20px !important;
            }

            /* Switch styling */
            button[role="switch"][data-state="checked"] {
                background-color: hsl(var(--primary)) !important;
            }
            
            button[role="switch"][data-state="unchecked"] {
                background-color: hsl(var(--input)) !important;
                border: 1px solid hsl(var(--border)) !important;
            }

            button[role="switch"] span {
                background-color: hsl(var(--background)) !important;
                border: 1px solid hsl(var(--border)) !important;
            }

            /* Dynamic spacing for main container */
            .theme-spacing {
                padding: calc(var(--spacing) * 1px);
            }

            .theme-spacing-sm {
                padding: calc(var(--spacing) * 0.5px);
            }

            .theme-spacing-lg {
                padding: calc(var(--spacing) * 1.5px);
            }

            /* Dynamic spacing for cards */
            .theme-card-spacing {
                padding: calc(var(--spacing) * 1px);
                margin-bottom: calc(var(--spacing) * 1px);
            }

            /* Dynamic spacing for elements */
            .theme-gap {
                gap: calc(var(--spacing) * 0.5px);
            }
        `;
    }, [settings]);

    const value = {
        settings,
        updateSetting,
        saveSettings,
        hasChanges,
        isLoading,
        themeStyles
    };

    return (
        <ThemeContext.Provider value={value}>
            <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
