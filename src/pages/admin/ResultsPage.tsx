import React, { useState } from 'react';
import { useLeague, Match, Fixture, Team } from '../../contexts/LeagueContext';
import { Edit, Save, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const ResultsPage: React.FC = () => {
  const { 
    leagues, 
    fixtures, 
    updateMatchResult, 
    getCategoriesByLeague, 
    getZonesByCategory 
  } = useLeague();
  
  const [selectedLeague, setSelectedLeague] = useState<string>(leagues[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  
  // Get categories for selected league
  const leagueCategories = getCategoriesByLeague(selectedLeague);
  
  // Get zones for selected category
  const categoryZones = getZonesByCategory(selectedCategory);
  
  // Filter fixtures by selections
  const filteredFixtures = fixtures.filter(fixture => {
    let match = true;
    if (selectedLeague) match = match && fixture.leagueId === selectedLeague;
    if (selectedCategory) match = match && fixture.categoryId === selectedCategory;
    if (selectedZone) match = match && fixture.zoneId === selectedZone;
    return match;
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
  
  const handleEditClick = (match: Match) => {
    setEditingMatch(match.id);
    setHomeScore(match.homeScore?.toString() || '');
    setAwayScore(match.awayScore?.toString() || '');
  };
  
  const handleCancelClick = () => {
    setEditingMatch(null);
    setHomeScore('');
    setAwayScore('');
  };
  
  const handleSaveClick = (matchId: string) => {
    const home = parseInt(homeScore);
    const away = parseInt(awayScore);
    
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      alert('Por favor ingresa resultados válidos (números enteros positivos)');
      return;
    }
    
    updateMatchResult(matchId, home, away);
    setEditingMatch(null);
    setHomeScore('');
    setAwayScore('');
  };
  
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
  
  // Get team by ID from fixture and matches
  const getTeamName = (teamId: string, fixture: Fixture): string => {
    // Get all teams that could be in this fixture
    const allTeams = fixture.matches.map(m => [m.homeTeamId, m.awayTeamId]).flat();
    // Find team in context
    const team = fixture.matches.find(m => 
      m.homeTeamId === teamId || m.awayTeamId === teamId
    );
    return team ? (teamId === team.homeTeamId ? 'Local' : 'Visitante') : 'Desconocido';
  };
  
  const getMatchDetails = (match: Match, fixture: Fixture): { homeTeam: string, awayTeam: string } => {
    // This function would ideally get the team details from the team context
    // but for simplicity we're just extracting from the fixtures
    const homeTeamId = match.homeTeamId;
    const awayTeamId = match.awayTeamId;
    
    // Find teams in all fixtures
    let homeTeam = 'Equipo local';
    let awayTeam = 'Equipo visitante';
    
    fixtures.forEach(f => {
      f.matches.forEach(m => {
        if (m.homeTeamId === homeTeamId) homeTeam = 'Equipo local';
        if (m.awayTeamId === awayTeamId) awayTeam = 'Equipo visitante';
      });
    });
    
    return { homeTeam, awayTeam };
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resultados</h1>
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
      
      {/* Fixtures List */}
      {selectedZone ? (
        filteredFixtures.length > 0 ? (
          <div className="space-y-6">
            {filteredFixtures.map((fixture: Fixture) => (
              <div key={fixture.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-semibold text-lg">{fixture.date}</h3>
                  <p className="text-gray-500 text-sm">{fixture.matchDate}</p>
                </div>
                
                <div className="divide-y">
                  {fixture.matches.map((match: Match) => {
                    const { homeTeam, awayTeam } = getMatchDetails(match, fixture);
                    
                    return (
                      <div 
                        key={match.id} 
                        className={cn(
                          "p-4",
                          editingMatch === match.id && "bg-blue-50"
                        )}
                      >
                        {editingMatch === match.id ? (
                          <div className="flex items-center">
                            <div className="flex-1">
                              <p className="font-medium mb-1">{homeTeam}</p>
                              <input
                                type="number"
                                min="0"
                                className="form-input w-20"
                                value={homeScore}
                                onChange={(e) => setHomeScore(e.target.value)}
                              />
                            </div>
                            
                            <div className="mx-4">
                              <span className="text-xl font-bold">-</span>
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-medium mb-1">{awayTeam}</p>
                              <input
                                type="number"
                                min="0"
                                className="form-input w-20"
                                value={awayScore}
                                onChange={(e) => setAwayScore(e.target.value)}
                              />
                            </div>
                            
                            <div className="ml-4 flex space-x-2">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSaveClick(match.id)}
                              >
                                <Save size={16} />
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={handleCancelClick}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="flex-1">
                              <p className="font-medium">{homeTeam}</p>
                            </div>
                            
                            <div className="flex items-center mx-4">
                              {match.played ? (
                                <div className="flex items-center">
                                  <span className="font-bold px-2 py-1 bg-gray-100 rounded-md min-w-[32px] text-center">
                                    {match.homeScore}
                                  </span>
                                  <span className="mx-1">-</span>
                                  <span className="font-bold px-2 py-1 bg-gray-100 rounded-md min-w-[32px] text-center">
                                    {match.awayScore}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm font-medium text-gray-500">Sin resultado</span>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-medium">{awayTeam}</p>
                            </div>
                            
                            <div className="ml-4">
                              <button
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                onClick={() => handleEditClick(match)}
                                disabled={!!editingMatch}
                              >
                                <Edit size={18} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay fixtures</h3>
            <p className="text-gray-500">
              No hay fixtures en esta zona. Primero debes crear fixtures en la sección correspondiente.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una zona</h3>
          <p className="text-gray-500">
            Selecciona una liga, categoría y zona para ver y gestionar los resultados.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;