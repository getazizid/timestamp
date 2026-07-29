import { TimestampSettings } from '../types';

export interface RenderCanvasResult {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Draws a mini GPS map graphic on the canvas context as fallback
 */
function drawMiniMapGraphic(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.translate(x, y);

  // Map Background
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, 8);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = Math.max(1, size * 0.03);
  ctx.stroke();

  // Grid / Road lines
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.lineWidth = Math.max(1, size * 0.025);
  ctx.beginPath();
  ctx.moveTo(size * 0.1, size * 0.4);
  ctx.lineTo(size * 0.9, size * 0.4);
  ctx.moveTo(size * 0.4, size * 0.1);
  ctx.lineTo(size * 0.4, size * 0.9);
  ctx.stroke();

  // Route highlight
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)';
  ctx.lineWidth = Math.max(2, size * 0.045);
  ctx.beginPath();
  ctx.moveTo(size * 0.15, size * 0.8);
  ctx.quadraticCurveTo(size * 0.5, size * 0.5, size * 0.85, size * 0.2);
  ctx.stroke();

  // Center Pin
  const cx = size / 2;
  const cy = size / 2;
  
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.08, size * 0.14, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.08, size * 0.05, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Main rendering function that takes the HTMLImageElement and settings,
 * draws onto a high-res HTML5 Canvas, and returns dataUrl and Blob.
 */
