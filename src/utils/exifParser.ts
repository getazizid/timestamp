import exifr from 'exifr';

export interface ExtractedExifData {
  dateTime?: string; // YYYY-MM-DD HH:mm:ss
  dateOnly?: string; // YYYY-MM-DD
  timeOnly?: string; // HH:mm:ss
  latitude?: number;
  longitude?: number;
  altitude?: number;
  cameraModel?: string;
  hasExifData: boolean;
}

export async function parsePhotoExif(file: File): Promise<ExtractedExifData> {
  try {
    const exif = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      reviveValues: true,
    });

    if (!exif) {
      return { hasExifData: false };
    }

    let dateTimeStr: string | undefined;
    let dateOnly: string | undefined;
    let timeOnly: string | undefined;

    const rawDate = exif.DateTimeOriginal || exif.CreateDate || exif.ModifyDate;
    if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
      const year = rawDate.getFullYear();
      const month = String(rawDate.getMonth() + 1).padStart(2, '0');
      const day = String(rawDate.getDate()).padStart(2, '0');
      const hours = String(rawDate.getHours()).padStart(2, '0');
      const minutes = String(rawDate.getMinutes()).padStart(2, '0');
      const seconds = String(rawDate.getSeconds()).padStart(2, '0');

      dateOnly = `${year}-${month}-${day}`;
      timeOnly = `${hours}:${minutes}:${seconds}`;
      dateTimeStr = `${dateOnly} ${timeOnly}`;
    }

    const latitude = typeof exif.latitude === 'number' ? parseFloat(exif.latitude.toFixed(6)) : undefined;
    const longitude = typeof exif.longitude === 'number' ? parseFloat(exif.longitude.toFixed(6)) : undefined;
    const altitude = typeof exif.GPSAltitude === 'number' ? Math.round(exif.GPSAltitude) : undefined;
    const cameraModel = [exif.Make, exif.Model].filter(Boolean).join(' ');

    return {
      dateTime: dateTimeStr,
      dateOnly,
      timeOnly,
      latitude,
      longitude,
      altitude,
      cameraModel: cameraModel || undefined,
      hasExifData: Boolean(dateTimeStr || latitude || cameraModel)
    };
  } catch (err) {
    console.warn('EXIF Parsing warning:', err);
    return { hasExifData: false };
  }
}
