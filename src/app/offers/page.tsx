"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  DollarSign,
  TrendingUp,
  Clock,
  Settings,
  Zap
} from "lucide-react";
import { sampleCustomerOffers } from "@/data/mock-data";
import { CustomerOffer } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  counter_offered: "bg-blue-100 text-blue-800 border-blue-200"
};

const statusLabels = {
  pending: "대기중",
  accepted: "수락됨",
  rejected: "거절됨",
  counter_offered: "역제안"
};


const actionLabels = {
  accept: "수락 권장",
  reject: "거절 권장",
  counter: "역제안 권장"
};

function calculateMargin(offerPrice: number, costPrice: number): number {
  return ((offerPrice - costPrice) / offerPrice) * 100;
}

function OfferResponseSheet({ offer }: { offer: CustomerOffer }) {
  const [response, setResponse] = useState<'accept' | 'reject' | 'counter'>('accept');
  const [counterPrice, setCounterPrice] = useState(0);
  const [message, setMessage] = useState('');

  // Mock cost price calculation
  const costPrice = 15.00; // This would come from your product data
  const currentMargin = calculateMargin(offer.offerPrice, costPrice);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">응답하기</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-white/95 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle>고객 오퍼 응답</SheetTitle>
          <SheetDescription>
            {offer.productName}에 대한 고객 오퍼를 검토하세요.
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>원가</Label>
              <div className="text-lg font-semibold">${costPrice}</div>
            </div>
            <div>
              <Label>판매가</Label>
              <div className="text-lg font-semibold">${offer.originalPrice}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>오퍼가</Label>
              <div className="text-lg font-semibold text-blue-600">
                ${offer.offerPrice}
              </div>
            </div>
            <div>
              <Label>예상 마진</Label>
              <div className={`text-lg font-semibold ${
                currentMargin > 20 ? 'text-green-600' :
                currentMargin > 10 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {currentMargin.toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div>
            <Label>고객 메시지</Label>
            <div className="bg-muted p-3 rounded-md text-sm mt-1">
              {offer.customerMessage || '메시지 없음'}
            </div>
          </div>
          
          <div>
            <Label>AI 추천</Label>
            <div className="bg-blue-50 p-3 rounded-md mt-1">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                  offer.recommendedAction === 'accept' ? 'bg-green-100 text-green-800 border-green-200' :
                  offer.recommendedAction === 'reject' ? 'bg-red-100 text-red-800 border-red-200' :
                  'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {actionLabels[offer.recommendedAction]}
                </span>
                {offer.recommendedCounterPrice && (
                  <span className="text-sm">
                    추천 역제안: ${offer.recommendedCounterPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <Label>응답 선택</Label>
            <RadioGroup value={response} onValueChange={(value) => setResponse(value as 'accept' | 'reject' | 'counter')} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accept" id="accept" />
                <Label htmlFor="accept">오퍼 수락</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reject" id="reject" />
                <Label htmlFor="reject">오퍼 거절</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="counter" id="counter" />
                <Label htmlFor="counter">역제안</Label>
              </div>
            </RadioGroup>
          </div>
          
          {response === 'counter' && (
            <div>
              <Label htmlFor="counter-price">역제안 가격</Label>
              <Input
                id="counter-price"
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(Number(e.target.value))}
                placeholder="역제안 가격 입력"
                className="mt-1"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="response-message">응답 메시지</Label>
            <Textarea
              id="response-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="고객에게 보낼 메시지를 입력하세요..."
              rows={3}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline">취소</Button>
          <Button onClick={() => console.log('Responding to offer', offer.id, response)}>
            응답 보내기
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function OffersPage() {
  const [offers] = useState<CustomerOffer[]>(sampleCustomerOffers);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOffers = offers.filter(offer => {
    return statusFilter === "all" || offer.status === statusFilter;
  });

  const pendingCount = offers.filter(o => o.status === 'pending').length;
  const acceptedCount = offers.filter(o => o.status === 'accepted').length;
  const avgOfferDiscount = offers.reduce((sum, o) => sum + ((o.originalPrice - o.offerPrice) / o.originalPrice) * 100, 0) / offers.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">오퍼 및 할인 관리</h1>
          <p className="text-muted-foreground">고객 오퍼와 자동 협상을 관리하세요</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            자동 규칙 설정
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600">
            <Zap className="h-4 w-4 mr-2" />
            일괄 응답
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div>
              <div className="text-sm text-muted-foreground">대기중인 오퍼</div>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="flex items-center space-x-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm text-muted-foreground">수락된 오퍼</div>
              <div className="text-2xl font-bold">{acceptedCount}</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-sm text-muted-foreground">평균 할인율</div>
              <div className="text-2xl font-bold">{avgOfferDiscount.toFixed(1)}%</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-sm text-muted-foreground">응답율</div>
              <div className="text-2xl font-bold">94%</div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Offers List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-4">
            <div className="flex items-center space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white/50 backdrop-blur-sm border-white/20">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="accepted">수락됨</SelectItem>
                  <SelectItem value="rejected">거절됨</SelectItem>
                  <SelectItem value="counter_offered">역제안</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                {filteredOffers.length}개 오퍼
              </div>
            </div>
          </GlassCard>

          {/* Offers Table */}
          <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">고객 오퍼 목록</h3>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead>상품</TableHead>
                      <TableHead>가격 정보</TableHead>
                      <TableHead>예상 마진</TableHead>
                      <TableHead>AI 추천</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>접수일</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOffers.map((offer) => {
                      const costPrice = 15.00; // Mock cost price
                      const margin = calculateMargin(offer.offerPrice, costPrice);
                      
                      return (
                        <TableRow 
                          key={offer.id} 
                          className="hover:bg-white/20 transition-colors border-white/10"
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{offer.productName}</p>
                              <p className="text-xs text-muted-foreground">{offer.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>판매가:</span>
                                <span>${offer.originalPrice}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>오퍼가:</span>
                                <span className="font-semibold text-blue-600">${offer.offerPrice}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>할인:</span>
                                <span className="text-red-600">
                                  -{(((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium ${
                                margin > 20 ? 'text-green-600' :
                                margin > 10 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {margin.toFixed(1)}%
                              </span>
                              <div className={`w-2 h-2 rounded-full ${
                                margin > 20 ? 'bg-green-500' :
                                margin > 10 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                offer.recommendedAction === 'accept' ? 'bg-green-100 text-green-800 border-green-200' :
                                offer.recommendedAction === 'reject' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-blue-100 text-blue-800 border-blue-200'
                              }`}>
                                {actionLabels[offer.recommendedAction]}
                              </span>
                              {offer.recommendedCounterPrice && (
                                <div className="text-xs text-muted-foreground">
                                  역제안: ${offer.recommendedCounterPrice}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusColors[offer.status]}`}>
                              {statusLabels[offer.status]}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDistanceToNow(new Date(offer.createdAt), { 
                              addSuffix: true,
                              locale: ko 
                            })}
                          </TableCell>
                          <TableCell>
                            {offer.status === 'pending' ? (
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline" className="text-green-600">
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                                <OfferResponseSheet offer={offer} />
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">완료됨</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Auto Response Settings */}
          <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              자동 응답 설정
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">최소 마진율</Label>
                <div className="mt-1">
                  <Input
                    type="number"
                    placeholder="15"
                    className="text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">최대 할인율</Label>
                <div className="mt-1">
                  <Input
                    type="number"
                    placeholder="20"
                    className="text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">자동 수락 임계값</Label>
                <div className="mt-1">
                  <Input
                    type="number"
                    placeholder="95"
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    판매가의 95% 이상 오퍼는 자동 수락
                  </p>
                </div>
              </div>
              <Button className="w-full">설정 저장</Button>
            </div>
          </GlassCard>

          {/* Today's Performance */}
          <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-6">
            <h3 className="font-semibold mb-4">오늘의 협상 성과</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">처리된 오퍼</span>
                <span className="font-semibold">12개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">수락율</span>
                <span className="font-semibold text-green-600">75%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">평균 응답 시간</span>
                <span className="font-semibold">23분</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">추가 매출</span>
                <span className="font-semibold text-blue-600">$1,240</span>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>목표 대비</span>
                  <span>82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className="backdrop-blur-xl bg-white/60 border-white/20 p-6">
            <h3 className="font-semibold mb-4">빠른 액션</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                일괄 메시지 보내기
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ThumbsUp className="h-4 w-4 mr-2" />
                AI 추천 모두 수락
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                자동 응답 활성화
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}