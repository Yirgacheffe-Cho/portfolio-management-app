import React, { useState } from 'react';
import LocationList from './LocationList';

type InvestmentItem = {
  type: string;
  currency: string;
};

type InvestmentMap = {
  [location: string]: InvestmentItem[];
};
const TemplateInvestmentEditor = () => {
  const [locations, setLocations] = useState<string[]>(['우리은행']);

  const [investments, setInvestments] = useState<InvestmentMap>({
    우리은행: [{ type: '현금', currency: 'KRW' }],
  });
  const [newLocation, setNewLocation] = useState('');

  const handleAddLocation = () => {
    if (!newLocation.trim() || locations.includes(newLocation)) return;
    setLocations([...locations, newLocation]);
    setInvestments({ ...investments, [newLocation]: [] });
    setNewLocation('');
  };

  const handleUpdateItem = (
    loc: string,
    idx: number,
    type: string,
    currency: string,
  ) => {
    const updated = [...investments[loc]];
    updated[idx] = { type, currency };
    setInvestments({ ...investments, [loc]: updated });
  };

  const handleDeleteItem = (loc: string, idx: number) => {
    const updated = [...investments[loc]];
    updated.splice(idx, 1);
    setInvestments({ ...investments, [loc]: updated });
  };

  const handleAddItem = (loc: string) => {
    const updated = [...investments[loc], { type: '현금', currency: 'KRW' }];
    setInvestments({ ...investments, [loc]: updated });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">자산 위치 설정</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          placeholder="새 위치 입력"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleAddLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          위치 추가
        </button>
      </div>

      <LocationList
        locations={investments}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onAddItem={handleAddItem}
      />
    </div>
  );
};

export default TemplateInvestmentEditor;
