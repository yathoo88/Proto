/**
 * eBay API 구조를 기반으로 한 데모 데이터
 * 실제 eBay Finances API, Inventory API 응답 구조를 모방
 */

// eBay Fee Types (실제 eBay Finances API에서 사용되는 수수료 유형)
export type EbayFeeType = 
  // === 핵심 거래 수수료 ===
  | 'FINAL_VALUE_FEE'                    // 최종 판매 수수료 (12.7%-14.9%, 베이직 스토어+ 50% 할인)
  | 'FINAL_VALUE_FEE_FIXED_PER_ORDER'    // 주문당 고정 수수료 ($0.30/$0.40)
  | 'FINAL_VALUE_SHIPPING_FEE'           // 배송비 기반 최종 판매 수수료
  | 'PAYMENT_PROCESSING_FEE'             // 결제 처리 수수료 (2.7% + $0.25)
  | 'INTERNATIONAL_FEE'                  // 국제 거래 수수료 (1.0%-1.7%)
  
  // === 리스팅 관련 수수료 ===
  | 'INSERTION_FEE'                      // 리스팅 등록 수수료 ($0.35)
  | 'BOLD_FEE'                          // 굵은 글씨 업그레이드 수수료
  | 'GALLERY_FEE'                       // 갤러리 등록 수수료
  | 'FEATURED_GALLERY_FEE'              // 특별 갤러리 수수료
  | 'SUBTITLE_FEE'                      // 부제목 수수료
  | 'LISTING_UPGRADE_FEE'               // 리스팅 업그레이드 수수료
  
  // === 성과 기반 수수료 ===
  | 'BELOW_STANDARD_FEE'                // 기준 미달 셀러 추가 수수료
  | 'BELOW_STANDARD_SHIPPING_FEE'       // 기준 미달 셀러 배송 수수료
  | 'HIGH_ITEM_NOT_AS_DESCRIBED_FEE'    // 상품 불일치 높은 셀러 수수료
  | 'HIGH_ITEM_NOT_AS_DESCRIBED_SHIPPING_FEE' // 상품 불일치 배송 수수료
  
  // === 마케팅 및 광고 ===
  | 'AD_FEE'                           // 프로모티드 리스팅 광고비
  | 'PROMOTED_LISTINGS_FEE'            // 프로모션 리스팅 수수료
  
  // === 운영 및 서비스 수수료 ===
  | 'STORE_SUBSCRIPTION_FEE'           // 스토어 구독료
  | 'EXPRESS_PAYOUT_FEE'               // 빠른 지급 수수료 (직불카드)
  | 'BANK_PAYOUT_FEE'                  // 은행 송금 수수료
  | 'REGULATORY_OPERATING_FEE'         // 규제 운영 수수료
  
  // === 세금 및 원천징수 ===
  | 'TAX_DEDUCTION_AT_SOURCE'          // 원천 세금 공제
  | 'INCOME_TAX_WITHHOLDING'           // 소득세 원천징수
  | 'VAT_WITHHOLDING'                  // 부가세 원천징수
  
  // === 분쟁 및 기타 ===
  | 'PAYMENT_DISPUTE_FEE'              // 결제 분쟁 수수료
  | 'FINANCE_FEE'                      // 미납 월 청구서 금융 수수료
  | 'CHARITY_DONATION'                 // 자선 기부
  | 'OTHER_FEES';                      // 기타 수수료

// eBay Store 구독 레벨
export type EbayStoreLevel = 'NONE' | 'BASIC' | 'PREMIUM' | 'ANCHOR' | 'ENTERPRISE';

// eBay 마켓플레이스
export type EbayMarketplace = 'EBAY_US' | 'EBAY_UK' | 'EBAY_DE' | 'EBAY_AU' | 'EBAY_CA';

// eBay Fee 구조 (Finances API 기반)
export interface EbayFee {
  amount: number;
  currency: string;
  feeJurisdiction: string;
  feeMemo: string;
  feeType: EbayFeeType;
}

