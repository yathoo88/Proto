/**
 * eBay 수수료 계산 유틸리티
 * 2025년 eBay 정책 및 프로모션을 반영한 실제 수수료 계산
 */

import { 
  EbayFee, 
  EbayFeeType, 
  EbayStoreLevel, 
  EbayMarketplace,
  EBAY_STORE_LEVELS,
  EBAY_PROMOTIONS_2025,
  CURRENT_USER_STORE 
} from '@/data/ebay-demo-data';

// 기본 eBay 수수료율 (2025년 기준)
export const EBAY_FEE_RATES = {
  // 최종 판매 수수료 (Final Value Fee)
  FINAL_VALUE_FEE_RATE: 0.1235, // 12.35%
  
  // 결제 처리 수수료 (Payment Processing Fee)
  PAYMENT_PROCESSING_RATE: 0.029, // 2.9%
  PAYMENT_PROCESSING_FIXED: 0.30, // $0.30 고정
  
  // 해외 거래 수수료
  INTERNATIONAL_FEE_RATE: 0.015, // 1.5%
  
  // 프로모티드 리스팅 기본 수수료율
  PROMOTED_LISTINGS_BASE_RATE: 0.02, // 2%
  
  // 등록 수수료 (무료 리스팅 한도 초과 시)
  INSERTION_FEE: 0.35, // $0.35 per listing
  
  // 부제목 수수료
  SUBTITLE_FEE: 0.50, // $0.50
  
  // 리스팅 업그레이드 수수료
  LISTING_UPGRADE_FEE: 1.00, // $1.00
} as const;

// 카테고리별 수수료율 (일부 카테고리는 다른 수수료율 적용)
export const CATEGORY_FEE_RATES: Record<string, number> = {
  '9355': 0.1235, // 휴대폰 및 액세서리
  '15709': 0.1235, // 의류, 신발 및 액세서리
  '43576': 0.1235, // 가전제품
  '11450': 0.1000, // 자동차 부품 및 액세서리 (10%)
  '550': 0.0800,   // 예술품 (8%)
  '267': 0.1500,   // 책 (15%)
};

// 수수료 계산 결과 인터페이스
export interface FeeCalculationResult {
  itemPrice: number;
  currency: string;
  fees: EbayFee[];
  totalFees: number;
  netAmount: number;
  feePercentage: number;
  savingsFromPromotions: number;
  storeLevel: EbayStoreLevel;
  promotionsApplied: string[];
}

// 리스팅 수수료 계산 결과
export interface ListingFeeCalculationResult {
  insertionFee: number;
  subtitleFee?: number;
  listingUpgradeFee?: number;
  totalListingFees: number;
  freeListingsRemaining: number;
}

/**
 * 최종 판매 수수료 계산 (2025년 프로모션 적용)
 */
export function calculateFinalValueFee(
  salePrice: number,
  categoryId?: string,
  storeLevel: EbayStoreLevel = CURRENT_USER_STORE.storeLevel
): { fee: number; originalFee: number; discount: number; discountPercentage: number } {
  // 카테고리별 수수료율 적용
  const feeRate = categoryId ? (CATEGORY_FEE_RATES[categoryId] || EBAY_FEE_RATES.FINAL_VALUE_FEE_RATE) : EBAY_FEE_RATES.FINAL_VALUE_FEE_RATE;
  
  const originalFee = salePrice * feeRate;
  
  // 2025년 베이직 스토어 이상 50% 할인 적용
  const storeInfo = EBAY_STORE_LEVELS[storeLevel];
  const discountPercentage = storeInfo.finalValueFeeDiscount;
  
  // $2,500까지만 할인 적용
  const discountableAmount = Math.min(salePrice, 2500);
  const nonDiscountableAmount = Math.max(salePrice - 2500, 0);
  
  const discountedFee = (discountableAmount * feeRate * (1 - discountPercentage)) + 
                       (nonDiscountableAmount * feeRate);
  
  const discount = originalFee - discountedFee;
  
  return {
    fee: discountedFee,
    originalFee,
    discount,
    discountPercentage: discountPercentage * 100
  };
}

/**
 * 결제 처리 수수료 계산
 */
