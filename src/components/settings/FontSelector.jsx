
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fonts = [
  { value: "Inter", label: "Inter", preview: "The quick brown fox jumps" },
  { value: "Roboto", label: "Roboto", preview: "The quick brown fox jumps" },
  { value: "Poppins", label: "Poppins", preview: "The quick brown fox jumps" },
  { value: "Open Sans", label: "Open Sans", preview: "The quick brown fox jumps" },
  { value: "Lato", label: "Lato", preview: "The quick brown fox jumps" },
  { value: "Montserrat", label: "Montserrat", preview: "The quick brown fox jumps" },
  { value: "Source Sans Pro", label: "Source Sans Pro", preview: "The quick brown fox jumps" },
  { value: "Nunito", label: "Nunito", preview: "The quick brown fox jumps" }
];

export default function FontSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground">Font Family</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-secondary border-border text-foreground">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {fonts.map((font) => (
            <SelectItem 
              key={font.value} 
              value={font.value}
              className="text-foreground hover:bg-secondary focus:bg-secondary"
            >
              <div className="flex flex-col items-start">
                <span style={{ fontFamily: font.value }} className="font-medium">
                  {font.label}
                </span>
                <span 
                  style={{ fontFamily: font.value }} 
                  className="text-xs text-muted-foreground"
                >
                  {font.preview}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
