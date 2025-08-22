

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Settings, 
  Palette, 
  Monitor, 
  Users, 
  Shield,
  Bell,
  Search,
  Activity // Added Activity icon import
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeProvider } from "./components/ThemeContext";
import GlobalSearch from "./components/search/GlobalSearch";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: "Activity Log", // New item added
    url: createPageUrl("ActivityLog"),
    icon: Activity,
    badge: null
  },
  {
    title: "Theme Settings",
    url: createPageUrl("ThemeSettings"),
    icon: Palette,
    badge: null
  },
  {
    title: "Display Settings",
    url: createPageUrl("DisplaySettings"),
    icon: Monitor,
    badge: null
  },
  {
    title: "User Management",
    url: createPageUrl("UserManagement"),
    icon: Users,
    badge: "new"
  },
  {
    title: "System Settings",
    url: createPageUrl("SystemSettings"),
    icon: Settings,
    badge: null
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background text-foreground">
          
          <div className="flex w-full min-h-screen">
            <Sidebar data-sidebar className="border-r backdrop-blur-xl">
              <SidebarHeader data-sidebar-header className="border-b p-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card"></div>
                  </div>
                  <div className="sidebar-text">
                    <h2 className="font-bold text-lg tracking-tight">AdminPortal</h2>
                    <p className="text-xs font-medium">Control Center</p>
                  </div>
                </div>
              </SidebarHeader>
              
              <SidebarContent className="p-3">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider px-3 py-3 sidebar-text">
                    Navigation
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {navigationItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            data-sidebar-menu-button
                            data-active={location.pathname === item.url}
                            asChild 
                            className="group transition-all duration-300 rounded-xl mx-1"
                          >
                            <Link to={item.url} className="flex items-center justify-between px-4 py-3 w-full">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
                                <span className="font-medium truncate sidebar-text">{item.title}</span>
                              </div>
                              {item.badge && (
                                <Badge className="ml-auto flex-shrink-0 bg-emerald-500 text-white px-2 py-0.5 text-xs sidebar-text">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider px-3 py-3 sidebar-text">
                    Quick Actions
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <div className="px-3 space-y-3">
                      <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsSearchOpen(true)}>
                        <Search className="w-4 h-4" />
                        <span className="sidebar-text">Search...</span>
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sidebar-text">
                          <span className="text-xs">⌘</span>K
                        </kbd>
                      </Button>
                      <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Bell className="w-4 h-4 text-indigo-400" />
                          <span className="text-sm font-medium sidebar-text">System Status</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-xs sidebar-text">All systems operational</span>
                        </div>
                      </div>
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter data-sidebar-footer className="border-t p-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-muted to-secondary rounded-xl flex items-center justify-center">
                    <span className="font-semibold text-sm">A</span>
                  </div>
                  <div className="flex-1 min-w-0 sidebar-text">
                    <p className="font-semibold text-sm truncate">Administrator</p>
                    <p className="text-xs truncate">Super Admin Access</p>
                  </div>
                </div>
              </SidebarFooter>
            </Sidebar>

            <main className="flex-1 flex flex-col min-w-0">
              {/* Mobile Header */}
              <header className="lg:hidden bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SidebarTrigger className="p-2 hover:bg-secondary/50 rounded-lg" />
                    <h1 className="text-lg font-bold">AdminPortal</h1>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </header>

              {/* Main Content */}
              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
      <GlobalSearch open={isSearchOpen} setOpen={setIsSearchOpen} />
    </ThemeProvider>
  );
}

