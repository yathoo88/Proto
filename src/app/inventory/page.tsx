"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Search, 
  AlertTriangle, 
  Package, 
  TrendingDown, 
  MoreHorizontal, 
  RefreshCw,
  Download,
  Plus 
} from "lucide-react";
import { sampleProducts, sampleInventoryAlerts, supplierStats } from "@/data/mock-data";
import { Product, InventoryAlert } from "@/lib/types";

const alertTypeColors = {
  low_stock: "border-orange-200 bg-orange-50",
  out_of_stock: "border-red-200 bg-red-50",
  overstock: "border-blue-200 bg-blue-50",
  slow_moving: "border-yellow-200 bg-yellow-50"
};

const alertTypeIcons = {
  low_stock: AlertTriangle,
  out_of_stock: Package,
  overstock: Package,
  slow_moving: TrendingDown
};

const priorityColors = {
  high: "text-red-600",
  medium: "text-orange-600",
  low: "text-yellow-600"
};

function StockLevelIndicator({ level, total }: { level: number; total: number }) {
  const percentage = (level / total) * 100;
  let color = "bg-green-500";
  
  if (percentage < 20) color = "bg-red-500";
  else if (percentage < 40) color = "bg-orange-500";
  else if (percentage < 60) color = "bg-yellow-500";
  
  return (
    <div className="flex items-center space-x-2">
      <div className="w-16 bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
    </div>
  );
}

function SupplierBadge({ supplier }: { supplier: string }) {
  const colors = {
    'JCPenney': 'bg-blue-100 text-blue-800',
    'Target': 'bg-red-100 text-red-800',
    'Walmart': 'bg-green-100 text-green-800',
    "Macy's": 'bg-purple-100 text-purple-800',
    'Costco': 'bg-orange-100 text-orange-800'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[supplier as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {supplier}
    </span>
  );
}

export default function InventoryPage() {
  const [products] = useState<Product[]>(sampleProducts);
  const [alerts] = useState<InventoryAlert[]>(sampleInventoryAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = supplierFilter === "all" || product.supplier === supplierFilter;
    const matchesStock = stockFilter === "all" || 
      (stockFilter === "low" && product.inventory.available < 20) ||
      (stockFilter === "normal" && product.inventory.available >= 20 && product.inventory.available < 50) ||
      (stockFilter === "high" && product.inventory.available >= 50);
    
    return matchesSearch && matchesSupplier && matchesStock;
  });

  const lowStockCount = products.filter(p => p.inventory.available < 20).length;
  const totalValue = products.reduce((sum, p) => sum + (p.currentPrice * p.inventory.total), 0);
  const avgTurnover = 8.5; // Mock average turnover rate

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">재고 관리</h1>
          <p className="text-muted-foreground">실시간 재고 현황과 알림을 관리하세요</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            재고 업데이트
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            상품 추가
          </Button>
        </div>
      </div>

      {/* Inventory Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">재고 알림</h3>
          {alerts.map((alert) => {
            const IconComponent = alertTypeIcons[alert.type];
            return (
              <Alert key={alert.id} className={alertTypeColors[alert.type]}>
                <IconComponent className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>{alert.title}</span>
                  <span className={`text-sm font-medium ${priorityColors[alert.priority]}`}>
                    {alert.priority.toUpperCase()}
                  </span>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p>{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.productName} ({alert.sku})
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        나중에
                      </Button>
                      <Button size="sm">
                        {alert.type === 'low_stock' ? '재주문' : '확인'}
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="text-sm text-muted-foreground">총 상품 수</div>
          <div className="text-2xl font-bold">{products.length}</div>
        </GlassCard>
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="text-sm text-muted-foreground">재고 총 가치</div>
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
        </GlassCard>
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="text-sm text-muted-foreground">낮은 재고 알림</div>
          <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
        </GlassCard>
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="text-sm text-muted-foreground">평균 회전율</div>
          <div className="text-2xl font-bold">{avgTurnover}/월</div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="상품명, SKU 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm border-white/20"
            />
          </div>
          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger className="w-40 bg-white/50 backdrop-blur-sm border-white/20">
              <SelectValue placeholder="매입처" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 매입처</SelectItem>
              <SelectItem value="JCPenney">JCPenney</SelectItem>
              <SelectItem value="Target">Target</SelectItem>
              <SelectItem value="Walmart">Walmart</SelectItem>
              <SelectItem value="Macy's">Macy&apos;s</SelectItem>
              <SelectItem value="Costco">Costco</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-40 bg-white/50 backdrop-blur-sm border-white/20">
              <SelectValue placeholder="재고 수준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 재고</SelectItem>
              <SelectItem value="low">낮은 재고 (&lt;20)</SelectItem>
              <SelectItem value="normal">보통 재고 (20-50)</SelectItem>
              <SelectItem value="high">높은 재고 (50+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Table */}
        <div className="lg:col-span-2">
          <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">재고 현황</h3>
                <div className="text-sm text-muted-foreground">
                  {filteredProducts.length}개 상품
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead>상품정보</TableHead>
                      <TableHead>매입처</TableHead>
                      <TableHead className="text-right">현재가</TableHead>
                      <TableHead>재고 수준</TableHead>
                      <TableHead>위탁/매입</TableHead>
                      <TableHead>회전율</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow 
                        key={product.id} 
                        className="hover:bg-white/20 transition-colors border-white/10"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <SupplierBadge supplier={product.supplier} />
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${product.currentPrice}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>재고: {product.inventory.available}</span>
                              <span className={`${
                                product.inventory.available < 10 ? 'text-red-600' :
                                product.inventory.available < 20 ? 'text-orange-600' :
                                'text-green-600'
                              }`}>
                                {product.inventory.available < 10 ? '부족' :
                                 product.inventory.available < 20 ? '주의' : '충분'}
                              </span>
                            </div>
                            <StockLevelIndicator 
                              level={product.inventory.available} 
                              total={product.inventory.total} 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span>위탁:</span>
                              <span>{product.inventory.consignment}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>매입:</span>
                              <span>{product.inventory.owned}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {Math.floor(Math.random() * 10 + 5)}/월
                            </div>
                            <Progress 
                              value={Math.random() * 100} 
                              className="h-1 mt-1 w-16" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-xl">
                              <DropdownMenuItem>재고 업데이트</DropdownMenuItem>
                              <DropdownMenuItem>자동 주문 설정</DropdownMenuItem>
                              <DropdownMenuItem>매입처 변경</DropdownMenuItem>
                              <DropdownMenuItem>상품 수정</DropdownMenuItem>
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

        {/* Supplier Analysis */}
        <div className="space-y-4">
          <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-6">
            <h3 className="font-semibold mb-4">매입처별 분석</h3>
            <div className="space-y-4">
              {Object.entries(supplierStats).map(([supplier, stats]) => (
                <div key={supplier} className="border-b border-white/20 pb-3 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <SupplierBadge supplier={supplier} />
                    <span className="text-sm font-medium">{stats.totalProducts}개</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>평균 마진:</span>
                      <span className="font-medium">{stats.avgMargin}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>총 매출:</span>
                      <span className="font-medium">${stats.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-6">
            <h3 className="font-semibold mb-4">빠른 액션</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                낮은 재고 일괄 주문
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                재고 실사 시작
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                재고 리포트 생성
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}