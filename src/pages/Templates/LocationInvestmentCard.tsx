import React from 'react';
import EditableInvestmentItem from './EditableInvestmentItem';
import { Button } from '@/components/ui/button';
import { InvestmentType, CurrencyType } from '@/types/asset';
import type { InvestmentItem } from '@/types/asset';
import { Plus } from 'lucide-react';

interface Props {
  locationName: string;
  investments: InvestmentItem[]; // ✅ string → enum 기반 InvestmentItem 사용
  onUpdate: (
    index: number,
    newType: InvestmentType,
    newCurrency: CurrencyType,
  ) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

const LocationInvestmentCard: React.FC<Props> = ({
  locationName,
  investments,
  onUpdate,
  onDelete,
  onAdd,
}) => {
  return (
    <div className="rounded-xl bg-white border bg-muted p-6 shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{locationName}</h3>
        {/* 위치 삭제 버튼 등 추가 가능 */}
      </div>

      <div className="space-y-4">
        {investments.map((item, idx) => (
          <EditableInvestmentItem
            key={idx}
            type={item.type}
            currency={item.currency}
            onSave={(t, c) => onUpdate(idx, t, c)}
            onDelete={() => onDelete(idx)}
          />
        ))}
      </div>

      <div className="mt-5">
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" />
          자산 항목 추가
        </Button>
      </div>
    </div>
  );
};

export default LocationInvestmentCard;
