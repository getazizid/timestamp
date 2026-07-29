import React from 'react';
import { X, CheckCircle, ShieldCheck, Zap, Server, Code, Sparkles, MapPin, Camera } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl text-zinc-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Panduan & Arsitektur Vercel (Tanpa Database)</h2>
              <p className="text-xs text-zinc-400">Cara kerja timestamp foto & deployment Vercel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Banner */}
        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4 flex items-start gap-3 text-emerald-300 text-xs leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-200 mb-0.5">100% Murni Client-Side & Privasi Terjamin</p>
            Aplikasi ini memproses semua foto secara lokal menggunakan <strong>HTML5 Canvas Engine</strong> langsung di browser perangkat Anda. Tidak ada foto yang diunggah ke server luar, dan tidak memerlukan database maupun backend khusus.
          </div>
        </div>

        {/* Features Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">✨ Fitur Utama Aplikasi:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Portrait & Landscape</p>
                <p className="text-zinc-400 text-[11px]">Mendukung foto HP tegak (9:16) maupun mendatar (16:9, 4:3).</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Lokasi Indonesia Lengkap</p>
                <p className="text-zinc-400 text-[11px]">Database preset 38 provinsi, kota, dan deteksi GPS HP otomatis.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Ekstrak EXIF Asli</p>
                <p className="text-zinc-400 text-[11px]">Otomatis membaca tanggal, jam & koordinat asli foto jika ada.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Template Stempel Variatif</p>
                <p className="text-zinc-400 text-[11px]">GPS Map Camera, Laporan PUPR/Proyek, Retro Digicam, Twiboon.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vercel Deploy Guide */}
        <div className="space-y-2 border-t border-zinc-800 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Server className="w-4 h-4" />
            <span>Cara Deploy ke Vercel (Gratis & Cepat):</span>
          </h3>
          <ol className="list-decimal list-inside text-xs text-zinc-300 space-y-1.5 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
            <li>Push repository ini ke akun <strong>GitHub</strong> Anda.</li>
            <li>Buka dashboard <strong>Vercel.com</strong> lalu klik <em>"Add New Project"</em>.</li>
            <li>Pilih repository GitHub Anda. Vercel akan otomatis mendeteksi framework <strong>Vite + React</strong>.</li>
            <li>Klik <strong>Deploy</strong>. Selesai dalam 30 detik tanpa perlu menyeting Database / Environment Variables backend!</li>
          </ol>
        </div>

        {/* Footer Close */}
        <div className="pt-2 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
