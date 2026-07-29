import React, { useState } from 'react';
import { MapPin, Navigation, Search, Building2, Compass, Check } from 'lucide-react';
import { LocationData } from '../types';
import { INDONESIAN_REGIONS, getRandomIndonesianAddress } from '../data/indonesiaRegions';

interface IndonesianLocationPickerProps {
  location: LocationData;
  onChange: (updatedLoc: LocationData) => void;
}

export const IndonesianLocationPicker: React.FC<IndonesianLocationPickerProps> = ({
  location,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Filter regions
  const filteredRegions = INDONESIAN_REGIONS.filter(
    (reg) =>
      reg.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.city.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

  const handleSelectRegion = (reg: typeof INDONESIAN_REGIONS[0]) => {
    const updated: LocationData = {
      ...location,
      province: reg.province,
      city: reg.city,
      latitude: reg.lat,
      longitude: reg.lng,
      formattedAddress: `${location.street || 'Jl. Utama'}, ${location.district || 'Kec. Kota'}, ${reg.city}, ${reg.province}, Indonesia`
    };
    onChange(updated);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Browser Anda tidak mendukung fitur lokasi GPS');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        const alt = pos.coords.altitude ? Math.round(pos.coords.altitude) : null;

        // Auto format location string
        const updated: LocationData = {
          ...location,
          latitude: lat,
          longitude: lng,
          altitude: alt,
          formattedAddress: location.formattedAddress || `GPS (${lat}, ${lng}), Indonesia`
        };
        onChange(updated);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoError('Akses GPS ditolak atau tidak ditemukan. Menggunakan preset lokasi.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleRandomizeLocation = () => {
    const random = getRandomIndonesianAddress();
    onChange({
      province: random.province,
      city: random.city,
      district: random.district,
      street: random.street,
      formattedAddress: random.formattedAddress,
      latitude: random.lat,
      longitude: random.lng,
      altitude: Math.floor(Math.random() * 80) + 10
    });
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-400">2. Lokasi Indonesia (GPS)</h2>
        </div>
        <button
          onClick={handleRandomizeLocation}
          className="text-[11px] text-zinc-300 hover:text-white font-medium bg-zinc-900 hover:bg-zinc-800 px-2 py-1 rounded border border-zinc-800 transition-colors"
          title="Pilih Acak Kota Indonesia"
        >
          🎲 Acak Lokasi
        </button>
      </div>

      {/* GPS Device Location Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-zinc-100 hover:bg-white text-black rounded-lg text-xs font-bold shadow transition-colors disabled:opacity-50"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Mendeteksi Koordinat GPS...' : '📍 Deteksi GPS Saya'}</span>
        </button>
      </div>

      {geoError && (
        <p className="text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-800/50">
          ⚠️ {geoError}
        </p>
      )}

      {/* Region Preset Quick Search */}
      <div className="space-y-1.5">
        <label className="text-xs text-zinc-300 font-medium flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-zinc-400" />
          <span>Cari Kota / Provinsi Indonesia:</span>
        </label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bandung, Jakarta, IKN, Surabaya, Medan..."
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-white"
          />
        </div>

        {/* Region Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1 max-h-28 overflow-y-auto pr-1">
          {filteredRegions.map((reg) => {
            const isSelected = location.city === reg.city;
            return (
              <button
                key={`${reg.province}-${reg.city}`}
                type="button"
                onClick={() => handleSelectRegion(reg)}
                className={`text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors ${
                  isSelected
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{reg.city}</span>
                <span className="opacity-60 text-[9px]">({reg.province})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Address Editable String */}
      <div className="space-y-1">
        <label className="text-xs text-zinc-300 font-medium">Format Alamat Lengkap Overlay:</label>
        <textarea
          rows={2}
          value={location.formattedAddress}
          onChange={(e) => onChange({ ...location, formattedAddress: e.target.value })}
          placeholder="Tulis alamat lengkap (misal: Jl. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan)"
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-2 focus:outline-none focus:border-white"
        />
      </div>

      {/* Lat & Long Coordinate manual fields */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/80">
        <div>
          <label className="text-[10px] text-zinc-400 font-mono">Latitude (Garis Lintang):</label>
          <input
            type="number"
            step="0.000001"
            value={location.latitude ?? ''}
            onChange={(e) =>
              onChange({
                ...location,
                latitude: e.target.value ? parseFloat(e.target.value) : null
              })
            }
            placeholder="-6.208800"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded p-1.5 font-mono focus:outline-none focus:border-white"
          />
        </div>
        <div>
          <label className="text-[10px] text-zinc-400 font-mono">Longitude (Garis Bujur):</label>
          <input
            type="number"
            step="0.000001"
            value={location.longitude ?? ''}
            onChange={(e) =>
              onChange({
                ...location,
                longitude: e.target.value ? parseFloat(e.target.value) : null
              })
            }
            placeholder="106.845600"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded p-1.5 font-mono focus:outline-none focus:border-white"
          />
        </div>
      </div>
    </div>
  );
};
