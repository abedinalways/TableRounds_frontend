// 'use client';

// import {
//   MapContainer,
//   Popup,
//   CircleMarker,
//   TileLayer,
//   useMap,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { useEffect, useRef, useState } from 'react';
// import gsap from 'gsap';
// import Image from 'next/image';

// const iconProto = L.Icon.Default.prototype as { _getIconUrl?: () => string };
// if (iconProto._getIconUrl) delete iconProto._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });

// type Location = {
//   city: string;
//   country: string;
//   users: number;
//   lat: number;
//   lng: number;
// };

// const locations: Location[] = [
//   {
//     city: 'Calgary',
//     country: 'Canada',
//     users: 18,
//     lat: 51.0447,
//     lng: -114.0719,
//   },
//   {
//     city: 'São Paulo',
//     country: 'Brazil',
//     users: 18,
//     lat: -23.5505,
//     lng: -46.6333,
//   },
//   { city: 'Algiers', country: 'Algeria', users: 8, lat: 36.7538, lng: 3.0588 },
//   { city: 'Shanghai', country: 'China', users: 6, lat: 31.2304, lng: 121.4737 },
//   {
//     city: 'Melbourne',
//     country: 'Australia',
//     users: 5,
//     lat: -37.8136,
//     lng: 144.9631,
//   },
// ];

// function MapControls() {
//   const map = useMap();
//   const targetRef = useRef<HTMLButtonElement>(null);
//   const [isLocating, setIsLocating] = useState(false);

//   useEffect(() => {
//     if (targetRef.current) {
//       gsap.to(targetRef.current, {
//         scale: 1.1,
//         duration: 1,
//         ease: 'power1.inOut',
//         repeat: -1,
//         yoyo: true,
//       });
//     }
//   }, []);

//   const handleRecenter = () => {
//     setIsLocating(true);
//     if (targetRef.current) {
//       gsap.to(targetRef.current, {
//         rotation: 360,
//         duration: 0.6,
//         ease: 'power2.out',
//       });
//     }
//     map.flyTo([20, 0], 2, { duration: 1.5 });
//     setTimeout(() => setIsLocating(false), 1500);
//   };

//   const buttonStyle = {
//     width: '44px',
//     height: '44px',
//     borderRadius: '10px',
//     border: 'none',
//     background: 'white',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: '#374151',
//   };

//   const handleHover = (
//     e: React.MouseEvent<HTMLButtonElement>,
//     isEnter: boolean
//   ) => {
//     gsap.to(e.currentTarget, {
//       boxShadow: isEnter
//         ? '0 4px 12px rgba(0,0,0,0.15)'
//         : '0 2px 8px rgba(0,0,0,0.1)',
//       y: isEnter ? -2 : 0,
//       duration: 0.2,
//     });
//   };

//   return (
//     <div
//       style={{
//         position: 'absolute',
//         top: '16px',
//         left: '16px',
//         zIndex: 500,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '8px',
//       }}
//       className=""
//     >
//       <button
//         ref={targetRef}
//         onClick={handleRecenter}
//         disabled={isLocating}
//         style={{ ...buttonStyle, cursor: isLocating ? 'wait' : 'pointer' }}
//         onMouseEnter={e => !isLocating && handleHover(e, true)}
//         onMouseLeave={e => !isLocating && handleHover(e, false)}
//       >
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <circle cx="12" cy="12" r="3" />
//           <circle cx="12" cy="12" r="10" />
//           <line x1="12" y1="2" x2="12" y2="4" />
//           <line x1="12" y1="20" x2="12" y2="22" />
//           <line x1="2" y1="12" x2="4" y2="12" />
//           <line x1="20" y1="12" x2="22" y2="12" />
//         </svg>
//       </button>

//       <button
//         onClick={() => map.zoomIn()}
//         style={buttonStyle}
//         onMouseEnter={e => handleHover(e, true)}
//         onMouseLeave={e => handleHover(e, false)}
//       >
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <circle cx="11" cy="11" r="8" />
//           <path d="m21 21-4.35-4.35" />
//           <line x1="11" y1="8" x2="11" y2="14" />
//           <line x1="8" y1="11" x2="14" y2="11" />
//         </svg>
//       </button>

