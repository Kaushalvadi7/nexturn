import { createContext, useContext } from 'react';

export const ContactInfoContext = createContext({
  info: {
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    companyDescription: '',
    companyProfile: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    x: '',
    youtube: '',
  },
  hrefs: {
    mailto: '',
    tel: '',
    whatsapp: '',
    maps: '',
    mapEmbed: '',
    mapDirections: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    x: '',
    youtube: '',
    companyProfile: '',
  },
  isLoading: true,
  error: '',
  refresh: async () => {},
});

export const useContactInfo = () => useContext(ContactInfoContext);
export const DEFAULT_WHATSAPP_MESSAGE =
  'Hello, we are interested in your products and would appreciate more details. Please share the relevant information.';

export const buildMailto = (email) => {
  const value = String(email || '').trim();
  return value ? `mailto:${value}` : '';
};

export const buildTel = (phone) => {
  const value = String(phone || '').trim();
  if (!value) return '';
  const cleaned = value.replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : '';
};

export const buildWhatsApp = (whatsapp) => {
  const value = String(whatsapp || '').trim();
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`
    : '';
};

export const buildMaps = (location) => {
  const query = resolveMapQuery(location);
  return query ? `https://maps.google.com/?q=${encodeURIComponent(query)}` : '';
};

export const buildExternalUrl = (url) => {
  const value = String(url || '').trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

const extractLatLng = (value) => {
  const text = String(value || '');
  const match = text.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return '';
  return `${match[1]},${match[2]}`;
};

const extractGoogleUrlQuery = (value) => {
  const raw = String(value || '').trim();
  if (!raw || !/^https?:\/\//i.test(raw)) return '';

  try {
    const url = new URL(raw);
    const host = String(url.hostname || '').toLowerCase();
    const isGoogleMapsHost =
      host.includes('google.com') || host.includes('google.co') || host.includes('goo.gl');

    if (!isGoogleMapsHost) return '';

    const candidates = [
      url.searchParams.get('q'),
      url.searchParams.get('query'),
      url.searchParams.get('destination'),
      url.searchParams.get('ll'),
    ].filter(Boolean);

    if (candidates.length > 0) {
      return String(candidates[0]).trim();
    }

    const atMatch = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (atMatch) {
      return `${atMatch[1]},${atMatch[2]}`;
    }
  } catch {
    return '';
  }

  return '';
};

export const resolveMapQuery = (location) => {
  const value = String(location || '').trim();
  if (!value) return '';

  const fromGoogleUrl = extractGoogleUrlQuery(value);
  if (fromGoogleUrl) return fromGoogleUrl;

  const latLng = extractLatLng(value);
  if (latLng) return latLng;

  return value.replace(/\s+/g, ' ').trim();
};

export const buildMapEmbed = (location, zoom = 14) => {
  const query = resolveMapQuery(location);
  if (!query) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${encodeURIComponent(String(zoom))}&output=embed`;
};

export const buildMapDirections = (location) => {
  const query = resolveMapQuery(location);
  if (!query) return '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
};
