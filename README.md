# eBay Seller Fee Manager

**eBay 전용 수수료 관리 및 분석 시스템**

2025년 eBay 프로모션 정책을 반영한 한국 셀러를 위한 수수료 최적화 도구입니다.

## 🌟 주요 기능

### 💰 실시간 수수료 분석
- **2025년 eBay 프로모션 적용**: 베이직 스토어 이상 50% 최종 판매 수수료 할인 반영
- **정확한 수수료 계산**: Final Value Fee, Payment Processing Fee, Store Subscription Fee 등
- **프로모션 절약 효과**: 실시간 할인 적용 금액 추적
- **실효 수수료율**: 모든 수수료를 고려한 실제 수수료 비율

### 📊 eBay 전용 대시보드
- **수수료 구성 분석**: 각 수수료 유형별 비율 및 금액
- **월별 수수료 트렌드**: 프로모션 적용 전후 비교
- **스토어 레벨 혜택**: 현재 스토어 등급의 혜택 및 절약 금액
- **수수료 계산기**: 판매 전 예상 수수료 시뮬레이션

### 🎯 2025년 eBay 프로모션 지원
- **베이직 스토어 이상 50% 할인**: $2,500까지 최종 판매 수수료 50% 할인
- **프로모티드 오프사이트 할인**: 2025년 1월-3월 캠페인 설정 시 광고비 50% 할인
- **자동 할인 적용**: 모든 계산에 현재 활성 프로모션 자동 반영

### 📈 고급 분석 도구
- **수익성 분석**: 매입가, 판매가, 수수료를 고려한 순이익 계산
- **가격 최적화**: 목표 마진 달성을 위한 최적 판매가 제안
- **경쟁사 가격 비교**: 경쟁사 대비 가격 경쟁력 분석

## 🛠 기술 스택

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Shadcn/ui
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 설치 및 실행

### 사전 요구사항
- Node.js 20+
- npm, yarn, pnpm 또는 bun

### 설치
```bash
# 저장소 클론
git clone <repository-url>
cd ebay-seller-fee-manager

# 의존성 설치
npm install
```

### 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어서 결과를 확인하세요.

### 사용 가능한 스크립트
- `npm run dev` - 개발 서버 시작 (Turbopack 지원)
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 시작
- `npm run lint` - ESLint 실행

## 📋 프로젝트 구조

```
src/
├── app/                        # Next.js App Router 페이지
│   ├── page.tsx               # eBay 셀러 대시보드
│   ├── orders/                # 주문 관리
│   ├── pricing/               # 가격 최적화
│   ├── inventory/             # 재고 관리
│   └── offers/                # 고객 오퍼 관리
├── components/
│   ├── dashboard/             # 대시보드 컴포넌트
│   │   └── ebay-fee-dashboard.tsx  # eBay 수수료 전용 대시보드
│   ├── layout/                # 레이아웃 컴포넌트
│   └── ui/                    # 재사용 가능한 UI 컴포넌트
├── data/
│   ├── ebay-demo-data.ts      # eBay API 구조 기반 데모 데이터
│   └── mock-data.ts           # 기존 샘플 데이터
└── lib/
    ├── ebay-fee-calculator.ts  # eBay 수수료 계산 로직
    ├── types.ts               # TypeScript 타입 정의
    └── utils.ts               # 유틸리티 함수
```

## 💡 주요 구성 요소

### eBay 수수료 계산기
2025년 eBay 정책을 반영한 정확한 수수료 계산:

```typescript
// 최종 판매 수수료 (2025년 50% 할인 적용)
const finalValueFee = calculateFinalValueFee(salePrice, categoryId, storeLevel);

// 결제 처리 수수료 (2.9% + $0.30)
const paymentFee = calculatePaymentProcessingFee(salePrice);

// 총 수수료 계산
const totalFees = calculateAllFees(salePrice, options);
```

### 2025년 프로모션 정책
```typescript
const EBAY_PROMOTIONS_2025 = [
  {
    name: '베이직 스토어 이상 50% 최종 판매 수수료 할인',
    discountPercentage: 50,
    applicableFeeTypes: ['FINAL_VALUE_FEE'],
    eligibilityRequirements: ['베이직 스토어 이상 구독', '판매 금액 $2,500 이하']
  }
];
```

### eBay 스토어 레벨별 혜택
```typescript
const EBAY_STORE_LEVELS = {
  BASIC: {
    monthlyFee: 27.95,
    freeListings: 1000,
    finalValueFeeDiscount: 0.5, // 2025년 50% 할인
    additionalListingFee: 0.30
  }
  // Premium, Anchor, Enterprise...
};
```

## 📊 데이터 구조

### eBay API 호환 데이터 모델
실제 eBay Finances API와 Inventory API 구조를 기반으로 설계:

```typescript
interface EbayFee {
  amount: number;
  currency: string;
  feeJurisdiction: string;
  feeMemo: string;
  feeType: EbayFeeType;
}

interface EbayTransaction {
  transactionId: string;
  transactionType: 'SALE' | 'REFUND' | 'CREDIT';
  transactionStatus: 'FUNDS_PROCESSING' | 'FUNDS_AVAILABLE_FOR_PAYOUT';
  orderLineItems: Array<{
    fees: EbayFee[];
    totalAmount: { currency: string; value: string; };
  }>;
}
```

## 🎨 디자인 시스템

### Glassmorphism UI
- **반투명 배경**: backdrop-blur 효과로 현대적인 느낌
- **부드러운 그라데이션**: 한국 사용자를 위한 직관적인 색상 체계
- **반응형 디자인**: 모바일부터 데스크톱까지 최적화

### 한국어 최적화
- **완전한 한국어 지원**: 모든 UI 텍스트 한국어화
- **한국 날짜 형식**: date-fns/locale/ko 사용
- **원화 표시 지원**: USD와 KRW 동시 지원 준비

## 🚀 향후 계획

### 실제 eBay API 연동
- [ ] eBay Developer Program 가입 및 API 키 획득
- [ ] OAuth 2.0 인증 시스템 구현
- [ ] 실시간 거래 및 수수료 데이터 동기화
- [ ] eBay Webhook 설정으로 자동 업데이트

### 고급 기능
- [ ] 머신러닝 기반 가격 최적화
- [ ] 다국가 eBay 마켓플레이스 지원
- [ ] 세금 계산 및 보고서 기능
- [ ] 모바일 앱 개발

### 한국 시장 특화
- [ ] 한국 세법 연동
- [ ] 원화 실시간 환율 적용
- [ ] 한국 eBay 셀러 커뮤니티 기능

## 📄 라이선스

이 프로젝트는 프로토타입 목적으로 개발되었습니다.

## 🤝 기여하기

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 지원

문의사항이나 버그 리포트는 GitHub Issues를 통해 제출해주세요.

---

**⚠️ 주의사항**: 이 프로젝트는 현재 데모 데이터를 사용합니다. 실제 운영 환경에서 사용하려면 실제 eBay API 연동이 필요합니다.