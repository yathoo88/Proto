"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingDown, TrendingUp } from "lucide-react";

interface FeeItem {
  type: string;
  amount: number;
  description: string;
  isPromotion?: boolean;
}

interface FeeBreakdownProps {
  fees: FeeItem[];
  marketplaceFees: FeeItem[];
  totalAmount: number;
  promotionSavings?: number;
}

export function FeeBreakdownCard({ 
  fees, 
  marketplaceFees, 
  totalAmount, 
  promotionSavings = 0 
}: FeeBreakdownProps) {
  const totalFees = [...fees, ...marketplaceFees].reduce((sum, fee) => sum + fee.amount, 0);
  const netAmount = totalAmount - totalFees + promotionSavings;
  
  return (
    <GlassCard className="backdrop-blur-xl bg-white/90 border-white/30 p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg">수수료 상세 분석</h3>
        </div>
        
        <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">총 판매금액</span>
            <span className="font-bold text-green-600">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 text-sm">eBay 수수료</h4>
          {marketplaceFees.map((fee, index) => (
            <div key={index} className="flex justify-between items-center py-2 px-3 bg-red-50/50 rounded-lg border border-red-200/50">
              <div>
                <span className="text-sm font-medium text-red-700">{fee.type}</span>
                <p className="text-xs text-red-600">{fee.description}</p>
              </div>
              <span className="font-medium text-red-600">-${fee.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        {fees.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 text-sm">기타 수수료</h4>
            {fees.map((fee, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-orange-50/50 rounded-lg border border-orange-200/50">
                <div>
                  <span className="text-sm font-medium text-orange-700">{fee.type}</span>
                  <p className="text-xs text-orange-600">{fee.description}</p>
                </div>
                <span className="font-medium text-orange-600">-${fee.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
        
        {promotionSavings > 0 && (
          <div className="bg-green-50/50 p-3 rounded-lg border border-green-200/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">프로모션 절약</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +${promotionSavings.toFixed(2)}
              </Badge>
            </div>
            <p className="text-xs text-green-600 mt-1">2025년 베이직 스토어+ 혜택</p>
          </div>
        )}
        
        <div className="border-t border-gray-200/50 pt-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">총 수수료</span>
            <span className="font-medium text-red-600">-${totalFees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 bg-blue-50/50 rounded-lg px-3 border border-blue-200/50">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-700">최종 순수익</span>
            </div>
            <span className="font-bold text-blue-600 text-lg">${netAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-200/50">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">수수료율</span>
            <span className="font-medium text-gray-700">{((totalFees / totalAmount) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">순 마진율</span>
            <span className="font-medium text-gray-700">{((netAmount / totalAmount) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}