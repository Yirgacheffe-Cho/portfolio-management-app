import React, { useState } from 'react';
import EditableInvestmentItem from './EditableInvestmentItem';
import { Button } from '@/components/ui/button';
import { InvestmentType, CurrencyType } from '@/types/asset';
import type { InvestmentItem } from '@/types/asset';
import { Landmark, Pencil, Check, PlusCircle } from 'lucide-react';
// ...
interface Props {
  locationName: string;
  investments: InvestmentItem[];
  onUpdate: (
    index: number,
    newType: InvestmentType,
    newCurrency: CurrencyType,
  ) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
  onRename: (newName: string) => void; // ✅ 추가
}

const LocationInvestmentCard: React.FC<Props> = ({
  locationName,
  investments,
  onUpdate,
  onDelete,
  onAdd,
  onRename,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(locationName);

  return (
    <div className="rounded-xl border bg-muted p-6 shadow mb-6">
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
              <Landmark className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-gray-800">
                {locationName}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingName(true)}
            >
              <Pencil className="w-4 h-4 text-blue-600" />
            </Button>
          </div>
        )}
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
          <PlusCircle className="w-4 h-4 mr-1" />
          자산 항목 추가
        </Button>
      </div>
    </div>
  );
};

export default LocationInvestmentCard;
