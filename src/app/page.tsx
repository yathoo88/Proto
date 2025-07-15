import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopProductsTable } from "@/components/dashboard/top-products-table";
import { RecentOrdersList } from "@/components/dashboard/recent-orders-list";
import { EbayFeeDashboard } from "@/components/dashboard/ebay-fee-dashboard";
import { GlassCard } from "@/components/ui/glass-card";
import { LinkButton } from "@/components/ui/link-button";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Package, 
  RefreshCw,
  Download,
  Store
} from "lucide-react";
import {
  sampleChartData,
  sampleProducts,
  sampleOrders
} from "@/data/mock-data";
import { CURRENT_USER_STORE, DEMO_MONTHLY_FEE_SUMMARY } from "@/data/ebay-demo-data";

export default function Dashboard() {
  // const metrics = sampleDashboardMetrics;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">eBay 셀러 대시보드</h1>
          <p className="text-muted-foreground">eBay 판매 현황과 수수료를 한눈에 확인하세요</p>
          <div className="flex items-center gap-2 mt-2">
            <Store className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">{CURRENT_USER_STORE.storeName}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            리포트 다운로드
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>

      {/* eBay 수수료 대시보드 */}
      <EbayFeeDashboard />
      
      {/* eBay 판매 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="eBay 총 매출"
          value={`$${DEMO_MONTHLY_FEE_SUMMARY[0].totalSales.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          trend="-13.2%"
          trendType="negative"
          className="backdrop-blur-xl bg-white/60 border-white/20"
        />
        <MetricCard
          title="순이익 (수수료 제외)"
          value={`$${(DEMO_MONTHLY_FEE_SUMMARY[0].totalSales - DEMO_MONTHLY_FEE_SUMMARY[0].totalFees).toLocaleString()}`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="+5.8%"
          trendType="positive"
          className="backdrop-blur-xl bg-white/60 border-white/20"
        />
        <MetricCard
          title="실효 수수료율"
          value={`${((DEMO_MONTHLY_FEE_SUMMARY[0].totalFees / DEMO_MONTHLY_FEE_SUMMARY[0].totalSales) * 100).toFixed(1)}%`}
          icon={<Target className="h-4 w-4" />}
          trend="-40.2%"
          trendType="positive"
          className="backdrop-blur-xl bg-white/60 border-white/20"
        />
        <MetricCard
          title="프로모션 절약"
          value={`$${DEMO_MONTHLY_FEE_SUMMARY[0].savingsFromPromotions.toLocaleString()}`}
          icon={<Package className="h-4 w-4" />}
          trend="신규"
          trendType="positive"
          className="backdrop-blur-xl bg-white/60 border-white/20"
        />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20">
            <RevenueChart data={sampleChartData} />
          </GlassCard>
        </div>

        {/* eBay 스토어 현황 */}
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">eBay 스토어 혜택</h3>
              <div className="text-sm font-bold text-purple-600">
                {CURRENT_USER_STORE.storeName}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>월 구독료</span>
                <span className="font-semibold">${CURRENT_USER_STORE.monthlyFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>무료 리스팅</span>
                <span className="font-semibold text-green-600">{CURRENT_USER_STORE.freeListings.toLocaleString()}개</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>수수료 할인</span>
                <span className="font-semibold text-blue-600">{(CURRENT_USER_STORE.finalValueFeeDiscount * 100)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>이번 달 절약</span>
                <span className="font-semibold text-green-600">${DEMO_MONTHLY_FEE_SUMMARY[0].savingsFromPromotions.toLocaleString()}</span>
              </div>
            </div>
            <LinkButton href="/store" className="w-full bg-gradient-to-r from-purple-500 to-blue-600">
              스토어 관리
            </LinkButton>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20">
          <TopProductsTable products={sampleProducts} />
        </GlassCard>
        
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20">
          <RecentOrdersList orders={sampleOrders} />
        </GlassCard>
      </div>

      {/* eBay 2025 프로모션 알림 */}
      <GlassCard className="backdrop-blur-xl bg-green-50/60 border-green-200/30 p-4">
        <div className="flex items-center space-x-3">
          <Store className="h-5 w-5 text-green-600" />
          <div>
            <h4 className="font-medium text-green-800">2025년 eBay 프로모션 혜택 적용 중</h4>
            <p className="text-sm text-green-600">
              베이직 스토어 이상 50% 최종 판매 수수료 할인이 적용되어 이번 달 ${DEMO_MONTHLY_FEE_SUMMARY[0].savingsFromPromotions.toLocaleString()}를 절약했습니다.
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            자세히 보기
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
