
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Palette, 
  Monitor, 
  Users, 
  Settings, 
  ArrowRight,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const quickActions = [
  {
    title: "Customize Theme",
    description: "Adjust colors, fonts, and visual elements",
    icon: Palette,
    url: "ThemeSettings",
    gradient: "from-pink-500 to-purple-600",
    color: "pink"
  },
  {
    title: "Display Settings",
    description: "Configure screen sizes and layouts",
    icon: Monitor,
    url: "DisplaySettings",
    gradient: "from-blue-500 to-cyan-600",
    color: "blue"
  },
  {
    title: "Manage Users",
    description: "Control user access and permissions",
    icon: Users,
    url: "UserManagement",
    gradient: "from-emerald-500 to-teal-600",
    color: "emerald"
  },
  {
    title: "System Config",
    description: "Advanced system configurations",
    icon: Settings,
    url: "SystemSettings",
    gradient: "from-orange-500 to-red-600",
    color: "orange"
  }
];

export default function QuickActions() {
  return (
    <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Zap className="w-5 h-5 text-yellow-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(action.url)}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/30 hover:border-border/50 transition-all duration-300 cursor-pointer"
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${action.gradient} shadow-lg`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transform group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
