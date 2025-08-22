
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const presetColors = [
  "#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#84cc16", "#f97316", "#6b7280"
];

export default function ColorPicker({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-12 h-10 p-0 border-border hover:border-border/80"
              style={{ backgroundColor: value }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-popover border-border">
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((color) => (
                  <Button
                    key={color}
                    className="w-10 h-10 p-0 rounded-md border-2 hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: color,
                      borderColor: value === color ? 'hsl(var(--foreground))' : 'transparent'
                    }}
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Custom Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-10 p-1 bg-secondary border-border"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-secondary border-border text-foreground"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-secondary border-border text-foreground"
          placeholder="#ffffff"
        />
      </div>
    </div>
  );
}
