"use client";

import { useState, useEffect } from 'react';
import { PricingRecommendation } from '@/lib/types';

interface RealTimePricingResult {
  updatedRecommendation: PricingRecommendation;
  priceChange: number;
  currentMargin: number;
  targetMargin: number;
}

export function useRealTimePricing(
  recommendations: PricingRecommendation[],
  targetMargin: number,
  riskLevel: string
): RealTimePricingResult[] {
  const [results, setResults] = useState<RealTimePricingResult[]>([]);

  useEffect(() => {
    const calculateUpdatedPricing = () => {
      const updatedResults = recommendations.map(rec => {
        const costPrice = rec.currentPrice * 0.6; // 원가 추정
        
        // 리스크 레벨에 따른 조정
        let riskAdjustment = 1;
        if (riskLevel === 'low') riskAdjustment = 0.95;
        else if (riskLevel === 'high') riskAdjustment = 1.1;
        
        // 목표 마진을 기반으로 한 새로운 추천가
        const newRecommendedPrice = (costPrice / (1 - targetMargin / 100)) * riskAdjustment;
        
        // 현재 마진 계산
        const currentMargin = ((rec.currentPrice - costPrice) / rec.currentPrice) * 100;
        
        // 가격 변화량
        const priceChange = newRecommendedPrice - rec.recommendedPrice;
        
        const updatedRecommendation: PricingRecommendation = {
          ...rec,
          recommendedPrice: Math.max(costPrice * 1.05, newRecommendedPrice), // 최소 5% 마진 보장
          reason: `목표 마진 ${targetMargin}%를 위한 ${riskLevel === 'low' ? '보수적' : riskLevel === 'high' ? '공격적' : '균형잡힌'} 가격 조정`
        };
        
        return {
          updatedRecommendation,
          priceChange,
          currentMargin,
          targetMargin
        };
      });
      
      setResults(updatedResults);
    };

    calculateUpdatedPricing();
  }, [recommendations, targetMargin, riskLevel]);

  return results;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}