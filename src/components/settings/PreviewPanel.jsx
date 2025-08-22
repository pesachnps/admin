import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, MessageCircle, Heart } from "lucide-react";

export default function PreviewPanel({ settings }) {
  const previewStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    '--border-radius': `${settings.borderRadius}px`,
    '--spacing': `${settings.spacing}px`
  };

  return (
    <div className="sticky top-8">
      <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Eye className="w-5 h-5" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="space-y-4 p-4 rounded-lg border"
            style={{
              ...previewStyle,
              backgroundColor: settings.backgroundColor,
              color: settings.textColor,
              borderColor: settings.primaryColor + '40',
              borderRadius: settings.borderRadius
            }}
          >
            {/* Header Preview */}
            <div className="flex items-center justify-between">
              <h3 
                className="font-bold text-lg"
                style={{ color: settings.textColor }}
              >
                Sample Header
              </h3>
              <Badge 
                style={{ 
                  backgroundColor: settings.primaryColor + '20',
                  color: settings.primaryColor,
                  borderRadius: settings.borderRadius / 2
                }}
              >
                New
              </Badge>
            </div>

            {/* Button Preview */}
            <Button
              className="w-full"
              style={{
                backgroundColor: settings.primaryColor,
                color: settings.textColor,
                borderRadius: settings.borderRadius
              }}
            >
              Primary Button
            </Button>

            {/* Card Preview */}
            <div 
              className="p-3 border"
              style={{
                borderColor: settings.secondaryColor + '40',
                borderRadius: settings.borderRadius,
                backgroundColor: settings.secondaryColor + '10'
              }}
            >
              <h4 
                className="font-medium mb-2"
                style={{ color: settings.textColor }}
              >
                Sample Card
              </h4>
              <p 
                className="text-sm opacity-75"
                style={{ color: settings.textColor }}
              >
                This is how your content will look with the current theme settings.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" style={{ color: settings.accentColor }} />
                  <span className="text-sm" style={{ color: settings.textColor }}>24</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" style={{ color: settings.accentColor }} />
                  <span className="text-sm" style={{ color: settings.textColor }}>12</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" style={{ color: settings.accentColor }} />
                  <span className="text-sm" style={{ color: settings.textColor }}>4.8</span>
                </div>
              </div>
            </div>

            {/* Text Preview */}
            <div className="space-y-2">
              <h4 
                className="font-semibold"
                style={{ color: settings.textColor }}
              >
                Typography Sample
              </h4>
              <p 
                className="text-sm"
                style={{ 
                  color: settings.textColor,
                  opacity: 0.8
                }}
              >
                Body text will appear like this. The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>

          {/* Theme Info */}
          <div className="mt-6 p-4 bg-slate-700/20 rounded-lg">
            <h4 className="font-medium text-slate-200 mb-3">Current Theme</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: settings.primaryColor }}
                />
                <span className="text-slate-300">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: settings.secondaryColor }}
                />
                <span className="text-slate-300">Secondary</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: settings.accentColor }}
                />
                <span className="text-slate-300">Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: settings.backgroundColor }}
                />
                <span className="text-slate-300">Background</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}