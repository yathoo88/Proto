import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopProductsTable } from "@/components/dashboard/top-products-table";
import { RecentOrdersList } from "@/components/dashboard/recent-orders-list";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Package, 
  AlertTriangle,
  RefreshCw,
  Download 
} from "lucide-react";
import {
  sampleDashboardMetrics,
  sampleChartData,
  sampleProducts,
  sampleOrders
} from "@/data/mock-data";

export default function Dashboard() {
  const metrics = sampleDashboardMetrics;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
          <p className="text-muted-foreground">멀티채널 판매 현황을 한눈에 확인하세요</p>
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="총 매출"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          trend="+12.5%"
          trendType="positive"
          className="backdrop-blur-xl bg-white/60 border-white/20"
        />
        <MetricCard
          title="순이익"
          value={`$${metrics.totalProfit.toLocaleString()}`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="+8.2%"
          trendType="positive"
          className="backdrop-blur-xl bg-white/60 border-white/20"
        />
        <MetricCard
          title="평균 마진율"
          value={`${metrics.avgMarginRate}%`}
          icon={<Target className="h-4 w-4" />}
          trend="+2.1%"
          trendType="positive"
          className="backdrop-blur-xl bg-white/60 border-white/20"
        />
        <MetricCard
          title="총 주문수"
          value={metrics.totalOrders.toLocaleString()}
          icon={<Package className="h-4 w-4" />}
          trend="+15.3%"
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

        {/* AI 추천 현황 */}
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI 가격 추천</h3>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.aiRecommendations}개
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>예상 수익 증가</span>
                <span className="font-semibold text-green-600">+15.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>대기중인 오퍼</span>
                <span className="font-semibold">{metrics.pendingOffers}개</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>낮은 재고 알림</span>
                <span className="font-semibold text-orange-600">{metrics.lowStockItems}개</span>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
              가격 최적화 보기
            </Button>
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

      {/* Alert Section */}
      <GlassCard className="backdrop-blur-xl bg-orange-50/60 border-orange-200/30 p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <div>
            <h4 className="font-medium text-orange-800">재고 부족 알림</h4>
            <p className="text-sm text-orange-600">
              {metrics.lowStockItems}개 상품의 재고가 부족합니다. 재주문을 고려해보세요.
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            확인하기
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
