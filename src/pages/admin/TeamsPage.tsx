import React, { useState } from 'react';
import { useLeague, Team } from '../../contexts/LeagueContext';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TeamFormData {
  name: string;
  logo?: string;
  leagueId: string;
  categoryId: string;
  zoneId: string;
}

const TeamsPage: React.FC = () => {
  const { 
    leagues, 
    teams,
    addTeam, 
    updateTeam, 
    deleteTeam, 
    getCategoriesByLeague, 
    getZonesByCategory,
    getTeamsByZone
  } = useLeague();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string>(leagues[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  
  // Get form handling
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TeamFormData>({
    defaultValues: {
      leagueId: selectedLeague,
      categoryId: selectedCategory,
      zoneId: selectedZone,
      name: '',
      logo: ''
    }
  });
  
  // Watch form values for dynamic dropdowns
  const watchLeagueId = watch('leagueId');
  const watchCategoryId = watch('categoryId');
  
  // Get categories for selected league
  const leagueCategories = getCategoriesByLeague(selectedLeague);
  
  // Get zones for selected category
  const categoryZones = getZonesByCategory(selectedCategory);
  
  // Filter teams by selections
  const filteredTeams = selectedZone 
    ? getTeamsByZone(selectedZone)
    : [];
  
  // Initialize select values when league changes
  React.useEffect(() => {
    if (leagueCategories.length > 0 && (!selectedCategory || !leagueCategories.find(cat => cat.id === selectedCategory))) {
      const firstCategoryId = leagueCategories[0].id;
      setSelectedCategory(firstCategoryId);
      
      // También actualizar el formulario si está abierto
      if (isAdding || editingId) {
        setValue('categoryId', firstCategoryId);
      }
    }
  }, [leagueCategories, selectedCategory, setValue, isAdding, editingId]);
  
  // Initialize zone values when category changes
  React.useEffect(() => {
    if (categoryZones.length > 0 && (!selectedZone || !categoryZones.find(zone => zone.id === selectedZone))) {
      const firstZoneId = categoryZones[0].id;
      setSelectedZone(firstZoneId);
      
      // También actualizar el formulario si está abierto
      if (isAdding || editingId) {
        setValue('zoneId', firstZoneId);
      }
    }
  }, [categoryZones, selectedZone, setValue, isAdding, editingId]);
  
  // Eliminar estos efectos anteriores que no funcionan correctamente
  // React.useEffect(() => {
  //   if (leagueCategories.length > 0 && !selectedCategory) {
  //     setSelectedCategory(leagueCategories[0].id);
  //   }
  // }, [leagueCategories, selectedCategory]);
  
  // React.useEffect(() => {
  //   if (categoryZones.length > 0 && !selectedZone) {
  //     setSelectedZone(categoryZones[0].id);
  //   }
  // }, [categoryZones, selectedZone]);
  
  // Update form values when selections change
  React.useEffect(() => {
    if (isAdding || editingId) {
      setValue('leagueId', selectedLeague);
      setValue('categoryId', selectedCategory);
      setValue('zoneId', selectedZone);
    }
  }, [selectedLeague, selectedCategory, selectedZone, isAdding, editingId, setValue]);
  
  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    reset({
      leagueId: selectedLeague,
      categoryId: selectedCategory,
      zoneId: selectedZone,
      name: '',
      logo: ''
    });
  };
  
  const handleEditClick = (team: Team) => {
    setIsAdding(false);
    setEditingId(team.id);
    reset({
      name: team.name,
      logo: team.logo,
      leagueId: team.leagueId,
      categoryId: team.categoryId,
      zoneId: team.zoneId
    });
    
    // Update selections
    setSelectedLeague(team.leagueId);
    setSelectedCategory(team.categoryId);
    setSelectedZone(team.zoneId);
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
  
  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zoneId = e.target.value;
    setSelectedZone(zoneId);
    
    // Actualizar el formulario si está abierto
    if (isAdding || editingId) {
      setValue('zoneId', zoneId);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Equipos</h1>
        
        <button
          className="btn btn-primary flex items-center space-x-2"
          onClick={handleAddClick}
          disabled={isAdding || !!editingId || !selectedZone}
        >
          <Plus size={18} />
          <span>Agregar Equipo</span>
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
        
        <div>
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
            onChange={handleZoneChange}
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
                  URL del Logo (opcional)
                </label>
                <input
                  id="logo"
                  type="text"
                  className="form-input"
                  placeholder="https://ejemplo.com/logo.png"
                  {...register('logo')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              
              <div>
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
      {selectedZone ? (
        filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeams.map(team => (
              <div 
                key={team.id} 
                className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      {team.logo ? (
                        <img 
                          src={team.logo} 
                          alt={`${team.name} logo`} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary-600 font-bold text-lg">
                          {team.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg">{team.name}</h3>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      onClick={() => handleEditClick(team)}
                      disabled={isAdding || !!editingId}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      onClick={() => handleDeleteTeam(team.id)}
                      disabled={isAdding || !!editingId}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay equipos</h3>
            <p className="text-gray-500 mb-4">
              No hay equipos en esta zona. Haz clic en "Agregar Equipo" para crear uno.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una zona</h3>
          <p className="text-gray-500">
            Selecciona una liga, categoría y zona para ver y gestionar los equipos.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;