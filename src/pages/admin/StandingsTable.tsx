import React, { useState } from 'react';
import { useLeague, Standing } from '../../contexts/LeagueContext';
import { Edit } from 'lucide-react';
import { cn } from '../../utils/cn';

interface EditableCellProps {
  value: number;
  standing: Standing;
  field: keyof Standing;
  onUpdate: (id: string, field: keyof Standing, value: number) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, standing, field, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  React.useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onUpdate(standing.id, field, tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(value);
    }
  };

  return (
    <td 
      className={cn(
        "px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center cursor-pointer",
        isEditing && "bg-violet-50/30"
      )}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {isEditing ? (
        <input
          type="number"
          min="0"
          value={tempValue}
          onChange={(e) => setTempValue(Math.max(0, Number(e.target.value)))}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-center focus:outline-none focus:ring-1 focus:ring-violet-200 py-0.5"
          autoFocus
          style={{ 
            fontSize: 'inherit',
            fontFamily: 'inherit'
          }}
        />
      ) : (
        <span>{value}</span>
      )}
    </td>
  );
};

const StandingsTable: React.FC = () => {
  const { standings, updateStanding } = useLeague();

  const handleUpdate = (id: string, field: keyof Standing, value: number) => {
    updateStanding(id, { [field]: value });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Equipo
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              PJ
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              G
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              E
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              P
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              GF
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              GC
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              DIF
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              PTS
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {standings.map((standing) => (
            <tr key={standing.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {standing.team.name}
                </div>
              </td>
              <EditableCell value={standing.played} standing={standing} field="played" onUpdate={handleUpdate} />
              <EditableCell value={standing.won} standing={standing} field="won" onUpdate={handleUpdate} />
              <EditableCell value={standing.drawn} standing={standing} field="drawn" onUpdate={handleUpdate} />
              <EditableCell value={standing.lost} standing={standing} field="lost" onUpdate={handleUpdate} />
              <EditableCell value={standing.goalsFor} standing={standing} field="goalsFor" onUpdate={handleUpdate} />
              <EditableCell value={standing.goalsAgainst} standing={standing} field="goalsAgainst" onUpdate={handleUpdate} />
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {standing.goalsFor - standing.goalsAgainst}
              </td>
              <EditableCell value={standing.points} standing={standing} field="points" onUpdate={handleUpdate} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;