//       <button
//         onClick={() => map.zoomOut()}
//         style={buttonStyle}
//         onMouseEnter={e => handleHover(e, true)}
//         onMouseLeave={e => handleHover(e, false)}
//       >
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <circle cx="11" cy="11" r="8" />
//           <path d="m21 21-4.35-4.35" />
//           <line x1="8" y1="11" x2="14" y2="11" />
//         </svg>
//       </button>

//       <button
//         onClick={() => map.invalidateSize()}
//         style={buttonStyle}
//         onMouseEnter={e => handleHover(e, true)}
//         onMouseLeave={e => handleHover(e, false)}
//       >
//         <svg
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
//         </svg>
//       </button>
//     </div>
//   );
// }

// export default function Mapview() {
//   const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     const style = document.createElement('style');
//     style.innerHTML = `
//     .leaflet-container {
//       background: #f5f7f6 !important;
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//     }
//     .leaflet-tile-pane {
//       filter: brightness(1.05) saturate(0.85) hue-rotate(-5deg);
//     }
//     .leaflet-popup-content-wrapper {
//       border-radius: 12px !important;
//       box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
//       border: 1px solid rgba(0,0,0,0.05);
//     }
//     .leaflet-popup-tip {
//       background: white !important;
//     }
//   `;
//     document.head.appendChild(style);

//     markerRefs.current.forEach((ref, index) => {
//       if (ref) {
//         gsap.fromTo(
//           ref,
//           { scale: 0, opacity: 0 },
//           {
//             scale: 1,
//             opacity: 1,
//             duration: 0.6,
//             delay: index * 0.15,
//             ease: 'back.out(1.7)',
//           }
//         );
//       }
//     });

//     // Proper cleanup: return a function that returns void
//     return () => {
//       if (document.head.contains(style)) {
//         document.head.removeChild(style);
//       }
//     };
//   }, []);

//   return (
//     <div
//       className="w-full h-[620px] rounded-xl overflow-hidden relative "
//       style={{
//         background: '#f5f7f6',
//         boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
//       }}
//     >
//       <MapContainer
//         center={[20, 0]}
//         zoom={2}
//         minZoom={2}
//         maxZoom={6}
//         className="h-full w-full relative "
//         scrollWheelZoom={true}
//         attributionControl={false}
//         zoomControl={false}
//       >
//         <TileLayer
//           url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
//           attribution="&copy; OpenStreetMap, &copy; CARTO"
//         />

//         <MapControls />

//         {locations.map((loc, index) => (
//           <CircleMarker
//             key={loc.city}
//             center={[loc.lat, loc.lng]}
//             radius={Math.sqrt(loc.users) * 8}
//             pathOptions={{
//               color: '#10b981',
//               fillColor: '#10b981',
//               fillOpacity: 0.15,
//               weight: 0,
//             }}
//             eventHandlers={{
//               add: e => {
//                 markerRefs.current[index] =
//                   e.target.getElement() as HTMLDivElement;
//               },
//               mouseover: e => e.target.setStyle({ fillOpacity: 0.3 }),
//               mouseout: e => e.target.setStyle({ fillOpacity: 0.15 }),
//             }}
//           >
//             <Popup>
//               <div
//                 style={{
//                   background: 'white',
//                   padding: '14px 18px',
//                   borderRadius: '8px',
//                   minWidth: '160px',
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: '15px',
//                     fontWeight: '600',
//                     color: '#1f2937',
//                     margin: '0 0 6px 0',
//                     letterSpacing: '-0.01em',
//                   }}
//                 >
//                   {loc.city}, {loc.country}
//                 </p>
//                 <p
//                   style={{
//                     fontSize: '13px',
//                     color: '#6b7280',
//                     margin: 0,
//                     fontWeight: '500',
//                   }}
//                 >
//                   {loc.users} Users
//                 </p>
//               </div>
//             </Popup>
//           </CircleMarker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }

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
import { useGetMapDataQuery } from '@/app/redux/api/mapApi';


