import React, { useState } from 'react';
import EditableInvestmentItem from './EditableInvestmentItem';
import { Button } from '@/components/ui/button';
import { InvestmentType, CurrencyType } from '@/types/asset';
import type { AssetRecord } from '@/types/asset';
import { Landmark, Pencil, Check, PlusCircle, Trash2 } from 'lucide-react';
import { useConfirmDialog } from '@/hooks/common/useConfirmDialog';

interface Props {
  locationName: string;
  investments: AssetRecord[];
  onUpdate: (
    index: number,
    newType: InvestmentType,
    newCurrency: CurrencyType,
  ) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
  onRename: (newName: string) => void;
  onRemove: () => void;
}

const LocationInvestmentCard: React.FC<Props> = ({
  locationName,
  investments,
  onUpdate,
  onDelete,
  onAdd,
  onRename,
  onRemove,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(locationName);
  const confirm = useConfirmDialog();

  const handleRemove = async () => {
    const ok = await confirm({
      title: `"${locationName}" 위치를 삭제할까요?`,
      description: '해당 위치의 자산 항목도 함께 삭제됩니다.',
      confirmText: '삭제하기',
      cancelText: '취소',
    });

    if (ok) {
      onRemove();
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm p-4 mb-6 transition hover:shadow-md">
      {/* 카드 헤더 */}
      <div className="flex justify-between items-center mb-4">
        {editingName ? (
          <div className="flex gap-2 items-center w-full">
            <Landmark className="w-4 h-4 text-muted-foreground" />
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onRename(tempName);
                setEditingName(false);
              }}
            >
              <Check className="w-4 h-4 text-green-600" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">{locationName}</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingName(true)}
              >
                <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRemove}>
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 자산 항목 목록 */}
      <div className="space-y-2">
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

      {/* 자산 항목 추가 버튼 */}
      <div className="mt-4">
        <Button variant="outline" size="sm" onClick={onAdd}>
          <PlusCircle className="w-4 h-4 mr-1" />
          자산 항목 추가
        </Button>
      </div>
    </div>
  );
};

export default LocationInvestmentCard;
