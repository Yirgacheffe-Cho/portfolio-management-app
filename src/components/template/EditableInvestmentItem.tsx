/**
 * ✅ EditableInvestmentItem
 *
 * 투자 항목 한 개의 정보를 표시/수정할 수 있는 카드형 UI
 * - shadcn/ui 스타일 기반
 * - editMode 여부에 따라 표시 형태 변경
 */

import { useState } from 'react';
import {
  InvestmentType,
  CurrencyType,
  INVESTMENT_TYPE_LIST,
  CURRENCY_TYPE_LIST,
} from '@/types/asset';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnumSelect } from '@/components/common/EnumSelect';
import { Check, Pencil, Trash2, X } from 'lucide-react';

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
    <div className="bg-white border rounded-lg px-4 py-3 shadow-sm">
      {editMode ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 자산 유형 선택 */}
          <EnumSelect
            className="min-w-[140px]"
            value={tempType}
            options={INVESTMENT_TYPE_LIST}
            onChange={setTempType}
            placeholder="자산 유형 선택"
          />

          {/* 통화 선택 */}
          <EnumSelect
            className="min-w-[140px]"
            value={tempCurrency}
            options={CURRENCY_TYPE_LIST}
            onChange={setTempCurrency}
            placeholder="통화 선택"
          />

          {/* 저장/취소 버튼 */}
          <div className="flex gap-1 ml-auto pt-4">
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
          <div className="flex gap-2">
            <Badge className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1">
              {type}
            </Badge>
            <Badge className="bg-gray-100 text-gray-800 text-sm px-3 py-1">
              {currency}
            </Badge>
          </div>

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