const iconProto = L.Icon.Default.prototype as { _getIconUrl?: () => string };
if (iconProto._getIconUrl) delete iconProto._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Country name/code → { lat, lng, displayName } lookup
const COUNTRY_COORDS: Record<
  string,
  { lat: number; lng: number; displayName: string }
> = {
  // Common country codes
  AF: { lat: 33.9391, lng: 67.71, displayName: 'Afghanistan' },
  AL: { lat: 41.1533, lng: 20.1683, displayName: 'Albania' },
  DZ: { lat: 28.0339, lng: 1.6596, displayName: 'Algeria' },
  AR: { lat: -38.4161, lng: -63.6167, displayName: 'Argentina' },
  AU: { lat: -25.2744, lng: 133.7751, displayName: 'Australia' },
  AT: { lat: 47.5162, lng: 14.5501, displayName: 'Austria' },
  BD: { lat: 23.685, lng: 90.3563, displayName: 'Bangladesh' },
  BE: { lat: 50.5039, lng: 4.4699, displayName: 'Belgium' },
  BR: { lat: -14.235, lng: -51.9253, displayName: 'Brazil' },
  CA: { lat: 56.1304, lng: -106.3468, displayName: 'Canada' },
  CL: { lat: -35.6751, lng: -71.543, displayName: 'Chile' },
  CN: { lat: 35.8617, lng: 104.1954, displayName: 'China' },
  CO: { lat: 4.5709, lng: -74.2973, displayName: 'Colombia' },
  HR: { lat: 45.1, lng: 15.2, displayName: 'Croatia' },
  CZ: { lat: 49.8175, lng: 15.473, displayName: 'Czech Republic' },
  DK: { lat: 56.2639, lng: 9.5018, displayName: 'Denmark' },
  EG: { lat: 26.8206, lng: 30.8025, displayName: 'Egypt' },
  FI: { lat: 61.9241, lng: 25.7482, displayName: 'Finland' },
  FR: { lat: 46.2276, lng: 2.2137, displayName: 'France' },
  DE: { lat: 51.1657, lng: 10.4515, displayName: 'Germany' },
  GH: { lat: 7.9465, lng: -1.0232, displayName: 'Ghana' },
  GR: { lat: 39.0742, lng: 21.8243, displayName: 'Greece' },
  HU: { lat: 47.1625, lng: 19.5033, displayName: 'Hungary' },
  IN: { lat: 20.5937, lng: 78.9629, displayName: 'India' },
  ID: { lat: -0.7893, lng: 113.9213, displayName: 'Indonesia' },
  IE: { lat: 53.4129, lng: -8.2439, displayName: 'Ireland' },
  IL: { lat: 31.0461, lng: 34.8516, displayName: 'Israel' },
  IT: { lat: 41.8719, lng: 12.5674, displayName: 'Italy' },
  JP: { lat: 36.2048, lng: 138.2529, displayName: 'Japan' },
  KE: { lat: -0.0236, lng: 37.9062, displayName: 'Kenya' },
  KR: { lat: 35.9078, lng: 127.7669, displayName: 'South Korea' },
  MY: { lat: 4.2105, lng: 101.9758, displayName: 'Malaysia' },
  MX: { lat: 23.6345, lng: -102.5528, displayName: 'Mexico' },
  MA: { lat: 31.7917, lng: -7.0926, displayName: 'Morocco' },
  NL: { lat: 52.1326, lng: 5.2913, displayName: 'Netherlands' },
  NZ: { lat: -40.9006, lng: 174.886, displayName: 'New Zealand' },
  NG: { lat: 9.082, lng: 8.6753, displayName: 'Nigeria' },
  NO: { lat: 60.472, lng: 8.4689, displayName: 'Norway' },
  PK: { lat: 30.3753, lng: 69.3451, displayName: 'Pakistan' },
  PE: { lat: -9.19, lng: -75.0152, displayName: 'Peru' },
  PH: { lat: 12.8797, lng: 121.774, displayName: 'Philippines' },
  PL: { lat: 51.9194, lng: 19.1451, displayName: 'Poland' },
  PT: { lat: 39.3999, lng: -8.2245, displayName: 'Portugal' },
  RO: { lat: 45.9432, lng: 24.9668, displayName: 'Romania' },
  RU: { lat: 61.524, lng: 105.3188, displayName: 'Russia' },
  SA: { lat: 23.8859, lng: 45.0792, displayName: 'Saudi Arabia' },
  SG: { lat: 1.3521, lng: 103.8198, displayName: 'Singapore' },
  ZA: { lat: -30.5595, lng: 22.9375, displayName: 'South Africa' },
  ES: { lat: 40.4637, lng: -3.7492, displayName: 'Spain' },
  SE: { lat: 60.1282, lng: 18.6435, displayName: 'Sweden' },
  CH: { lat: 46.8182, lng: 8.2275, displayName: 'Switzerland' },
  TW: { lat: 23.6978, lng: 120.9605, displayName: 'Taiwan' },
  TH: { lat: 15.87, lng: 100.9925, displayName: 'Thailand' },
  TR: { lat: 38.9637, lng: 35.2433, displayName: 'Turkey' },
  UA: { lat: 48.3794, lng: 31.1656, displayName: 'Ukraine' },
  AE: { lat: 23.4241, lng: 53.8478, displayName: 'UAE' },
  GB: { lat: 55.3781, lng: -3.436, displayName: 'United Kingdom' },
  US: { lat: 37.0902, lng: -95.7129, displayName: 'United States' },
  VN: { lat: 14.0583, lng: 108.2772, displayName: 'Vietnam' },
  // Full country names (as returned by some APIs)
  'United States': {
    lat: 37.0902,
    lng: -95.7129,
    displayName: 'United States',
  },
  'United Kingdom': {
    lat: 55.3781,
    lng: -3.436,
    displayName: 'United Kingdom',
  },
  Algeria: { lat: 28.0339, lng: 1.6596, displayName: 'Algeria' },
  Australia: { lat: -25.2744, lng: 133.7751, displayName: 'Australia' },
  Brazil: { lat: -14.235, lng: -51.9253, displayName: 'Brazil' },
  Canada: { lat: 56.1304, lng: -106.3468, displayName: 'Canada' },
  China: { lat: 35.8617, lng: 104.1954, displayName: 'China' },
  France: { lat: 46.2276, lng: 2.2137, displayName: 'France' },
  Germany: { lat: 51.1657, lng: 10.4515, displayName: 'Germany' },
  India: { lat: 20.5937, lng: 78.9629, displayName: 'India' },
  Japan: { lat: 36.2048, lng: 138.2529, displayName: 'Japan' },
  Nigeria: { lat: 9.082, lng: 8.6753, displayName: 'Nigeria' },
  Russia: { lat: 61.524, lng: 105.3188, displayName: 'Russia' },
};

