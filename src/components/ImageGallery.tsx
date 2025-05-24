import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Image {
  id: string;
  url: string;
  created_at: string;
}

export const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
      return;
    }

    setImages(data || []);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images.map((image) => (
        <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={image.url}
            alt="Gallery image"
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};