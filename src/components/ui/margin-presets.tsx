"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarginPresetsProps {
  selectedMargin: number;
  onMarginSelect: (margin: number) => void;
  className?: string;
}

const presets = [
  {
    label: "보수적",
    value: 15,
    icon: Shield,
    color: "text-green-600 bg-green-50 border-green-200",
    description: "안정적인 수익"
  },
  {
    label: "균형",
    value: 25,
    icon: Target,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    description: "최적의 균형"
  },
  {
    label: "적극적",
    value: 35,
    icon: TrendingUp,
    color: "text-orange-600 bg-orange-50 border-orange-200",
    description: "높은 수익률"
  },
  {
    label: "최대",
    value: 50,
    icon: Zap,
    color: "text-red-600 bg-red-50 border-red-200",
    description: "최대 마진"
  }
];

export function MarginPresets({ selectedMargin, onMarginSelect, className }: MarginPresetsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="text-sm font-medium text-gray-700 mb-2">마진율 프리셋</div>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedMargin === preset.value;
          
          return (
            <Button
              key={preset.value}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onMarginSelect(preset.value)}
              className={cn(
                "h-auto p-3 flex-col space-y-1 transition-all duration-200",
                isSelected 
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105" 
                  : "hover:scale-102 hover:shadow-md"
              )}
            >
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{preset.label}</span>
              </div>
              <div className="text-xs opacity-90">
                {preset.value}%
              </div>
              <div className="text-xs opacity-75">
                {preset.description}
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        선택한 마진율: <Badge variant="secondary" className="ml-1">{selectedMargin}%</Badge>
      </div>
    </div>
  );
}