'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  EBAY_STORE_LEVELS, 
  CURRENT_USER_STORE,
  EbayStoreLevel,
  EbayStoreInfo 
} from '@/data/ebay-demo-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Crown, 
  TrendingUp, 
  Package, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Calculator,
  Calendar
} from 'lucide-react';

export function EbayStoreManager() {
  const [selectedStoreLevel, setSelectedStoreLevel] = useState<EbayStoreLevel>(CURRENT_USER_STORE.storeLevel);
  const currentStore = EBAY_STORE_LEVELS[CURRENT_USER_STORE.storeLevel];
  const selectedStore = EBAY_STORE_LEVELS[selectedStoreLevel];

  // 스토어 레벨별 월 예상 절약 금액 계산
  const calculateMonthlySavings = (storeLevel: EbayStoreLevel, monthlySales: number = 50000) => {
    const store = EBAY_STORE_LEVELS[storeLevel];
    const noStoreLevel = EBAY_STORE_LEVELS.NONE;
    
    // 최종 판매 수수료 차이
    const finalValueFeeSavings = (monthlySales * 0.1235 * store.finalValueFeeDiscount);
    
    // 리스팅 수수료 절약 (1000개 리스팅 기준)
    const listingsSaved = Math.max(store.freeListings - noStoreLevel.freeListings, 0);
    const listingFeeSavings = listingsSaved * noStoreLevel.additionalListingFee;
    
    const totalSavings = finalValueFeeSavings + listingFeeSavings - store.monthlyFee;
    
    return {
      finalValueFeeSavings,
      listingFeeSavings,
      monthlyFee: store.monthlyFee,
      totalSavings
    };
  };

  const storeComparison = Object.entries(EBAY_STORE_LEVELS).map(([level, info]) => ({
    level: level as EbayStoreLevel,
    info,
    savings: calculateMonthlySavings(level as EbayStoreLevel)
  }));

  return (
    <div className="space-y-6">
      {/* 현재 스토어 상태 */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Store className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">현재 eBay 스토어</h2>
              <p className="text-gray-600">스토어 혜택 및 사용량 현황</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {currentStore.storeName}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 월 구독료 */}
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">${currentStore.monthlyFee}</div>
            <div className="text-sm text-gray-600">월 구독료</div>
          </div>
          
          {/* 무료 리스팅 */}
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{currentStore.freeListings.toLocaleString()}</div>
            <div className="text-sm text-gray-600">무료 리스팅</div>
            <Progress value={75} className="mt-2 h-2" />
            <div className="text-xs text-gray-500 mt-1">750개 사용 중</div>
          </div>
          
          {/* 수수료 할인 */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{(currentStore.finalValueFeeDiscount * 100)}%</div>
            <div className="text-sm text-gray-600">최종 판매 수수료 할인</div>
            <div className="text-xs text-green-600 mt-1">2025년 프로모션 적용</div>
          </div>
        </div>

        {/* 스토어 혜택 목록 */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">현재 혜택</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentStore.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* 스토어 레벨 비교 */}
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comparison">스토어 레벨 비교</TabsTrigger>
          <TabsTrigger value="calculator">절약 계산기</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {storeComparison.filter(({ level }) => level !== 'NONE').map(({ level, info, savings }) => (
              <GlassCard 
                key={level} 
                className={`p-6 transition-all duration-200 hover:scale-105 cursor-pointer ${
                  level === currentStore.storeLevel ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedStoreLevel(level)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {level === 'ENTERPRISE' && <Crown className="h-5 w-5 text-yellow-500" />}
                    <h3 className="font-bold">{info.storeName}</h3>
                  </div>
                  {level === currentStore.storeLevel && (
                    <Badge variant="default">현재</Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">월 구독료</span>
                    <span className="font-semibold">${info.monthlyFee}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">무료 리스팅</span>
                    <span className="font-semibold text-green-600">{info.freeListings.toLocaleString()}개</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">수수료 할인</span>
                    <span className="font-semibold text-blue-600">{(info.finalValueFeeDiscount * 100)}%</span>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">월 예상 절약</span>
                      <span className={`font-bold ${savings.totalSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(savings.totalSavings).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {level !== currentStore.storeLevel && (
                  <Button 
                    className="w-full mt-4" 
                    variant={savings.totalSavings > 0 ? 'default' : 'outline'}
                  >
                    {savings.totalSavings > 0 ? '업그레이드' : '다운그레이드'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </GlassCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">스토어 레벨별 절약 계산기</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 입력 섹션 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">월 예상 매출 ($)</label>
                  <input 
                    type="number" 
                    defaultValue="50000"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="50000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">월 예상 리스팅 수</label>
                  <input 
                    type="number" 
                    defaultValue="1000"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">비교할 스토어 레벨</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-lg"
                    value={selectedStoreLevel}
                    onChange={(e) => setSelectedStoreLevel(e.target.value as EbayStoreLevel)}
                  >
                    {Object.entries(EBAY_STORE_LEVELS).filter(([level]) => level !== 'NONE').map(([level, info]) => (
                      <option key={level} value={level}>{info.storeName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 결과 섹션 */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">{selectedStore.storeName} 절약 분석</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>최종 판매 수수료 절약:</span>
                      <span className="text-green-600 font-medium">
                        +${calculateMonthlySavings(selectedStoreLevel).finalValueFeeSavings.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>리스팅 수수료 절약:</span>
                      <span className="text-green-600 font-medium">
                        +${calculateMonthlySavings(selectedStoreLevel).listingFeeSavings.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>월 구독료:</span>
                      <span className="text-red-600 font-medium">
                        -${selectedStore.monthlyFee}
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-bold">
                        <span>순 절약 효과:</span>
                        <span className={calculateMonthlySavings(selectedStoreLevel).totalSavings > 0 ? 'text-green-600' : 'text-red-600'}>
                          ${Math.abs(calculateMonthlySavings(selectedStoreLevel).totalSavings).toLocaleString()}
                          {calculateMonthlySavings(selectedStoreLevel).totalSavings > 0 ? ' 절약' : ' 추가 비용'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 연간 전망 */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">연간 전망</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${(calculateMonthlySavings(selectedStoreLevel).totalSavings * 12).toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600">
                    {calculateMonthlySavings(selectedStoreLevel).totalSavings > 0 ? '연간 절약 예상' : '연간 추가 비용'}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* 2025년 프로모션 혜택 알림 */}
      <GlassCard className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="font-bold text-green-800">2025년 특별 혜택</h3>
            <p className="text-sm text-green-600">베이직 스토어 이상 가입 시 최종 판매 수수료 50% 할인!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-lg font-bold text-green-600">50%</div>
            <div className="text-xs text-gray-600">최종 판매 수수료 할인</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-lg font-bold text-blue-600">$2,500</div>
            <div className="text-xs text-gray-600">할인 적용 한도</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-lg font-bold text-purple-600">2025년</div>
            <div className="text-xs text-gray-600">프로모션 기간</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}