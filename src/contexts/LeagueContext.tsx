import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockLeagueData } from '../data/mockData';

// Types
export interface Team {
  id: string;
  name: string;
  logo?: string;
  leagueId: string;
  categoryId: string;
  zoneId: string;
}

export interface Category {
  id: string;
  name: string;
  leagueId: string;
  isEditable: boolean;
}

export interface Zone {
  id: string;
  name: string;
  leagueId: string;
  categoryId: string;
}

export interface Match {
  id: string;
  fixtureId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  played: boolean;
}

export interface Fixture {
  id: string;
  date: string;
  matchDate: string;
  leagueId: string;
  categoryId: string;
  zoneId: string;
  matches: Match[];
}

export interface Standing {
  id: string;
  teamId: string;
  leagueId: string;
  categoryId: string;
  zoneId: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface League {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

interface LeagueContextType {
  leagues: League[];
  categories: Category[];
  zones: Zone[];
  teams: Team[];
  fixtures: Fixture[];
  standings: Standing[];
  
  // League operations
  getLeague: (id: string) => League | undefined;
  
  // Category operations
  getCategoriesByLeague: (leagueId: string) => Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Zone operations
  getZonesByCategory: (categoryId: string) => Zone[];
  addZone: (zone: Omit<Zone, 'id'>) => void;
  updateZone: (id: string, data: Partial<Zone>) => void;
  deleteZone: (id: string) => void;
  
  // Team operations
  getTeamsByZone: (zoneId: string) => Team[];
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, data: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  
  // Fixture operations
  getFixturesByZone: (zoneId: string) => Fixture[];
  addFixture: (fixture: Omit<Fixture, 'id'>) => void;
  updateFixture: (id: string, data: Partial<Fixture>) => void;
  deleteFixture: (id: string) => void;
  
  // Match operations
  updateMatchResult: (matchId: string, homeScore: number, awayScore: number) => void;
  
  // Standings operations
  getStandingsByZone: (zoneId: string) => Standing[];
  updateStanding: (id: string, data: Partial<Standing>) => void;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export function useLeague() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
}

interface LeagueProviderProps {
  children: React.ReactNode;
}

export const LeagueProvider: React.FC<LeagueProviderProps> = ({ children }) => {
  // Initialize state with mock data
  const [leagues, setLeagues] = useState<League[]>(mockLeagueData.leagues);
  const [categories, setCategories] = useState<Category[]>(mockLeagueData.categories);
  const [zones, setZones] = useState<Zone[]>(mockLeagueData.zones);
  const [teams, setTeams] = useState<Team[]>(mockLeagueData.teams);
  const [fixtures, setFixtures] = useState<Fixture[]>(mockLeagueData.fixtures);
  const [standings, setStandings] = useState<Standing[]>(mockLeagueData.standings);

  // League operations
  const getLeague = (id: string) => {
    return leagues.find(league => league.id === id);
  };

  // Category operations
  const getCategoriesByLeague = (leagueId: string) => {
    if (!leagueId) return [];
    return categories.filter(category => category.leagueId === leagueId);
  };

  const getZonesByCategory = (categoryId: string) => {
    if (!categoryId) return [];
    return zones.filter(zone => zone.categoryId === categoryId);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: `cat_${Date.now()}`
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, ...data } : cat
    ));
  };

  const deleteCategory = (id: string) => {
    // First, delete all related zones
    const relatedZones = zones.filter(zone => zone.categoryId === id);
    relatedZones.forEach(zone => deleteZone(zone.id));
    
    // Then delete the category
    setCategories(categories.filter(cat => cat.id !== id));
  };

  // Zone operations
  // Eliminar esta segunda declaración de getZonesByCategory que está duplicada
  
  const addZone = (zone: Omit<Zone, 'id'>) => {
    const newZone = {
      ...zone,
      id: `zone_${Date.now()}`
    };
    setZones([...zones, newZone]);
  };

  const updateZone = (id: string, data: Partial<Zone>) => {
    setZones(zones.map(zone => 
      zone.id === id ? { ...zone, ...data } : zone
    ));
  };

  const deleteZone = (id: string) => {
    // First, delete all related teams, fixtures, and standings
    setTeams(teams.filter(team => team.zoneId !== id));
    setFixtures(fixtures.filter(fixture => fixture.zoneId !== id));
    setStandings(standings.filter(standing => standing.zoneId !== id));
    
    // Then delete the zone
    setZones(zones.filter(zone => zone.id !== id));
  };

  // Team operations
  const getTeamsByZone = (zoneId: string) => {
    return teams.filter(team => team.zoneId === zoneId);
  };

  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam = {
      ...team,
      id: `team_${Date.now()}`
    };
    setTeams([...teams, newTeam]);
    
    // Add a new standing entry for this team
    const newStanding: Standing = {
      id: `standing_${Date.now()}`,
      teamId: newTeam.id,
      leagueId: newTeam.leagueId,
      categoryId: newTeam.categoryId,
      zoneId: newTeam.zoneId,
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0
    };
    setStandings([...standings, newStanding]);
  };

  const updateTeam = (id: string, data: Partial<Team>) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, ...data } : team
    ));
  };

  const deleteTeam = (id: string) => {
    // Delete team
    setTeams(teams.filter(team => team.id !== id));
    
    // Delete standings for this team
    setStandings(standings.filter(standing => standing.teamId !== id));
    
    // Update fixtures to remove matches with this team
    setFixtures(fixtures.map(fixture => {
      const updatedMatches = fixture.matches.filter(
        match => match.homeTeamId !== id && match.awayTeamId !== id
      );
      return {
        ...fixture,
        matches: updatedMatches
      };
    }));
  };

  // Fixture operations
  const getFixturesByZone = (zoneId: string) => {
    return fixtures.filter(fixture => fixture.zoneId === zoneId);
  };

  const addFixture = (fixture: Omit<Fixture, 'id'>) => {
    const newFixture = {
      ...fixture,
      id: `fixture_${Date.now()}`
    };
    setFixtures([...fixtures, newFixture]);
  };

  const updateFixture = (id: string, data: Partial<Fixture>) => {
    setFixtures(fixtures.map(fixture => 
      fixture.id === id ? { ...fixture, ...data } : fixture
    ));
  };

  const deleteFixture = (id: string) => {
    setFixtures(fixtures.filter(fixture => fixture.id !== id));
  };

  // Match operations
  const updateMatchResult = (matchId: string, homeScore: number, awayScore: number) => {
    // Find the match and its fixture
    let updatedFixture: Fixture | undefined;
    let updatedMatch: Match | undefined;
    
    const updatedFixtures = fixtures.map(fixture => {
      const matchIndex = fixture.matches.findIndex(match => match.id === matchId);
      
      if (matchIndex !== -1) {
        // Save reference to the fixture and match for standings update
        updatedFixture = fixture;
        
        // Create updated match with scores
        const match = fixture.matches[matchIndex];
        updatedMatch = {
          ...match,
          homeScore,
          awayScore,
          played: true
        };
        
        // Return updated fixture with updated match
        const updatedMatches = [...fixture.matches];
        updatedMatches[matchIndex] = updatedMatch;
        
        return {
          ...fixture,
          matches: updatedMatches
        };
      }
      
      return fixture;
    });
    
    // Update fixtures with new match results
    setFixtures(updatedFixtures);
    
    // If we found the match and fixture, update the standings
    if (updatedFixture && updatedMatch) {
      updateStandingsForMatch(updatedMatch, updatedFixture);
    }
  };
  
  // Helper function to update standings after a match result
  const updateStandingsForMatch = (match: Match, fixture: Fixture) => {
    // Find home and away team standings
    const homeTeamStanding = standings.find(
      s => s.teamId === match.homeTeamId && 
           s.leagueId === fixture.leagueId &&
           s.categoryId === fixture.categoryId &&
           s.zoneId === fixture.zoneId
    );
    
    const awayTeamStanding = standings.find(
      s => s.teamId === match.awayTeamId && 
           s.leagueId === fixture.leagueId &&
           s.categoryId === fixture.categoryId &&
           s.zoneId === fixture.zoneId
    );
    
    if (!homeTeamStanding || !awayTeamStanding || !match.homeScore || !match.awayScore) {
      return;
    }
    
    // Calculate standing updates based on match result
    const homeScore = match.homeScore;
    const awayScore = match.awayScore;
    
    // Determine match outcome
    let homeWon = false;
    let awayWon = false;
    let draw = false;
    
    if (homeScore > awayScore) {
      homeWon = true;
    } else if (awayScore > homeScore) {
      awayWon = true;
    } else {
      draw = true;
    }
    
    // Update home team standing
    const updatedHomeStanding: Standing = {
      ...homeTeamStanding,
      played: homeTeamStanding.played + 1,
      won: homeTeamStanding.won + (homeWon ? 1 : 0),
      drawn: homeTeamStanding.drawn + (draw ? 1 : 0),
      lost: homeTeamStanding.lost + (awayWon ? 1 : 0),
      points: homeTeamStanding.points + (homeWon ? 3 : (draw ? 1 : 0)),
      goalsFor: homeTeamStanding.goalsFor + homeScore,
      goalsAgainst: homeTeamStanding.goalsAgainst + awayScore
    };
    
    // Update away team standing
    const updatedAwayStanding: Standing = {
      ...awayTeamStanding,
      played: awayTeamStanding.played + 1,
      won: awayTeamStanding.won + (awayWon ? 1 : 0),
      drawn: awayTeamStanding.drawn + (draw ? 1 : 0),
      lost: awayTeamStanding.lost + (homeWon ? 1 : 0),
      points: awayTeamStanding.points + (awayWon ? 3 : (draw ? 1 : 0)),
      goalsFor: awayTeamStanding.goalsFor + awayScore,
      goalsAgainst: awayTeamStanding.goalsAgainst + homeScore
    };
    
    // Update standings
    setStandings(standings.map(standing => {
      if (standing.id === homeTeamStanding.id) {
        return updatedHomeStanding;
      }
      if (standing.id === awayTeamStanding.id) {
        return updatedAwayStanding;
      }
      return standing;
    }));
  };

  // Standings operations
  const getStandingsByZone = (zoneId: string) => {
    return standings.filter(standing => standing.zoneId === zoneId);
  };

  const updateStanding = (id: string, data: Partial<Standing>) => {
    setStandings(standings.map(standing => 
      standing.id === id ? { ...standing, ...data } : standing
    ));
  };

  return (
    <LeagueContext.Provider value={{
      leagues,
      categories,
      zones,
      teams,
      fixtures,
      standings,
      
      // Methods
      getLeague,
      
      getCategoriesByLeague,
      addCategory,
      updateCategory,
      deleteCategory,
      
      getZonesByCategory,
      addZone,
      updateZone,
      deleteZone,
      
      getTeamsByZone,
      addTeam,
      updateTeam,
      deleteTeam,
      
      getFixturesByZone,
      addFixture,
      updateFixture,
      deleteFixture,
      
      updateMatchResult,
      
      getStandingsByZone,
      updateStanding
    }}>
      {children}
    </LeagueContext.Provider>
  );
};