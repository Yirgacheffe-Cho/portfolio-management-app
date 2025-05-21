import React from 'react';
import LocationInvestmentCard from './LocationInvestmentCard';

interface InvestmentItem {
  type: string;
  currency: string;
}

type InvestmentMap = {
  [location: string]: InvestmentItem[];
};

interface Props {
  locations: InvestmentMap;
  onUpdateItem: (
    loc: string,
    index: number,
    type: string,
    currency: string,
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
