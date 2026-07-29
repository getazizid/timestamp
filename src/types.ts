export type ImageOrientation = 'portrait' | 'landscape' | 'square';

export type OverlayPosition = 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-center' 
  | 'bottom-full-bar';

export type TemplateTheme = 
  | 'gps-camera'        // Classic GPS Map Camera style with mini coordinates badge
  | 'modern-minimal'    // Clean modern typography, subtle dark background
  | 'digital-clock'     // Nostalgic retro LED camera clock (Orange/Yellow digital text)
  | 'project-field'     // Official work report / PUPR / Dinas structured table box
  | 'security-patrol'   // Security / Presisi patrol verification stamp style
  | 'twiboon-banner'    // Top/Bottom header frame with custom title/slogan
  | 'compact-badge';    // Small pill-shaped floating badge

export type TextColorPreset = 
  | '#FFFFFF' // White
  | '#FFD700' // Gold / Yellow
  | '#FF6B00' // Digital Orange
  | '#00FF66' // Neon Lime
  | '#00E5FF' // Cyan
  | '#000000'; // Black

export type BgStyle = 
  | 'semi-dark'       // 60% opacity dark gray box
  | 'solid-dark'      // 90% opacity solid black box
  | 'glass'           // Subtle gradient glassmorphism
  | 'gradient-bottom' // Smooth fade gradient at bottom of photo
  | 'none';           // No background, text shadow only

export interface LocationData {
  province: string;
  city: string;
  district: string;
  village?: string;
  street: string;
  formattedAddress: string;
  latitude: number | null;
  longitude: number | null;
  altitude?: number | null;
}

export interface TimestampSettings {
  // Date & Time
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  timezone: 'WIB' | 'WITA' | 'WIT' | 'UTC';
  showSeconds: boolean;
  
  // Location
  location: LocationData;
  showCoordinates: boolean;
  showAddress: boolean;
  showMiniMapBadge: boolean;
  
  // Extra Info
  projectName: string;
  officerName: string;
  weatherInfo: string;
  customNotes: string;
  
  // Styling
  template: TemplateTheme;
  position: OverlayPosition;
  textColor: string;
  bgStyle: BgStyle;
  fontSizeScale: number; // 0.7 to 1.5
  fontFamily: 'monospace' | 'sans-serif' | 'serif' | 'digital';
  logoUrl?: string | null;
  
  // Image Transformations
  rotation: number; // 0, 90, 180, 270
  flipHorizontal: boolean;
}

export interface PhotoItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  orientation: ImageOrientation;
  originalExif?: {
    dateTime?: string;
    latitude?: number;
    longitude?: number;
    altitude?: number;
    cameraModel?: string;
  };
}

export interface IndonesianRegion {
  province: string;
  city: string;
  lat: number;
  lng: number;
}
