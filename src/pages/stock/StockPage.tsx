// pages/StockPage.tsx
import { TickerSearchInput } from '@/components/stock/TickerSearchInput';
import { useState } from 'react';
import { type TickerItem } from '@/types/stock';

function StockPage() {
  const [selected, setSelected] = useState<TickerItem | null>(null);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">📈 티커 검색</h2>
      <TickerSearchInput onSelect={setSelected} />
      {selected && (
        <div className="text-sm text-muted-foreground">
          선택된 종목: <strong>{selected.name}</strong> ({selected.symbol})
        </div>
      )}
    </div>
  );
}

export default StockPage;