// eBay Payout 구조 (Finances API 기반)
export interface EbayPayout {
  payoutId: string;
  payoutStatus: 'INITIATED' | 'SUCCEEDED' | 'RETRYABLE_FAILED' | 'TERMINAL_FAILED';
  payoutDate: string;
  payoutAmount: {
    convertedFromCurrency: string;
    convertedFromValue: string;
    currency: string;
    value: string;
  };
  payoutMemo: string;
  transactionCount: number;
  lastAttemptedPayoutDate?: string;
}

// eBay Transaction 구조 (Finances API 기반)
export interface EbayTransaction {
  transactionId: string;
  transactionDate: string;
  transactionType: 'SALE' | 'REFUND' | 'CREDIT' | 'DISPUTE' | 'NON_SALE_CHARGE' | 'SHIPPING_LABEL';
  transactionStatus: 'FUNDS_PROCESSING' | 'FUNDS_AVAILABLE_FOR_PAYOUT' | 'FUNDS_ON_HOLD' | 'PAID';
  transactionMemo: string;
  orderLineItems: Array<{
    itemId: string;
    transactionId: string;
    legacyOrderId?: string;
    fees: EbayFee[];
    marketplaceFees: EbayFee[];
    totalAmount: {
      currency: string;
      value: string;
    };
  }>;
  totalFeeAmount: {
    currency: string;
    value: string;
  };
  totalFeeBasisAmount: {
    currency: string;
    value: string;
  };
}

// eBay Store 정보
export interface EbayStoreInfo {
  storeLevel: EbayStoreLevel;
  storeName: string;
  monthlyFee: number;
  freeListings: number;
  additionalListingFee: number;
  finalValueFeeDiscount: number; // 2025년 프로모션 할인율
  benefits: string[];
}

// eBay 상품 정보 (Inventory API 기반)
export interface EbayProduct {
  sku: string;
  offerId?: string;
  title: string;
  condition: 'NEW' | 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE';
  categoryId: string;
  listingPolicies: {
    fulfillmentPolicyId: string;
    paymentPolicyId: string;
    returnPolicyId: string;
  };
  pricingSummary: {
    price: {
      currency: string;
      value: string;
    };
    pricingVisibility: 'DURING_CHECKOUT' | 'PRE_CHECKOUT' | 'NONE';
  };
  quantityLimitPerBuyer?: number;
  storeCategoryNames?: string[];
  lotSize?: number;
  marketplaceId: EbayMarketplace;
  format: 'FIXED_PRICE' | 'AUCTION';
  availableQuantity: number;
  sold: number;
  listingStartDate: string;
  listingEndDate?: string;
  estimatedFees?: EbayFee[];
}

// 2025년 eBay 프로모션 정보
export interface EbayPromotion2025 {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountPercentage: number;
  applicableFeeTypes: EbayFeeType[];
  eligibilityRequirements: string[];
  marketplaces: EbayMarketplace[];
}

// eBay Store 레벨별 정보
export const EBAY_STORE_LEVELS: Record<EbayStoreLevel, EbayStoreInfo> = {
  NONE: {
    storeLevel: 'NONE',
    storeName: '일반 셀러',
    monthlyFee: 0,
    freeListings: 250,
    additionalListingFee: 0.35,
    finalValueFeeDiscount: 0,
    benefits: ['250개 무료 리스팅', '기본 셀러 도구']
  },
  BASIC: {
    storeLevel: 'BASIC',
    storeName: '베이직 스토어',
    monthlyFee: 27.95,
    freeListings: 1000,
    additionalListingFee: 0.30,
    finalValueFeeDiscount: 0.5, // 2025년 50% 할인
    benefits: ['1,000개 무료 리스팅', '50% 최종 판매 수수료 할인', '고급 마케팅 도구']
  },
  PREMIUM: {
    storeLevel: 'PREMIUM',
    storeName: '프리미엄 스토어',
    monthlyFee: 74.95,
    freeListings: 10000,
    additionalListingFee: 0.25,
    finalValueFeeDiscount: 0.5, // 2025년 50% 할인
    benefits: ['10,000개 무료 리스팅', '50% 최종 판매 수수료 할인', '프리미엄 마케팅 도구', '우선 고객 지원']
  },
  ANCHOR: {
    storeLevel: 'ANCHOR',
    storeName: '앵커 스토어',
    monthlyFee: 349.95,
    freeListings: 25000,
    additionalListingFee: 0.20,
    finalValueFeeDiscount: 0.5, // 2025년 50% 할인
    benefits: ['25,000개 무료 리스팅', '50% 최종 판매 수수료 할인', '고급 분석 도구', '전용 계정 매니저']
  },
  ENTERPRISE: {
    storeLevel: 'ENTERPRISE',
    storeName: '엔터프라이즈 스토어',
    monthlyFee: 2999.95,
    freeListings: 100000,
    additionalListingFee: 0.15,
    finalValueFeeDiscount: 0.5, // 2025년 50% 할인
    benefits: ['100,000개 무료 리스팅', '50% 최종 판매 수수료 할인', '엔터프라이즈 API 액세스', '24/7 전용 지원']
  }
};

