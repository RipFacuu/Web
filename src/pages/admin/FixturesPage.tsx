import React, { useState } from 'react';
import { useLeague, Match, Team } from '../../contexts/LeagueContext';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Edit, Trash2, Calendar, Save, X, Users } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FixtureFormData {
  date: string;
  matchDate: string;
  leagueId: string;
  categoryId: string;
  zoneId: string;
  matches: {
    homeTeamId: string;
    awayTeamId: string;
    played?: boolean;
    homeScore?: number;
    awayScore?: number;
  }[];
}

const FixturesPage: React.FC = () => {
  const { 
    leagues, 
    fixtures, 
    addFixture, 
    updateFixture, 
    deleteFixture, 
    getCategoriesByLeague, 
    getZonesByCategory,
    getTeamsByZone
  } = useLeague();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string>(leagues[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  
  // Verificar si la liga seleccionada es "Liga Participando"
  const isLigaParticipando = selectedLeague === 'liga_masculina';
  
  // Get form handling
  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<FixtureFormData>({
    defaultValues: {
      leagueId: selectedLeague,
      categoryId: selectedCategory,
      zoneId: selectedZone,
      date: '',
      matchDate: '',
      matches: [{ homeTeamId: '', awayTeamId: '', played: false }]
    }
  });
  
  // Field array for matches
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'matches'
  });
  
  // Watch form values for dynamic dropdowns
  const watchLeagueId = watch('leagueId');
  const watchCategoryId = watch('categoryId');
  const watchZoneId = watch('zoneId');
  
  // Get categories for selected league
  const leagueCategories = getCategoriesByLeague(selectedLeague);
  
  // Get zones for selected category
  const categoryZones = getZonesByCategory(selectedCategory);
  
  // Get teams for selected zone
  const zoneTeams = getTeamsByZone(selectedZone);
  
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
  
  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    reset({
      leagueId: selectedLeague,
      categoryId: selectedCategory,
      zoneId: selectedZone,
      date: '',
      matchDate: '',
      matches: [{ homeTeamId: '', awayTeamId: '', played: false }]
    });
  };
  
  const handleEditClick = (fixtureId: string) => {
    const fixture = fixtures.find(f => f.id === fixtureId);
    if (!fixture) return;
    
    setIsAdding(false);
    setEditingId(fixtureId);
    
    // Convert matches to form format
    const formattedMatches = fixture.matches.map(match => ({
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      played: match.played,
      homeScore: match.homeScore,
      awayScore: match.awayScore
    }));
    
    reset({
      date: fixture.date,
      matchDate: fixture.matchDate,
      leagueId: fixture.leagueId,
      categoryId: fixture.categoryId,
      zoneId: fixture.zoneId,
      matches: formattedMatches
    });
    
    // Update selections
    setSelectedLeague(fixture.leagueId);
    setSelectedCategory(fixture.categoryId);
    setSelectedZone(fixture.zoneId);
  };
  
  const handleCancelClick = () => {
    setIsAdding(false);
    setEditingId(null);
  };
  
  const handleDeleteFixture = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este fixture? Esta acción no se puede deshacer.')) {
      deleteFixture(id);
    }
  };
  
  const onSubmit = (data: FixtureFormData) => {
    if (isAdding) {
      addFixture({
        ...data,
        matches: data.matches.map(match => ({
          ...match,
          id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fixtureId: '', // This will be set by the context
          played: false
        }))
      });
    } else if (editingId) {
      // Preserve match IDs for existing matches
      const existingFixture = fixtures.find(f => f.id === editingId);
      const updatedMatches = data.matches.map((match, index) => {
        const existingMatch = existingFixture?.matches[index];
        return {
          ...match,
          id: existingMatch?.id || `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fixtureId: editingId,
          played: !!match.played
        };
      });
      
      updateFixture(editingId, {
        ...data,
        matches: updatedMatches
      });
    }
    
    setIsAdding(false);
    setEditingId(null);
    reset();
  };
  
  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
    setSelectedCategory('');
    setSelectedZone('');
    
    // Actualizar el formulario si está abierto
    if (isAdding || editingId) {
      setValue('leagueId', leagueId);
      setValue('categoryId', '');
      setValue('zoneId', '');
    }
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedZone('');
    
    // Actualizar el formulario si está abierto
    if (isAdding || editingId) {
      setValue('categoryId', categoryId);
      setValue('zoneId', '');
    }
  };
  
  // Get team name by ID
  const getTeamName = (teamId: string): string => {
    const team = zoneTeams.find(team => team.id === teamId);
    return team ? team.name : 'Equipo desconocido';
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Fixtures</h1>
        
        <button
          className="btn btn-primary flex items-center space-x-2"
          onClick={handleAddClick}
          disabled={isAdding || !!editingId || !selectedZone}
        >
          <Plus size={18} />
          <span>Agregar Fixture</span>
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
            disabled={isAdding || !!editingId}
          >
            {leagues.map(league => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ display: isLigaParticipando ? 'none' : 'block' }}>
          <label htmlFor="categoryFilter" className="form-label">
            Categoría
          </label>
          <select
            id="categoryFilter"
            className="form-input"
            value={selectedCategory}
            onChange={handleCategoryChange}
            disabled={isAdding || !!editingId || leagueCategories.length === 0}
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
            onChange={(e) => {
              const zoneId = e.target.value;
              setSelectedZone(zoneId);
              
              // Actualizar el formulario si está abierto
              if (isAdding || editingId) {
                setValue('zoneId', zoneId);
              }
            }}
            disabled={isAdding || !!editingId || categoryZones.length === 0}
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
      
      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label" htmlFor="date">
                  Fecha (nombre)
                </label>
                <input
                  id="date"
                  type="text"
                  className={cn(
                    "form-input",
                    errors.date && "border-red-500"
                  )}
                  placeholder="Ej: 1° FECHA"
                  {...register('date', { required: 'La fecha es requerida' })}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>
              
              <div>
                <label className="form-label" htmlFor="matchDate">
                  Fecha del partido
                </label>
                <input
                  id="matchDate"
                  type="text"
                  className={cn(
                    "form-input",
                    errors.matchDate && "border-red-500"
                  )}
                  placeholder="Ej: 29 DE MARZO"
                  {...register('matchDate', { required: 'La fecha del partido es requerida' })}
                />
                {errors.matchDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.matchDate.message}</p>
                )}
              </div>
              
              {/* Campos de selección visibles */}
              <div>
                <label className="form-label" htmlFor="formLeagueId">
                  Liga
                </label>
                <select
                  id="formLeagueId"
                  className={cn(
                    "form-input",
                    errors.leagueId && "border-red-500"
                  )}
                  {...register('leagueId', { required: 'La liga es requerida' })}
                  onChange={(e) => {
                    setValue('leagueId', e.target.value);
                    setValue('categoryId', '');
                    setValue('zoneId', '');
                  }}
                >
                  {leagues.map(league => (
                    <option key={league.id} value={league.id}>
                      {league.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: watchLeagueId === 'liga_masculina' ? 'none' : 'block' }}>
                <label className="form-label" htmlFor="formCategoryId">
                  Categoría
                </label>
                <select
                  id="formCategoryId"
                  className={cn(
                    "form-input",
                    errors.categoryId && "border-red-500"
                  )}
                  {...register('categoryId', { required: 'La categoría es requerida' })}
                  onChange={(e) => {
                    setValue('categoryId', e.target.value);
                    setValue('zoneId', '');
                  }}
                >
                  <option value="">Seleccionar categoría</option>
                  {getCategoriesByLeague(watchLeagueId).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label" htmlFor="formZoneId">
                  Zona
                </label>
                <select
                  id="formZoneId"
                  className={cn(
                    "form-input",
                    errors.zoneId && "border-red-500"
                  )}
                  {...register('zoneId', { required: 'La zona es requerida' })}
                >
                  <option value="">Seleccionar zona</option>
                  {getZonesByCategory(watchCategoryId).map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Matches */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-3">Partidos</h3>
              
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-5 gap-2 items-center mb-3 pb-3 border-b last:border-0"
                >
                  <div className="col-span-2">
                    <label className="form-label text-sm">Equipo Local</label>
                    <select
                      className={cn(
                        "form-input",
                        errors.matches?.[index]?.homeTeamId && "border-red-500"
                      )}
                      {...register(`matches.${index}.homeTeamId` as const, {
                        required: 'Requerido'
                      })}
                    >
                      <option value="">Seleccionar equipo</option>
                      {zoneTeams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <span className="text-gray-400">VS</span>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="form-label text-sm">Equipo Visitante</label>
                    <select
                      className={cn(
                        "form-input",
                        errors.matches?.[index]?.awayTeamId && "border-red-500"
                      )}
                      {...register(`matches.${index}.awayTeamId` as const, {
                        required: 'Requerido'
                      })}
                    >
                      <option value="">Seleccionar equipo</option>
                      {zoneTeams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="btn btn-outline text-sm w-full mt-2"
                onClick={() => append({ homeTeamId: '', awayTeamId: '', played: false })}
              >
                <Plus size={14} className="mr-1" /> Agregar Partido
              </button>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="btn btn-outline flex items-center space-x-2"
                onClick={handleCancelClick}
              >
                <X size={18} />
                <span>Cancelar</span>
              </button>
              
              <button
                type="submit"
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save size={18} />
                <span>{isAdding ? 'Crear Fixture' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Fixtures List */}
      {selectedZone ? (
        filteredFixtures.length > 0 ? (
          <div className="space-y-6">
            {filteredFixtures.map(fixture => (
              <div key={fixture.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-4 flex items-center justify-between border-b">
                  <div>
                    <h3 className="font-semibold text-lg">{fixture.date}</h3>
                    <p className="text-gray-500 text-sm">{fixture.matchDate}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      onClick={() => handleEditClick(fixture.id)}
                      disabled={isAdding || !!editingId}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      onClick={() => handleDeleteFixture(fixture.id)}
                      disabled={isAdding || !!editingId}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  {fixture.matches.map((match: Match) => (
                    <div 
                      key={match.id} 
                      className="py-3 border-b last:border-0 flex items-center justify-between"
                    >
                      <div className="flex-1 text-right pr-3">
                        <span className="font-medium">{getTeamName(match.homeTeamId)}</span>
                      </div>
                      
                      <div className="flex items-center justify-center w-20">
                        {match.played ? (
                          <div className="flex items-center justify-center">
                            <span className="font-bold px-2 py-1 bg-gray-100 rounded-md min-w-[32px] text-center">
                              {match.homeScore}
                            </span>
                            <span className="mx-1">-</span>
                            <span className="font-bold px-2 py-1 bg-gray-100 rounded-md min-w-[32px] text-center">
                              {match.awayScore}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-500">VS</span>
                        )}
                      </div>
                      
                      <div className="flex-1 pl-3">
                        <span className="font-medium">{getTeamName(match.awayTeamId)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay fixtures</h3>
            <p className="text-gray-500 mb-4">
              No hay fixtures en esta zona. Haz clic en "Agregar Fixture" para crear uno.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una zona</h3>
          <p className="text-gray-500">
            Selecciona una liga, categoría y zona para ver y gestionar los fixtures.
          </p>
        </div>
      )}
    </div>
  );
};

export default FixturesPage;