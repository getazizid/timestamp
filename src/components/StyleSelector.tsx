import React, { useRef } from 'react';
import { Palette, Layout, Type, Upload, Check, Sliders, Shield } from 'lucide-react';
import { TimestampSettings, TemplateTheme, OverlayPosition, BgStyle, TextColorPreset } from '../types';

interface StyleSelectorProps {
  settings: TimestampSettings;
  onChange: (updated: Partial<TimestampSettings>) => void;
  onLogoUploaded: (logoUrl: string | null) => void;
}

const TEMPLATE_CARDS: { id: TemplateTheme; title: string; desc: string; icon: string }[] = [
  { id: 'gps-camera', title: 'GPS Map Camera', desc: 'Badge klasik GPS + Peta mini', icon: '📍' },
  { id: 'modern-minimal', title: 'Modern Clean', desc: 'Minimalis elegan tanpa sesak', icon: '✨' },
  { id: 'digital-clock', title: 'Retro Digicam', desc: 'Stempel Jam Digital Oranye (Kamera 90-an)', icon: '⏱️' },
  { id: 'project-field', title: 'Laporan Proyek PUPR', desc: 'Tabel resmi proyek & dinas', icon: '📋' },
  { id: 'security-patrol', title: 'Security Patrol', desc: 'Stempel verifikasi patroli keamanan', icon: '🛡️' },
  { id: 'twiboon-banner', title: 'Twiboon Frame', desc: 'Ribbon header & footer lengkap', icon: '🖼️' },
];

const POSITIONS: { id: OverlayPosition; label: string }[] = [
  { id: 'bottom-left', label: '↙ Kiri Bawah' },
  { id: 'bottom-right', label: '↘ Kanan Bawah' },
  { id: 'top-left', label: '↖ Kiri Atas' },
  { id: 'top-right', label: '↗ Kanan Atas' },
  { id: 'bottom-center', label: '⬇ Tengah Bawah' },
  { id: 'bottom-full-bar', label: '▬ Bar Bawah Penuh' },
];

const COLOR_PRESETS: { hex: TextColorPreset; name: string }[] = [
  { hex: '#FFD700', name: 'Kuning Kunyit (Populer)' },
  { hex: '#FF6B00', name: 'Digi Orange' },
  { hex: '#FFFFFF', name: 'Putih Bersih' },
  { hex: '#00FF66', name: 'Hijau Lime' },
  { hex: '#00E5FF', name: 'Sian Neon' },
  { hex: '#000000', name: 'Hitam Solid' },
];

