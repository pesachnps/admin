
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function StatsCards({ title, value, icon: Icon, gradient, trend, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-muted" />
              <Skeleton className="h-8 w-16 bg-muted" />
            </div>
            <Skeleton className="w-12 h-12 rounded-xl bg-muted" />
          </div>
          <Skeleton className="h-4 w-20 mt-4 bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        className="h-full"
        whileHover={{ 
          scale: 1.02,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="relative h-full overflow-hidden bg-card/30 border-border/50 backdrop-blur-xl hover:bg-card/40 transition-all duration-300 group">
          {/* Animated gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
          
          {/* Glow effect */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl transform translate-x-8 -translate-y-8`} />
          
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  {value}
                </div>
              </div>
              <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {trend && (
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 mr-2 text-emerald-400" />
                <span className="text-emerald-400 font-medium">{trend}</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
