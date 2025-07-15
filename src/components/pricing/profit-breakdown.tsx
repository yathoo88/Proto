'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  TrendingUp, 
  Calculator,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { calculateProfitability } from '@/lib/ebay-fee-calculator';
import { cn } from '@/lib/utils';

interface ProfitBreakdownProps {
  productName: string;
  sku: string;
  currentPrice: number;
  recommendedPrice: number;
  costPrice: number;
  shippingCost?: number;
  categoryId?: string;
  className?: string;
}

export function ProfitBreakdown({ 
  currentPrice, 
  recommendedPrice, 
  costPrice, 
  shippingCost = 5.00,
  categoryId,
  className 
}: ProfitBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 현재 가격과 추천 가격에 대한 수익성 분석
  const currentAnalysis = calculateProfitability(currentPrice, costPrice, { 
    categoryId, 
    shippingCost 
  });
  
  const recommendedAnalysis = calculateProfitability(recommendedPrice, costPrice, { 
    categoryId, 
    shippingCost 
  });
  
  // 변화량 계산
  const profitChange = recommendedAnalysis.profit.netProfit - currentAnalysis.profit.netProfit;
  const marginChange = recommendedAnalysis.profit.profitMargin - currentAnalysis.profit.profitMargin;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">수익성 상세 분석</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* 요약 정보 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">현재 순수익</div>
            <div className="font-semibold flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              {currentAnalysis.profit.netProfit.toFixed(2)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">예상 순수익</div>
            <div className="font-semibold flex items-center text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {recommendedAnalysis.profit.netProfit.toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* 변화량 표시 */}
        {profitChange !== 0 && (
          <div className="flex items-center gap-2">
            <Badge variant={profitChange > 0 ? "default" : "destructive"} className="text-xs">
              {profitChange > 0 ? '+' : ''}{profitChange.toFixed(2)} 순수익 변화
            </Badge>
            <Badge variant={marginChange > 0 ? "default" : "destructive"} className="text-xs">
              {marginChange > 0 ? '+' : ''}{marginChange.toFixed(1)}% 마진 변화
            </Badge>
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 space-y-6">
          {/* 가격 비교 */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <Calculator className="h-4 w-4 mr-2 text-blue-500" />
              가격 비교
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">현재 가격</div>
                <div className="text-lg font-bold">${currentPrice}</div>
                <div className="text-xs text-muted-foreground">마진: {currentAnalysis.profit.profitMargin.toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-700">추천 가격</div>
                <div className="text-lg font-bold text-green-600">${recommendedPrice}</div>
                <div className="text-xs text-green-600">마진: {recommendedAnalysis.profit.profitMargin.toFixed(1)}%</div>
              </div>
            </div>
          </div>
          
          {/* eBay 수수료 상세 내역 */}
          <div className="space-y-3">
            <h4 className="font-medium">eBay 수수료 상세 (추천 가격 기준)</h4>
            <div className="space-y-2">
              {recommendedAnalysis.feeCalculation.fees.map((fee, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{fee.feeMemo}</span>
                    <span className="text-xs text-muted-foreground">{fee.feeType}</span>
                  </div>
                  <span className="font-medium">${fee.amount.toFixed(2)}</span>
                </div>
              ))}
              
              {/* 프로모션 절약 표시 */}
              {recommendedAnalysis.feeCalculation.savingsFromPromotions > 0 && (
                <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-700">프로모션 절약</span>
                  </div>
                  <span className="font-medium text-green-600">
                    -${recommendedAnalysis.feeCalculation.savingsFromPromotions.toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="border-t pt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>총 eBay 수수료</span>
                  <span className="text-red-600">${recommendedAnalysis.feeCalculation.totalFees.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 비용 구조 분석 */}
          <div className="space-y-3">
            <h4 className="font-medium">비용 구조 분석 (추천 가격 기준)</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">매입가</span>
                <span className="font-medium">${recommendedAnalysis.costs.itemCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">eBay 수수료</span>
                <span className="font-medium text-red-600">${recommendedAnalysis.costs.totalFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">배송비</span>
                <span className="font-medium">${recommendedAnalysis.costs.shippingCost.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>총 비용</span>
                  <span className="text-red-600">${recommendedAnalysis.costs.totalCosts.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 수익성 지표 */}
          <div className="space-y-3">
            <h4 className="font-medium">수익성 지표</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700">총수익</div>
                <div className="text-lg font-bold text-blue-600">
                  ${recommendedAnalysis.profit.grossProfit.toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700">순수익</div>
                <div className="text-lg font-bold text-green-600">
                  ${recommendedAnalysis.profit.netProfit.toFixed(2)}
                </div>
              </div>
            </div>
            
            {/* 마진율 시각화 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>순수익 마진율</span>
                <span className="font-medium">{recommendedAnalysis.profit.profitMargin.toFixed(1)}%</span>
              </div>
              <Progress value={Math.max(0, Math.min(100, recommendedAnalysis.profit.profitMargin))} className="h-2" />
            </div>
          </div>
          
          {/* 위험 지표 */}
          {recommendedAnalysis.profit.profitMargin < 15 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">낮은 마진율 주의</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                마진율이 15% 미만입니다. 가격 조정을 고려해보세요.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}