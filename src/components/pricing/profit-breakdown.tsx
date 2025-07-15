"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateAllFees } from "@/lib/ebay-fee-calculator";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck,
  ArrowRight,
  Info
} from "lucide-react";

interface ProfitBreakdownProps {
  productName: string;
  sku: string;
  currentPrice: number;
  recommendedPrice: number;
  costPrice: number;
  shippingCost: number;
  categoryId: string;
}

export function ProfitBreakdown({
  productName,
  sku,
  currentPrice,
  recommendedPrice,
  costPrice,
  shippingCost,
  categoryId
}: ProfitBreakdownProps) {
  const [showDetails, setShowDetails] = useState(false);

  const currentFees = calculateAllFees(currentPrice, categoryId);
  const recommendedFees = calculateAllFees(recommendedPrice, categoryId);
  
  const currentProfit = currentPrice - costPrice - shippingCost - currentFees.totalFees;
  const recommendedProfit = recommendedPrice - costPrice - shippingCost - recommendedFees.totalFees;
  
  const currentMargin = ((currentProfit / currentPrice) * 100);
  const recommendedMargin = ((recommendedProfit / recommendedPrice) * 100);
  
  const profitDifference = recommendedProfit - currentProfit;
  const marginDifference = recommendedMargin - currentMargin;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent.toFixed(1)}%`;

  return (
    <GlassCard className="backdrop-blur-xl bg-white/95 border-white/30 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">수익성 상세 분석</h3>
              <p className="text-sm text-gray-600">{productName} ({sku})</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Info className="h-4 w-4 mr-2" />
            {showDetails ? "간단히" : "자세히"}
          </Button>
        </div>

        {/* 현재 vs 추천 비교 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200/50">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="font-medium text-gray-700">현재 상태</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>판매가</span>
                <span className="font-medium">{formatCurrency(currentPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>순이익</span>
                <span className={`font-medium ${currentProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(currentProfit)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>마진율</span>
                <span className={`font-medium ${currentMargin > 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {formatPercent(currentMargin)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200/50">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-700">추천 상태</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>판매가</span>
                <span className="font-medium">{formatCurrency(recommendedPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>순이익</span>
                <span className={`font-medium ${recommendedProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(recommendedProfit)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>마진율</span>
                <span className={`font-medium ${recommendedMargin > 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {formatPercent(recommendedMargin)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 변화량 표시 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                {profitDifference > 0 ? (
                  <TrendingUp className="h-4 w-4 text-white" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-800">예상 변화</div>
                <div className="text-sm text-gray-600">추천 가격 적용 시</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold text-lg ${profitDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitDifference > 0 ? '+' : ''}{formatCurrency(profitDifference)}
              </div>
              <div className={`text-sm ${marginDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marginDifference > 0 ? '+' : ''}{formatPercent(marginDifference)}
              </div>
            </div>
          </div>
        </div>

        {/* 상세 분석 (토글) */}
        {showDetails && (
          <div className="space-y-4">
            <div className="border-t border-gray-200/50 pt-4">
              <h4 className="font-medium text-gray-700 mb-3">비용 구조 분석</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Package className="h-4 w-4" />
                    <span>현재 가격 구조</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>판매가</span>
                      <span className="font-medium">{formatCurrency(currentPrice)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>- 상품 원가</span>
                      <span>-{formatCurrency(costPrice)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>- 배송비</span>
                      <span>-{formatCurrency(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>- eBay 수수료</span>
                      <span>-{formatCurrency(currentFees.totalFees)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>순이익</span>
                      <span className={currentProfit > 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(currentProfit)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-medium text-blue-700">
                    <TrendingUp className="h-4 w-4" />
                    <span>추천 가격 구조</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>판매가</span>
                      <span className="font-medium">{formatCurrency(recommendedPrice)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>- 상품 원가</span>
                      <span>-{formatCurrency(costPrice)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>- 배송비</span>
                      <span>-{formatCurrency(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>- eBay 수수료</span>
                      <span>-{formatCurrency(recommendedFees.totalFees)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>순이익</span>
                      <span className={recommendedProfit > 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(recommendedProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-200/50">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-yellow-800">수수료 차이</div>
                  <div className="text-yellow-700">
                    eBay 수수료: {formatCurrency(recommendedFees.totalFees - currentFees.totalFees)} 
                    ({recommendedFees.totalFees > currentFees.totalFees ? '증가' : '감소'})
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}