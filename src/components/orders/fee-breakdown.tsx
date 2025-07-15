'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  CreditCard,
  Package,
  Star,
  Globe,
  Zap
} from 'lucide-react';
import { EbayFee } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FeeBreakdownCardProps {
  fees: EbayFee[];
  marketplaceFees?: EbayFee[];
  totalAmount: number;
  promotionSavings?: number;
  className?: string;
}

// 수수료 유형별 아이콘 매핑
const getFeeIcon = (feeType: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'FINAL_VALUE_FEE': TrendingUp,
    'FINAL_VALUE_FEE_FIXED_PER_ORDER': Package,
    'PAYMENT_PROCESSING_FEE': CreditCard,
    'INTERNATIONAL_FEE': Globe,
    'INSERTION_FEE': Package,
    'AD_FEE': Star,
    'PROMOTED_LISTINGS_FEE': Star,
    'BELOW_STANDARD_FEE': AlertTriangle,
    'HIGH_ITEM_NOT_AS_DESCRIBED_FEE': AlertTriangle,
    'EXPRESS_PAYOUT_FEE': Zap,
    'REGULATORY_OPERATING_FEE': Info,
    'PAYMENT_DISPUTE_FEE': AlertTriangle,
    'SUBTITLE_FEE': Package,
    'BOLD_FEE': Package,
    'FEATURED_GALLERY_FEE': Package,
    'STORE_SUBSCRIPTION_FEE': Star
  };
  
  return iconMap[feeType] || DollarSign;
};

// 수수료 유형별 색상 매핑
const getFeeColor = (feeType: string) => {
  const colorMap: Record<string, string> = {
    'FINAL_VALUE_FEE': 'text-blue-600 bg-blue-50 border-blue-200',
    'PAYMENT_PROCESSING_FEE': 'text-green-600 bg-green-50 border-green-200',
    'INTERNATIONAL_FEE': 'text-purple-600 bg-purple-50 border-purple-200',
    'INSERTION_FEE': 'text-gray-600 bg-gray-50 border-gray-200',
    'AD_FEE': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'PROMOTED_LISTINGS_FEE': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'BELOW_STANDARD_FEE': 'text-red-600 bg-red-50 border-red-200',
    'HIGH_ITEM_NOT_AS_DESCRIBED_FEE': 'text-red-600 bg-red-50 border-red-200',
    'EXPRESS_PAYOUT_FEE': 'text-indigo-600 bg-indigo-50 border-indigo-200',
    'REGULATORY_OPERATING_FEE': 'text-orange-600 bg-orange-50 border-orange-200',
    'PAYMENT_DISPUTE_FEE': 'text-red-600 bg-red-50 border-red-200'
  };
  
  return colorMap[feeType] || 'text-gray-600 bg-gray-50 border-gray-200';
};

// 수수료 유형별 한국어 라벨
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