// 2025년 eBay 프로모션 정보
export const EBAY_PROMOTIONS_2025: EbayPromotion2025[] = [
  {
    id: 'basic_store_discount_2025',
    name: '베이직 스토어 이상 50% 최종 판매 수수료 할인',
    description: '$2,500까지의 판매 금액에 대해 12.35% 최종 판매 수수료의 50% 할인',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    discountPercentage: 50,
    applicableFeeTypes: ['FINAL_VALUE_FEE'],
    eligibilityRequirements: ['베이직 스토어 이상 구독', '판매 금액 $2,500 이하'],
    marketplaces: ['EBAY_US', 'EBAY_UK', 'EBAY_DE', 'EBAY_AU']
  },
  {
    id: 'promoted_offsite_discount_2025',
    name: '프로모티드 오프사이트 광고비 50% 할인',
    description: '2025년 1월 20일 - 3월 31일 캠페인 설정 시 광고비 50% 할인',
    startDate: '2025-01-20',
    endDate: '2025-03-31',
    discountPercentage: 50,
    applicableFeeTypes: ['PROMOTED_LISTINGS_FEE'],
    eligibilityRequirements: ['해당 기간 내 프로모티드 오프사이트 캠페인 설정'],
    marketplaces: ['EBAY_US', 'EBAY_UK', 'EBAY_DE', 'EBAY_AU']
  }
];

