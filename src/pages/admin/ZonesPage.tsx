import React, { useState } from 'react';
import { useLeague, Zone } from '../../contexts/LeagueContext';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ZoneFormData {
  name: string;
  leagueId: string;
  categoryId: string;
  isEditable: boolean; // Agregar esta propiedad
}

const ZonesPage: React.FC = () => {
  const { 
    leagues, 
    getCategoriesByLeague, 
    getZonesByCategory,
    addZone, 
    updateZone, 
    deleteZone 
  } = useLeague();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Get categories for selected league
  const categories = getCategoriesByLeague(selectedLeague);
  
  // Get zones for selected category
  const zones = selectedCategory ? getZonesByCategory(selectedCategory) : [];

  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
    setSelectedCategory(''); // Reset categoría cuando cambia la liga
  };
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ZoneFormData>({
    defaultValues: {
      leagueId: selectedLeague,
      categoryId: selectedCategory,
      name: '',
      isEditable: true // Valor por defecto
    }
  });
  
  // Watch form values for dynamic dropdowns
  const watchLeagueId = watch('leagueId');
  
  // Get categories for selected league
  const leagueCategories = getCategoriesByLeague(watchLeagueId || selectedLeague);
  
  // Filter zones by selections
  const filteredZones = selectedCategory 
    ? getZonesByCategory(selectedCategory)
    : [];
  
  // Initialize select values
  React.useEffect(() => {
    if (leagueCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(leagueCategories[0].id);
    }
  }, [leagueCategories, selectedCategory]);
  
  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    reset({
      leagueId: selectedLeague,
      categoryId: selectedCategory,
      name: ''
    });
  };
  
  const handleEditClick = (zone: Zone) => {
    setIsAdding(false);
    setEditingId(zone.id);
    reset({
      name: zone.name,
      leagueId: zone.leagueId,
      categoryId: zone.categoryId
    });
    
    // Update selections
    setSelectedLeague(zone.leagueId);
    setSelectedCategory(zone.categoryId);
  };
  
  const handleCancelClick = () => {
    setIsAdding(false);
    setEditingId(null);
  };
  
  const onSubmit = (data: ZoneFormData) => {
    if (isAdding) {
      addZone(data);
    } else if (editingId) {
      updateZone(editingId, data);
    }
    
    setIsAdding(false);
    setEditingId(null);
    reset();
  };
  
  const handleDeleteZone = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta zona? Esta acción eliminará todos los equipos y fixtures asociados.')) {
      deleteZone(id);
    }
  };
  
  // Remove this duplicate declaration
  // const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const leagueId = e.target.value;
  //   setSelectedLeague(leagueId);
  //   setSelectedCategory('');
  // };
  
  // Update category options when league changes
  React.useEffect(() => {
    if (watchLeagueId && leagueCategories.length > 0) {
      setValue('categoryId', leagueCategories[0].id);
    }
  }, [watchLeagueId, leagueCategories, setValue]);
  
  // Define components outside of return statement
  const ZoneSelect = () => (
    <div>
      <label htmlFor="zoneFilter" className="form-label">
        Zona
      </label>
      <select
        id="zoneFilter"
        className="form-input"
        value={selectedZone}
        onChange={(e) => setSelectedZone(e.target.value)}
        disabled={isAdding || !!editingId || !selectedCategory}
      >
        <option value="">Seleccionar zona</option>
        {zones.map(zone => (
          <option key={zone.id} value={zone.id}>
            {zone.name}
          </option>
        ))}
      </select>
    </div>
  );

  // Determine if it's Liga Masculina
  const isMasculina = selectedLeague === 'liga_masculina';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Zonas</h1>
        
        <button
          className="btn btn-primary flex items-center space-x-2"
          onClick={handleAddClick}
          disabled={isAdding || !!editingId || !selectedCategory}
        >
          <Plus size={18} />
          <span>Agregar Zona</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <option value="">Seleccionar Liga</option>
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
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={isAdding || !!editingId || !selectedLeague}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="form-label" htmlFor="name">
                  Nombre de la Zona
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
                <span>{isAdding ? 'Crear Zona' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Zones List */}
      {selectedCategory ? (
        filteredZones.length > 0 ? (
          <div className="bg-white border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredZones.map(zone => (
                  <tr key={zone.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {zone.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleEditClick(zone)}
                          disabled={isAdding || !!editingId}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteZone(zone.id)}
                          disabled={isAdding || !!editingId}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay zonas</h3>
            <p className="text-gray-500 mb-4">
              No hay zonas en esta categoría. Haz clic en "Agregar Zona" para crear una.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una categoría</h3>
          <p className="text-gray-500">
            Selecciona una liga y una categoría para ver y gestionar las zonas.
          </p>
        </div>
      )}
    </div>
  );
};

export default ZonesPage;