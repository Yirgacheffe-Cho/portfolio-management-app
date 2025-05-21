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
}

const LocationList: React.FC<Props> = ({
  locations,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
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
        />
      ))}
    </>
  );
};

export default LocationList;
