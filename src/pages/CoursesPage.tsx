import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Flyer {
  id: string;
  imageUrl: string;
  created_at: string;
}

const CoursesPage: React.FC = () => {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [selectedImage, setSelectedImage] = useState<Flyer | null>(null);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cursos y Capacitaciones</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {flyers.map((flyer) => (
          <div 
            key={flyer.id} 
            className="overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedImage(flyer)}
          >
            <img
              src={flyer.imageUrl}
              alt="Flyer"
              className="w-full h-60 object-cover"
            />
          </div>
        ))}
      </div>

      {/* Modal para ver la imagen en grande */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full">
            <img
              src={selectedImage.imageUrl}
              alt="Flyer"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;