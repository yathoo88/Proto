import { useMemo } from 'react';
import { useDebounce } from './use-debounce';
import { calculateAllFees, suggestOptimalPrice } from '@/lib/ebay-fee-calculator';
import { PricingRecommendation } from '@/lib/types';
import { sampleProducts } from '@/data/mock-data';

export interface RealTimePricingResult {
  originalRecommendation: PricingRecommendation;
  updatedRecommendation: PricingRecommendation;
  currentMargin: number;
  targetMargin: number;
  priceChange: number;
  marginChange: number;
  feeCalculation: ReturnType<typeof calculateAllFees>;
}

export function useRealTimePricing(
  recommendations: PricingRecommendation[],
  targetMargin: number,
  riskLevel: string = 'medium'
): RealTimePricingResult[] {
  const debouncedTargetMargin = useDebounce(targetMargin, 300);

  // 실시간 가격 계산
  const realTimePricingResults = useMemo(() => {
    return recommendations.map((rec) => {
      // 현재 상품 정보 찾기
      const product = sampleProducts.find(p => p.sku === rec.sku);
      const costPrice = product?.purchasePrice || rec.currentPrice * 0.6;
      
      // 현재 마진율 계산
      const currentMargin = ((rec.currentPrice - costPrice) / rec.currentPrice) * 100;
      
      // 목표 마진율에 따른 최적 가격 제안
      const optimalPricing = suggestOptimalPrice(costPrice, debouncedTargetMargin, {
        categoryId: '15709', // 기본 카테고리
        shippingCost: 5.00, // 기본 배송비
        competitorPrice: rec.competitorPrices[0]
      });
      
      // 가격 변화 계산
      const priceChange = optimalPricing.suggestedPrice - rec.currentPrice;
      const marginChange = debouncedTargetMargin - currentMargin;
      
      // 업데이트된 추천 생성
      const updatedRecommendation: PricingRecommendation = {
        ...rec,
        recommendedPrice: Math.round(optimalPricing.suggestedPrice * 100) / 100,
        expectedMarginIncrease: ((optimalPricing.suggestedPrice - rec.currentPrice) / rec.currentPrice) * 100,
        reason: generateReason(debouncedTargetMargin, riskLevel, marginChange, priceChange),
        confidence: calculateConfidence(priceChange, marginChange, rec.stockLevel)
      };
      
      return {
        originalRecommendation: rec,
        updatedRecommendation,
        currentMargin,
        targetMargin: debouncedTargetMargin,
        priceChange,
        marginChange,
        feeCalculation: optimalPricing.feeCalculation
      };
    });
  }, [recommendations, debouncedTargetMargin, riskLevel]);

  return realTimePricingResults;
}

// 추천 이유 생성
function generateReason(targetMargin: number, riskLevel: string, marginChange: number, priceChange: number): string {
  const reasons = [];
  
  if (targetMargin > 30) {
    reasons.push('높은 목표 마진율 적용');
  } else if (targetMargin < 20) {
    reasons.push('경쟁력 있는 가격 전략');
  } else {
    reasons.push('균형 잡힌 마진율 목표');
  }
  
  if (Math.abs(priceChange) > 5) {
    if (priceChange > 0) {
      reasons.push('수익성 개선 우선');
    } else {
      reasons.push('판매량 증대 전략');
    }
  }
  
  if (riskLevel === 'high') {
    reasons.push('공격적 가격 정책');
  } else if (riskLevel === 'low') {
    reasons.push('보수적 가격 조정');
  }
  
  return reasons.join(', ');
}

// 신뢰도 계산
function calculateConfidence(priceChange: number, marginChange: number, stockLevel: number): number {
  let confidence = 85; // 기본 신뢰도
  
  // 가격 변화가 클수록 신뢰도 감소
  const priceChangePercent = Math.abs(priceChange / 100);
  confidence -= priceChangePercent * 20;
  
  // 마진 변화가 클수록 신뢰도 감소
  confidence -= Math.abs(marginChange) * 0.5;
  
  // 재고 수준에 따른 조정
  if (stockLevel < 10) {
    confidence -= 5; // 낮은 재고는 리스크
  } else if (stockLevel > 50) {
    confidence += 5; // 높은 재고는 안정적
  }
  
  return Math.max(60, Math.min(95, Math.round(confidence)));
}