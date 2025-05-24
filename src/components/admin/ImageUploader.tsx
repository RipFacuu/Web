import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export const ImageUploader: React.FC = () => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;

      // Subir archivo a Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      // Guardar referencia en la base de datos
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([{ url: publicUrl }]);

      if (dbError) throw dbError;

      alert('Imagen subida exitosamente');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Subir imagen
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      {uploading && <p className="mt-2 text-sm text-gray-500">Subiendo...</p>}
    </div>
  );
};