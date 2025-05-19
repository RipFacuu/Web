import React, { useState } from 'react';
import { useLeague, Standing, Team } from '../../contexts/LeagueContext';
import { Download } from 'lucide-react';

const StandingsPage: React.FC = () => {
  const { 
    leagues, 
    teams,
    standings,
    getCategoriesByLeague, 
    getZonesByCategory,
    getStandingsByZone
  } = useLeague();
  
  const [selectedLeague, setSelectedLeague] = useState<string>(leagues[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  
  // Get categories for selected league
  const leagueCategories = getCategoriesByLeague(selectedLeague);
  
  // Get zones for selected category
  const categoryZones = getZonesByCategory(selectedCategory);
  
  // Get standings for the selected zone
  const zoneStandings = selectedZone ? getStandingsByZone(selectedZone) : [];
  
  // Sort standings by points (descending) and then by goal difference
  const sortedStandings = [...zoneStandings].sort((a, b) => {
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
  
  // Initialize select values
  React.useEffect(() => {
    if (leagueCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(leagueCategories[0].id);
    }
  }, [leagueCategories, selectedCategory]);
  
  React.useEffect(() => {
    if (categoryZones.length > 0 && !selectedZone) {
      setSelectedZone(categoryZones[0].id);
    }
  }, [categoryZones, selectedZone]);
  
  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
    setSelectedCategory('');
    setSelectedZone('');
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedZone('');
  };
  
  // Get team name by ID
  const getTeamName = (teamId: string): string => {
    const team = teams.find(team => team.id === teamId);
    return team ? team.name : 'Equipo desconocido';
  };
  
  // Export standings to CSV
  const exportToCSV = () => {
    if (sortedStandings.length === 0) return;
    
    const headers = [
      'Posición', 'Equipo', 'PJ', 'G', 'E', 'P', 'GF', 'GC', 'DIF', 'PTS'
    ];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    sortedStandings.forEach((standing, index) => {
      const teamName = getTeamName(standing.teamId);
      const goalDifference = standing.goalsFor - standing.goalsAgainst;
      
      const row = [
        index + 1,
        `"${teamName}"`, // Quote team name to handle commas
        standing.played,
        standing.won,
        standing.drawn,
        standing.lost,
        standing.goalsFor,
        standing.goalsAgainst,
        goalDifference,
        standing.points
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    // Create a download link
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `posiciones_${selectedLeague}_${selectedCategory}_${selectedZone}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tabla de Posiciones</h1>
        
        <button
          className="btn btn-outline flex items-center space-x-2"
          onClick={exportToCSV}
          disabled={sortedStandings.length === 0}
        >
          <Download size={18} />
          <span>Exportar CSV</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="leagueFilter" className="form-label">
            Liga
          </label>
          <select
            id="leagueFilter"
            className="form-input"
            value={selectedLeague}
            onChange={handleLeagueChange}
          >
            {leagues.map(league => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="categoryFilter" className="form-label">
            Categoría
          </label>
          <select
            id="categoryFilter"
            className="form-input"
            value={selectedCategory}
            onChange={handleCategoryChange}
            disabled={leagueCategories.length === 0}
          >
            <option value="">Seleccionar categoría</option>
            {leagueCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="zoneFilter" className="form-label">
            Zona
          </label>
          <select
            id="zoneFilter"
            className="form-input"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            disabled={categoryZones.length === 0}
          >
            <option value="">Seleccionar zona</option>
            {categoryZones.map(zone => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Standings Table */}
      {selectedZone ? (
        sortedStandings.length > 0 ? (
          <div className="bg-white border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pos
                    </th>
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
                  {sortedStandings.map((standing: Standing, index) => {
                    const goalDifference = standing.goalsFor - standing.goalsAgainst;
                    
                    return (
                      <tr key={standing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getTeamName(standing.teamId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {standing.played}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {standing.won}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {standing.drawn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {standing.lost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {standing.goalsFor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {standing.goalsAgainst}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                          <span className={
                            goalDifference > 0 
                              ? 'text-green-600' 
                              : goalDifference < 0 
                                ? 'text-red-600' 
                                : 'text-gray-500'
                          }>
                            {goalDifference > 0 ? '+' : ''}{goalDifference}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-center">
                          {standing.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay posiciones</h3>
            <p className="text-gray-500">
              No hay equipos o resultados en esta zona para generar la tabla de posiciones.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una zona</h3>
          <p className="text-gray-500">
            Selecciona una liga, categoría y zona para ver la tabla de posiciones.
          </p>
        </div>
      )}
    </div>
  );
};

export default StandingsPage;