// 데모 eBay 상품 데이터
export const DEMO_EBAY_PRODUCTS: EbayProduct[] = [
  {
    sku: 'EBY-ELEC-001',
    offerId: 'offer_12345678',
    title: 'Apple iPhone 15 Pro Max 256GB 자연 티타늄',
    condition: 'NEW',
    categoryId: '9355',
    listingPolicies: {
      fulfillmentPolicyId: 'fulfillment_policy_001',
      paymentPolicyId: 'payment_policy_001',
      returnPolicyId: 'return_policy_001'
    },
    pricingSummary: {
      price: {
        currency: 'USD',
        value: '1199.99'
      },
      pricingVisibility: 'PRE_CHECKOUT'
    },
    quantityLimitPerBuyer: 2,
    marketplaceId: 'EBAY_US',
    format: 'FIXED_PRICE',
    availableQuantity: 15,
    sold: 23,
    listingStartDate: '2025-01-10T09:00:00.000Z',
    estimatedFees: [
      {
        amount: 74.28, // 12.35% * 50% 할인 적용
        currency: 'USD',
        feeJurisdiction: 'US',
        feeMemo: '최종 판매 수수료 (50% 할인 적용)',
        feeType: 'FINAL_VALUE_FEE'
      },
      {
        amount: 35.10, // 2.9% + $0.30
        currency: 'USD',
        feeJurisdiction: 'US',
        feeMemo: '결제 처리 수수료',
        feeType: 'PAYMENT_PROCESSING_FEE'
      }
    ]
  },
  {
    sku: 'EBY-FASH-002',
    offerId: 'offer_23456789',
    title: 'Nike Air Force 1 Low White 남성 운동화',
    condition: 'NEW',
    categoryId: '15709',
    listingPolicies: {
      fulfillmentPolicyId: 'fulfillment_policy_001',
      paymentPolicyId: 'payment_policy_001',
      returnPolicyId: 'return_policy_001'
    },
    pricingSummary: {
      price: {
        currency: 'USD',
        value: '89.99'
      },
      pricingVisibility: 'PRE_CHECKOUT'
    },
    marketplaceId: 'EBAY_US',
    format: 'FIXED_PRICE',
    availableQuantity: 42,
    sold: 156,
    listingStartDate: '2025-01-08T14:30:00.000Z',
    estimatedFees: [
      {
        amount: 5.57, // 12.35% * 50% 할인 적용
        currency: 'USD',
        feeJurisdiction: 'US',
        feeMemo: '최종 판매 수수료 (50% 할인 적용)',
        feeType: 'FINAL_VALUE_FEE'
      },
      {
        amount: 2.91, // 2.9% + $0.30
        currency: 'USD',
        feeJurisdiction: 'US',
        feeMemo: '결제 처리 수수료',
        feeType: 'PAYMENT_PROCESSING_FEE'
      }
    ]
  },
  {
    sku: 'EBY-HOME-003',
    offerId: 'offer_34567890',
    title: 'Dyson V15 Detect 무선 청소기',
    condition: 'NEW',
    categoryId: '43576',
    listingPolicies: {
      fulfillmentPolicyId: 'fulfillment_policy_001',
      paymentPolicyId: 'payment_policy_001',
      returnPolicyId: 'return_policy_001'
    },
    pricingSummary: {
      price: {
        currency: 'USD',
        value: '649.99'
      },
      pricingVisibility: 'PRE_CHECKOUT'
    },
    marketplaceId: 'EBAY_US',
    format: 'FIXED_PRICE',
    availableQuantity: 8,
    sold: 34,
    listingStartDate: '2025-01-12T11:15:00.000Z',
    estimatedFees: [
      {
        amount: 40.22, // 12.35% * 50% 할인 적용
        currency: 'USD',
        feeJurisdiction: 'US',
        feeMemo: '최종 판매 수수료 (50% 할인 적용)',
        feeType: 'FINAL_VALUE_FEE'
      },
      {
        amount: 19.15, // 2.9% + $0.30
        currency: 'USD',
        feeJurisdiction: 'US',
        feeMemo: '결제 처리 수수료',
        feeType: 'PAYMENT_PROCESSING_FEE'
      },
      {
        amount: 12.99, // 프로모션 리스팅 수수료
        currency: 'USD',
        feeJurisdiction: 'US',
        feeMemo: '프로모티드 리스팅 수수료',
        feeType: 'PROMOTED_LISTINGS_FEE'
      }
    ]
  }
];