export function calculatePaymentProcessingFee(salePrice: number): number {
  return (salePrice * EBAY_FEE_RATES.PAYMENT_PROCESSING_RATE) + EBAY_FEE_RATES.PAYMENT_PROCESSING_FIXED;
}

/**
 * 프로모티드 리스팅 수수료 계산
 */
export function calculatePromotedListingsFee(
  salePrice: number, 
  adRate: number = EBAY_FEE_RATES.PROMOTED_LISTINGS_BASE_RATE
): { fee: number; originalFee: number; discount: number } {
  const originalFee = salePrice * adRate;
  
  // 2025년 프로모티드 오프사이트 50% 할인 확인
  const promotion = EBAY_PROMOTIONS_2025.find(p => p.id === 'promoted_offsite_discount_2025');
  const now = new Date();
  const promotionActive = promotion && 
    now >= new Date(promotion.startDate) && 
    now <= new Date(promotion.endDate);
  
  const discountPercentage = promotionActive ? 0.5 : 0;
  const fee = originalFee * (1 - discountPercentage);
  const discount = originalFee - fee;
  
  return { fee, originalFee, discount };
}

/**
 * 해외 거래 수수료 계산
 */
export function calculateInternationalFee(salePrice: number, isInternational: boolean = false): number {
  return isInternational ? salePrice * EBAY_FEE_RATES.INTERNATIONAL_FEE_RATE : 0;
}

/**
 * 리스팅 수수료 계산
 */
export function calculateListingFees(
  listingCount: number,
  hasSubtitle: boolean = false,
  hasListingUpgrade: boolean = false,
  storeLevel: EbayStoreLevel = CURRENT_USER_STORE.storeLevel
): ListingFeeCalculationResult {
  const storeInfo = EBAY_STORE_LEVELS[storeLevel];
  // const freeListingsUsed = Math.min(listingCount, storeInfo.freeListings);
  const paidListings = Math.max(listingCount - storeInfo.freeListings, 0);
  
  const insertionFee = paidListings * storeInfo.additionalListingFee;
  const subtitleFee = hasSubtitle ? EBAY_FEE_RATES.SUBTITLE_FEE : 0;
  const listingUpgradeFee = hasListingUpgrade ? EBAY_FEE_RATES.LISTING_UPGRADE_FEE : 0;
  
  const totalListingFees = insertionFee + subtitleFee + listingUpgradeFee;
  const freeListingsRemaining = Math.max(storeInfo.freeListings - listingCount, 0);
  
  return {
    insertionFee,
    subtitleFee: hasSubtitle ? subtitleFee : undefined,
    listingUpgradeFee: hasListingUpgrade ? listingUpgradeFee : undefined,
    totalListingFees,
    freeListingsRemaining
  };
}

/**
 * 전체 수수료 계산 (판매 완료 시)
 */
