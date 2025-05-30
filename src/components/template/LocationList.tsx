import React from 'react';
import LocationInvestmentCard from './LocationInvestmentCard';
import type {
  InvestmentMap,
  InvestmentType,
  CurrencyType,
} from '@/types/asset';

interface Props {
  locations: InvestmentMap;
  onUpdateItem: (
    loc: string,
    index: number,
    type: InvestmentType,
    currency: CurrencyType,
  ) => void;
  onDeleteItem: (loc: string, index: number) => void;
  onAddItem: (loc: string) => void;
  onRenameLocation: (oldName: string, newName: string) => void; // ✅ 추가
  onRemoveLocation: (locationName: string) => void; // ✅ 삭제 기능 연결
}

const LocationList: React.FC<Props> = ({
  locations,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onRenameLocation,
  onRemoveLocation,
}) => {
  return (
    <>
      {Object.entries(locations).map(([location, items]) => (
        <LocationInvestmentCard
          key={location}
          locationName={location}
          investments={items}
          onUpdate={(i, t, c) => onUpdateItem(location, i, t, c)}
          onDelete={(i) => onDeleteItem(location, i)}
          onAdd={() => onAddItem(location)}
          onRename={(newName) => onRenameLocation(location, newName)}
          onRemove={() => onRemoveLocation(location)}
        />
      ))}
    </>
  );
};

export default LocationList;
