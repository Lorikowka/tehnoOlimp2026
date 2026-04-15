import React from 'react';
import { ConcreteClass } from '../data/concreteData';
import ConcreteCard from './ConcreteCard';

interface CatalogSectionProps {
  concreteClasses: ConcreteClass[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const CatalogSection: React.FC<CatalogSectionProps> = ({ concreteClasses, selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {concreteClasses.map(concrete => (
        <div key={concrete.id} className="relative">
          <ConcreteCard
            concrete={concrete}
            isSelected={selectedId === concrete.id}
            onClick={() => onSelect(concrete.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default CatalogSection;