export function calculateAllFees(
  salePrice: number,
  options: {
    categoryId?: string;
    storeLevel?: EbayStoreLevel;
    isInternational?: boolean;
    promotedListingsAdRate?: number;
    marketplace?: EbayMarketplace;
  } = {}
): FeeCalculationResult {
  const {
    categoryId,
    storeLevel = CURRENT_USER_STORE.storeLevel,
    isInternational = false,
    promotedListingsAdRate,
    marketplace = 'EBAY_US'
  } = options;
  
  const currency = marketplace === 'EBAY_US' ? 'USD' : 
                  marketplace === 'EBAY_UK' ? 'GBP' :
                  marketplace === 'EBAY_DE' ? 'EUR' : 'USD';
  
  const fees: EbayFee[] = [];
  const promotionsApplied: string[] = [];
  let totalSavings = 0;
  
  // 최종 판매 수수료
  const finalValueFeeResult = calculateFinalValueFee(salePrice, categoryId, storeLevel);
  fees.push({
    amount: finalValueFeeResult.fee,
    currency,
    feeJurisdiction: marketplace.split('_')[1],
    feeMemo: `최종 판매 수수료${finalValueFeeResult.discountPercentage > 0 ? ` (${finalValueFeeResult.discountPercentage}% 할인 적용)` : ''}`,
    feeType: 'FINAL_VALUE_FEE'
  });
  
  if (finalValueFeeResult.discount > 0) {
    totalSavings += finalValueFeeResult.discount;
    promotionsApplied.push('베이직 스토어 이상 50% 최종 판매 수수료 할인');
  }
  
  // 결제 처리 수수료
  const paymentFee = calculatePaymentProcessingFee(salePrice);
  fees.push({
    amount: paymentFee,
    currency,
    feeJurisdiction: marketplace.split('_')[1],
    feeMemo: '결제 처리 수수료',
    feeType: 'PAYMENT_PROCESSING_FEE'
  });
  
  // 프로모티드 리스팅 수수료 (설정된 경우)
  if (promotedListingsAdRate && promotedListingsAdRate > 0) {
    const promotedFeeResult = calculatePromotedListingsFee(salePrice, promotedListingsAdRate);
    fees.push({
      amount: promotedFeeResult.fee,
      currency,
      feeJurisdiction: marketplace.split('_')[1],
      feeMemo: `프로모티드 리스팅 수수료${promotedFeeResult.discount > 0 ? ' (50% 할인 적용)' : ''}`,
      feeType: 'PROMOTED_LISTINGS_FEE'
    });
    
    if (promotedFeeResult.discount > 0) {
      totalSavings += promotedFeeResult.discount;
      promotionsApplied.push('프로모티드 오프사이트 광고비 50% 할인');
    }
  }
  
  // 해외 거래 수수료
  if (isInternational) {
    const internationalFee = calculateInternationalFee(salePrice, true);
    fees.push({
      amount: internationalFee,
      currency,
      feeJurisdiction: marketplace.split('_')[1],
      feeMemo: '해외 거래 수수료',
      feeType: 'INTERNATIONAL_FEE'
    });
  }
  
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const netAmount = salePrice - totalFees;
  const feePercentage = (totalFees / salePrice) * 100;
  
  return {
    itemPrice: salePrice,
    currency,
    fees,
    totalFees,
    netAmount,
    feePercentage,
    savingsFromPromotions: totalSavings,
    storeLevel,
    promotionsApplied
  };
}

/**
 * 월별 수수료 요약 계산
 */
export function calculateMonthlyFeeSummary(
  transactions: Array<{
    salePrice: number;
    fees: EbayFee[];
    date: Date;
  }>,
  storeLevel: EbayStoreLevel = CURRENT_USER_STORE.storeLevel
): {
  totalSales: number;
  totalFees: number;
  feeBreakdown: Partial<Record<EbayFeeType, number>>;
  storeSubscriptionFee: number;
  totalSavings: number;
} {
  const totalSales = transactions.reduce((sum, t) => sum + t.salePrice, 0);
  const allFees = transactions.flatMap(t => t.fees);
  const totalFees = allFees.reduce((sum, fee) => sum + fee.amount, 0);
  
  // 수수료 유형별 분류
  const feeBreakdown: Partial<Record<EbayFeeType, number>> = {
    FINAL_VALUE_FEE: 0,
    INSERTION_FEE: 0,
    PAYMENT_PROCESSING_FEE: 0,
    STORE_SUBSCRIPTION_FEE: 0,
    PROMOTED_LISTINGS_FEE: 0,
    INTERNATIONAL_FEE: 0,
    SUBTITLE_FEE: 0,
    LISTING_UPGRADE_FEE: 0,
    BELOW_STANDARD_FEE: 0
  };
  
  allFees.forEach(fee => {
    feeBreakdown[fee.feeType] = (feeBreakdown[fee.feeType] || 0) + fee.amount;
  });
  
  // 스토어 구독료 추가
  const storeInfo = EBAY_STORE_LEVELS[storeLevel];
  const storeSubscriptionFee = storeInfo.monthlyFee;
  feeBreakdown.STORE_SUBSCRIPTION_FEE = (feeBreakdown.STORE_SUBSCRIPTION_FEE || 0) + storeSubscriptionFee;
  
  // 프로모션으로 절약한 금액 계산
  const totalSavings = transactions.reduce((sum, t) => {
    const fullFeeCalc = calculateAllFees(t.salePrice, { storeLevel: 'NONE' }); // 할인 없는 경우
    const currentFeeCalc = calculateAllFees(t.salePrice, { storeLevel });
    return sum + (fullFeeCalc.totalFees - currentFeeCalc.totalFees);
  }, 0);
  
  return {
    totalSales,
    totalFees: totalFees + storeSubscriptionFee,
    feeBreakdown,
    storeSubscriptionFee,
    totalSavings
  };
}

