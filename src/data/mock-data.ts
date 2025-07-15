import { Product, Order, EbayOrder, EbayFee, CustomerOffer, PricingRecommendation, InventoryAlert, DashboardMetrics, ChartData } from '@/lib/types';
import { DEMO_EBAY_TRANSACTIONS } from './ebay-demo-data';

// 더미 상품 데이터
export const sampleProducts: Product[] = [
  {
    id: "1",
    sku: "JCP-SHIRT-001",
    name: "JCPenney Men's Cotton Shirt - Blue",
    category: "Clothing",
    supplier: "JCPenney",
    purchasePrice: 12.50,
    currentPrice: 25.99,
    recommendedPrice: 27.50,
    inventory: {
      total: 45,
      available: 38,
      consignment: 20,
      owned: 25
    },
    images: ["/images/jcp-shirt-blue.jpg"],
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    sku: "TGT-PANTS-002",
    name: "Target Women's Jeans - Black",
    category: "Clothing",
    supplier: "Target",
    purchasePrice: 18.75,
    currentPrice: 35.99,
    recommendedPrice: 38.99,
    inventory: {
      total: 32,
      available: 28,
      consignment: 15,
      owned: 17
    },
    images: ["/images/target-jeans-black.jpg"],
    createdAt: "2024-01-20"
  },
  {
    id: "3",
    sku: "WMT-SHOES-003",
    name: "Walmart Sneakers - White",
    category: "Footwear",
    supplier: "Walmart",
    purchasePrice: 22.00,
    currentPrice: 45.99,
    recommendedPrice: 42.99,
    inventory: {
      total: 18,
      available: 12,
      consignment: 8,
      owned: 10
    },
    images: ["/images/walmart-sneakers-white.jpg"],
    createdAt: "2024-02-01"
  },
  {
    id: "4",
    sku: "MAC-ELECT-004",
    name: "Macy's Bluetooth Headphones",
    category: "Electronics",
    supplier: "Macy's",
    purchasePrice: 35.00,
    currentPrice: 79.99,
    recommendedPrice: 85.99,
    inventory: {
      total: 25,
      available: 22,
      consignment: 12,
      owned: 13
    },
    images: ["/images/macys-headphones.jpg"],
    createdAt: "2024-02-10"
  },
  {
    id: "5",
    sku: "COST-HOME-005",
    name: "Costco Kitchen Set",
    category: "Home & Garden",
    supplier: "Costco",
    purchasePrice: 45.00,
    currentPrice: 89.99,
    recommendedPrice: 92.99,
    inventory: {
      total: 8,
      available: 6,
      consignment: 3,
      owned: 5
    },
    images: ["/images/costco-kitchen-set.jpg"],
    createdAt: "2024-02-15"
  }
];