const BG_STYLES: { id: BgStyle; name: string }[] = [
  { id: 'semi-dark', name: 'Transparan Gelap (60%)' },
  { id: 'solid-dark', name: 'Hitam Solid (90%)' },
  { id: 'glass', name: 'Efek Glassmorphism' },
  { id: 'none', name: 'Tanpa Background (Teks saja + Bayangan)' },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  settings,
  onChange,
  onLogoUploaded,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onLogoUploaded(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-zinc-300" />
          <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-400">4. Desain & Template Stempel Watermark</h2>
        </div>
      </div>

      {/* Template Theme Grid */}
      <div className="space-y-1.5">
        <label className="text-xs text-zinc-300 font-medium">Model / Gaya Stempel:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TEMPLATE_CARDS.map((tpl) => {
            const isSelected = settings.template === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onChange({ template: tpl.id })}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-white text-zinc-100 shadow-md ring-1 ring-white/50'
                    : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{tpl.icon}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="mt-1">
                  <p className="text-xs font-bold leading-tight">{tpl.title}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{tpl.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Position & Background Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
        <div>
          <label className="text-xs text-zinc-300 font-medium flex items-center gap-1 mb-1.5">
            <Layout className="w-3.5 h-3.5 text-zinc-400" />
            <span>Posisi Watermark Foto:</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {POSITIONS.map((pos) => {
              const isSelected = settings.position === pos.id;
              return (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => onChange({ position: pos.id })}
                  className={`text-[11px] p-2 rounded text-left transition-colors ${
                    isSelected
                      ? 'bg-white text-black font-bold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {pos.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-300 font-medium mb-1.5 block">
            Gaya Latar Belakang Kotak:
          </label>
          <div className="space-y-1.5">
            {BG_STYLES.map((bg) => {
              const isSelected = settings.bgStyle === bg.id;
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => onChange({ bgStyle: bg.id })}
                  className={`w-full text-left text-xs p-2 rounded flex items-center justify-between border transition-colors ${
                    isSelected
                      ? 'bg-zinc-800 border-zinc-700 text-white font-semibold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <span>{bg.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Color Preset & Mini Map Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
        <div>
          <label className="text-xs text-zinc-300 font-medium mb-1.5 block">
            Warna Teks Utama:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_PRESETS.map((c) => {
              const isSelected = settings.textColor === c.hex;
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onChange({ textColor: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform ${
                    isSelected ? 'border-white scale-110 shadow-lg' : 'border-zinc-800 opacity-80 hover:opacity-100'
                  }`}
                  title={c.name}
                >
                  {isSelected && (
                    <Check className={`w-4 h-4 ${c.hex === '#FFFFFF' || c.hex === '#FFD700' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-300 font-medium mb-1.5 block">
            Toggle Elemen Tambahan:
          </label>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showMiniMapBadge}
                onChange={(e) => onChange({ showMiniMapBadge: e.target.checked })}
                className="rounded border-zinc-800 text-white focus:ring-white bg-zinc-900"
              />
              <span>Tampilkan Mini Peta GPS (Jika Tanpa Logo)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showCoordinates}
                onChange={(e) => onChange({ showCoordinates: e.target.checked })}
                className="rounded border-zinc-800 text-white focus:ring-white bg-zinc-900"
              />
              <span>Tampilkan Koordinat Lat/Long</span>
            </label>
          </div>
        </div>
      </div>

      {/* Font Size Scaling & Font Family */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
        <div>
          <label className="text-xs text-zinc-300 font-medium flex items-center justify-between mb-1">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              Ukuran Tulisan Overlay:
            </span>
            <span className="font-mono text-zinc-200 font-bold">{Math.round(settings.fontSizeScale * 100)}%</span>
          </label>
          <input
            type="range"
            min="0.7"
            max="1.6"
            step="0.05"
            value={settings.fontSizeScale}
            onChange={(e) => onChange({ fontSizeScale: parseFloat(e.target.value) })}
            className="w-full accent-white"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-300 font-medium flex items-center gap-1 mb-1">
            <Type className="w-3.5 h-3.5 text-zinc-400" />
            <span>Jenis Huruf (Font):</span>
          </label>
          <select
            value={settings.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value as any })}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-2 focus:outline-none focus:border-white"
          >
            <option value="sans-serif">Sans-Serif (Standard Modern)</option>
            <option value="monospace">Monospace / Digicam (Kamera Digital)</option>
            <option value="digital">Digital Clock LED (Retro Consolas)</option>
            <option value="serif">Serif (Formal Classic)</option>
          </select>
        </div>
      </div>

      {/* Custom Logo Upload Panel */}
      <div className="pt-3 border-t border-zinc-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-200 font-bold flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-white" />
            <span>Form Upload Logo Custom (Sebelah Kiri Teks)</span>
          </label>
          {settings.logoUrl && (
            <button
              type="button"
              onClick={() => onLogoUploaded(null)}
              className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline font-semibold"
            >
              Hapus Logo
            </button>
          )}
        </div>

        <p className="text-[11px] text-zinc-400">
          Unggah logo instansi/sekolah/perusahaan Anda sendiri (format PNG, JPG, SVG). Logo akan otomatis dipasang di sebelah kiri teks timestamp.
        </p>

        <input
          type="file"
          ref={logoInputRef}
          accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
          onChange={handleLogoChange}
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="flex-1 py-2.5 px-3 border border-zinc-700 hover:border-white rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Pilih & Upload File Logo Anda</span>
          </button>

          <button
            type="button"
            onClick={() => onLogoUploaded('/sman1batu-logo.png')}
            className="py-2.5 px-3 border border-zinc-800 hover:border-zinc-700 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-xs text-zinc-300 font-medium transition-colors flex items-center justify-center gap-1.5"
            title="Gunakan Logo SMAN 1 Batu"
          >
            <img src="/sman1batu-logo.png" alt="SMAN 1 Batu" className="w-4 h-4 object-contain" />
            <span>Gunakan Preset SMAN 1 Batu</span>
          </button>
        </div>

        {settings.logoUrl && (
          <div className="flex items-center gap-3 bg-zinc-900/80 p-2.5 rounded-lg border border-emerald-500/30">
            <div className="w-10 h-10 rounded bg-black border border-zinc-800 p-1 flex items-center justify-center shrink-0">
              <img src={settings.logoUrl} alt="Logo overlay" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-emerald-400 font-bold truncate">✓ Logo Custom Aktif</p>
              <p className="text-[10px] text-zinc-400">Ditampilkan langsung di sudut watermark foto</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
