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
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type LeafletIconPrototype = {
  _getIconUrl?: () => string;
};

const iconProto = L.Icon.Default.prototype as LeafletIconPrototype;

if (iconProto._getIconUrl) {
  delete iconProto._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Location = {
  city: string;
  country: string;
  users: number;
  lat: number;
  lng: number;
};

const locations: Location[] = [
  {
    city: 'Calgary',
    country: 'Canada',
    users: 18,
    lat: 51.0447,
    lng: -114.0719,
  },
  {
    city: 'São Paulo',
    country: 'Brazil',
    users: 18,
    lat: -23.5505,
    lng: -46.6333,
  },
  { city: 'Algiers', country: 'Algeria', users: 8, lat: 36.7538, lng: 3.0588 },
  { city: 'Shanghai', country: 'China', users: 6, lat: 31.2304, lng: 121.4737 },
  {
    city: 'Melbourne',
    country: 'Australia',
    users: 5,
    lat: -37.8136,
    lng: 144.9631,
  },
];

function MapControls() {
  const map = useMap();
  const targetButtonRef = useRef<HTMLButtonElement>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (targetButtonRef.current) {
      // Pulse animation for target button
      gsap.to(targetButtonRef.current, {
        scale: 1.1,
        duration: 1,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleRecenter = () => {
    setIsLocating(true);

    if (targetButtonRef.current) {
      gsap.to(targetButtonRef.current, {
        rotation: 360,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    map.flyTo([20, 0], 2, {
      duration: 1.5,
    });

    setTimeout(() => setIsLocating(false), 1500);
  };

  const handleExpand = () => {
    map.invalidateSize();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <button
        ref={targetButtonRef}
        onClick={handleRecenter}
        disabled={isLocating}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          border: 'none',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          cursor: isLocating ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          fontSize: '20px',
          color: '#374151',
        }}
        onMouseEnter={e => {
          if (!isLocating) {
            gsap.to(e.currentTarget, {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              y: -2,
              duration: 0.2,
            });
          }
        }}
        onMouseLeave={e => {
          if (!isLocating) {
            gsap.to(e.currentTarget, {
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              y: 0,
              duration: 0.2,
            });
          }
        }}
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
        onClick={handleZoomIn}
        style={{
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
          transition: 'all 0.2s',
          fontSize: '20px',
          fontWeight: '500',
          color: '#374151',
        }}
        onMouseEnter={e => {
          gsap.to(e.currentTarget, {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            y: -2,
            duration: 0.2,
          });
        }}
        onMouseLeave={e => {
          gsap.to(e.currentTarget, {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            y: 0,
            duration: 0.2,
          });
        }}
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
        onClick={handleZoomOut}
        style={{
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
          transition: 'all 0.2s',
          fontSize: '20px',
          fontWeight: '500',
          color: '#374151',
        }}
        onMouseEnter={e => {
          gsap.to(e.currentTarget, {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            y: -2,
            duration: 0.2,
          });
        }}
        onMouseLeave={e => {
          gsap.to(e.currentTarget, {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            y: 0,
            duration: 0.2,
          });
        }}
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
        onClick={handleExpand}
        style={{
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
          transition: 'all 0.2s',
          fontSize: '20px',
          color: '#374151',
        }}
        onMouseEnter={e => {
          gsap.to(e.currentTarget, {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            y: -2,
            duration: 0.2,
          });
        }}
        onMouseLeave={e => {
          gsap.to(e.currentTarget, {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            y: 0,
            duration: 0.2,
          });
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>
    </div>
  );
}

export default function Mapview() {
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-map-tiles {
        filter: brightness(1.1) contrast(0.9) saturate(0.3) hue-rotate(80deg) !important;
        opacity: 0.8 !important;
      }
      .leaflet-container {
        background: #c8ddd6 !important;
      }
      .leaflet-tile-pane {
        opacity: 0.7;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 12px !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
      }
      .leaflet-popup-tip {
        background: white !important;
      }
    `;
    document.head.appendChild(style);

    // Animate markers on mount
    markerRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(
          ref,
          {
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'back.out(1.7)',
          }
        );
      }
    });

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      className="w-full h-[620px] rounded-xl overflow-hidden relative"
      style={{
        background: '#d5e5e0',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        className="h-full w-full"
        scrollWheelZoom={true}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          className="custom-map-tiles"
        />

        <MapControls />

        {locations.map((loc, index) => (
          <CircleMarker
            key={loc.city}
            center={[loc.lat, loc.lng]}
            radius={Math.sqrt(loc.users) * 8}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.15,
              weight: 0,
            }}
            eventHandlers={{
              add: e => {
                const element = e.target.getElement();
                if (element) {
                  markerRefs.current[index] = element as HTMLDivElement;
                }
              },
              mouseover: e => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.3,
                });
              },
              mouseout: e => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.15,
                });
              },
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
                  {loc.city}, {loc.country}
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0,
                    fontWeight: '500',
                  }}
                >
                  {loc.users} Users
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
