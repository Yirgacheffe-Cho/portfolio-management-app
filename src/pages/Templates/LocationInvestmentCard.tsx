import React from 'react';
import InvestmentItem from './EditableInvestmentItem';

interface InvestmentItemData {
  type: string;
  currency: string;
}

interface Props {
  locationName: string;
  investments: InvestmentItemData[];
  onUpdate: (index: number, newType: string, newCurrency: string) => void;
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
    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {locationName}
      </h3>

      <div className="space-y-3">
        {investments.map((item, idx) => (
          <InvestmentItem
            key={idx}
            type={item.type}
            currency={item.currency}
            onSave={(t, c) => onUpdate(idx, t, c)}
            onDelete={() => onDelete(idx)}
          />
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={onAdd}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + 자산 항목 추가
        </button>
      </div>
    </div>
  );
};

export default LocationInvestmentCard;
