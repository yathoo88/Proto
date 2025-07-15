"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
import { EbayFee } from "@/lib/types";

// 수수료 유형별 한국어 라벨 매핑
const getFeeLabel = (feeType: string) => {
  const labelMap: Record<string, string> = {
    'FINAL_VALUE_FEE': '최종 판매 수수료',
    'FINAL_VALUE_FEE_FIXED_PER_ORDER': '주문당 고정 수수료',
    'FINAL_VALUE_SHIPPING_FEE': '배송비 기반 수수료',
    'PAYMENT_PROCESSING_FEE': '결제 처리 수수료',
    'INTERNATIONAL_FEE': '국제 거래 수수료',
    'INSERTION_FEE': '리스팅 등록 수수료',
    'AD_FEE': '광고 수수료',
    'PROMOTED_LISTINGS_FEE': '프로모션 리스팅 수수료',
    'BELOW_STANDARD_FEE': '기준 미달 수수료',
    'BELOW_STANDARD_SHIPPING_FEE': '기준 미달 배송 수수료',
    'HIGH_ITEM_NOT_AS_DESCRIBED_FEE': '상품 불일치 수수료',
    'HIGH_ITEM_NOT_AS_DESCRIBED_SHIPPING_FEE': '상품 불일치 배송 수수료',
    'EXPRESS_PAYOUT_FEE': '빠른 지급 수수료',
    'BANK_PAYOUT_FEE': '은행 송금 수수료',
    'REGULATORY_OPERATING_FEE': '규제 운영 수수료',
    'PAYMENT_DISPUTE_FEE': '결제 분쟁 수수료',
    'SUBTITLE_FEE': '부제목 수수료',
    'BOLD_FEE': '굵은 글씨 수수료',
    'FEATURED_GALLERY_FEE': '특별 갤러리 수수료',
    'GALLERY_FEE': '갤러리 수수료',
    'STORE_SUBSCRIPTION_FEE': '스토어 구독료',
    'TAX_DEDUCTION_AT_SOURCE': '원천 세금 공제',
    'INCOME_TAX_WITHHOLDING': '소득세 원천징수',
    'VAT_WITHHOLDING': '부가세 원천징수',
    'FINANCE_FEE': '금융 수수료',
    'CHARITY_DONATION': '자선 기부',
    'OTHER_FEES': '기타 수수료'
  };
  
  return labelMap[feeType] || feeType;
};

interface FeeBreakdownProps {
  fees: EbayFee[];
  marketplaceFees: EbayFee[];
  totalAmount: number;
  promotionSavings?: number;
}

export function FeeBreakdownCard({ 
  fees, 
  marketplaceFees, 
  totalAmount, 
  promotionSavings = 0 
}: FeeBreakdownProps) {
  const totalFees = [...fees, ...marketplaceFees].reduce((sum, fee) => sum + Math.abs(fee.amount), 0);
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
                <span className="text-sm font-medium text-red-700">{getFeeLabel(fee.feeType)}</span>
                <p className="text-xs text-red-600">{fee.feeMemo}</p>
              </div>
              <span className="font-medium text-red-600">
                {fee.amount < 0 ? '+' : '-'}${Math.abs(fee.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        {fees.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 text-sm">기타 수수료</h4>
            {fees.map((fee, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-orange-50/50 rounded-lg border border-orange-200/50">
                <div>
                  <span className="text-sm font-medium text-orange-700">{getFeeLabel(fee.feeType)}</span>
                  <p className="text-xs text-orange-600">{fee.feeMemo}</p>
                </div>
                <span className="font-medium text-orange-600">
                  {fee.amount < 0 ? '+' : '-'}${Math.abs(fee.amount).toFixed(2)}
                </span>
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