// eBay 거래 데이터를 주문 형태로 변환하는 헬퍼 함수
function convertEbayTransactionToOrder(transaction: any, index: number): Order {
  const orderLineItem = transaction.orderLineItems[0];
  const allFees = [...orderLineItem.fees, ...orderLineItem.marketplaceFees];
  const totalFees = allFees.reduce((sum: number, fee: any) => sum + Math.abs(fee.amount), 0);
  const salePrice = parseFloat(orderLineItem.totalAmount.value);
  const estimatedPurchasePrice = salePrice * 0.6; // 추정 매입가
  const profit = salePrice - totalFees - estimatedPurchasePrice;
  const marginRate = salePrice > 0 ? ((profit / salePrice) * 100) : 0;
  
  // 프로모션 절약 계산
  const promotionSavings = allFees
    .filter((fee: any) => fee.feeMemo.includes('할인') || fee.feeMemo.includes('50%'))
    .reduce((sum: number, fee: any) => sum + Math.abs(fee.amount), 0);

  return {
    id: (index + 1).toString(),
    orderNumber: orderLineItem.legacyOrderId || `TXN-${transaction.transactionId}`,
    platform: "ebay",
    sku: `SKU-${orderLineItem.itemId.slice(-6)}`,
    productName: transaction.transactionMemo,
    quantity: 1,
    salePrice,
    purchasePrice: estimatedPurchasePrice,
    fees: {
      platformFee: allFees.filter((f: any) => f.feeType.includes('FINAL_VALUE')).reduce((sum: number, fee: any) => sum + Math.abs(fee.amount), 0),
      paymentFee: allFees.filter((f: any) => f.feeType === 'PAYMENT_PROCESSING_FEE').reduce((sum: number, fee: any) => sum + Math.abs(fee.amount), 0),
      shippingFee: allFees.filter((f: any) => f.feeType.includes('SHIPPING')).reduce((sum: number, fee: any) => sum + Math.abs(fee.amount), 0),
      promotionFee: allFees.filter((f: any) => f.feeType.includes('AD_FEE') || f.feeType.includes('PROMOTED')).reduce((sum: number, fee: any) => sum + Math.abs(fee.amount), 0),
      tax: allFees.filter((f: any) => f.feeType.includes('TAX')).reduce((sum: number, fee: any) => sum + Math.abs(fee.amount), 0),
      others: allFees.filter((f: any) => !['FINAL_VALUE_FEE', 'PAYMENT_PROCESSING_FEE', 'AD_FEE', 'PROMOTED_LISTINGS_FEE'].some(type => f.feeType.includes(type))).reduce((sum: number, fee: any) => sum + Math.abs(fee.amount), 0)
    },
    profit,
    marginRate,
    orderDate: transaction.transactionDate,
    shippingDate: transaction.transactionStatus === 'FUNDS_AVAILABLE_FOR_PAYOUT' ? new Date(Date.now() - 86400000).toISOString() : undefined,
    status: transaction.transactionStatus === 'FUNDS_AVAILABLE_FOR_PAYOUT' ? 'delivered' : 
            transaction.transactionStatus === 'FUNDS_PROCESSING' ? 'shipped' :
            transaction.transactionStatus === 'FUNDS_ON_HOLD' ? 'pending' : 'pending',
    // eBay API 확장 데이터
    ebayTransaction: transaction,
    detailedFees: allFees,
    promotionSavings
  };
}

// 더미 주문 데이터 (eBay 거래 데이터 기반)
export const sampleOrders: Order[] = DEMO_EBAY_TRANSACTIONS
  .filter(transaction => transaction.transactionType === 'SALE')
  .map((transaction, index) => convertEbayTransactionToOrder(transaction, index));

// 더미 고객 오퍼 데이터
export const sampleOffers: CustomerOffer[] = [
  {
    id: "1",
    sku: "JCP-SHIRT-001",
    productName: "JCPenney Men's Cotton Shirt - Blue",
    originalPrice: 25.99,
    offerPrice: 22.50,
    customerName: "김고객",
    message: "3개 구매할게요. 할인 가능하신가요?",
    date: "2024-07-15T14:20:00Z",
    status: "pending",
    responseDeadline: "2024-07-17T14:20:00Z",
    aiRecommendation: "accept",
    profitImpact: -3.49
  }
];

// 더미 고객 오퍼 데이터
export const sampleCustomerOffers: CustomerOffer[] = [
  {
    id: "1",
    sku: "JCP-SHIRT-001",
    productName: "JCPenney Men's Cotton Shirt - Blue",
    originalPrice: 25.99,
    offerPrice: 22.50,
    customerMessage: "Can you do $22.50 for this shirt? I'll buy 3 if you accept.",
    status: "pending",
    recommendedAction: "accept",
    recommendedCounterPrice: 23.00,
    createdAt: "2024-07-15T14:20:00Z"
  },
  {
    id: "2",
    sku: "WMT-SHOES-003",
    productName: "Walmart Sneakers - White",
    originalPrice: 45.99,
    offerPrice: 35.00,
    customerMessage: "These are too expensive. Would you take $35?",
    status: "pending",
    recommendedAction: "counter",
    recommendedCounterPrice: 42.00,
    createdAt: "2024-07-15T12:10:00Z"
  },
  {
    id: "3",
    sku: "MAC-ELECT-004",
    productName: "Macy's Bluetooth Headphones",
    originalPrice: 79.99,
    offerPrice: 65.00,
    customerMessage: "I found these cheaper elsewhere. Can you match $65?",
    status: "pending",
    recommendedAction: "reject",
    createdAt: "2024-07-15T08:45:00Z"
  }
];

