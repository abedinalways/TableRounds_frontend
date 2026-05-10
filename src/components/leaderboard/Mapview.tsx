'use client';

import {
  MapContainer,
  Popup,
  CircleMarker,
  TileLayer,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Country } from 'country-state-city';
import { useGetMapDataQuery } from '@/app/redux/api/mapApi';

const iconProto = L.Icon.Default.prototype as { _getIconUrl?: () => string };
if (iconProto._getIconUrl) delete iconProto._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type ApiMapItem = {
  country: string;
  count: number | string;
};

type MappedLocation = {
  country: string;
  displayName: string;
  count: number;
  lat: number;
  lng: number;
};

type CountryLocation = {
  isoCode: string;
  name: string;
  lat: number;
  lng: number;
};

const normalizeCountryText = (value?: string | null) => {
  if (!value) return '';

  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const COUNTRY_ALIASES: Record<string, string> = {
  usa: 'US',
  america: 'US',
  'united states': 'US',
  'united states of america': 'US',

  uk: 'GB',
  'u k': 'GB',
  britain: 'GB',
  'great britain': 'GB',
  england: 'GB',
  'united kingdom': 'GB',

  uae: 'AE',
  emirates: 'AE',
  'united arab emirates': 'AE',

  korea: 'KR',
  'south korea': 'KR',
  'republic of korea': 'KR',
  'korea republic of': 'KR',
  'korea south': 'KR',

  'north korea': 'KP',
  'democratic peoples republic of korea': 'KP',

  russia: 'RU',
  vietnam: 'VN',
  'viet nam': 'VN',

  iran: 'IR',
  'iran islamic republic of': 'IR',

  syria: 'SY',
  'syrian arab republic': 'SY',

  tanzania: 'TZ',
  'tanzania united republic of': 'TZ',

  moldova: 'MD',
  'moldova republic of': 'MD',

  bolivia: 'BO',
  'bolivia plurinational state of': 'BO',

  venezuela: 'VE',
  'venezuela bolivarian republic of': 'VE',

  laos: 'LA',
  'lao peoples democratic republic': 'LA',

  brunei: 'BN',
  'brunei darussalam': 'BN',

  'czech republic': 'CZ',
  czechia: 'CZ',
};

const COUNTRY_INDEX: Record<string, CountryLocation> = (() => {
  const index: Record<string, CountryLocation> = {};

  Country.getAllCountries().forEach(country => {
    const lat = Number(country.latitude);
    const lng = Number(country.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const location: CountryLocation = {
      isoCode: country.isoCode,
      name: country.name,
      lat,
      lng,
    };

    index[normalizeCountryText(country.isoCode)] = location;
    index[normalizeCountryText(country.name)] = location;
  });

  Object.entries(COUNTRY_ALIASES).forEach(([alias, isoCode]) => {
    const country = Country.getCountryByCode(isoCode);

    if (!country) return;

    const lat = Number(country.latitude);
    const lng = Number(country.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    index[normalizeCountryText(alias)] = {
      isoCode: country.isoCode,
      name: country.name,
      lat,
      lng,
    };
  });

  return index;
})();

const resolveCountryLocation = (
  countryValue?: string | null,
): CountryLocation | null => {
  const normalizedCountry = normalizeCountryText(countryValue);

  if (!normalizedCountry) return null;

  const aliasIsoCode = COUNTRY_ALIASES[normalizedCountry];

  if (aliasIsoCode) {
    const country = Country.getCountryByCode(aliasIsoCode);

    if (!country) return null;

    const lat = Number(country.latitude);
    const lng = Number(country.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return {
      isoCode: country.isoCode,
      name: country.name,
      lat,
      lng,
    };
  }

  return COUNTRY_INDEX[normalizedCountry] ?? null;
};

function MapControls({
  onRefresh,
  isRefreshing,
}: {
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const map = useMap();
  const targetRef = useRef<HTMLButtonElement>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (targetRef.current) {
      gsap.to(targetRef.current, {
        scale: 1.1,
        duration: 1,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  const handleRecenter = () => {
    setIsLocating(true);

    if (targetRef.current) {
      gsap.to(targetRef.current, {
        rotation: 360,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    map.flyTo([20, 0], 2, { duration: 1.5 });
    setTimeout(() => setIsLocating(false), 1500);
  };

  const handleRefresh = () => {
    map.invalidateSize();
    onRefresh();
  };

  const buttonStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    border: 'none',
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#374151',
  };

  const handleHover = (
    e: React.MouseEvent<HTMLButtonElement>,
    isEnter: boolean,
  ) => {
    gsap.to(e.currentTarget, {
      boxShadow: isEnter
        ? '0 4px 12px rgba(0,0,0,0.15)'
        : '0 2px 8px rgba(0,0,0,0.1)',
      y: isEnter ? -2 : 0,
      duration: 0.2,
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <button
        ref={targetRef}
        onClick={handleRecenter}
        disabled={isLocating}
        title="Recenter map"
        style={{ ...buttonStyle, cursor: isLocating ? 'wait' : 'pointer' }}
        onMouseEnter={e => !isLocating && handleHover(e, true)}
        onMouseLeave={e => !isLocating && handleHover(e, false)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
        </svg>
      </button>

      <button
        onClick={() => map.zoomIn()}
        title="Zoom in"
        style={buttonStyle}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <button
        onClick={() => map.zoomOut()}
        title="Zoom out"
        style={buttonStyle}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Refresh map data"
        style={{
          ...buttonStyle,
          cursor: isRefreshing ? 'wait' : 'pointer',
          opacity: isRefreshing ? 0.7 : 1,
        }}
        onMouseEnter={e => !isRefreshing && handleHover(e, true)}
        onMouseLeave={e => !isRefreshing && handleHover(e, false)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 3v6h-6" />
        </svg>
      </button>
    </div>
  );
}

export default function Mapview() {
  const markerRefs = useRef<(SVGElement | null)[]>([]);

  const { data, isLoading, isFetching, refetch } = useGetMapDataQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const locations: MappedLocation[] = useMemo(() => {
    const groupedLocations = new Map<string, MappedLocation>();

    const apiItems = (data?.data ?? []) as ApiMapItem[];

    apiItems.forEach(item => {
      const resolvedCountry = resolveCountryLocation(item.country);

      if (!resolvedCountry) {
        console.warn('[Mapview] Unknown country value:', item.country);
        return;
      }

      const count = Number(item.count) || 0;
      const existingLocation = groupedLocations.get(resolvedCountry.isoCode);

      if (existingLocation) {
        existingLocation.count += count;
      } else {
        groupedLocations.set(resolvedCountry.isoCode, {
          country: resolvedCountry.isoCode,
          displayName: resolvedCountry.name,
          count,
          lat: resolvedCountry.lat,
          lng: resolvedCountry.lng,
        });
      }
    });

    return Array.from(groupedLocations.values());
  }, [data]);

  useEffect(() => {
    markerRefs.current = markerRefs.current.slice(0, locations.length);
  }, [locations.length]);

  useEffect(() => {
    const style = document.createElement('style');

    style.innerHTML = `
      .leaflet-container {
        background: #f5f7f6 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .leaflet-tile-pane {
        filter: brightness(1.05) saturate(0.85) hue-rotate(-5deg);
      }

      .leaflet-popup-content-wrapper {
        border-radius: 12px !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
        border: 1px solid rgba(0,0,0,0.05);
      }

      .leaflet-popup-tip {
        background: white !important;
      }
    `;

    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading && locations.length > 0) {
      markerRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(
            ref,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              delay: index * 0.15,
              ease: 'back.out(1.7)',
            },
          );
        }
      });
    }
  }, [isLoading, locations]);

  return (
    <div
      className="w-full h-[620px] rounded-xl overflow-hidden relative"
      style={{
        background: '#f5f7f6',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        className="h-full w-full relative"
        scrollWheelZoom={true}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap, &copy; CARTO"
        />

        <MapControls onRefresh={refetch} isRefreshing={isFetching} />

        {locations.map((loc, index) => (
          <CircleMarker
            key={loc.country}
            center={[loc.lat, loc.lng]}
            radius={Math.max(8, Math.min(45, Math.sqrt(loc.count) * 12))}
            pathOptions={{
              color: '#32CD32',
              fillColor: '#7FFF00',
              fillOpacity: 0.7,
              weight: 1,
            }}
            eventHandlers={{
              add: e => {
                markerRefs.current[index] = e.target.getElement() as SVGElement;
              },
              mouseover: e => e.target.setStyle({ fillOpacity: 0.3 }),
              mouseout: e => e.target.setStyle({ fillOpacity: 0.7 }),
            }}
          >
            <Popup>
              <div
                style={{
                  background: 'white',
                  padding: '14px 18px',
                  borderRadius: '8px',
                  minWidth: '160px',
                }}
              >
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 6px 0',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {loc.displayName}
                </p>

                <p
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0,
                    fontWeight: '500',
                  }}
                >
                  {loc.count} {loc.count === 1 ? 'User' : 'Users'}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