// 데모 eBay 거래 내역
export const DEMO_EBAY_TRANSACTIONS: EbayTransaction[] = [
  {
    transactionId: 'TXN_001_2025',
    transactionDate: '2025-01-14T16:45:00.000Z',
    transactionType: 'SALE',
    transactionStatus: 'FUNDS_AVAILABLE_FOR_PAYOUT',
    transactionMemo: 'iPhone 15 Pro Max 판매',
    orderLineItems: [
      {
        itemId: '12345678901',
        transactionId: 'TXN_001_2025',
        legacyOrderId: 'ORDER_001_2025',
        fees: [
          {
            amount: 74.28,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '최종 판매 수수료 (베이직 스토어 50% 할인 적용)',
            feeType: 'FINAL_VALUE_FEE'
          },
          {
            amount: 0.40,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '주문당 고정 수수료',
            feeType: 'FINAL_VALUE_FEE_FIXED_PER_ORDER'
          },
          {
            amount: 3.24,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '배송비 기반 최종 판매 수수료',
            feeType: 'FINAL_VALUE_SHIPPING_FEE'
          },
          {
            amount: 32.65,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '결제 처리 수수료 (2.7% + $0.25)',
            feeType: 'PAYMENT_PROCESSING_FEE'
          },
          {
            amount: 23.99,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '프로모티드 리스팅 광고비',
            feeType: 'AD_FEE'
          }
        ],
        marketplaceFees: [
          {
            amount: 0.35,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '리스팅 등록 수수료',
            feeType: 'INSERTION_FEE'
          }
        ],
        totalAmount: {
          currency: 'USD',
          value: '1199.99'
        }
      }
    ],
    totalFeeAmount: {
      currency: 'USD',
      value: '134.91'
    },
    totalFeeBasisAmount: {
      currency: 'USD',
      value: '1199.99'
    }
  },
  {
    transactionId: 'TXN_002_2025',
    transactionDate: '2025-01-14T14:22:00.000Z',
    transactionType: 'SALE',
    transactionStatus: 'FUNDS_PROCESSING',
    transactionMemo: 'Nike Air Force 1 판매 (국제 배송)',
    orderLineItems: [
      {
        itemId: '23456789012',
        transactionId: 'TXN_002_2025',
        legacyOrderId: 'ORDER_002_2025',
        fees: [
          {
            amount: 5.57,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '최종 판매 수수료 (베이직 스토어 50% 할인 적용)',
            feeType: 'FINAL_VALUE_FEE'
          },
          {
            amount: 0.30,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '주문당 고정 수수료 ($10 이하)',
            feeType: 'FINAL_VALUE_FEE_FIXED_PER_ORDER'
          },
          {
            amount: 2.68,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '결제 처리 수수료 (2.7% + $0.25)',
            feeType: 'PAYMENT_PROCESSING_FEE'
          },
          {
            amount: 1.53,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '국제 거래 수수료 (1.7%)',
            feeType: 'INTERNATIONAL_FEE'
          }
        ],
        marketplaceFees: [
          {
            amount: 0.35,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '리스팅 등록 수수료',
            feeType: 'INSERTION_FEE'
          },
          {
            amount: 2.99,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '부제목 수수료',
            feeType: 'SUBTITLE_FEE'
          }
        ],
        totalAmount: {
          currency: 'USD',
          value: '89.99'
        }
      }
    ],
    totalFeeAmount: {
      currency: 'USD',
      value: '13.42'
    },
    totalFeeBasisAmount: {
      currency: 'USD',
      value: '89.99'
    }
  },
  {
    transactionId: 'TXN_003_2025',
    transactionDate: '2025-01-13T10:15:00.000Z',
    transactionType: 'NON_SALE_CHARGE',
    transactionStatus: 'FUNDS_AVAILABLE_FOR_PAYOUT',
    transactionMemo: '베이직 스토어 월 구독료',
    orderLineItems: [
      {
        itemId: 'STORE_SUBSCRIPTION',
        transactionId: 'TXN_003_2025',
        fees: [
          {
            amount: 27.95,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '베이직 스토어 월 구독료',
            feeType: 'STORE_SUBSCRIPTION_FEE'
          }
        ],
        marketplaceFees: [],
        totalAmount: {
          currency: 'USD',
          value: '-27.95'
        }
      }
    ],
    totalFeeAmount: {
      currency: 'USD',
      value: '27.95'
    },
    totalFeeBasisAmount: {
      currency: 'USD',
      value: '0'
    }
  },
  {
    transactionId: 'TXN_004_2025',
    transactionDate: '2025-01-12T08:30:00.000Z',
    transactionType: 'REFUND',
    transactionStatus: 'FUNDS_PROCESSING',
    transactionMemo: 'Dyson V15 Detect 부분 환불',
    orderLineItems: [
      {
        itemId: '34567890123',
        transactionId: 'TXN_004_2025',
        legacyOrderId: 'ORDER_003_2025',
        fees: [
          {
            amount: -40.22,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '최종 판매 수수료 환불',
            feeType: 'FINAL_VALUE_FEE'
          },
          {
            amount: -0.40,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '주문당 고정 수수료 환불',
            feeType: 'FINAL_VALUE_FEE_FIXED_PER_ORDER'
          },
          {
            amount: 2.50,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '결제 분쟁 처리 수수료',
            feeType: 'PAYMENT_DISPUTE_FEE'
          }
        ],
        marketplaceFees: [],
        totalAmount: {
          currency: 'USD',
          value: '-649.99'
        }
      }
    ],
    totalFeeAmount: {
      currency: 'USD',
      value: '-38.12'
    },
    totalFeeBasisAmount: {
      currency: 'USD',
      value: '649.99'
    }
  },
  {
    transactionId: 'TXN_005_2025',
    transactionDate: '2025-01-11T15:45:00.000Z',
    transactionType: 'SALE',
    transactionStatus: 'FUNDS_ON_HOLD',
    transactionMemo: '기준 미달 셀러 - 추가 수수료 적용',
    orderLineItems: [
      {
        itemId: '45678901234',
        transactionId: 'TXN_005_2025',
        legacyOrderId: 'ORDER_004_2025',
        fees: [
          {
            amount: 15.98,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '최종 판매 수수료 (일반 요율)',
            feeType: 'FINAL_VALUE_FEE'
          },
          {
            amount: 0.40,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '주문당 고정 수수료',
            feeType: 'FINAL_VALUE_FEE_FIXED_PER_ORDER'
          },
          {
            amount: 6.98,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '결제 처리 수수료',
            feeType: 'PAYMENT_PROCESSING_FEE'
          },
          {
            amount: 25.99,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '기준 미달 셀러 추가 수수료 (10%)',
            feeType: 'BELOW_STANDARD_FEE'
          },
          {
            amount: 2.60,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '기준 미달 배송 수수료',
            feeType: 'BELOW_STANDARD_SHIPPING_FEE'
          }
        ],
        marketplaceFees: [
          {
            amount: 0.35,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '리스팅 등록 수수료',
            feeType: 'INSERTION_FEE'
          },
          {
            amount: 4.95,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '갤러리 특별 등록 수수료',
            feeType: 'FEATURED_GALLERY_FEE'
          }
        ],
        totalAmount: {
          currency: 'USD',
          value: '259.99'
        }
      }
    ],
    totalFeeAmount: {
      currency: 'USD',
      value: '57.25'
    },
    totalFeeBasisAmount: {
      currency: 'USD',
      value: '259.99'
    }
  },
  {
    transactionId: 'TXN_006_2025',
    transactionDate: '2025-01-10T11:20:00.000Z',
    transactionType: 'SALE',
    transactionStatus: 'FUNDS_AVAILABLE_FOR_PAYOUT',
    transactionMemo: '고가 명품 시계 판매 - 높은 상품 불일치 셀러',
    orderLineItems: [
      {
        itemId: '56789012345',
        transactionId: 'TXN_006_2025',
        legacyOrderId: 'ORDER_005_2025',
        fees: [
          {
            amount: 372.25,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '최종 판매 수수료 (14.9%)',
            feeType: 'FINAL_VALUE_FEE'
          },
          {
            amount: 0.40,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '주문당 고정 수수료',
            feeType: 'FINAL_VALUE_FEE_FIXED_PER_ORDER'
          },
          {
            amount: 67.57,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '결제 처리 수수료',
            feeType: 'PAYMENT_PROCESSING_FEE'
          },
          {
            amount: 125.00,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '상품 설명 불일치 높은 셀러 수수료 (5%)',
            feeType: 'HIGH_ITEM_NOT_AS_DESCRIBED_FEE'
          },
          {
            amount: 12.50,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '상품 불일치 배송 수수료',
            feeType: 'HIGH_ITEM_NOT_AS_DESCRIBED_SHIPPING_FEE'
          },
          {
            amount: 50.00,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '규제 운영 수수료 (고가 상품)',
            feeType: 'REGULATORY_OPERATING_FEE'
          }
        ],
        marketplaceFees: [
          {
            amount: 0.35,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '리스팅 등록 수수료',
            feeType: 'INSERTION_FEE'
          },
          {
            amount: 19.95,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '굵은 글씨 강조 수수료',
            feeType: 'BOLD_FEE'
          },
          {
            amount: 2.99,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '부제목 수수료',
            feeType: 'SUBTITLE_FEE'
          }
        ],
        totalAmount: {
          currency: 'USD',
          value: '2499.99'
        }
      }
    ],
    totalFeeAmount: {
      currency: 'USD',
      value: '651.01'
    },
    totalFeeBasisAmount: {
      currency: 'USD',
      value: '2499.99'
    }
  },
  {
    transactionId: 'TXN_007_2025',
    transactionDate: '2025-01-09T09:15:00.000Z',
    transactionType: 'NON_SALE_CHARGE',
    transactionStatus: 'FUNDS_AVAILABLE_FOR_PAYOUT',
    transactionMemo: '빠른 지급 요청 수수료',
    orderLineItems: [
      {
        itemId: 'EXPRESS_PAYOUT_REQUEST',
        transactionId: 'TXN_007_2025',
        fees: [
          {
            amount: 1.50,
            currency: 'USD',
            feeJurisdiction: 'US',
            feeMemo: '직불카드 빠른 지급 수수료',
            feeType: 'EXPRESS_PAYOUT_FEE'
          }
        ],
        marketplaceFees: [],
        totalAmount: {
          currency: 'USD',
          value: '-1.50'
        }
      }
    ],
    totalFeeAmount: {
      currency: 'USD',
      value: '1.50'
    },
    totalFeeBasisAmount: {
      currency: 'USD',
      value: '0'
    }
  }
];

