import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PhotoUploader } from './components/PhotoUploader';
import { IndonesianLocationPicker } from './components/IndonesianLocationPicker';
import { TimestampForm } from './components/TimestampForm';
import { StyleSelector } from './components/StyleSelector';
import { CanvasPreview } from './components/CanvasPreview';
import { BatchProcessor } from './components/BatchProcessor';
import { HelpModal } from './components/HelpModal';
import { PhotoItem, TimestampSettings, ImageOrientation } from './types';
import { parsePhotoExif } from './utils/exifParser';
import { getRandomIndonesianAddress } from './data/indonesiaRegions';
import { SAMPLE_PHOTO_LIST, loadSamplePhotoAsFile } from './data/samplePhotos';

export default function App() {
  const [photo, setPhoto] = useState<PhotoItem | null>(null);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [isLoadingExif, setIsLoadingExif] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  // Default Timestamp Settings initialized for SMAN 1 Batu, Indonesia
  const [settings, setSettings] = useState<TimestampSettings>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}:${seconds}`,
      timezone: 'WIB',
      showSeconds: true,
      location: {
        province: 'Jawa Timur',
        city: 'Kota Batu',
        district: 'Kec. Batu',
        street: 'Jl. Ngaglik No. 1, SMAN 1 Batu',
        formattedAddress: 'Jl. Ngaglik No. 1, Kec. Batu, Kota Batu, Jawa Timur 65311',
        latitude: -7.870012,
        longitude: 112.527045,
        altitude: 880,
      },
      showCoordinates: true,
      showAddress: true,
      showMiniMapBadge: true,
      projectName: 'Dokumentasi SMAN 1 Batu',
      officerName: 'Tim SMAN 1 Batu',
      weatherInfo: '24°C Cerah Sejuk',
      customNotes: 'Kegiatan SMAN 1 Batu',
      template: 'gps-camera',
      position: 'bottom-left',
      textColor: '#FFD700',
      bgStyle: 'semi-dark',
      fontSizeScale: 1.0,
      fontFamily: 'sans-serif',
      logoUrl: '/sman1batu-logo.svg',
      rotation: 0,
      flipHorizontal: false,
    };
  });

  // Auto load initial logo on mount
  useEffect(() => {
    if (settings.logoUrl) {
      const img = new Image();
      img.src = settings.logoUrl;
      img.onload = () => {
        setLogoImg(img);
      };
    }
  }, []);

  // Load photo helper
  const handlePhotoSelected = async (file: File) => {
    setIsLoadingExif(true);

    const previewUrl = URL.createObjectURL(file);

    // Read Image Dimensions & Orientation
    const img = new Image();
    img.src = previewUrl;
    await new Promise((resolve) => (img.onload = resolve));

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const orientation: ImageOrientation =
      h > w * 1.1 ? 'portrait' : w > h * 1.1 ? 'landscape' : 'square';

    // Parse EXIF Metadata
    const exif = await parsePhotoExif(file);

    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      file,
      previewUrl,
      width: w,
      height: h,
      orientation,
      originalExif: {
        dateTime: exif.dateTime,
        latitude: exif.latitude,
        longitude: exif.longitude,
        altitude: exif.altitude,
        cameraModel: exif.cameraModel,
      },
    };

    setPhoto(newPhoto);

    // Auto update Date, Time, and GPS Coordinates if found in EXIF
    if (exif.hasExifData) {
      setSettings((prev) => ({
        ...prev,
        date: exif.dateOnly || prev.date,
        time: exif.timeOnly || prev.time,
        location: {
          ...prev.location,
          latitude: exif.latitude !== undefined ? exif.latitude : prev.location.latitude,
          longitude: exif.longitude !== undefined ? exif.longitude : prev.location.longitude,
          altitude: exif.altitude !== undefined ? exif.altitude : prev.location.altitude,
          formattedAddress:
            exif.latitude && exif.longitude
              ? `GPS (${exif.latitude}, ${exif.longitude}), ${prev.location.city}, Indonesia`
              : prev.location.formattedAddress,
        },
      }));
    }

    setIsLoadingExif(false);
  };

  // Auto load first sample photo on initial mount if no photo selected yet
  useEffect(() => {
    if (!photo) {
      loadSamplePhotoAsFile(SAMPLE_PHOTO_LIST[0]).then((file) => {
        handlePhotoSelected(file);
      });
    }
  }, []);

  const handleRotate = () => {
    setSettings((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const handleUpdateSettings = (updated: Partial<TimestampSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const handleLogoUploaded = (logoUrl: string | null) => {
    if (!logoUrl) {
      setLogoImg(null);
      setSettings((prev) => ({ ...prev, logoUrl: null }));
    } else {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => {
        setLogoImg(img);
        setSettings((prev) => ({ ...prev, logoUrl }));
      };
    }
  };

  const handleReset = () => {
    setPhoto(null);
    setSettings((prev) => ({
      ...prev,
      rotation: 0,
      flipHorizontal: false,
    }));
  };

  const handleOpenSamplePhotos = async () => {
    const randomSample = SAMPLE_PHOTO_LIST[Math.floor(Math.random() * SAMPLE_PHOTO_LIST.length)];
    const file = await loadSamplePhotoAsFile(randomSample);
    handlePhotoSelected(file);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <Navbar
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSamplePhotos={handleOpenSamplePhotos}
        onReset={handleReset}
        photoLoaded={Boolean(photo)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4">
        {/* Tab Selection */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'single'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              📷 Edit Stempel Foto
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'batch'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              📚 Mode Banyak Foto (Batch)
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Vercel Ready • 100% Client-Side Engine</span>
          </div>
        </div>

        {activeTab === 'single' ? (
          /* Two-Column Workspace Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Controls Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <PhotoUploader
                photo={photo}
                onPhotoSelected={handlePhotoSelected}
                onRotate={handleRotate}
                isLoadingExif={isLoadingExif}
              />

              <IndonesianLocationPicker
                location={settings.location}
                onChange={(loc) => handleUpdateSettings({ location: loc })}
              />

              <TimestampForm
                settings={settings}
                onChange={handleUpdateSettings}
                exifDateAvailable={photo?.originalExif?.dateTime?.split(' ')[0]}
                exifTimeAvailable={photo?.originalExif?.dateTime?.split(' ')[1]}
              />

              <StyleSelector
                settings={settings}
                onChange={handleUpdateSettings}
                onLogoUploaded={handleLogoUploaded}
              />
            </div>

            {/* Right Live Preview Column (7 cols) */}
            <div className="lg:col-span-7 lg:sticky lg:top-20">
              <CanvasPreview
                photo={photo}
                settings={settings}
                logoImg={logoImg}
                onRotate={handleRotate}
              />
            </div>
          </div>
        ) : (
          /* Batch Tab */
          <BatchProcessor
            settings={settings}
            logoImg={logoImg}
            onSelectPhotoToEdit={() => setActiveTab('single')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black text-zinc-500 py-4 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} TIMESTAMPR by Vercel • Client-Side Photo & GPS Timestamp</p>
          <p className="text-zinc-600 text-[11px]">
            Diproses 100% lokal di browser (Tanpa Database & Serverless)
          </p>
        </div>
      </footer>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
