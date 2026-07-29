import React, { useState } from 'react';
import { Layers, Download, CheckCircle2, Upload, Trash2 } from 'lucide-react';
import { PhotoItem, TimestampSettings } from '../types';
import { renderTimestampedCanvas } from '../utils/canvasRenderer';

interface BatchProcessorProps {
  settings: TimestampSettings;
  logoImg: HTMLImageElement | null;
  onSelectPhotoToEdit: (photo: PhotoItem) => void;
}

export const BatchProcessor: React.FC<BatchProcessorProps> = ({
  settings,
  logoImg,
  onSelectPhotoToEdit,
}) => {
  const [batchPhotos, setBatchPhotos] = useState<PhotoItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadedCount, setDownloadedCount] = useState(0);

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);

    const newPhotos: PhotoItem[] = files.map((file, idx) => {
      const url = URL.createObjectURL(file);
      return {
        id: `batch-${Date.now()}-${idx}`,
        file,
        previewUrl: url,
        width: 1920,
        height: 1080,
        orientation: 'landscape' as const,
      };
    });

    setBatchPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDownloadAll = async () => {
    if (batchPhotos.length === 0) return;
    setIsProcessing(true);
    setDownloadedCount(0);

    for (let i = 0; i < batchPhotos.length; i++) {
      const item = batchPhotos[i];
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = item.previewUrl;
        await new Promise((res) => (img.onload = res));

        const result = await renderTimestampedCanvas(img, settings, logoImg);
        const link = document.createElement('a');
        link.href = result.dataUrl;
        link.download = `Batch_Timestamp_${i + 1}_${item.file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadedCount((prev) => prev + 1);
        // Small delay between downloads
        await new Promise((r) => setTimeout(r, 400));
      } catch (err) {
        console.error('Batch download error:', err);
      }
    }

    setIsProcessing(false);
  };

  const handleRemoveItem = (id: string) => {
    setBatchPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-300" />
          <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-400">Mode Banyak Foto (Batch Processing)</h2>
        </div>
        {batchPhotos.length > 0 && (
          <span className="text-xs text-white font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            {batchPhotos.length} Foto
          </span>
        )}
      </div>

      <p className="text-xs text-zinc-400">
        Terapkan desain stempel waktu & lokasi saat ini ke banyak foto sekaligus tanpa mengunggah satu per satu.
      </p>

      {/* Batch Upload Input */}
      <label className="block">
        <span className="sr-only">Pilih foto sekaligus</span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleBatchUpload}
          className="block w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 cursor-pointer"
        />
      </label>

      {/* Batch Grid */}
      {batchPhotos.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-black rounded-lg border border-zinc-800">
            {batchPhotos.map((item) => (
              <div key={item.id} className="relative group bg-zinc-900 rounded p-1.5 border border-zinc-800">
                <img src={item.previewUrl} alt="batch" className="w-full h-16 object-cover rounded" />
                <p className="text-[10px] text-zinc-300 truncate mt-1">{item.file.name}</p>
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-rose-600 text-white p-1 rounded hover:bg-rose-500"
                    title="Hapus"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={isProcessing}
            className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-extrabold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Mengunduh Foto Ke-{downloadedCount + 1} dari {batchPhotos.length}...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh Semua {batchPhotos.length} Foto Sekaligus</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
