import React, { useState } from 'react';
import { useLeague, Team } from '../../contexts/LeagueContext';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Users, Save, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TeamFormData {
  name: string;
  leagueId: string;
  categoryId: string;
  zoneId: string;
  logo?: string;
}

const TeamsPage: React.FC = () => {
  const { leagues, teams, categories, zones, addTeam, updateTeam, deleteTeam, getCategoriesByLeague, getZonesByCategory } = useLeague();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string>(leagues[0]?.id || '');
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TeamFormData>({
    defaultValues: {
      leagueId: selectedLeague,
      categoryId: '',
      zoneId: '',
      name: '',
      logo: ''
    }
  });
  
  // Watch form values for dynamic dropdowns
  const watchLeagueId = watch('leagueId');
  const watchCategoryId = watch('categoryId');
  
  // Get categories for selected league
  const leagueCategories = getCategoriesByLeague(watchLeagueId || selectedLeague);
  
  // Get zones for selected category
  const categoryZones = getZonesByCategory(watchCategoryId);
  
  // Filter teams by selected league
  const filteredTeams = teams.filter(team => team.leagueId === selectedLeague);
  
  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    reset({
      leagueId: selectedLeague,
      categoryId: leagueCategories[0]?.id || '',
      zoneId: '',
      name: '',
      logo: ''
    });
  };
  
  const handleEditClick = (team: Team) => {
    setIsAdding(false);
    setEditingId(team.id);
    reset({
      name: team.name,
      leagueId: team.leagueId,
      categoryId: team.categoryId,
      zoneId: team.zoneId,
      logo: team.logo
    });
  };
  
  const handleCancelClick = () => {
    setIsAdding(false);
    setEditingId(null);
  };
  
  const onSubmit = (data: TeamFormData) => {
    if (isAdding) {
      addTeam(data);
    } else if (editingId) {
      updateTeam(editingId, data);
    }
    
    setIsAdding(false);
    setEditingId(null);
    reset();
  };
  
  const handleDeleteTeam = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este equipo? Esta acción no se puede deshacer.')) {
      deleteTeam(id);
    }
  };
  
  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
    
    // Reset form with new league
    if (!isAdding && !editingId) {
      reset();
    }
  };
  
  // Update category options when league changes
  React.useEffect(() => {
    if (watchLeagueId && leagueCategories.length > 0) {
      setValue('categoryId', leagueCategories[0].id);
    }
  }, [watchLeagueId, leagueCategories, setValue]);
  
  // Update zone options when category changes
  React.useEffect(() => {
    if (watchCategoryId && categoryZones.length > 0) {
      setValue('zoneId', categoryZones[0].id);
    }
  }, [watchCategoryId, categoryZones, setValue]);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Equipos</h1>
        
        <button
          className="btn btn-primary flex items-center space-x-2"
          onClick={handleAddClick}
          disabled={isAdding || !!editingId}
        >
          <Plus size={18} />
          <span>Agregar Equipo</span>
        </button>
      </div>
      
      {/* League selector */}
      <div className="mb-6">
        <label htmlFor="leagueFilter" className="form-label">
          Filtrar por Liga
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
      
      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label" htmlFor="name">
                  Nombre del Equipo
                </label>
                <input
                  id="name"
                  type="text"
                  className={cn(
                    "form-input",
                    errors.name && "border-red-500"
                  )}
                  {...register('name', { required: 'El nombre es requerido' })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label className="form-label" htmlFor="logo">
                  Logo URL (opcional)
                </label>
                <input
                  id="logo"
                  type="text"
                  className="form-input"
                  placeholder="https://ejemplo.com/logo.png"
                  {...register('logo')}
                />
              </div>
              
              <div>
                <label className="form-label" htmlFor="leagueId">
                  Liga
                </label>
                <select
                  id="leagueId"
                  className={cn(
                    "form-input",
                    errors.leagueId && "border-red-500"
                  )}
                  {...register('leagueId', { required: 'La liga es requerida' })}
                >
                  {leagues.map(league => (
                    <option key={league.id} value={league.id}>
                      {league.name}
                    </option>
                  ))}
                </select>
                {errors.leagueId && (
                  <p className="mt-1 text-sm text-red-600">{errors.leagueId.message}</p>
                )}
              </div>
              
              <div>
                <label className="form-label" htmlFor="categoryId">
                  Categoría
                </label>
                <select
                  id="categoryId"
                  className={cn(
                    "form-input",
                    errors.categoryId && "border-red-500"
                  )}
                  {...register('categoryId', { required: 'La categoría es requerida' })}
                >
                  {leagueCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="form-label" htmlFor="zoneId">
                  Zona
                </label>
                <select
                  id="zoneId"
                  className={cn(
                    "form-input",
                    errors.zoneId && "border-red-500"
                  )}
                  {...register('zoneId', { required: 'La zona es requerida' })}
                >
                  {categoryZones.map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
                {errors.zoneId && (
                  <p className="mt-1 text-sm text-red-600">{errors.zoneId.message}</p>
                )}
              </div>
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
                <span>{isAdding ? 'Crear Equipo' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Teams List */}
      {filteredTeams.length > 0 ? (
        <div className="bg-white border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zona
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeams.map(team => {
                const teamCategory = categories.find(c => c.id === team.categoryId);
                const teamZone = zones.find(z => z.id === team.zoneId);
                
                return (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          {team.logo ? (
                            <img 
                              src={team.logo} 
                              alt={`${team.name} logo`} 
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <Users size={16} className="text-primary-600" />
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {team.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teamCategory?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teamZone?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleEditClick(team)}
                          disabled={isAdding || !!editingId}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteTeam(team.id)}
                          disabled={isAdding || !!editingId}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay equipos</h3>
          <p className="text-gray-500 mb-4">
            No hay equipos en esta liga. Haz clic en "Agregar Equipo" para crear uno.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;