// Mock data for development
import { League, Category, Zone, Team, Fixture, Standing, Match } from '../contexts/LeagueContext';

// Leagues
const leagues: League[] = [
  {
    id: 'liga_masculina',
    name: 'Liga Masculina',
    description: 'Competición de fútbol masculino',
    logo: '/images/liga-masculina.svg'
  },
  {
    id: 'lifufe',
    name: 'LIFUFE',
    description: 'Liga de Fútbol Femenino',
    logo: '/images/lifufe.svg'
  },
  {
    id: 'mundialito',
    name: 'Mundialito',
    description: 'Competición internacional de fútbol',
    logo: '/images/mundialito.svg'
  }
];

// Categories
const categories: Category[] = [
  // Liga Masculina
  {
    id: 'cat_liga_masc_primera',
    name: 'Primera División',
    leagueId: 'liga_masculina',
    isEditable: true
  },
  {
    id: 'cat_liga_masc_segunda',
    name: 'Segunda División',
    leagueId: 'liga_masculina',
    isEditable: true
  },
  
  // LIFUFE - Fixed categories
  {
    id: 'cat_lifufe_sub10',
    name: 'Sub10',
    leagueId: 'lifufe',
    isEditable: false
  },
  {
    id: 'cat_lifufe_sub13',
    name: 'Sub13',
    leagueId: 'lifufe',
    isEditable: false
  },
  {
    id: 'cat_lifufe_sub16',
    name: 'Sub16',
    leagueId: 'lifufe',
    isEditable: false
  },
  
  // Mundialito - Editable categories
  {
    id: 'cat_mundialito_grupo_a',
    name: 'Grupo A',
    leagueId: 'mundialito',
    isEditable: true
  },
  {
    id: 'cat_mundialito_grupo_b',
    name: 'Grupo B',
    leagueId: 'mundialito',
    isEditable: true
  }
];

// Zones
const zones: Zone[] = [
  // Liga Masculina zones
  {
    id: 'zone_liga_masc_primera_norte',
    name: 'Zona Norte',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera'
  },
  {
    id: 'zone_liga_masc_primera_sur',
    name: 'Zona Sur',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera'
  },
  {
    id: 'zone_liga_masc_segunda_unica',
    name: 'Zona Única',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_segunda'
  },
  
  // LIFUFE zones
  {
    id: 'zone_lifufe_sub10_unica',
    name: 'Zona Única',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub10'
  },
  {
    id: 'zone_lifufe_sub13_unica',
    name: 'Zona Única',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub13'
  },
  {
    id: 'zone_lifufe_sub16_unica',
    name: 'Zona Única',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub16'
  },
  
  // Mundialito zones
  {
    id: 'zone_mundialito_grupo_a_unica',
    name: 'Zona Única',
    leagueId: 'mundialito',
    categoryId: 'cat_mundialito_grupo_a'
  },
  {
    id: 'zone_mundialito_grupo_b_unica',
    name: 'Zona Única',
    leagueId: 'mundialito',
    categoryId: 'cat_mundialito_grupo_b'
  }
];

// Teams
const teams: Team[] = [
  // Liga Masculina - Primera División - Zona Norte
  {
    id: 'team_1',
    name: 'Taladro FC',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_norte'
  },
  {
    id: 'team_2',
    name: 'Crecer',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_norte'
  },
  {
    id: 'team_3',
    name: 'Independiente',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_norte'
  },
  {
    id: 'team_4',
    name: 'Atlético Nacional',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_norte'
  },
  
  // Liga Masculina - Primera División - Zona Sur
  {
    id: 'team_5',
    name: 'Estrella Roja',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_sur'
  },
  {
    id: 'team_6',
    name: 'Deportivo Sur',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_sur'
  },
  {
    id: 'team_7',
    name: 'Sporting Club',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_sur'
  },
  {
    id: 'team_8',
    name: 'Real FC',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_sur'
  },
  
  // LIFUFE - Sub10
  {
    id: 'team_9',
    name: 'Pequeñas Estrellas',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub10',
    zoneId: 'zone_lifufe_sub10_unica'
  },
  {
    id: 'team_10',
    name: 'Atletico Junior',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub10',
    zoneId: 'zone_lifufe_sub10_unica'
  },
  {
    id: 'team_11',
    name: 'Las Aguilas',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub10',
    zoneId: 'zone_lifufe_sub10_unica'
  },
  {
    id: 'team_12',
    name: 'Club Deportivo Tigres',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub10',
    zoneId: 'zone_lifufe_sub10_unica'
  },
  
  // Mundialito - Grupo A
  {
    id: 'team_13',
    name: 'Brasil',
    leagueId: 'mundialito',
    categoryId: 'cat_mundialito_grupo_a',
    zoneId: 'zone_mundialito_grupo_a_unica'
  },
  {
    id: 'team_14',
    name: 'Argentina',
    leagueId: 'mundialito',
    categoryId: 'cat_mundialito_grupo_a',
    zoneId: 'zone_mundialito_grupo_a_unica'
  },
  {
    id: 'team_15',
    name: 'Francia',
    leagueId: 'mundialito',
    categoryId: 'cat_mundialito_grupo_a',
    zoneId: 'zone_mundialito_grupo_a_unica'
  },
  {
    id: 'team_16',
    name: 'Italia',
    leagueId: 'mundialito',
    categoryId: 'cat_mundialito_grupo_a',
    zoneId: 'zone_mundialito_grupo_a_unica'
  }
];

