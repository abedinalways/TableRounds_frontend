'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { CloudUpload } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  description = 'Drag & drop or click to upload',
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const preview = value || null;
  const blobUrlRef = React.useRef<string | null>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    blobUrlRef.current = url;
    onChange(url);
  }, [onChange]);

  const handleRemove = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    onChange('');
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && !disabled) {
      processFile(file);
    }
  }, [disabled, processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !disabled) {
      processFile(file);
    }
    e.target.value = '';
  };

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl overflow-hidden transition-colors',
          isDragging
            ? 'border-[#01503b] bg-[#01503b]/5'
            : 'border-gray-300 hover:border-[#01503b]/60',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative group w-full">
            <div className="relative w-full aspect-video max-h-[200px]">
              <Image
                src={preview}
                alt={label}
                fill
                className="object-contain bg-gray-50"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <label
                htmlFor={`${label}-replace`}
                className="cursor-pointer bg-white text-[#01281e] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
              >
                Replace
              </label>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
            <input
              id={`${label}-replace`}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </div>
        ) : (
          <label
            htmlFor={`${label}-upload`}
            className={cn(
              'flex flex-col items-center justify-center gap-3 py-10 px-4 cursor-pointer',
              disabled && 'cursor-not-allowed'
            )}
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <CloudUpload className="w-7 h-7 text-gray-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {isDragging ? 'Drop image here' : description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG up to 5MB
              </p>
            </div>
            <input
              id={`${label}-upload`}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
        )}
      </div>

      {preview && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <span className="truncate max-w-[200px]">
            {preview.startsWith('blob:') ? 'Uploaded image preview' : preview}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