/**
 * 수익성 분석
 */
export function calculateProfitability(
  salePrice: number,
  costPrice: number,
  options: {
    categoryId?: string;
    storeLevel?: EbayStoreLevel;
    isInternational?: boolean;
    promotedListingsAdRate?: number;
    shippingCost?: number;
  } = {}
): {
  revenue: number;
  costs: {
    itemCost: number;
    totalFees: number;
    shippingCost: number;
    totalCosts: number;
  };
  profit: {
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
  };
  feeCalculation: FeeCalculationResult;
} {
  const { shippingCost = 0 } = options;
  
  const feeCalculation = calculateAllFees(salePrice, options);
  
  const revenue = salePrice;
  const costs = {
    itemCost: costPrice,
    totalFees: feeCalculation.totalFees,
    shippingCost,
    totalCosts: costPrice + feeCalculation.totalFees + shippingCost
  };
  
  const grossProfit = revenue - costPrice;
  const netProfit = revenue - costs.totalCosts;
  const profitMargin = (netProfit / revenue) * 100;
  
  return {
    revenue,
    costs,
    profit: {
      grossProfit,
      netProfit,
      profitMargin
    },
    feeCalculation
  };
}

/**
 * 가격 최적화 제안
 */
export function suggestOptimalPrice(
  costPrice: number,
  targetMargin: number, // 목표 마진 (%)
  options: {
    categoryId?: string;
    storeLevel?: EbayStoreLevel;
    isInternational?: boolean;
    promotedListingsAdRate?: number;
    shippingCost?: number;
    competitorPrice?: number;
  } = {}
): {
  suggestedPrice: number;
  profitAnalysis: ReturnType<typeof calculateProfitability>;
  competitorComparison?: {
    priceDifference: number;
    priceDifferencePercentage: number;
    recommendation: string;
  };
} {
  const { competitorPrice, shippingCost = 0 } = options;
  
  // 목표 마진을 달성하기 위한 가격 역산
  // netProfit = revenue - (costPrice + fees + shippingCost)
  // targetMargin = (netProfit / revenue) * 100
  // 수수료는 가격에 비례하므로 반복 계산 필요
  
  let suggestedPrice = costPrice * 2; // 초기값
  let iterations = 0;
  const maxIterations = 10;
  
  while (iterations < maxIterations) {
    const profitAnalysis = calculateProfitability(suggestedPrice, costPrice, { ...options, shippingCost });
    const currentMargin = profitAnalysis.profit.profitMargin;
    
    if (Math.abs(currentMargin - targetMargin) < 0.1) {
      break; // 목표 마진에 근접
    }
    
    // 가격 조정
    if (currentMargin < targetMargin) {
      suggestedPrice *= 1.05; // 5% 증가
    } else {
      suggestedPrice *= 0.98; // 2% 감소
    }
    
    iterations++;
  }
  
  const profitAnalysis = calculateProfitability(suggestedPrice, costPrice, { ...options, shippingCost });
  
  let competitorComparison;
  if (competitorPrice) {
    const priceDifference = suggestedPrice - competitorPrice;
    const priceDifferencePercentage = (priceDifference / competitorPrice) * 100;
    
    let recommendation = '';
    if (priceDifferencePercentage > 10) {
      recommendation = '경쟁사 대비 가격이 높습니다. 가격 조정을 고려해보세요.';
    } else if (priceDifferencePercentage < -10) {
      recommendation = '경쟁사 대비 가격이 낮습니다. 가격 인상 여지가 있습니다.';
    } else {
      recommendation = '경쟁사와 비슷한 가격 수준입니다.';
    }
    
    competitorComparison = {
      priceDifference,
      priceDifferencePercentage,
      recommendation
    };
  }
  
  return {
    suggestedPrice: Math.round(suggestedPrice * 100) / 100, // 소수점 둘째 자리까지
    profitAnalysis,
    competitorComparison
  };
}