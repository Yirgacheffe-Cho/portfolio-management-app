import React, { useState } from 'react';

interface Props {
  type: string;
  currency: string;
  onSave: (newType: string, newCurrency: string) => void;
  onDelete: () => void;
}

const typeOptions = ['현금', '주식', '코인', '금'];
const currencyOptions = ['KRW', 'USD', 'BTC'];

const InvestmentItem: React.FC<Props> = ({
  type,
  currency,
  onSave,
  onDelete,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [tempType, setTempType] = useState(type);
  const [tempCurrency, setTempCurrency] = useState(currency);

  return (
    <div className="flex items-center gap-3">
      {editMode ? (
        <>
          <select
            value={tempType}
            onChange={(e) => setTempType(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={tempCurrency}
            onChange={(e) => setTempCurrency(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            {currencyOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            className="text-green-600 text-sm"
            onClick={() => {
              onSave(tempType, tempCurrency);
              setEditMode(false);
            }}
            title="확인"
          >
            ✔
          </button>
          <button
            className="text-gray-500 text-sm"
            onClick={() => setEditMode(false)}
            title="취소"
          >
            ✖
          </button>
        </>
      ) : (
        <>
          <span className="text-sm text-gray-800">
            {type} / {currency}
          </span>
          <button
            className="text-blue-600 text-sm"
            onClick={() => setEditMode(true)}
            title="수정"
          >
            ✏
          </button>
          <button
            className="text-red-500 text-sm"
            onClick={onDelete}
            title="삭제"
          >
            🗑
          </button>
        </>
      )}
    </div>
  );
};

export default InvestmentItem;