export function FeeBreakdownCard({ 
  fees, 
  marketplaceFees = [], 
  totalAmount, 
  promotionSavings = 0,
  className 
}: FeeBreakdownCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const allFees = [...fees, ...marketplaceFees];
  const totalFees = allFees.reduce((sum, fee) => sum + Math.abs(fee.amount), 0);
  const totalFeePercentage = totalAmount > 0 ? (totalFees / totalAmount) * 100 : 0;
  
  // 수수료 유형별 그룹화
  const feesByCategory = {
    core: allFees.filter(fee => ['FINAL_VALUE_FEE', 'FINAL_VALUE_FEE_FIXED_PER_ORDER', 'PAYMENT_PROCESSING_FEE'].includes(fee.feeType)),
    listing: allFees.filter(fee => ['INSERTION_FEE', 'SUBTITLE_FEE', 'BOLD_FEE', 'FEATURED_GALLERY_FEE', 'GALLERY_FEE'].includes(fee.feeType)),
    marketing: allFees.filter(fee => ['AD_FEE', 'PROMOTED_LISTINGS_FEE'].includes(fee.feeType)),
    penalties: allFees.filter(fee => ['BELOW_STANDARD_FEE', 'HIGH_ITEM_NOT_AS_DESCRIBED_FEE', 'PAYMENT_DISPUTE_FEE'].includes(fee.feeType)),
    other: allFees.filter(fee => !['FINAL_VALUE_FEE', 'FINAL_VALUE_FEE_FIXED_PER_ORDER', 'PAYMENT_PROCESSING_FEE', 'INSERTION_FEE', 'SUBTITLE_FEE', 'BOLD_FEE', 'FEATURED_GALLERY_FEE', 'GALLERY_FEE', 'AD_FEE', 'PROMOTED_LISTINGS_FEE', 'BELOW_STANDARD_FEE', 'HIGH_ITEM_NOT_AS_DESCRIBED_FEE', 'PAYMENT_DISPUTE_FEE'].includes(fee.feeType))
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
            eBay 수수료 상세 분석
          </CardTitle>
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
            <div className="text-muted-foreground">총 수수료</div>
            <div className="font-semibold text-red-600 flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              ${totalFees.toFixed(2)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">수수료율</div>
            <div className="font-semibold">
              {totalFeePercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* 프로모션 절약 표시 */}
        {promotionSavings > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              프로모션 절약: ${promotionSavings.toFixed(2)}
            </Badge>
          </div>
        )}

        {/* 수수료율 시각화 */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>수수료 비율</span>
            <span>{totalFeePercentage.toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(100, totalFeePercentage)} className="h-2" />
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          {/* 핵심 거래 수수료 */}
          {feesByCategory.core.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-blue-700 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                핵심 거래 수수료
              </h4>
              {feesByCategory.core.map((fee, index) => {
                const Icon = getFeeIcon(fee.feeType);
                return (
                  <div key={index} className={`flex justify-between items-center py-2 px-3 rounded-lg border ${getFeeColor(fee.feeType)}`}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{getFeeLabel(fee.feeType)}</span>
                        <span className="text-xs opacity-75">{fee.feeMemo}</span>
                      </div>
                    </div>
                    <span className="font-medium">
                      {fee.amount < 0 ? '+' : '-'}${Math.abs(fee.amount).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* 리스팅 관련 수수료 */}
          {feesByCategory.listing.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                리스팅 관련 수수료
              </h4>
              {feesByCategory.listing.map((fee, index) => {
                const Icon = getFeeIcon(fee.feeType);
                return (
                  <div key={index} className={`flex justify-between items-center py-2 px-3 rounded-lg border ${getFeeColor(fee.feeType)}`}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{getFeeLabel(fee.feeType)}</span>
                        <span className="text-xs opacity-75">{fee.feeMemo}</span>
                      </div>
                    </div>
                    <span className="font-medium">-${fee.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* 마케팅 수수료 */}
          {feesByCategory.marketing.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-yellow-700 flex items-center">
                <Star className="h-4 w-4 mr-2" />
                마케팅 수수료
              </h4>
              {feesByCategory.marketing.map((fee, index) => {
                const Icon = getFeeIcon(fee.feeType);
                return (
                  <div key={index} className={`flex justify-between items-center py-2 px-3 rounded-lg border ${getFeeColor(fee.feeType)}`}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{getFeeLabel(fee.feeType)}</span>
                        <span className="text-xs opacity-75">{fee.feeMemo}</span>
                      </div>
                    </div>
                    <span className="font-medium">-${fee.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* 페널티 수수료 */}
          {feesByCategory.penalties.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-red-700 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                페널티 수수료
              </h4>
              {feesByCategory.penalties.map((fee, index) => {
                const Icon = getFeeIcon(fee.feeType);
                return (
                  <div key={index} className={`flex justify-between items-center py-2 px-3 rounded-lg border ${getFeeColor(fee.feeType)}`}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{getFeeLabel(fee.feeType)}</span>
                        <span className="text-xs opacity-75">{fee.feeMemo}</span>
                      </div>
                    </div>
                    <span className="font-medium">-${fee.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* 기타 수수료 */}
          {feesByCategory.other.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                기타 수수료
              </h4>
              {feesByCategory.other.map((fee, index) => {
                const Icon = getFeeIcon(fee.feeType);
                return (
                  <div key={index} className={`flex justify-between items-center py-2 px-3 rounded-lg border ${getFeeColor(fee.feeType)}`}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{getFeeLabel(fee.feeType)}</span>
                        <span className="text-xs opacity-75">{fee.feeMemo}</span>
                      </div>
                    </div>
                    <span className="font-medium">
                      {fee.amount < 0 ? '+' : '-'}${Math.abs(fee.amount).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* 총계 */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-semibold">
              <span>총 eBay 수수료</span>
              <span className="text-red-600">-${totalFees.toFixed(2)}</span>
            </div>
            {promotionSavings > 0 && (
              <div className="flex justify-between items-center text-sm text-green-600 mt-1">
                <span>프로모션 절약</span>
                <span>+${promotionSavings.toFixed(2)}</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}