export async function renderTimestampedCanvas(
  img: HTMLImageElement,
  settings: TimestampSettings,
  logoImg?: HTMLImageElement | null
): Promise<RenderCanvasResult> {
  const canvas = document.createElement('canvas');
  
  // Calculate orientation dimensions with rotation
  const isRotated90or270 = settings.rotation === 90 || settings.rotation === 270;
  const originalWidth = img.naturalWidth || img.width;
  const originalHeight = img.naturalHeight || img.height;

  const targetWidth = isRotated90or270 ? originalHeight : originalWidth;
  const targetHeight = isRotated90or270 ? originalWidth : originalHeight;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D Context initialization failed');

  ctx.save();

  // Handle Rotation and Flipping around center
  ctx.translate(targetWidth / 2, targetHeight / 2);
  
  if (settings.rotation !== 0) {
    ctx.rotate((settings.rotation * Math.PI) / 180);
  }
  
  if (settings.flipHorizontal) {
    ctx.scale(-1, 1);
  }

  // Draw the image centered
  ctx.drawImage(
    img,
    -originalWidth / 2,
    -originalHeight / 2,
    originalWidth,
    originalHeight
  );

  ctx.restore();

  // Base font size scaling relative to image dimension
  // Ensure overlay scales gracefully whether image is 800px or 4000px high resolution
  const minDim = Math.min(targetWidth, targetHeight);
  const baseFontSize = Math.max(14, Math.floor(minDim * 0.022 * settings.fontSizeScale));
  const padding = Math.max(16, Math.floor(minDim * 0.025));

  // Formatted date and time strings
  const [year, month, day] = settings.date.split('-');
  const formattedDate = settings.date ? `${day}/${month}/${year}` : '';
  const timeStr = settings.time || '';
  const tzStr = settings.timezone;
  const fullDateTime = `${formattedDate} ${timeStr} ${tzStr}`.trim();

  // Location strings
  const loc = settings.location;
  const addressText = loc.formattedAddress || `${loc.street}, ${loc.district}, ${loc.city}, ${loc.province}`;
  
  let coordText = '';
  if (settings.showCoordinates && loc.latitude !== null && loc.longitude !== null) {
    const latDir = loc.latitude >= 0 ? 'N' : 'S';
    const lngDir = loc.longitude >= 0 ? 'E' : 'W';
    const absLat = Math.abs(loc.latitude).toFixed(6);
    const absLng = Math.abs(loc.longitude).toFixed(6);
    const altStr = loc.altitude ? ` • Alt: ${loc.altitude}m` : '';
    coordText = `GPS: ${absLat}° ${latDir}, ${absLng}° ${lngDir}${altStr}`;
  }

  // Font family string
  let fontFamilyCSS = 'sans-serif';
  if (settings.fontFamily === 'monospace') fontFamilyCSS = '"Courier New", Courier, monospace';
  else if (settings.fontFamily === 'serif') fontFamilyCSS = 'Georgia, serif';
  else if (settings.fontFamily === 'digital') fontFamilyCSS = '"Consolas", "Courier New", monospace';

  // Apply Template Themes
  switch (settings.template) {
    case 'digital-clock': {
      // Retro Digicam Orange Stamp at bottom-right
      ctx.save();
      const digiFontSize = Math.max(20, Math.floor(minDim * 0.038 * settings.fontSizeScale));
      ctx.font = `bold ${digiFontSize}px ${fontFamilyCSS}`;
      
      const lines = [fullDateTime];
      if (loc.city) lines.push(`${loc.city}, ${loc.province}`);
      
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      
      let curY = targetHeight - padding;
      lines.reverse().forEach((line) => {
        // Shadow for glowing digital effect
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillText(line, targetWidth - padding + 2, curY + 2);

        ctx.fillStyle = settings.textColor || '#FF6B00'; // Digital orange default
        ctx.fillText(line, targetWidth - padding, curY);
        curY -= digiFontSize * 1.2;
      });
      ctx.restore();
      break;
    }

    case 'project-field': {
      // Official PUPR / Corporate Project Header Box
      ctx.save();
      const boxWidth = Math.min(targetWidth - padding * 2, Math.max(400, targetWidth * 0.65));
      const lineHeight = baseFontSize * 1.4;
      
      const contentLines: { label: string; value: string }[] = [];
      if (settings.projectName) contentLines.push({ label: 'PROYEK/KEGIATAN', value: settings.projectName });
      if (settings.officerName) contentLines.push({ label: 'PETUGAS/INSPEKTOR', value: settings.officerName });
      contentLines.push({ label: 'WAKTU DOKUMENTASI', value: fullDateTime });
      if (settings.showAddress) contentLines.push({ label: 'LOKASI LAPANGAN', value: addressText });
      if (coordText) contentLines.push({ label: 'KOORDINAT GPS', value: coordText });
      if (settings.weatherInfo) contentLines.push({ label: 'CUACA/SUHU', value: settings.weatherInfo });
      if (settings.customNotes) contentLines.push({ label: 'CATATAN', value: settings.customNotes });

      const headerHeight = baseFontSize * 1.8;
      const bodyHeight = contentLines.length * lineHeight + padding;
      const totalBoxHeight = headerHeight + bodyHeight;

      let boxX = padding;
      let boxY = targetHeight - totalBoxHeight - padding;
      if (settings.position.includes('top')) boxY = padding;
      if (settings.position.includes('right')) boxX = targetWidth - boxWidth - padding;

      // Draw Main Box Header
      ctx.fillStyle = '#1e3a8a'; // Navy Blue Header
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxWidth, headerHeight, [8, 8, 0, 0]);
      ctx.fill();

      // Header Text
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.floor(baseFontSize * 1.1)}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('📋 LAPORAN DOKUMENTASI LAPANGAN', boxX + 12, boxY + headerHeight / 2);

      // Draw Body Box
      ctx.fillStyle = settings.bgStyle === 'solid-dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY + headerHeight, boxWidth, bodyHeight, [0, 0, 8, 8]);
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Body Content
      ctx.font = `${baseFontSize}px ${fontFamilyCSS}`;
      let textY = boxY + headerHeight + padding / 1.5;

      contentLines.forEach((item) => {
        ctx.fillStyle = '#94a3b8'; // Label color
        ctx.font = `bold ${Math.floor(baseFontSize * 0.85)}px sans-serif`;
        ctx.fillText(item.label, boxX + 12, textY);

        ctx.fillStyle = settings.textColor || '#ffffff';
        ctx.font = `${baseFontSize}px ${fontFamilyCSS}`;
        
        // Wrap long values if needed
        const valX = boxX + 12;
        const maxValWidth = boxWidth - 24;
        textY += lineHeight * 0.7;

        // Simple text truncation/wrap for address
        let displayVal = item.value;
        if (ctx.measureText(displayVal).width > maxValWidth) {
          while (ctx.measureText(displayVal + '...').width > maxValWidth && displayVal.length > 5) {
            displayVal = displayVal.slice(0, -1);
          }
          displayVal += '...';
        }
        
        ctx.fillText(displayVal, valX, textY);
        textY += lineHeight * 0.9;
      });

      ctx.restore();
      break;
    }

    case 'twiboon-banner': {
      // Twiboon Header & Footer Frame Style
      ctx.save();
      const bannerHeight = Math.max(60, Math.floor(targetHeight * 0.1));
      
      // Top Banner
      const topGrad = ctx.createLinearGradient(0, 0, 0, bannerHeight);
      topGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      topGrad.addColorStop(1, 'rgba(15, 23, 42, 0.4)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, targetWidth, bannerHeight);

      // Top Title
      ctx.fillStyle = '#f59e0b';
      ctx.font = `bold ${Math.floor(baseFontSize * 1.3)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(settings.projectName || 'DOKUMENTASI KOTA & LOKASI INDONESIA', targetWidth / 2, bannerHeight * 0.4);

      // Bottom Banner
      const botGrad = ctx.createLinearGradient(0, targetHeight - bannerHeight, 0, targetHeight);
      botGrad.addColorStop(0, 'rgba(15, 23, 42, 0.4)');
      botGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, targetHeight - bannerHeight, targetWidth, bannerHeight);

      // Bottom Info
      ctx.fillStyle = settings.textColor || '#ffffff';
      ctx.font = `${baseFontSize}px ${fontFamilyCSS}`;
      ctx.fillText(`📍 ${addressText}`, targetWidth / 2, targetHeight - bannerHeight * 0.6);
      
      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold ${Math.floor(baseFontSize * 0.9)}px ${fontFamilyCSS}`;
      ctx.fillText(`🕒 ${fullDateTime} ${coordText ? '• ' + coordText : ''}`, targetWidth / 2, targetHeight - bannerHeight * 0.25);

      ctx.restore();
      break;
    }

    case 'gps-camera':
    case 'modern-minimal':
    case 'security-patrol':
    case 'compact-badge':
    default: {
      // Default GPS Map Camera badge style
      ctx.save();

      const lines: string[] = [];
      lines.push(fullDateTime);
      if (settings.showAddress && addressText) lines.push(addressText);
      if (coordText) lines.push(coordText);
      if (settings.weatherInfo) lines.push(`🌤️ ${settings.weatherInfo}`);
      if (settings.projectName) lines.push(`📌 ${settings.projectName}`);
      if (settings.officerName) lines.push(`👤 ${settings.officerName}`);
      if (settings.customNotes) lines.push(`📝 ${settings.customNotes}`);

      const logoBoxSize = logoImg ? Math.max(64, Math.floor(baseFontSize * 4.2)) : 0;
      const mapSize = (settings.showMiniMapBadge && !logoImg) ? Math.max(64, Math.floor(baseFontSize * 4.2)) : 0;
      const gap = Math.floor(baseFontSize * 0.8);
      const sideGraphicSize = Math.max(logoBoxSize, mapSize);

      // Measure max text width
      ctx.font = `bold ${baseFontSize}px ${fontFamilyCSS}`;
      let maxTextWidth = 0;
      lines.forEach((line) => {
        const w = ctx.measureText(line).width;
        if (w > maxTextWidth) maxTextWidth = w;
      });

      const maxAllowedWidth = targetWidth * 0.8;
      if (maxTextWidth > maxAllowedWidth) maxTextWidth = maxAllowedWidth;

      const badgeContentWidth = maxTextWidth + (sideGraphicSize ? sideGraphicSize + gap : 0);
      const badgeWidth = badgeContentWidth + padding * 2;
      const lineHeight = baseFontSize * 1.45;
      const textBlockHeight = lines.length * lineHeight;
      const badgeHeight = Math.max(textBlockHeight, sideGraphicSize) + padding * 1.5;

      // Position math
      let x = padding;
      let y = targetHeight - badgeHeight - padding;

      if (settings.position === 'bottom-right') {
        x = targetWidth - badgeWidth - padding;
      } else if (settings.position === 'top-left') {
        y = padding;
      } else if (settings.position === 'top-right') {
        x = targetWidth - badgeWidth - padding;
        y = padding;
      } else if (settings.position === 'bottom-center') {
        x = (targetWidth - badgeWidth) / 2;
      } else if (settings.position === 'bottom-full-bar') {
        x = 0;
        y = targetHeight - badgeHeight;
      }

      // Draw Background Box
      if (settings.bgStyle !== 'none') {
        ctx.fillStyle = 
          settings.bgStyle === 'solid-dark' ? 'rgba(0, 0, 0, 0.92)' :
          settings.bgStyle === 'glass' ? 'rgba(15, 23, 42, 0.78)' :
          'rgba(0, 0, 0, 0.68)';

        ctx.beginPath();
        if (settings.position === 'bottom-full-bar') {
          ctx.rect(0, y, targetWidth, badgeHeight);
        } else {
          ctx.roundRect(x, y, badgeWidth, badgeHeight, 12);
        }
        ctx.fill();

        ctx.strokeStyle = settings.template === 'security-patrol' ? '#e11d48' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      let currentDrawX = x + padding;

      // Render Uploaded Logo or Fallback Mini Map Graphic
      if (logoImg && logoBoxSize > 0) {
        const logoAspect = (logoImg.naturalWidth || logoImg.width) / (logoImg.naturalHeight || logoImg.height);
        let drawW = logoBoxSize;
        let drawH = logoBoxSize;
        if (logoAspect > 1) {
          drawH = logoBoxSize / logoAspect;
        } else {
          drawW = logoBoxSize * logoAspect;
        }
        const logoY = y + (badgeHeight - drawH) / 2;
        const logoX = currentDrawX + (logoBoxSize - drawW) / 2;
        ctx.drawImage(logoImg, logoX, logoY, drawW, drawH);
        currentDrawX += logoBoxSize + gap;
      } else if (settings.showMiniMapBadge && mapSize > 0) {
        const mapY = y + (badgeHeight - mapSize) / 2;
        drawMiniMapGraphic(ctx, currentDrawX, mapY, mapSize);
        currentDrawX += mapSize + gap;
      }

      // Security Patrol Header Badge
      if (settings.template === 'security-patrol') {
        ctx.fillStyle = '#f43f5e';
        ctx.font = `bold ${Math.floor(baseFontSize * 0.8)}px sans-serif`;
        ctx.fillText('🛡️ SECURITY PATROL VERIFIED', currentDrawX, y + padding * 0.8);
      }

      // Draw Lines
      let textY = y + (badgeHeight - textBlockHeight) / 2 + baseFontSize * 0.8;
      
      lines.forEach((line, idx) => {
        // Date/Time line uses highlight color
        if (idx === 0) {
          ctx.fillStyle = settings.textColor || '#FFD700'; // Gold/Yellow default for time
          ctx.font = `bold ${Math.floor(baseFontSize * 1.15)}px ${fontFamilyCSS}`;
        } else if (line.startsWith('GPS:')) {
          ctx.fillStyle = '#38bdf8'; // Sky blue for GPS
          ctx.font = `bold ${Math.floor(baseFontSize * 0.95)}px ${fontFamilyCSS}`;
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.font = `${baseFontSize}px ${fontFamilyCSS}`;
        }

        // Draw subtle drop shadow for maximum legibility on any background
        if (settings.bgStyle === 'none') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.fillText(line, currentDrawX + 1.5, textY + 1.5);
          ctx.fillStyle = idx === 0 ? (settings.textColor || '#FFD700') : '#ffffff';
        }

        ctx.fillText(line, currentDrawX, textY);
        textY += lineHeight;
      });

      ctx.restore();
      break;
    }
  }

  // Convert canvas to Data URL and Blob
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject('Blob creation failed')), 'image/jpeg', 0.95);
  });

  return {
    dataUrl,
    blob,
    width: targetWidth,
    height: targetHeight
  };
}
