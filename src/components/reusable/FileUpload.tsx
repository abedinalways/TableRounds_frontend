'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { CloudUpload, CheckCircle2, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FileUploadProps {
  id: string;
  label: string;
  description: string;
  supportedFormats: string;
  accept?: string;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export default function FileUpload({
  id,
  label,
  description,
  supportedFormats,
  accept = "image/*",
  selectedFile,
  onFileSelect,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Use useMemo to generate the URL only when the file changes
  const previewUrl = useMemo(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      return URL.createObjectURL(selectedFile);
    }
    return null;
  }, [selectedFile]);

  // Clean up the URL when the component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg py-8 text-center transition-colors',
        isDragging ? 'border-yellow-500 bg-[#1C765E]/80' : 'border-[#22BA92] bg-[#1C765E]',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-3 px-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <CloudUpload className="w-8 h-8 text-teal-700" />
        </div>
        <div className="text-white">
          <p className="text-white text-md md:text-[20px] font-semibold">
            {label}
          </p>
          <p className="text-xs md:text-sm text-teal-200">
            {supportedFormats}
          </p>
        </div>

        {selectedFile ? (
          <div className="relative group w-full max-w-[200px] aspect-square mx-auto mt-2">
            {previewUrl ? (
              <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-white/20">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-lg bg-teal-800/50 flex flex-col items-center justify-center border-2 border-white/20 gap-2">
                <FileText className="w-10 h-10 text-teal-200" />
                <span className="text-xs text-teal-100 px-2 truncate max-w-full">
                  {selectedFile.name}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onFileSelect(null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <label 
              htmlFor={id} 
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
            >
              <span className="text-white text-sm font-medium">Change File</span>
            </label>
          </div>
        ) : (
          <label htmlFor={id}>
            <Button
              type="button"
              className="bg-[#B79E6B] text-white w-fit h-10 hover:bg-[#a08c5f] transition-colors rounded-[8px] px-[32px] py-[14px] w-[150px] h-[54px] cursor-pointer"
              asChild
            >
              <span>Choose File</span>
            </Button>
            <input
              id={id}
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
            />
          </label>
        )}

        {selectedFile && (
          <p className="text-teal-100 text-sm flex items-center gap-2 max-w-full overflow-hidden mt-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{selectedFile.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}
