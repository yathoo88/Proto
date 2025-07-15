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

export interface OrderFees {
  platformFee: number; // 플랫폼 수수료
  paymentFee: number; // 결제 수수료
  shippingFee: number; // 배송비
  promotionFee: number; // 프로모션비
  tax: number; // 세금
  others: number; // 기타
}

export interface Order {
  id: string;
  orderNumber: string;
  platform: 'ebay' | 'shopify' | 'auction' | 'other';
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

// 플랫폼별 수수료 구조
export interface PlatformFeeStructure {
  ebay: {
    baseFee: number;
    paymentFee: number;
    promotionFee?: number;
  };
  shopify: {
    baseFee: number;
    transactionFee: number;
  };
  auction: {
    baseFee: number;
    paymentFee: number;
  };
}