// Sample matches for a fixture
const sampleMatches1: Match[] = [
  {
    id: 'match_1',
    fixtureId: 'fixture_1',
    homeTeamId: 'team_1',
    awayTeamId: 'team_2',
    homeScore: 2,
    awayScore: 1,
    played: true
  },
  {
    id: 'match_2',
    fixtureId: 'fixture_1',
    homeTeamId: 'team_3',
    awayTeamId: 'team_4',
    homeScore: 0,
    awayScore: 0,
    played: true
  }
];

const sampleMatches2: Match[] = [
  {
    id: 'match_3',
    fixtureId: 'fixture_2',
    homeTeamId: 'team_2',
    awayTeamId: 'team_3',
    homeScore: 1,
    awayScore: 3,
    played: true
  },
  {
    id: 'match_4',
    fixtureId: 'fixture_2',
    homeTeamId: 'team_4',
    awayTeamId: 'team_1',
    played: false
  }
];

// Fixtures
const fixtures: Fixture[] = [
  {
    id: 'fixture_1',
    date: '1° FECHA',
    matchDate: '29 DE MARZO',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_norte',
    matches: sampleMatches1
  },
  {
    id: 'fixture_2',
    date: '2° FECHA',
    matchDate: '5 DE ABRIL',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_norte',
    matches: sampleMatches2
  },
  {
    id: 'fixture_3',
    date: '1° FECHA',
    matchDate: '29 DE MARZO',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub10',
    zoneId: 'zone_lifufe_sub10_unica',
    matches: [
      {
        id: 'match_5',
        fixtureId: 'fixture_3',
        homeTeamId: 'team_9',
        awayTeamId: 'team_10',
        homeScore: 3,
        awayScore: 1,
        played: true
      },
      {
        id: 'match_6',
        fixtureId: 'fixture_3',
        homeTeamId: 'team_11',
        awayTeamId: 'team_12',
        homeScore: 2,
        awayScore: 2,
        played: true
      }
    ]
  }
];

// Standings
const standings: Standing[] = [
  // Liga Masculina - Primera División - Zona Norte
  {
    id: 'standing_1',
    teamId: 'team_1',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_norte',
    points: 3,
    played: 1,
    won: 1,
    drawn: 0,
    lost: 0,
    goalsFor: 2,
    goalsAgainst: 1
  },
  {
    id: 'standing_2',
    teamId: 'team_2',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_norte',
    points: 0,
    played: 1,
    won: 0,
    drawn: 0,
    lost: 1,
    goalsFor: 1,
    goalsAgainst: 2
  },
  {
    id: 'standing_3',
    teamId: 'team_3',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_norte',
    points: 1,
    played: 1,
    won: 0,
    drawn: 1,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0
  },
  {
    id: 'standing_4',
    teamId: 'team_4',
    leagueId: 'liga_masculina',
    categoryId: 'cat_liga_masc_primera',
    zoneId: 'zone_liga_masc_primera_norte',
    points: 1,
    played: 1,
    won: 0,
    drawn: 1,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0
  },
  
  // LIFUFE - Sub10
  {
    id: 'standing_9',
    teamId: 'team_9',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub10',
    zoneId: 'zone_lifufe_sub10_unica',
    points: 3,
    played: 1,
    won: 1,
    drawn: 0,
    lost: 0,
    goalsFor: 3,
    goalsAgainst: 1
  },
  {
    id: 'standing_10',
    teamId: 'team_10',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub10',
    zoneId: 'zone_lifufe_sub10_unica',
    points: 0,
    played: 1,
    won: 0,
    drawn: 0,
    lost: 1,
    goalsFor: 1,
    goalsAgainst: 3
  },
  {
    id: 'standing_11',
    teamId: 'team_11',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub10',
    zoneId: 'zone_lifufe_sub10_unica',
    points: 1,
    played: 1,
    won: 0,
    drawn: 1,
    lost: 0,
    goalsFor: 2,
    goalsAgainst: 2
  },
  {
    id: 'standing_12',
    teamId: 'team_12',
    leagueId: 'lifufe',
    categoryId: 'cat_lifufe_sub10',
    zoneId: 'zone_lifufe_sub10_unica',
    points: 1,
    played: 1,
    won: 0,
    drawn: 1,
    lost: 0,
    goalsFor: 2,
    goalsAgainst: 2
  }
];

// Export mock data
export const mockLeagueData = {
  leagues: [
    {
      id: 'liga_masculina',
      name: 'Liga Participando',
      description: 'Liga Principal de Fútbol',
      logo: undefined
    },
    {
      id: 'lifufe',
      name: 'LIFUFE',
      description: 'Liga de Fútbol Federado',
      logo: undefined
    },
    {
      id: 'mundialito',
      name: 'Mundialito',
      description: 'Torneo Internacional',
      logo: undefined
    }
  ],
  categories: categories,
  zones: zones,
  teams: teams,
  fixtures: fixtures,
  standings: standings
};