import React, { useState } from 'react';
import {
  InvestmentType,
  CurrencyType,
  INVESTMENT_TYPE_LIST,
  CURRENCY_TYPE_LIST,
} from '@/types/asset';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { EnumSelect } from '@/components/common/EnumSelect'; // ✅ 확장 셀렉트 사용

interface Props {
  type: InvestmentType;
  currency: CurrencyType;
  onSave: (newType: InvestmentType, newCurrency: CurrencyType) => void;
  onDelete: () => void;
}

const EditableInvestmentItem: React.FC<Props> = ({
  type,
  currency,
  onSave,
  onDelete,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [tempType, setTempType] = useState<InvestmentType>(type);
  const [tempCurrency, setTempCurrency] = useState<CurrencyType>(currency);

  return (
    <div className="bg-white border rounded-lg px-4 py-2 shadow-sm">
      {editMode ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 자산 유형 선택 */}
          <EnumSelect
            value={tempType}
            options={INVESTMENT_TYPE_LIST}
            onChange={setTempType}
            placeholder="자산 유형 선택"
            label="유형"
          />

          {/* 통화 선택 */}
          <EnumSelect
            value={tempCurrency}
            options={CURRENCY_TYPE_LIST}
            onChange={setTempCurrency}
            placeholder="통화 선택"
            label="통화"
          />

          {/* 저장 / 취소 버튼 */}
          <div className="flex gap-1 ml-auto pt-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onSave(tempType, tempCurrency);
                setEditMode(false);
              }}
            >
              <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditMode(false)}
            >
              <X className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          {/* 현재 표시 중인 자산 */}
          <div className="flex gap-2">
            <Badge className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1">
              {type}
            </Badge>
            <Badge className="bg-gray-100 text-gray-800 text-sm px-3 py-1">
              {currency}
            </Badge>
          </div>

          {/* 수정 / 삭제 버튼 */}
          <div className="flex gap-1 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditMode(true)}
            >
              <Pencil className="w-4 h-4 text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableInvestmentItem;
