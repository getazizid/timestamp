/**
 * Generates lightweight sample canvas images for testing landscape and portrait orientations
 */

function createSampleImageDataUrl(width: number, height: number, type: 'construction' | 'survey' | 'office' | 'outdoor'): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  if (type === 'construction') {
    grad.addColorStop(0, '#2d3748');
    grad.addColorStop(0.5, '#4a5568');
    grad.addColorStop(1, '#1a202c');
  } else if (type === 'survey') {
    grad.addColorStop(0, '#1b4332');
    grad.addColorStop(0.5, '#2d6a4f');
    grad.addColorStop(1, '#081c15');
  } else if (type === 'office') {
    grad.addColorStop(0, '#1e3a8a');
    grad.addColorStop(0.5, '#3b82f6');
    grad.addColorStop(1, '#1e1b4b');
  } else {
    grad.addColorStop(0, '#78350f');
    grad.addColorStop(0.5, '#d97706');
    grad.addColorStop(1, '#451a03');
  }
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative shapes simulating a real photo scene
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(
      (Math.sin(i * 1.5) * 0.4 + 0.5) * width,
      (Math.cos(i * 1.2) * 0.4 + 0.5) * height,
      width * 0.15 + i * 20,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  const step = Math.min(width, height) / 10;
  for (let x = 0; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Scene Center Emblem & Text
  ctx.save();
  ctx.translate(width / 2, height / 2);

  // Badge background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  const boxWidth = width * 0.65;
  const boxHeight = height * 0.25;
  ctx.roundRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.stroke();

  // Label Title
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const titleSize = Math.max(16, Math.floor(width * 0.035));
  ctx.font = `bold ${titleSize}px sans-serif`;
  const titles = {
    construction: '🏗️ Foto Lapangan Proyek Konstruksi',
    survey: '📍 Dokumentasi Survei Pemetaan GPS',
    office: '🏢 Foto Inspeksi & Verifikasi Instansi',
    outdoor: '🌅 Foto Kegiatan Lapangan Outdoor'
  };
  ctx.fillText(titles[type], 0, -titleSize * 0.8);

  // Subtitle
  const subSize = Math.max(12, Math.floor(width * 0.022));
  ctx.font = `${subSize}px sans-serif`;
  ctx.fillStyle = '#CBD5E1';
  ctx.fillText(`Resolusi Sample: ${width} x ${height} (${width > height ? 'Landscape' : 'Portrait'})`, 0, titleSize * 0.8);

  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.9);
}

export interface SamplePhotoOption {
  id: string;
  name: string;
  orientation: 'landscape' | 'portrait';
  width: number;
  height: number;
  type: 'construction' | 'survey' | 'office' | 'outdoor';
  description: string;
}

export const SAMPLE_PHOTO_LIST: SamplePhotoOption[] = [
  {
    id: 'sample-landscape-1',
    name: 'Proyek Lapangan (Landscape 16:9)',
    orientation: 'landscape',
    width: 1920,
    height: 1080,
    type: 'construction',
    description: 'Foto horisontal standar kamera & HP landscape'
  },
  {
    id: 'sample-portrait-1',
    name: 'Dokumentasi Survei (Portrait 9:16)',
    orientation: 'portrait',
    width: 1080,
    height: 1920,
    type: 'survey',
    description: 'Foto vertikal dari HP / Smartphone'
  },
  {
    id: 'sample-landscape-2',
    name: 'Inspeksi Instansi (Landscape 4:3)',
    orientation: 'landscape',
    width: 1600,
    height: 1200,
    type: 'office',
    description: 'Format foto rasio 4:3 standar kamera'
  },
  {
    id: 'sample-portrait-2',
    name: 'Kegiatan Outdoor (Portrait 3:4)',
    orientation: 'portrait',
    width: 1200,
    height: 1600,
    type: 'outdoor',
    description: 'Format foto portrait 3:4'
  }
];

export async function loadSamplePhotoAsFile(sample: SamplePhotoOption): Promise<File> {
  const dataUrl = createSampleImageDataUrl(sample.width, sample.height, sample.type);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], `sample_${sample.id}.jpg`, { type: 'image/jpeg' });
}
