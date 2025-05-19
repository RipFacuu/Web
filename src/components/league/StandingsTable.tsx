import React from 'react';
import { useLeague, Standing, Team } from '../../contexts/LeagueContext';

interface StandingsTableProps {
  zoneId: string;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ zoneId }) => {
  const { getStandingsByZone, teams } = useLeague();
  
  // Get standings for this zone
  const standings = getStandingsByZone(zoneId);
  
  // Sort standings by points (descending) and then by goal difference
  const sortedStandings = [...standings].sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points; // Sort by points (descending)
    }
    // If points are equal, sort by goal difference
    const aDiff = a.goalsFor - a.goalsAgainst;
    const bDiff = b.goalsFor - b.goalsAgainst;
    if (aDiff !== bDiff) {
      return bDiff - aDiff;
    }
    // If goal difference is equal, sort by goals scored
    return b.goalsFor - a.goalsFor;
  });
  
  // Get team by ID
  const getTeam = (teamId: string): Team | undefined => {
    return teams.find(team => team.id === teamId);
  };
  
  if (standings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay equipos en esta zona
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50 text-gray-700 uppercase text-xs">
            <th className="py-3 px-4 text-left">Pos</th>
            <th className="py-3 px-4 text-left">Equipo</th>
            <th className="py-3 px-2 text-center">PJ</th>
            <th className="py-3 px-2 text-center">G</th>
            <th className="py-3 px-2 text-center">E</th>
            <th className="py-3 px-2 text-center">P</th>
            <th className="py-3 px-2 text-center">GF</th>
            <th className="py-3 px-2 text-center">GC</th>
            <th className="py-3 px-2 text-center">DIF</th>
            <th className="py-3 px-2 text-center">PTS</th>
          </tr>
        </thead>
        <tbody>
          {sortedStandings.map((standing, index) => {
            const team = getTeam(standing.teamId);
            const goalDifference = standing.goalsFor - standing.goalsAgainst;
            
            return (
              <tr 
                key={standing.id} 
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="font-semibold">{index + 1}</span>
                </td>
                <td className="py-3 px-4">
                  {team?.name || 'Equipo desconocido'}
                </td>
                <td className="py-3 px-2 text-center">{standing.played}</td>
                <td className="py-3 px-2 text-center">{standing.won}</td>
                <td className="py-3 px-2 text-center">{standing.drawn}</td>
                <td className="py-3 px-2 text-center">{standing.lost}</td>
                <td className="py-3 px-2 text-center">{standing.goalsFor}</td>
                <td className="py-3 px-2 text-center">{standing.goalsAgainst}</td>
                <td className="py-3 px-2 text-center font-medium">
                  <span className={
                    goalDifference > 0 
                      ? 'text-green-600' 
                      : goalDifference < 0 
                        ? 'text-red-600' 
                        : ''
                  }>
                    {goalDifference > 0 ? '+' : ''}{goalDifference}
                  </span>
                </td>
                <td className="py-3 px-2 text-center font-bold">{standing.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;