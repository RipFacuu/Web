import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Flyer {
  id: string;
  imageUrl: string;
  created_at: string;
}

const FlyersPage: React.FC = () => {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadFlyers();
  }, []);

  const loadFlyers = async () => {
    try {
      const { data, error } = await supabase
        .from('flyers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlyers(data || []);
    } catch (error) {
      console.error('Error al cargar flyers:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;

      // Subir archivo a Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('flyers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('flyers')
        .getPublicUrl(fileName);

      // Guardar referencia en la base de datos
      const { error: dbError } = await supabase
        .from('flyers')
        .insert([{ imageUrl: publicUrl }]);

      if (dbError) throw dbError;

      loadFlyers(); // Recargar la lista
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir el flyer');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Administrar Flyers</h1>
      
      <div className="mb-8">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Subir nuevo flyer
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        {isUploading && <p className="mt-2 text-sm text-gray-500">Subiendo...</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flyers.map((flyer) => (
          <div key={flyer.id} className="relative group">
            <img
              src={flyer.imageUrl}
              alt="Flyer"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={async () => {
                if (window.confirm('¿Estás seguro de eliminar este flyer?')) {
                  await supabase.from('flyers').delete().eq('id', flyer.id);
                  loadFlyers();
                }
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlyersPage;