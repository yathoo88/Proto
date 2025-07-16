"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Plus, MoreVertical, Upload, Info, RefreshCw } from "lucide-react";
import { FeeBreakdownCard } from "@/components/orders/fee-breakdown";
import { sampleOrders } from "@/data/mock-data";
import { Order } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useEbayData } from "@/hooks/use-ebay-data";
import { toast } from "sonner";

const platformColors = {
  ebay: "bg-yellow-100 text-yellow-800 border-yellow-200",
  shopify: "bg-green-100 text-green-800 border-green-200",
  auction: "bg-purple-100 text-purple-800 border-purple-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  shipped: "bg-blue-100 text-blue-800 border-blue-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  refunded: "bg-red-100 text-red-800 border-red-200"
};

const statusLabels = {
  pending: "처리중",
  shipped: "배송중",
  delivered: "배송완료",
  refunded: "환불완료"
};

function calculateTotalFees(fees: Order['fees']): number {
  return Object.values(fees).reduce((sum, fee) => sum + fee, 0);
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [useEbayApi, setUseEbayApi] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const { data: ebayData, loading, error, refetch } = useEbayData({
    endpoint: 'orders',
    params: {
      limit: '100',
      offset: '0'
    },
    enabled: useEbayApi
  });

  useEffect(() => {
    if (ebayData?.orders) {
      const transformedOrders = ebayData.orders.map((order: {
        id: string;
        customerName: string;
        products?: Array<{ name: string; quantity: number }>;
        total: number;
        fees: number;
        profit: number;
        status: string;
        date: Date;
      }) => ({
        id: order.id,
        orderNumber: order.id,
        platform: 'ebay' as const,
        customerName: order.customerName,
        productName: order.products?.[0]?.name || 'Unknown Product',
        sku: `SKU-${order.id.slice(-6)}`,
        quantity: order.products?.reduce((sum: number, p) => sum + (p.quantity || 1), 0) || 1,
        salePrice: order.total / (order.products?.reduce((sum: number, p) => sum + (p.quantity || 1), 0) || 1),
        purchasePrice: order.total * 0.6,
        fees: {
          platform: order.fees * 0.7,
          payment: order.fees * 0.3,
          shipping: 0,
          other: 0
        },
        detailedFees: [
          {
            feeType: 'FINAL_VALUE_FEE',
            feeDescription: 'eBay Final Value Fee',
            amount: order.fees * 0.7,
            currency: 'USD'
          },
          {
            feeType: 'PAYMENT_PROCESSING_FEE',
            feeDescription: 'Payment Processing Fee',
            amount: order.fees * 0.3,
            currency: 'USD'
          }
        ],
        profit: order.profit,
        marginRate: (order.profit / order.total) * 100,
        status: order.status as 'pending' | 'shipped' | 'delivered' | 'refunded',
        orderDate: order.date,
        deliveryDate: new Date(order.date.getTime() + 7 * 24 * 60 * 60 * 1000),
        promotionSavings: 0
      }));
      setOrders(transformedOrders);
    } else if (!useEbayApi) {
      setOrders(sampleOrders);
    }
  }, [ebayData, useEbayApi]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === "all" || order.platform === platformFilter;
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.salePrice * order.quantity), 0);
  const totalProfit = filteredOrders.reduce((sum, order) => sum + order.profit, 0);
  const avgMargin = filteredOrders.length > 0 ? 
    filteredOrders.reduce((sum, order) => sum + order.marginRate, 0) / filteredOrders.length : 0;
  const totalPromotionSavings = filteredOrders.reduce((sum, order) => sum + (order.promotionSavings || 0), 0);
  const totalFees = filteredOrders.reduce((sum, order) => sum + calculateTotalFees(order.fees), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">주문 및 정산 관리</h1>
          <p className="text-muted-foreground">
            {useEbayApi ? 'eBay Sandbox API' : 'Mock 데이터'}를 사용한 주문 내역
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setUseEbayApi(!useEbayApi);
              toast.success(`${!useEbayApi ? 'eBay API' : 'Mock 데이터'}로 전환했습니다`);
            }}
          >
            {useEbayApi ? 'Mock 데이터 사용' : 'eBay API 사용'}
          </Button>
          {useEbayApi && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            엑셀 업로드
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            주문 추가
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="text-sm text-muted-foreground">총 매출</div>
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
        </GlassCard>
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="text-sm text-muted-foreground">총 수수료</div>
          <div className="text-2xl font-bold text-red-600">${totalFees.toLocaleString()}</div>
        </GlassCard>
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="text-sm text-muted-foreground">총 순이익</div>
          <div className="text-2xl font-bold text-green-600">${totalProfit.toLocaleString()}</div>
        </GlassCard>
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="text-sm text-muted-foreground">평균 마진율</div>
          <div className="text-2xl font-bold">{avgMargin.toFixed(1)}%</div>
        </GlassCard>
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="text-sm text-muted-foreground">프로모션 절약</div>
          <div className="text-2xl font-bold text-green-600">${totalPromotionSavings.toLocaleString()}</div>
          {totalPromotionSavings > 0 && (
            <div className="text-xs text-green-600 mt-1">2025년 베이직 스토어+ 혜택</div>
          )}
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="주문번호, 상품명, SKU 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm border-white/20"
            />
          </div>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-40 bg-white/50 backdrop-blur-sm border-white/20">
              <SelectValue placeholder="플랫폼" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 플랫폼</SelectItem>
              <SelectItem value="ebay">eBay</SelectItem>
              <SelectItem value="shopify">Shopify</SelectItem>
              <SelectItem value="auction">옥션</SelectItem>
              <SelectItem value="other">기타</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white/50 backdrop-blur-sm border-white/20">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="pending">처리중</SelectItem>
              <SelectItem value="shipped">배송중</SelectItem>
              <SelectItem value="delivered">배송완료</SelectItem>
              <SelectItem value="refunded">환불완료</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Orders Table */}
      <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">주문 목록</h3>
            <div className="text-sm text-muted-foreground">
              {loading ? '로딩 중...' : `총 ${filteredOrders.length}개 주문`}
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-medium">오류가 발생했습니다</p>
              <p className="text-sm">{error.message}</p>
              <p className="text-xs mt-2">Mock 데이터로 전환하여 계속 사용할 수 있습니다.</p>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead>주문번호</TableHead>
                  <TableHead>플랫폼</TableHead>
                  <TableHead>상품정보</TableHead>
                  <TableHead className="text-right">판매가</TableHead>
                  <TableHead className="text-right">수수료</TableHead>
                  <TableHead className="text-right">순이익</TableHead>
                  <TableHead className="text-right">마진율</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>주문일</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="hover:bg-white/20 transition-colors border-white/10"
                  >
                    <TableCell className="font-mono text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${platformColors[order.platform]}`}
                      >
                        {order.platform.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{order.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.sku} • 수량: {order.quantity}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${(order.salePrice * order.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-red-600 font-medium">
                          -${calculateTotalFees(order.fees).toFixed(2)}
                        </span>
                        {order.detailedFees && order.detailedFees.length > 0 && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Info className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>수수료 상세 내역 - {order.productName}</DialogTitle>
                              </DialogHeader>
                              <FeeBreakdownCard 
                                fees={order.detailedFees?.filter(fee => 
                                  !order.ebayTransaction?.orderLineItems[0]?.marketplaceFees.some(mf => mf.feeType === fee.feeType)
                                ) || []}
                                marketplaceFees={order.ebayTransaction?.orderLineItems[0]?.marketplaceFees || []}
                                totalAmount={order.salePrice * order.quantity}
                                promotionSavings={order.promotionSavings}
                              />
                            </DialogContent>
                          </Dialog>
                        )}
                        {order.promotionSavings && order.promotionSavings > 0 && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            -${order.promotionSavings.toFixed(2)} 절약
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${
                      order.profit > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${order.profit.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`font-medium ${
                          order.marginRate > 30 ? 'text-green-600' : 
                          order.marginRate > 20 ? 'text-blue-600' :
                          order.marginRate > 10 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {order.marginRate.toFixed(1)}%
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          order.marginRate > 30 ? 'bg-green-500' : 
                          order.marginRate > 20 ? 'bg-blue-500' :
                          order.marginRate > 10 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusColors[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDistanceToNow(new Date(order.orderDate), { 
                        addSuffix: true,
                        locale: ko 
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-xl">
                          <DropdownMenuItem>상세 보기</DropdownMenuItem>
                          <DropdownMenuItem>수정</DropdownMenuItem>
                          <DropdownMenuItem>추적번호 입력</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            환불 처리
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}