type MappedLocation = {
  country: string;
  displayName: string;
  count: number;
  lat: number;
  lng: number;
};

function MapControls() {
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

  const buttonStyle = {
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
        onClick={() => map.invalidateSize()}
        style={buttonStyle}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
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
  const { data, isLoading } = useGetMapDataQuery();

  // Map API response to locations with coordinates
  const locations: MappedLocation[] = (data?.data ?? []).reduce<
    MappedLocation[]
  >((acc, item) => {
    const coords = COUNTRY_COORDS[item.country];
    if (coords) {
      acc.push({
        country: item.country,
        displayName: coords.displayName,
        count: item.count,
        lat: coords.lat,
        lng: coords.lng,
      });
    }
    return acc;
  }, []);

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

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Re-animate markers when API data loads
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
  }, [isLoading, locations.length]);

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

        <MapControls />

        {locations.map((loc, index) => (
          <CircleMarker
            key={loc.country}
            center={[loc.lat, loc.lng]}
            radius={Math.sqrt(loc.count) * 12}
            pathOptions={{
              color: '#32CD32',
              fillColor: '#7FFF00',
              fillOpacity: 0.70,
              weight: 1,
            }}
            eventHandlers={{
              add: e => {
                markerRefs.current[index] =
                  e.target.getElement() as HTMLDivElement;
              },
              mouseover: e => e.target.setStyle({ fillOpacity: 0.3 }),
              mouseout: e => e.target.setStyle({ fillOpacity: 0.15 }),
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