'use client';

import { Button } from './button';
import { cn } from '@/lib/utils';

interface MarginPresetsProps {
  selectedMargin: number;
  onMarginSelect: (margin: number) => void;
  className?: string;
}

const PRESET_MARGINS = [
  { value: 15, label: '15%', description: '기본 마진' },
  { value: 20, label: '20%', description: '표준 마진' },
  { value: 25, label: '25%', description: '권장 마진' },
  { value: 30, label: '30%', description: '높은 마진' },
  { value: 35, label: '35%', description: '프리미엄 마진' },
  { value: 40, label: '40%', description: '최고 마진' }
];

export function MarginPresets({ selectedMargin, onMarginSelect, className }: MarginPresetsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="text-sm font-medium text-gray-700 mb-2">빠른 설정</div>
      <div className="grid grid-cols-3 gap-2">
        {PRESET_MARGINS.map((preset) => (
          <Button
            key={preset.value}
            variant={selectedMargin === preset.value ? "default" : "outline"}
            size="sm"
            onClick={() => onMarginSelect(preset.value)}
            className={cn(
              "h-auto flex flex-col items-center p-3 transition-all duration-200",
              selectedMargin === preset.value 
                ? "bg-blue-500 text-white border-blue-500 shadow-md" 
                : "hover:border-blue-300 hover:bg-blue-50"
            )}
            title={preset.description}
          >
            <span className="font-bold text-lg">{preset.label}</span>
            <span className="text-xs opacity-80">{preset.description}</span>
          </Button>
        ))}
      </div>
      
      {/* 커스텀 마진일 경우 표시 */}
      {!PRESET_MARGINS.some(preset => preset.value === selectedMargin) && (
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
            커스텀: {selectedMargin}%
          </div>
        </div>
      )}
    </div>
  );
}