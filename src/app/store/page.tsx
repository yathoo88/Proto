import { EbayStoreManager } from '@/components/dashboard/ebay-store-manager';

export default function StorePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">eBay 스토어 관리</h1>
          <p className="text-muted-foreground">스토어 레벨별 혜택을 비교하고 최적의 선택을 하세요</p>
        </div>
      </div>
      
      <EbayStoreManager />
    </div>
  );
}