// 더미 가격 추천 데이터
export const samplePricingRecommendations: PricingRecommendation[] = [
  {
    id: "1",
    sku: "JCP-SHIRT-001",
    productName: "JCPenney Men's Cotton Shirt - Blue",
    currentPrice: 25.99,
    recommendedPrice: 27.50,
    reason: "경쟁사 대비 5% 저가, 재고 회전율 개선 필요",
    expectedMarginIncrease: 8.2,
    competitorPrices: [28.99, 29.50, 26.99],
    stockLevel: 38,
    salesVelocity: 12,
    confidence: 85
  },
  {
    id: "2",
    sku: "TGT-PANTS-002",
    productName: "Target Women's Jeans - Black",
    currentPrice: 35.99,
    recommendedPrice: 38.99,
    reason: "계절성 수요 증가, 재고 부족",
    expectedMarginIncrease: 12.5,
    competitorPrices: [39.99, 42.00, 37.50],
    stockLevel: 28,
    salesVelocity: 15,
    confidence: 92
  },
  {
    id: "3",
    sku: "COST-HOME-005",
    productName: "Costco Kitchen Set",
    currentPrice: 89.99,
    recommendedPrice: 92.99,
    reason: "프리미엄 포지셔닝 가능, 높은 수요",
    expectedMarginIncrease: 6.8,
    competitorPrices: [95.00, 98.99, 94.50],
    stockLevel: 6,
    salesVelocity: 8,
    confidence: 78
  }
];

// 더미 재고 알림 데이터
export const sampleInventoryAlerts: InventoryAlert[] = [
  {
    id: "1",
    sku: "COST-HOME-005",
    productName: "Costco Kitchen Set",
    type: "low_stock",
    priority: "high",
    title: "재고 부족 경고",
    message: "현재 재고가 6개로 안전 재고량 이하입니다. 재주문을 고려해주세요.",
    createdAt: "2024-07-15T09:00:00Z"
  },
  {
    id: "2",
    sku: "WMT-SHOES-003",
    productName: "Walmart Sneakers - White",
    type: "low_stock",
    priority: "medium",
    title: "재고 부족 주의",
    message: "현재 재고가 12개입니다. 판매 속도를 고려하여 재주문을 준비해주세요.",
    createdAt: "2024-07-15T10:30:00Z"
  },
  {
    id: "3",
    sku: "JCP-SHIRT-001",
    productName: "JCPenney Men's Cotton Shirt - Blue",
    type: "slow_moving",
    priority: "low",
    title: "회전율 저하",
    message: "최근 2주간 판매가 없었습니다. 프로모션을 고려해보세요.",
    createdAt: "2024-07-14T15:20:00Z"
  }
];

// 더미 대시보드 지표 데이터
export const sampleDashboardMetrics: DashboardMetrics = {
  totalRevenue: 127543.50,
  totalProfit: 34210.80,
  avgMarginRate: 26.8,
  totalOrders: 1247,
  activeListings: 156,
  lowStockItems: 12,
  pendingOffers: 23,
  aiRecommendations: 15
};

// 더미 차트 데이터 (최근 7일)
export const sampleChartData: ChartData[] = [
  { date: "2024-07-09", revenue: 2845.50, profit: 765.20, orders: 18 },
  { date: "2024-07-10", revenue: 3102.75, profit: 834.60, orders: 22 },
  { date: "2024-07-11", revenue: 2678.30, profit: 719.40, orders: 16 },
  { date: "2024-07-12", revenue: 3456.80, profit: 928.70, orders: 25 },
  { date: "2024-07-13", revenue: 2934.25, profit: 788.90, orders: 19 },
  { date: "2024-07-14", revenue: 3789.60, profit: 1018.20, orders: 28 },
  { date: "2024-07-15", revenue: 4234.90, profit: 1138.50, orders: 31 }
];

// 매입처별 통계 데이터
export const supplierStats = {
  "JCPenney": { totalProducts: 45, avgMargin: 28.5, totalRevenue: 34520.30 },
  "Target": { totalProducts: 38, avgMargin: 32.1, totalRevenue: 28940.75 },
  "Walmart": { totalProducts: 29, avgMargin: 25.8, totalRevenue: 21560.45 },
  "Macy's": { totalProducts: 23, avgMargin: 31.4, totalRevenue: 19780.80 },
  "Costco": { totalProducts: 21, avgMargin: 35.2, totalRevenue: 22741.20 }
};