import React, { useState, useEffect } from 'react';
import { useLeague, Category, Zone } from '../../contexts/LeagueContext';
import { cn } from '../../utils/cn';

interface CategoryPanelProps {
  category: Category;
  isSelected: boolean;
  onSelect: (categoryId: string, zoneId: string) => void;
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({ 
  category, 
  isSelected, 
  onSelect 
}) => {
  const { getZonesByCategory, getLeague } = useLeague();
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(isSelected);
  
  // Get zones for this category
  const zones = getZonesByCategory(category.id);
  const league = getLeague(category.leagueId);
  
  // Se eliminó el comentario y la condición innecesaria
  // Si es Liga Participando, mostrar normalmente (eliminada la condición de retorno null)
  
  // Set the first zone as active if none is selected and zones exist
  useEffect(() => {
    if (!activeZoneId && zones.length > 0) {
      setActiveZoneId(zones[0].id);
    }
  }, [zones, activeZoneId]);
  
  // Update expanded state based on isSelected prop
  useEffect(() => {
    setExpanded(isSelected);
  }, [isSelected]);
  
  const handleCategoryClick = () => {
    setExpanded(!expanded);
    if (!expanded && activeZoneId) {
      onSelect(category.id, activeZoneId);
    }
  };
  
  const handleZoneClick = (zoneId: string) => {
    setActiveZoneId(zoneId);
    onSelect(category.id, zoneId);
  };
  
  return (
    <div 
      className={cn(
        "league-panel",
        isSelected && "ring-2 ring-primary-500"
      )}
    >
      <button
        className="w-full flex items-center justify-between font-semibold text-lg p-2 rounded-md hover:bg-gray-50 transition-colors"
        onClick={handleCategoryClick}
      >
        <span>{category.name}</span>
        <span className="text-gray-400">
          {expanded ? '▲' : '▼'}
        </span>
      </button>
      
      {expanded && (
        <div className="mt-3 space-y-2">
          <h4 className="text-sm font-medium text-gray-500 uppercase">Zonas</h4>
          <div className="space-y-1">
            {zones.map((zone: Zone) => (
              <button
                key={zone.id}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                  activeZoneId === zone.id
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => handleZoneClick(zone.id)}
              >
                {zone.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPanel;