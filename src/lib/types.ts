// 기본 엔티티 타입들
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  supplier: string; // 매입처
  purchasePrice: number; // 매입가
  currentPrice: number; // 현재 판매가
  recommendedPrice?: number; // AI 추천가
  inventory: {
    total: number;
    available: number;
    consignment: number; // 위탁
    owned: number; // 매입
  };
  images: string[];
  createdAt: string;
}

// eBay API 구조를 기반으로 한 수수료 정보
export interface EbayFee {
  amount: number;
  currency: string;
  feeJurisdiction: string;
  feeMemo: string;
  feeType: string; // EbayFeeType from ebay-demo-data.ts
}

// eBay Order Line Item (Finances API 구조 기반)
export interface EbayOrderLineItem {
  itemId: string;
  transactionId: string;
  legacyOrderId?: string;
  fees: EbayFee[];
  marketplaceFees: EbayFee[];
  totalAmount: {
    currency: string;
    value: string;
  };
  productName?: string;
  sku?: string;
  quantity?: number;
  purchasePrice?: number;
}

// 기존 OrderFees - 하위 호환성을 위해 유지
export interface OrderFees {
  platformFee: number; // 플랫폼 수수료
  paymentFee: number; // 결제 수수료
  shippingFee: number; // 배송비
  promotionFee: number; // 프로모션비
  tax: number; // 세금
  others: number; // 기타
}

// eBay Transaction 기반의 주문 정보
export interface EbayOrder {
  transactionId: string;
  transactionDate: string;
  transactionType: 'SALE' | 'REFUND' | 'CREDIT' | 'DISPUTE' | 'NON_SALE_CHARGE' | 'SHIPPING_LABEL';
  transactionStatus: 'FUNDS_PROCESSING' | 'FUNDS_AVAILABLE_FOR_PAYOUT' | 'FUNDS_ON_HOLD' | 'PAID';
  transactionMemo: string;
  orderLineItems: EbayOrderLineItem[];
  totalFeeAmount: {
    currency: string;
    value: string;
  };
  totalFeeBasisAmount: {
    currency: string;
    value: string;
  };
  // 계산된 필드들
  profit?: number;
  marginRate?: number;
  promotionSavings?: number;
}

// 기존 Order 인터페이스 - 하위 호환성을 위해 유지하되 eBay 필드 추가
export interface Order {
  id: string;
  orderNumber: string;
  platform: 'ebay';
  sku: string;
  productName: string;
  quantity: number;
  salePrice: number;
  purchasePrice: number;
  fees: OrderFees;
  profit: number; // 순이익
  marginRate: number; // 마진율
  orderDate: string;
  shippingDate?: string;
  status: 'pending' | 'shipped' | 'delivered' | 'refunded';
  // eBay API 확장 필드들
  ebayTransaction?: EbayOrder;
  detailedFees?: EbayFee[];
  promotionSavings?: number;
}

export interface CustomerOffer {
  id: string;
  orderId?: string;
  sku: string;
  productName: string;
  originalPrice: number;
  offerPrice: number;
  customerMessage?: string;
  autoResponse?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'counter_offered';
  recommendedAction: 'accept' | 'reject' | 'counter';
  recommendedCounterPrice?: number;
  createdAt: string;
  respondedAt?: string;
}

export interface PricingRule {
  id: string;
  name: string;
  condition: {
    dayOfWeek?: number[]; // 0=일요일
    timeRange?: { start: string; end: string };
    stockLevel?: { min: number; max: number };
    marginRate?: { min: number };
  };
  action: {
    type: 'percentage' | 'fixed' | 'dynamic';
    value: number;
    maxDiscount?: number;
  };
  active: boolean;
}

export interface PricingRecommendation {
  id: string;
  sku: string;
  productName: string;
  currentPrice: number;
  recommendedPrice: number;
  reason: string;
  expectedMarginIncrease: number;
  competitorPrices: number[];
  stockLevel: number;
  salesVelocity: number;
  confidence: number;
}

export interface InventoryAlert {
  id: string;
  sku: string;
  productName: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'slow_moving';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalProfit: number;
  avgMarginRate: number;
  totalOrders: number;
  activeListings: number;
  lowStockItems: number;
  pendingOffers: number;
  aiRecommendations: number;
}

export interface ChartData {
  date: string;
  revenue: number;
  profit: number;
  orders: number;
}

export interface AutoNegotiationRule {
  id: string;
  name: string;
  minMarginRate: number;
  maxDiscountPercent: number;
  autoAcceptThreshold: number;
  autoRejectThreshold: number;
  active: boolean;
}

// eBay 수수료 구조
export interface EbayFeeStructure {
  finalValueFee: number;
  paymentProcessingFee: number;
  storeSubscriptionFee?: number;
  promotedListingsFee?: number;
  internationalFee?: number;
  insertionFee?: number;
}