// 데모 eBay 지급 내역
export const DEMO_EBAY_PAYOUTS: EbayPayout[] = [
  {
    payoutId: 'PAYOUT_001_2025',
    payoutStatus: 'SUCCEEDED',
    payoutDate: '2025-01-12T09:00:00.000Z',
    payoutAmount: {
      convertedFromCurrency: 'USD',
      convertedFromValue: '2847.63',
      currency: 'USD',
      value: '2847.63'
    },
    payoutMemo: '2025년 1월 첫 번째 주 판매 대금',
    transactionCount: 15,
    lastAttemptedPayoutDate: '2025-01-12T09:00:00.000Z'
  },
  {
    payoutId: 'PAYOUT_002_2025',
    payoutStatus: 'INITIATED',
    payoutDate: '2025-01-14T09:00:00.000Z',
    payoutAmount: {
      convertedFromCurrency: 'USD',
      convertedFromValue: '1582.14',
      currency: 'USD',
      value: '1582.14'
    },
    payoutMemo: '2025년 1월 두 번째 주 판매 대금',
    transactionCount: 8,
    lastAttemptedPayoutDate: '2025-01-14T09:00:00.000Z'
  }
];

// 수수료 계산을 위한 현재 사용자 스토어 정보
export const CURRENT_USER_STORE: EbayStoreInfo = EBAY_STORE_LEVELS.BASIC;

