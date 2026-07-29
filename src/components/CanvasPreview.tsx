import React, { useEffect, useRef, useState } from 'react';
import { Download, Maximize2, Minimize2, Eye, EyeOff, RotateCw, Check, Sparkles, Copy } from 'lucide-react';
import { PhotoItem, TimestampSettings } from '../types';
import { renderTimestampedCanvas, RenderCanvasResult } from '../utils/canvasRenderer';

interface CanvasPreviewProps {
  photo: PhotoItem | null;
  settings: TimestampSettings;
  logoImg: HTMLImageElement | null;
  onRotate: () => void;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  photo,
  settings,
  logoImg,
  onRotate,
}) => {
  const [renderResult, setRenderResult] = useState<RenderCanvasResult | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [zoomFull, setZoomFull] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Re-render canvas whenever photo or settings change
  useEffect(() => {
    if (!photo) {
      setRenderResult(null);
      return;
    }

    let isMounted = true;
    setIsRendering(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photo.previewUrl;

    img.onload = async () => {
      try {
        const result = await renderTimestampedCanvas(img, settings, logoImg);
        if (isMounted) {
          setRenderResult(result);
          setIsRendering(false);
        }
      } catch (err) {
        console.error('Canvas render error:', err);
        if (isMounted) setIsRendering(false);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [photo, settings, logoImg]);

  const handleDownload = () => {
    if (!renderResult || !photo) return;

    // Construct filename from timestamp & city
    const dateStr = settings.date ? settings.date.replace(/-/g, '') : 'date';
    const cityClean = settings.location.city ? settings.location.city.replace(/[^a-zA-Z0-9]/g, '_') : 'Indonesia';
    const filename = `Timestamp_${dateStr}_${cityClean}.jpg`;

    const link = document.createElement('a');
    link.href = renderResult.dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopyToClipboard = async () => {
    if (!renderResult) return;
    try {
      const response = await fetch(renderResult.dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write warning:', err);
    }
  };

  if (!photo) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 h-full min-h-[420px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-400">
          <Sparkles className="w-8 h-8 text-zinc-300" />
        </div>
        <h3 className="text-base font-semibold text-zinc-200 mb-1">Preview Hasil Watermark Foto</h3>
        <p className="text-xs text-zinc-400 max-w-sm">
          Unggah foto atau pilih foto contoh di sebelah kiri untuk melihat hasil stempel lokasi dan waktu secara langsung.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col h-full space-y-3">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-300">Live Preview Canvas</h2>
          {renderResult && (
            <span className="text-[10px] text-zinc-400 font-mono bg-black px-2 py-0.5 rounded border border-zinc-800">
              {renderResult.width} × {renderResult.height} px
            </span>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
              showOriginal
                ? 'bg-white text-black font-bold'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
            title="Bandingkan Foto Asli vs Watermark"
          >
            {showOriginal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showOriginal ? 'Foto Asli' : 'Bandingkan'}</span>
          </button>

          <button
            type="button"
            onClick={onRotate}
            className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs transition-colors"
            title="Putar Foto 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setZoomFull(!zoomFull)}
            className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs transition-colors"
            title={zoomFull ? 'Fit ke Layar' : 'Zoom Full Resolusi'}
          >
            {zoomFull ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        className={`relative bg-black rounded-lg border border-zinc-800 overflow-auto flex items-center justify-center p-2 min-h-[380px] max-h-[600px] ${
          zoomFull ? 'cursor-grab' : ''
        }`}
      >
        {isRendering && (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center text-zinc-200 font-medium text-xs gap-2">
            <span className="animate-spin">⌛</span> Rendering stempel resolusi tinggi...
          </div>
        )}

        {showOriginal ? (
          <img
            src={photo.previewUrl}
            alt="Original"
            className={`object-contain rounded transition-all ${
              zoomFull ? 'max-w-none' : 'max-w-full max-h-[520px]'
            }`}
          />
        ) : renderResult ? (
          <img
            src={renderResult.dataUrl}
            alt="Timestamped result"
            className={`object-contain rounded shadow-2xl ring-1 ring-zinc-800 transition-all ${
              zoomFull ? 'max-w-none' : 'max-w-full max-h-[520px]'
            }`}
          />
        ) : null}
      </div>

      {/* Primary Download Action Bar */}
      <div className="pt-2 border-t border-zinc-800 space-y-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!renderResult || isRendering}
          className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
            downloadSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-white hover:bg-zinc-200 text-black shadow-zinc-900/50'
          } disabled:opacity-50`}
        >
          {downloadSuccess ? (
            <>
              <Check className="w-5 h-5" />
              <span>Foto Berhasil Diunduh!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>SIMPAN FOTO KE LOKAL (DOWNLOAD)</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span className="flex items-center gap-1 text-[11px]">
            🔒 100% Client-Side Mode (Tanpa Database)
          </span>

          <button
            type="button"
            onClick={handleCopyToClipboard}
            className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors text-[11px]"
            title="Salin Foto ke Clipboard"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Tersalin!' : 'Copy Foto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
