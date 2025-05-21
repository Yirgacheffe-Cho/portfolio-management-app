// 예제 컴포넌트 구조: EditableInvestmentItem.tsx
import React, { useState } from 'react';

interface InvestmentItemProps {
  type: string;
  currency: string;
  onSave: (newType: string, newCurrency: string) => void;
  onDelete: () => void;
}

const InvestmentItem: React.FC<InvestmentItemProps> = ({
  type,
  currency,
  onSave,
  onDelete,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [tempType, setTempType] = useState(type);
  const [tempCurrency, setTempCurrency] = useState(currency);

  const handleSave = () => {
    onSave(tempType, tempCurrency);
    setEditMode(false);
  };

  return (
    <div className="flex items-center gap-2 py-2">
      {editMode ? (
        <>
          <select
            value={tempType}
            onChange={(e) => setTempType(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="현금">현금</option>
            <option value="주식">주식</option>
            <option value="코인">코인</option>
            <option value="금">금</option>
          </select>
          <select
            value={tempCurrency}
            onChange={(e) => setTempCurrency(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="KRW">KRW</option>
            <option value="USD">USD</option>
            <option value="BTC">BTC</option>
          </select>
          <button onClick={handleSave} className="text-green-600">
            ✔
          </button>
          <button onClick={() => setEditMode(false)} className="text-gray-400">
            ✖
          </button>
        </>
      ) : (
        <>
          <span className="text-sm text-gray-800">
            {type} / {currency}
          </span>
          <button
            onClick={() => setEditMode(true)}
            className="text-blue-600 text-xs"
          >
            수정
          </button>
          <button onClick={onDelete} className="text-red-500 text-xs">
            삭제
          </button>
        </>
      )}
    </div>
  );
};

export default InvestmentItem;
