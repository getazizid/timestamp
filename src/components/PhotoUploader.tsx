import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, RotateCw, Sparkles, AlertCircle } from 'lucide-react';
import { PhotoItem } from '../types';
import { SAMPLE_PHOTO_LIST, loadSamplePhotoAsFile, SamplePhotoOption } from '../data/samplePhotos';

interface PhotoUploaderProps {
  photo: PhotoItem | null;
  onPhotoSelected: (file: File) => void;
  onRotate: () => void;
  isLoadingExif?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photo,
  onPhotoSelected,
  onRotate,
  isLoadingExif = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onPhotoSelected(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onPhotoSelected(e.target.files[0]);
    }
  };

  const handleSelectSample = async (sample: SamplePhotoOption) => {
    try {
      setIsLoadingSample(true);
      const file = await loadSamplePhotoAsFile(sample);
      onPhotoSelected(file);
    } catch (err) {
      console.error('Failed to load sample photo:', err);
    } finally {
      setIsLoadingSample(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-white" />
          <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-400">1. Unggah Foto (Portrait / Landscape)</h2>
        </div>
        {photo && (
          <button
            onClick={onRotate}
            className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white font-medium bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800 transition-colors"
            title="Putar Foto 90 Derajat"
          >
            <RotateCw className="w-3 h-3 text-zinc-400" />
            <span>Putar Foto</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!photo ? (
        <div className="space-y-3">
          {/* Main Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-white bg-zinc-900'
                : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-900'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-white">
              <Upload className="w-5 h-5 text-zinc-200" />
            </div>
            <p className="text-sm font-semibold text-zinc-100 mb-1">
              Klik atau tarik foto ke sini
            </p>
            <p className="text-xs text-zinc-400">
              Mendukung JPG, PNG, WEBP (Portrait 9:16 / Landscape 16:9 / Square 1:1)
            </p>
          </div>

          {/* Quick Sample Selector */}
          <div>
            <div className="flex items-center gap-1 text-xs text-zinc-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Coba foto contoh gratis:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PHOTO_LIST.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  disabled={isLoadingSample}
                  className="flex flex-col text-left p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-xs transition-colors disabled:opacity-50"
                >
                  <span className="font-semibold text-zinc-200">{sample.name}</span>
                  <span className="text-[10px] text-zinc-400">{sample.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Loaded Photo Info Card */
        <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-14 h-14 rounded overflow-hidden bg-black border border-zinc-800 shrink-0">
              <img
                src={photo.previewUrl}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-100 truncate">
                {photo.file.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-300 font-mono border border-zinc-800">
                  {photo.width} × {photo.height} px
                </span>
                <span
                  className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-medium capitalize border ${
                    photo.orientation === 'portrait'
                      ? 'bg-purple-950/40 text-purple-300 border-purple-800/50'
                      : photo.orientation === 'landscape'
                      ? 'bg-blue-950/40 text-blue-300 border-blue-800/50'
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                  }`}
                >
                  📱 {photo.orientation}
                </span>
              </div>

              {/* EXIF Badge Notice */}
              {isLoadingExif ? (
                <p className="text-[10px] text-zinc-300 mt-1 flex items-center gap-1">
                  <span className="animate-spin">⏳</span> Membaca metadata EXIF foto...
                </p>
              ) : photo.originalExif?.hasExifData ? (
                <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  EXIF terdeteksi: {photo.originalExif.dateTime || 'Ada data lokasi/kamera'}
                </p>
              ) : (
                <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-zinc-500 shrink-0" />
                  EXIF foto bersih / manual setting
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-white hover:underline font-medium shrink-0 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded border border-zinc-700"
          >
            Ganti
          </button>
        </div>
      )}
    </div>
  );
};
