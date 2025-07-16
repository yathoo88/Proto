"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { MarginPresets } from "@/components/ui/margin-presets";
import { ProfitBreakdown } from "@/components/pricing/profit-breakdown";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap, 
  Loader2,
  Calculator,
  ChevronUp
} from "lucide-react";
import { samplePricingRecommendations, sampleProducts } from "@/data/mock-data";
import { useRealTimePricing } from "@/hooks/use-real-time-pricing";
import { PricingRecommendation } from "@/lib/types";
import { toast } from "sonner";
import { useEbayData } from "@/hooks/use-ebay-data";

export default function PricingPage() {
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>(samplePricingRecommendations);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [targetMargin, setTargetMargin] = useState(25);
  const [riskLevel, setRiskLevel] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [useEbayApi, setUseEbayApi] = useState(true);

  const { data: ebayListings, loading: listingsLoading, refetch: refetchListings } = useEbayData({
    endpoint: 'listings',
    params: {
      limit: '50',
      offset: '0'
    },
    enabled: useEbayApi
  });

  const { data: ebayAnalytics, loading: analyticsLoading } = useEbayData({
    endpoint: 'analytics',
    params: {
      metric_name: 'LISTING_VIEWS_TOTAL',
      date_range: 'LAST_30_DAYS'
    },
    enabled: useEbayApi
  });

  useEffect(() => {
    if (ebayListings?.listings && useEbayApi) {
      const transformedRecommendations = ebayListings.listings.map((listing: {
        id: string;
        name: string;
        currentPrice: number;
      }) => {
        const baseRecommendation = {
          id: listing.id,
          productName: listing.name,
          currentPrice: listing.currentPrice,
          recommendedPrice: listing.currentPrice * 1.15,
          profit: listing.currentPrice * 0.15,
          marginRate: 15,
          demand: Math.floor(Math.random() * 100),
          competitorPrice: listing.currentPrice * (0.95 + Math.random() * 0.1),
          riskScore: Math.floor(Math.random() * 10) + 1
        };
        return baseRecommendation;
      });
      setRecommendations(transformedRecommendations);
    } else if (!useEbayApi) {
      setRecommendations(samplePricingRecommendations);
    }
  }, [ebayListings, useEbayApi]);

  // 실시간 가격 계산 사용
  const realTimePricingResults = useRealTimePricing(recommendations, targetMargin, riskLevel);

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedItems(realTimePricingResults.map(result => result.updatedRecommendation.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const applySelectedPrices = () => {
    console.log('Applying prices for:', selectedItems);
    toast.success(`${selectedItems.length}개 상품의 가격이 적용되었습니다!`, {
      description: "선택한 상품의 추천 가격이 실제 판매가로 업데이트되었습니다."
    });
    setSelectedItems([]);
  };

  const applySinglePrice = (id: string, productName: string) => {
    console.log('Applying price for:', id);
    toast.success("가격이 적용되었습니다!", {
      description: `${productName}의 추천 가격이 실제 판매가로 업데이트되었습니다.`
    });
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    toast.info("AI 가격 추천을 생성하고 있습니다...", {
      description: `목표 마진율: ${targetMargin}%, 리스크 레벨: ${riskLevel === 'low' ? '보수적' : riskLevel === 'medium' ? '균형' : '공격적'}`
    });
    
    // 시뮬레이션 지연
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    toast.success("새로운 AI 가격 추천이 생성되었습니다!", {
      description: `${recommendations.length}개 상품의 가격이 업데이트되었습니다.`
    });
  };

  const expectedRevenue = selectedItems.reduce((sum, id) => {
    const rec = recommendations.find(r => r.id === id);
    return sum + (rec ? (rec.recommendedPrice - rec.currentPrice) * 10 : 0);
  }, 0);

  // 설정 변경으로 영향받을 상품 수 계산
  const getSettingImpact = () => {
    return realTimePricingResults.filter(result => 
      Math.abs(result.priceChange) > 1 // $1 이상 가격 변화
    ).length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI 가격 최적화</h1>
          <p className="text-muted-foreground">
            {useEbayApi ? 'eBay API' : 'Mock 데이터'}를 사용한 실시간 가격 분석
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
              onClick={() => refetchListings()}
              disabled={listingsLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${listingsLoading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          )}
          <Button onClick={generateRecommendations} variant="outline" size="sm" disabled={isGenerating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? '업데이트 중...' : '추천 업데이트'}
          </Button>
          <Button 
            onClick={applySelectedPrices}
            disabled={selectedItems.length === 0}
            size="sm" 
            className="bg-gradient-to-r from-green-500 to-green-600"
          >
            <Zap className="h-4 w-4 mr-2" />
            선택 항목 적용 ({selectedItems.length})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI 추천 카드들 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                모두 선택
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                선택 해제
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {listingsLoading ? '로딩 중...' : `${recommendations.length}개의 추천 항목 (실시간 업데이트)`}
            </div>
          </div>

          {realTimePricingResults.map((result) => {
            const rec = result.updatedRecommendation;
            const product = sampleProducts.find(p => p.sku === rec.sku);
            const isExpanded = expandedItems.has(rec.id);
            
            return (
              <GlassCard 
                key={rec.id} 
                className="backdrop-blur-xl bg-white/60 border-white/20 p-6 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id={rec.id}
                    checked={selectedItems.includes(rec.id)}
                    onCheckedChange={() => toggleSelection(rec.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{rec.productName}</h3>
                          <p className="text-sm text-muted-foreground">{rec.sku}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="text-sm text-muted-foreground">현재</div>
                            <span className="text-lg font-mono">${rec.currentPrice}</span>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-green-600">추천</div>
                            <span className="text-xl font-bold text-green-600">${rec.recommendedPrice}</span>
                          </div>
                        </div>
                        
                        {/* 실시간 가격 변화 표시 */}
                        {Math.abs(result.priceChange) > 0.01 && (
                          <div className="mt-1">
                            <Badge 
                              variant={result.priceChange > 0 ? "default" : "destructive"} 
                              className="text-xs"
                            >
                              {result.priceChange > 0 ? '+' : ''}${result.priceChange.toFixed(2)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">현재 마진</span>
                          <div className="font-semibold">{result.currentMargin.toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">목표 마진</span>
                          <div className="font-semibold text-blue-600">{result.targetMargin}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">재고 수준</span>
                          <div className="font-semibold">{rec.stockLevel}개</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">AI 신뢰도</span>
                          <div className="font-semibold">{rec.confidence}%</div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          경쟁가: ${Math.min(...rec.competitorPrices)} - ${Math.max(...rec.competitorPrices)}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleExpanded(rec.id)}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                간단히
                              </>
                            ) : (
                              <>
                                <Calculator className="h-4 w-4 mr-1" />
                                상세 보기
                              </>
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-green-500 to-green-600"
                            onClick={() => applySinglePrice(rec.id, rec.productName)}
                          >
                            적용하기
                          </Button>
                        </div>
                      </div>
                      
                      {/* 상세 수익성 분석 */}
                      {isExpanded && product && (
                        <div className="mt-4">
                          <ProfitBreakdown
                            productName={rec.productName}
                            sku={rec.sku}
                            currentPrice={rec.currentPrice}
                            recommendedPrice={rec.recommendedPrice}
                            costPrice={product.purchasePrice}
                            shippingCost={5.00}
                            categoryId="15709"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
        
        {/* 사이드 패널 - 설정 및 통계 */}
        <div className="space-y-4">
          {/* 가격 최적화 설정 */}
          <GlassCard className="backdrop-blur-xl bg-white/90 border-white/30 shadow-lg p-6">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 -m-6 p-6 mb-4 rounded-t-lg">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <div className="p-2 bg-blue-500 rounded-lg mr-3">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                실시간 가격 최적화 설정
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200/50">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">목표 마진율</Label>
                <div className="space-y-3">
                  <NumberInput
                    value={targetMargin}
                    onChange={setTargetMargin}
                    min={0}
                    max={100}
                    step={0.1}
                    suffix="%"
                    className="text-center font-semibold"
                    placeholder="목표 마진율을 입력하세요"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    실시간으로 가격이 조정됩니다
                  </div>
                </div>
              </div>
              
              {/* 마진율 프리셋 */}
              <MarginPresets
                selectedMargin={targetMargin}
                onMarginSelect={setTargetMargin}
              />
              
              <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200/50">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">리스크 레벨</Label>
                <Select value={riskLevel} onValueChange={setRiskLevel}>
                  <SelectTrigger className="bg-white border-gray-300 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="low">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        보수적 (낮은 리스크)
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        균형 (중간 리스크)
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        공격적 (높은 리스크)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200/50 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700 font-medium">실시간 영향 상품</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {getSettingImpact()}개
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  현재 설정으로 {getSettingImpact()}개 상품의 가격이 실시간 조정됩니다
                </p>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg font-semibold text-white disabled:opacity-70" 
                onClick={generateRecommendations}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    새 추천 생성
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
          
          {/* 오늘의 성과 */}
          <GlassCard className="backdrop-blur-xl bg-white/90 border-white/30 shadow-lg p-6">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 -m-6 p-6 mb-4 rounded-t-lg">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <div className="p-2 bg-green-500 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                오늘의 성과
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-200/50 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">적용된 추천</span>
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">15개</div>
              </div>
              <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-200/50 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">예상 추가 수익</span>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">+$2,340</div>
              </div>
              <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-200/50 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">평균 마진 개선</span>
                <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">+8.2%</div>
              </div>
              
              <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200/50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">목표 달성률</span>
                  <span className="font-bold text-blue-600">78%</span>
                </div>
                <Progress value={78} className="h-3" />
              </div>
            </div>
          </GlassCard>
          
          {/* 선택된 항목 예상 효과 */}
          {selectedItems.length > 0 && (
            <GlassCard className="backdrop-blur-xl bg-green-50/90 border-green-200/50 shadow-lg p-6">
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 -m-6 p-6 mb-4 rounded-t-lg border-b border-green-200/30">
                <h3 className="font-semibold text-green-800 flex items-center">
                  <div className="p-2 bg-green-600 rounded-lg mr-3">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  선택된 항목 예상 효과
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/80 p-3 rounded-lg border border-green-200/50 flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">선택된 상품</span>
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {selectedItems.length}개
                  </div>
                </div>
                <div className="bg-white/80 p-3 rounded-lg border border-green-200/50 flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">예상 추가 수익</span>
                  <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    +${expectedRevenue.toFixed(2)}
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg font-semibold text-white transform hover:scale-105 transition-all duration-200"
                  onClick={applySelectedPrices}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  선택된 가격 일괄 적용
                </Button>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}