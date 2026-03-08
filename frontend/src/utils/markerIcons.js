/**
 * Leaflet marker icon factories. Single Responsibility: icon creation.
 */
import L from 'leaflet';

/** @param {string} color - Hex color. @param {number} size - Icon size in px. */
export function createColoredIcon(color, size = 36) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="${size}" height="${size * 1.5}">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5" fill="#fff" opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size * 1.5],
    iconAnchor: [size / 2, size * 1.5],
    popupAnchor: [0, -size * 1.2],
  });
}

export const MARKER_ICONS = {
  myOrg: createColoredIcon('#F59E0B', 38),
  dealPartner: createColoredIcon('#2364AA', 32),
  matchOrigin: createColoredIcon('#10B981', 38),
  matchResult: createColoredIcon('#2364AA', 32),
  organisation: createColoredIcon('#EA7317', 28),
};
