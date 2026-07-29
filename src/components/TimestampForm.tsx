import React from 'react';
import { Calendar, Clock, Briefcase, User, Sun, FileText, Sparkles } from 'lucide-react';
import { TimestampSettings } from '../types';

interface TimestampFormProps {
  settings: TimestampSettings;
  onChange: (updated: Partial<TimestampSettings>) => void;
  exifDateAvailable?: string; // YYYY-MM-DD
  exifTimeAvailable?: string; // HH:mm:ss
}

export const TimestampForm: React.FC<TimestampFormProps> = ({
  settings,
  onChange,
  exifDateAvailable,
  exifTimeAvailable,
}) => {
  const handleSetCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    onChange({
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}:${seconds}`,
    });
  };

  const handleApplyExifDateTime = () => {
    if (exifDateAvailable || exifTimeAvailable) {
      onChange({
        date: exifDateAvailable || settings.date,
        time: exifTimeAvailable || settings.time,
      });
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-300" />
          <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-400">3. Tanggal, Waktu & Informasi Lapangan</h2>
        </div>
        <div className="flex items-center gap-1.5">
          {exifDateAvailable && (
            <button
              type="button"
              onClick={handleApplyExifDateTime}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium bg-zinc-900 px-2 py-1 rounded border border-zinc-800 transition-colors"
              title="Gunakan Tanggal/Jam Asli saat Foto Diambil"
            >
              📷 EXIF Foto
            </button>
          )}
          <button
            type="button"
            onClick={handleSetCurrentTime}
            className="text-[11px] text-zinc-200 hover:text-white font-medium bg-zinc-900 px-2 py-1 rounded border border-zinc-800 transition-colors"
          >
            ⚡ Waktu Sekarang
          </button>
        </div>
      </div>

      {/* Date & Time Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="text-[11px] text-zinc-300 font-medium flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-zinc-400" />
            <span>Tanggal:</span>
          </label>
          <input
            type="date"
            value={settings.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-2 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="text-[11px] text-zinc-300 font-medium flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>Jam (HH:mm:ss):</span>
          </label>
          <input
            type="text"
            value={settings.time}
            onChange={(e) => onChange({ time: e.target.value })}
            placeholder="14:30:00"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-2 focus:outline-none focus:border-white font-mono"
          />
        </div>

        <div>
          <label className="text-[11px] text-zinc-300 font-medium mb-1 block">
            Zona Waktu:
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => onChange({ timezone: e.target.value as any })}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-2 focus:outline-none focus:border-white"
          >
            <option value="WIB">WIB (UTC+7 - Barat)</option>
            <option value="WITA">WITA (UTC+8 - Tengah)</option>
            <option value="WIT">WIT (UTC+9 - Timur)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>

      {/* Project & Officer Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-zinc-800/80">
        <div>
          <label className="text-[11px] text-zinc-300 font-medium flex items-center gap-1 mb-1">
            <Briefcase className="w-3 h-3 text-zinc-400" />
            <span>Nama Proyek / Instansi:</span>
          </label>
          <input
            type="text"
            value={settings.projectName}
            onChange={(e) => onChange({ projectName: e.target.value })}
            placeholder="Contoh: Proyek PUPR / PT ABC"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-2 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="text-[11px] text-zinc-300 font-medium flex items-center gap-1 mb-1">
            <User className="w-3 h-3 text-zinc-400" />
            <span>Petugas / Inspector ID:</span>
          </label>
          <input
            type="text"
            value={settings.officerName}
            onChange={(e) => onChange({ officerName: e.target.value })}
            placeholder="Contoh: Ahmad - Tim Lapangan"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-2 focus:outline-none focus:border-white"
          />
        </div>
      </div>

      {/* Weather & Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] text-zinc-300 font-medium flex items-center gap-1 mb-1">
            <Sun className="w-3 h-3 text-zinc-400" />
            <span>Info Cuaca / Suhu:</span>
          </label>
          <input
            type="text"
            value={settings.weatherInfo}
            onChange={(e) => onChange({ weatherInfo: e.target.value })}
            placeholder="Contoh: 31°C Cerah Berawan"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-2 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="text-[11px] text-zinc-300 font-medium flex items-center gap-1 mb-1">
            <FileText className="w-3 h-3 text-zinc-400" />
            <span>Catatan Lapangan:</span>
          </label>
          <input
            type="text"
            value={settings.customNotes}
            onChange={(e) => onChange({ customNotes: e.target.value })}
            placeholder="Contoh: Progres 80%"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-2 focus:outline-none focus:border-white"
          />
        </div>
      </div>
    </div>
  );
};