// 월별 수수료 요약 데이터
export interface MonthlyFeeSummary {
  month: string;
  totalSales: number;
  totalFees: number;
  feeBreakdown: {
    finalValueFees: number;
    paymentProcessingFees: number;
    storeSubscriptionFees: number;
    promotedListingsFees: number;
    otherFees: number;
  };
  savingsFromPromotions: number;
}

export const DEMO_MONTHLY_FEE_SUMMARY: MonthlyFeeSummary[] = [
  {
    month: '2025-01',
    totalSales: 45280.50,
    totalFees: 3842.65,
    feeBreakdown: {
      finalValueFees: 2798.23, // 50% 할인 적용
      paymentProcessingFees: 1342.33,
      storeSubscriptionFees: 27.95,
      promotedListingsFees: 524.87,
      otherFees: 149.27
    },
    savingsFromPromotions: 2798.23 // 50% 할인으로 절약한 금액
  },
  {
    month: '2024-12',
    totalSales: 52140.75,
    totalFees: 6425.84,
    feeBreakdown: {
      finalValueFees: 6439.39, // 할인 적용 전
      paymentProcessingFees: 1512.08,
      storeSubscriptionFees: 27.95,
      promotedListingsFees: 678.12,
      otherFees: 203.30
    },
    savingsFromPromotions: 0 // 2025년 프로모션 이전
  }
];