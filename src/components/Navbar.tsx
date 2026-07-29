import React from 'react';
import { Camera, ShieldCheck, Zap, HelpCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  onOpenHelp: () => void;
  onOpenSamplePhotos: () => void;
  onReset: () => void;
  photoLoaded: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHelp,
  onOpenSamplePhotos,
  onReset,
  photoLoaded
}) => {
  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800 text-white px-4 sm:px-8 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center p-0.5 shadow-sm">
            <img src="/sman1batu-logo.svg" alt="SMAN 1 Batu Logo" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                SMAN 1 BATU <span className="text-zinc-500 font-normal text-xs sm:text-sm">Camera Timestamp</span>
              </h1>
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" /> SMAN 1 Batu Verified
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block">
              Stempel Waktu, Tanggal & Lokasi Foto Dokumentasi SMAN 1 Batu
            </p>
          </div>
        </div>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenSamplePhotos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors"
            title="Coba dengan Foto Contoh"
          >
            <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>Foto Contoh</span>
          </button>

          {photoLoaded && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-medium transition-colors"
              title="Reset Foto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Reset</span>
            </button>
          )}

          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-bold text-xs transition-colors shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Panduan Vercel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
