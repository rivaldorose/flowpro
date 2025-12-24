import React, { useState } from 'react';
import { Image, Upload } from 'lucide-react';
import BaseCard from './BaseCard';
import { Button } from '@/components/ui/button';

/**
 * Image Card - Display image with upload functionality
 */
export default function ImageCard({ id, x, y, width = 400, src, alt = '', onUpdate, onDelete, ...props }) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setImageSrc(result);
      onUpdate?.({ id, src: result });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <BaseCard
      id={id}
      type="image"
      x={x}
      y={y}
      width={width}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="draggable"
      {...props}
    >
      <div className="flex items-center gap-2 mb-2">
        <Image className="w-4 h-4 text-purple-600" />
        <span className="text-xs font-medium text-gray-600">Image</span>
      </div>
      <div className="relative">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-auto rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <label htmlFor={`image-upload-${id}`}>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                disabled={isUploading}
                asChild
              >
                <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
              </Button>
            </label>
            <input
              id={`image-upload-${id}`}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
    </BaseCard>
  );
}

