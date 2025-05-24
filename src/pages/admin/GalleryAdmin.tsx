import React from 'react';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { ImageGallery } from '../../components/ImageGallery';

const GalleryAdmin: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Administrar Galería</h1>
      <ImageUploader />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Imágenes Actuales</h2>
        <ImageGallery />
      </div>
    </div>
  );
};

export default GalleryAdmin;