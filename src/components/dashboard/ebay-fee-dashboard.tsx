'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  DEMO_EBAY_TRANSACTIONS, 
  DEMO_MONTHLY_FEE_SUMMARY, 
  CURRENT_USER_STORE,
  EBAY_PROMOTIONS_2025,
  MonthlyFeeSummary 
} from '@/data/ebay-demo-data';
import { 
  calculateAllFees, 
  calculateMonthlyFeeSummary,
  EBAY_FEE_RATES 
} from '@/lib/ebay-fee-calculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Store, Zap } from 'lucide-react';

interface FeeMetric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export function EbayFeeDashboard() {
  const [feeMetrics, setFeeMetrics] = useState<FeeMetric[]>([]);
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyFeeSummary | null>(null);
  const [activePromotions, setActivePromotions] = useState(EBAY_PROMOTIONS_2025);

  useEffect(() => {
    // 현재 월 데이터 설정
    const currentMonth = DEMO_MONTHLY_FEE_SUMMARY[0]; // 2025-01
    const previousMonth = DEMO_MONTHLY_FEE_SUMMARY[1]; // 2024-12
    setCurrentMonthData(currentMonth);

    // 수수료 지표 계산
    const totalFeesChange = ((currentMonth.totalFees - previousMonth.totalFees) / previousMonth.totalFees) * 100;
    const salesChange = ((currentMonth.totalSales - previousMonth.totalSales) / previousMonth.totalSales) * 100;
    const savingsChange = currentMonth.savingsFromPromotions > 0 ? 100 : 0; // 새로운 프로모션

    const metrics: FeeMetric[] = [
      {
        title: '이번 달 총 수수료',
        value: `$${currentMonth.totalFees.toLocaleString()}`,
        change: totalFeesChange,
        icon: <DollarSign className="h-4 w-4" />,
        color: 'text-red-500'
      },
      {
        title: '이번 달 총 매출',
        value: `$${currentMonth.totalSales.toLocaleString()}`,
        change: salesChange,
        icon: <ShoppingCart className="h-4 w-4" />,
        color: 'text-blue-500'
      },
      {
        title: '프로모션 절약 금액',
        value: `$${currentMonth.savingsFromPromotions.toLocaleString()}`,
        change: savingsChange,
        icon: <Zap className="h-4 w-4" />,
        color: 'text-green-500'
      },
      {
        title: '스토어 레벨',
        value: CURRENT_USER_STORE.storeName,
        change: 0,
        icon: <Store className="h-4 w-4" />,
        color: 'text-purple-500'
      }
    ];

    setFeeMetrics(metrics);
  }, []);

  const feeEffectiveRate = currentMonthData 
    ? (currentMonthData.totalFees / currentMonthData.totalSales) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* 주요 지표 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {feeMetrics.map((metric, index) => (
          <GlassCard key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`${metric.color}`}>
                  {metric.icon}
                </div>
                <div className="text-sm font-medium text-gray-600">{metric.title}</div>
              </div>
              {metric.change !== 0 && (
                <Badge variant={metric.change > 0 ? "destructive" : "default"} className="text-xs">
                  {metric.change > 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(metric.change).toFixed(1)}%
                </Badge>
              )}
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{metric.value}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* 수수료 상세 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 수수료 구성 비율 */}
        <GlassCard className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              수수료 구성 분석
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            {currentMonthData && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">최종 판매 수수료 (50% 할인)</span>
                    <span className="text-sm">${currentMonthData.feeBreakdown.finalValueFees.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(currentMonthData.feeBreakdown.finalValueFees / currentMonthData.totalFees) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">결제 처리 수수료</span>
                    <span className="text-sm">${currentMonthData.feeBreakdown.paymentProcessingFees.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(currentMonthData.feeBreakdown.paymentProcessingFees / currentMonthData.totalFees) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">스토어 구독료</span>
                    <span className="text-sm">${currentMonthData.feeBreakdown.storeSubscriptionFees.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(currentMonthData.feeBreakdown.storeSubscriptionFees / currentMonthData.totalFees) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">프로모티드 리스팅</span>
                    <span className="text-sm">${currentMonthData.feeBreakdown.promotedListingsFees.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(currentMonthData.feeBreakdown.promotedListingsFees / currentMonthData.totalFees) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span>실효 수수료율</span>
                    <span className="text-lg">{feeEffectiveRate.toFixed(2)}%</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </GlassCard>

        {/* 2025년 프로모션 현황 */}
        <GlassCard className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              2025년 eBay 프로모션
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            {activePromotions.map((promotion) => (
              <div key={promotion.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{promotion.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {promotion.discountPercentage}% 할인
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{promotion.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{new Date(promotion.startDate).toLocaleDateString('ko-KR')} ~ {new Date(promotion.endDate).toLocaleDateString('ko-KR')}</span>
                  <span className="text-green-600 font-medium">활성</span>
                </div>
              </div>
            ))}
            
            {currentMonthData && currentMonthData.savingsFromPromotions > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold text-sm">이번 달 절약 효과</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${currentMonthData.savingsFromPromotions.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  할인 미적용 시 대비 {((currentMonthData.savingsFromPromotions / (currentMonthData.totalFees + currentMonthData.savingsFromPromotions)) * 100).toFixed(1)}% 절약
                </div>
              </div>
            )}
          </CardContent>
        </GlassCard>
      </div>

      {/* 수수료 계산기 미리보기 */}
      <GlassCard className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-purple-500" />
            수수료 계산기 (데모)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">판매가</label>
              <input 
                type="number" 
                placeholder="$100.00" 
                className="w-full px-3 py-2 border rounded-lg text-sm"
                defaultValue="100"
                onChange={(e) => {
                  const price = parseFloat(e.target.value) || 0;
                  const calculation = calculateAllFees(price);
                  // 실시간 계산 결과 업데이트 로직
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">예상 최종 판매 수수료</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
                $6.18 <span className="text-green-600">(50% 할인 적용)</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">예상 결제 처리 수수료</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
                $3.20
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">총 예상 수수료:</span>
              <span className="text-lg font-bold text-red-600">$9.38</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>순수익 (매입가 $60 기준):</span>
              <span className="font-medium text-green-600">$30.62</span>
            </div>
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}