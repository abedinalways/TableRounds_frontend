// // // // // 'use client';

// // // // // import { MapContainer, Popup, Marker, TileLayer, useMap } from 'react-leaflet';
// // // // // import 'leaflet/dist/leaflet.css';
// // // // // import L from 'leaflet';
// // // // // import { useEffect, useMemo, useRef, useState } from 'react';
// // // // // import gsap from 'gsap';
// // // // // import { Country } from 'country-state-city';
// // // // // import { useGetMapDataQuery } from '@/app/redux/api/mapApi';

// // // // // const iconProto = L.Icon.Default.prototype as { _getIconUrl?: () => string };
// // // // // if (iconProto._getIconUrl) delete iconProto._getIconUrl;

// // // // // L.Icon.Default.mergeOptions({
// // // // //   iconRetinaUrl:
// // // // //     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
// // // // //   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
// // // // //   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// // // // // });

// // // // // type ApiMapItem = {
// // // // //   country: string;
// // // // //   count: number | string;
// // // // // };

// // // // // type MappedLocation = {
// // // // //   country: string;
// // // // //   displayName: string;
// // // // //   count: number;
// // // // //   lat: number;
// // // // //   lng: number;
// // // // // };

// // // // // type CountryLocation = {
// // // // //   isoCode: string;
// // // // //   name: string;
// // // // //   lat: number;
// // // // //   lng: number;
// // // // // };

// // // // // const normalizeCountryText = (value?: string | null) => {
// // // // //   if (!value) return '';

// // // // //   return value
// // // // //     .trim()
// // // // //     .toLowerCase()
// // // // //     .replace(/['’]/g, '')
// // // // //     .replace(/&/g, 'and')
// // // // //     .replace(/[^a-z0-9]+/gi, ' ')
// // // // //     .replace(/\s+/g, ' ')
// // // // //     .trim();
// // // // // };

// // // // // const COUNTRY_ALIASES: Record<string, string> = {
// // // // //   usa: 'US',
// // // // //   america: 'US',
// // // // //   'united states': 'US',
// // // // //   'united states of america': 'US',

// // // // //   uk: 'GB',
// // // // //   'u k': 'GB',
// // // // //   britain: 'GB',
// // // // //   'great britain': 'GB',
// // // // //   england: 'GB',
// // // // //   'united kingdom': 'GB',

// // // // //   uae: 'AE',
// // // // //   emirates: 'AE',
// // // // //   'united arab emirates': 'AE',

// // // // //   korea: 'KR',
// // // // //   'south korea': 'KR',
// // // // //   'republic of korea': 'KR',
// // // // //   'korea republic of': 'KR',
// // // // //   'korea south': 'KR',

// // // // //   'north korea': 'KP',
// // // // //   'democratic peoples republic of korea': 'KP',

// // // // //   russia: 'RU',
// // // // //   vietnam: 'VN',
// // // // //   'viet nam': 'VN',

// // // // //   iran: 'IR',
// // // // //   'iran islamic republic of': 'IR',

// // // // //   syria: 'SY',
// // // // //   'syrian arab republic': 'SY',

// // // // //   tanzania: 'TZ',
// // // // //   'tanzania united republic of': 'TZ',

// // // // //   moldova: 'MD',
// // // // //   'moldova republic of': 'MD',

// // // // //   bolivia: 'BO',
// // // // //   'bolivia plurinational state of': 'BO',

// // // // //   venezuela: 'VE',
// // // // //   'venezuela bolivarian republic of': 'VE',

// // // // //   laos: 'LA',
// // // // //   'lao peoples democratic republic': 'LA',

// // // // //   brunei: 'BN',
// // // // //   'brunei darussalam': 'BN',

// // // // //   'czech republic': 'CZ',
// // // // //   czechia: 'CZ',
// // // // // };

// // // // // const COUNTRY_INDEX: Record<string, CountryLocation> = (() => {
// // // // //   const index: Record<string, CountryLocation> = {};

// // // // //   Country.getAllCountries().forEach(country => {
// // // // //     const lat = Number(country.latitude);
// // // // //     const lng = Number(country.longitude);

// // // // //     if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

// // // // //     const location: CountryLocation = {
// // // // //       isoCode: country.isoCode,
// // // // //       name: country.name,
// // // // //       lat,
// // // // //       lng,
// // // // //     };

// // // // //     index[normalizeCountryText(country.isoCode)] = location;
// // // // //     index[normalizeCountryText(country.name)] = location;
// // // // //   });

// // // // //   Object.entries(COUNTRY_ALIASES).forEach(([alias, isoCode]) => {
// // // // //     const country = Country.getCountryByCode(isoCode);

// // // // //     if (!country) return;

// // // // //     const lat = Number(country.latitude);
// // // // //     const lng = Number(country.longitude);

// // // // //     if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

// // // // //     index[normalizeCountryText(alias)] = {
// // // // //       isoCode: country.isoCode,
// // // // //       name: country.name,
// // // // //       lat,
// // // // //       lng,
// // // // //     };
// // // // //   });

// // // // //   return index;
// // // // // })();

// // // // // const resolveCountryLocation = (
// // // // //   countryValue?: string | null,
// // // // // ): CountryLocation | null => {
// // // // //   const normalizedCountry = normalizeCountryText(countryValue);

// // // // //   if (!normalizedCountry) return null;

// // // // //   const aliasIsoCode = COUNTRY_ALIASES[normalizedCountry];

// // // // //   if (aliasIsoCode) {
// // // // //     const country = Country.getCountryByCode(aliasIsoCode);

// // // // //     if (!country) return null;

// // // // //     const lat = Number(country.latitude);
// // // // //     const lng = Number(country.longitude);

// // // // //     if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

// // // // //     return {
// // // // //       isoCode: country.isoCode,
// // // // //       name: country.name,
// // // // //       lat,
// // // // //       lng,
// // // // //     };
// // // // //   }

// // // // //   return COUNTRY_INDEX[normalizedCountry] ?? null;
// // // // // };

// // // // // function MapControls({
// // // // //   onRefresh,
// // // // //   isRefreshing,
// // // // // }: {
// // // // //   onRefresh: () => void;
// // // // //   isRefreshing: boolean;
// // // // // }) {
// // // // //   const map = useMap();
// // // // //   const targetRef = useRef<HTMLButtonElement>(null);
// // // // //   const [isLocating, setIsLocating] = useState(false);

// // // // //   useEffect(() => {
// // // // //     if (targetRef.current) {
// // // // //       gsap.to(targetRef.current, {
// // // // //         scale: 1.1,
// // // // //         duration: 1,
// // // // //         ease: 'power1.inOut',
// // // // //         repeat: -1,
// // // // //         yoyo: true,
// // // // //       });
// // // // //     }
// // // // //   }, []);

// // // // //   const handleRecenter = () => {
// // // // //     setIsLocating(true);

// // // // //     if (targetRef.current) {
// // // // //       gsap.to(targetRef.current, {
// // // // //         rotation: 360,
// // // // //         duration: 0.6,
// // // // //         ease: 'power2.out',
// // // // //       });
// // // // //     }

// // // // //     map.flyTo([20, 0], 2, { duration: 1.5 });
// // // // //     setTimeout(() => setIsLocating(false), 1500);
// // // // //   };

// // // // //   const handleRefresh = () => {
// // // // //     map.invalidateSize();
// // // // //     onRefresh();
// // // // //   };

// // // // //   const buttonStyle: React.CSSProperties = {
// // // // //     width: '44px',
// // // // //     height: '44px',
// // // // //     borderRadius: '10px',
// // // // //     border: 'none',
// // // // //     background: 'white',
// // // // //     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
// // // // //     cursor: 'pointer',
// // // // //     display: 'flex',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     color: '#374151',
// // // // //   };

// // // // //   const handleHover = (
// // // // //     e: React.MouseEvent<HTMLButtonElement>,
// // // // //     isEnter: boolean,
// // // // //   ) => {
// // // // //     gsap.to(e.currentTarget, {
// // // // //       boxShadow: isEnter
// // // // //         ? '0 4px 12px rgba(0,0,0,0.15)'
// // // // //         : '0 2px 8px rgba(0,0,0,0.1)',
// // // // //       y: isEnter ? -2 : 0,
// // // // //       duration: 0.2,
// // // // //     });
// // // // //   };

// // // // //   return (
// // // // //     <div
// // // // //       style={{
// // // // //         position: 'absolute',
// // // // //         top: '16px',
// // // // //         left: '16px',
// // // // //         zIndex: 500,
// // // // //         display: 'flex',
// // // // //         flexDirection: 'column',
// // // // //         gap: '8px',
// // // // //       }}
// // // // //     >
// // // // //       <button
// // // // //         ref={targetRef}
// // // // //         onClick={handleRecenter}
// // // // //         disabled={isLocating}
// // // // //         title="Recenter map"
// // // // //         style={{ ...buttonStyle, cursor: isLocating ? 'wait' : 'pointer' }}
// // // // //         onMouseEnter={e => !isLocating && handleHover(e, true)}
// // // // //         onMouseLeave={e => !isLocating && handleHover(e, false)}
// // // // //       >
// // // // //         <svg
// // // // //           width="20"
// // // // //           height="20"
// // // // //           viewBox="0 0 24 24"
// // // // //           fill="none"
// // // // //           stroke="currentColor"
// // // // //           strokeWidth="2"
// // // // //         >
// // // // //           <circle cx="12" cy="12" r="3" />
// // // // //           <circle cx="12" cy="12" r="10" />
// // // // //           <line x1="12" y1="2" x2="12" y2="4" />
// // // // //           <line x1="12" y1="20" x2="12" y2="22" />
// // // // //           <line x1="2" y1="12" x2="4" y2="12" />
// // // // //           <line x1="20" y1="12" x2="22" y2="12" />
// // // // //         </svg>
// // // // //       </button>

// // // // //       <button
// // // // //         onClick={() => map.zoomIn()}
// // // // //         title="Zoom in"
// // // // //         style={buttonStyle}
// // // // //         onMouseEnter={e => handleHover(e, true)}
// // // // //         onMouseLeave={e => handleHover(e, false)}
// // // // //       >
// // // // //         <svg
// // // // //           width="20"
// // // // //           height="20"
// // // // //           viewBox="0 0 24 24"
// // // // //           fill="none"
// // // // //           stroke="currentColor"
// // // // //           strokeWidth="2"
// // // // //         >
// // // // //           <circle cx="11" cy="11" r="8" />
// // // // //           <path d="m21 21-4.35-4.35" />
// // // // //           <line x1="11" y1="8" x2="11" y2="14" />
// // // // //           <line x1="8" y1="11" x2="14" y2="11" />
// // // // //         </svg>
// // // // //       </button>

// // // // //       <button
// // // // //         onClick={() => map.zoomOut()}
// // // // //         title="Zoom out"
// // // // //         style={buttonStyle}
// // // // //         onMouseEnter={e => handleHover(e, true)}
// // // // //         onMouseLeave={e => handleHover(e, false)}
// // // // //       >
// // // // //         <svg
// // // // //           width="20"
// // // // //           height="20"
// // // // //           viewBox="0 0 24 24"
// // // // //           fill="none"
// // // // //           stroke="currentColor"
// // // // //           strokeWidth="2"
// // // // //         >
// // // // //           <circle cx="11" cy="11" r="8" />
// // // // //           <path d="m21 21-4.35-4.35" />
// // // // //           <line x1="8" y1="11" x2="14" y2="11" />
// // // // //         </svg>
// // // // //       </button>

// // // // //       <button
// // // // //         onClick={handleRefresh}
// // // // //         disabled={isRefreshing}
// // // // //         title="Refresh map data"
// // // // //         style={{
// // // // //           ...buttonStyle,
// // // // //           cursor: isRefreshing ? 'wait' : 'pointer',
// // // // //           opacity: isRefreshing ? 0.7 : 1,
// // // // //         }}
// // // // //         onMouseEnter={e => !isRefreshing && handleHover(e, true)}
// // // // //         onMouseLeave={e => !isRefreshing && handleHover(e, false)}
// // // // //       >
// // // // //         <svg
// // // // //           width="18"
// // // // //           height="18"
// // // // //           viewBox="0 0 24 24"
// // // // //           fill="none"
// // // // //           stroke="currentColor"
// // // // //           strokeWidth="2"
// // // // //         >
// // // // //           <path d="M21 12a9 9 0 1 1-2.64-6.36" />
// // // // //           <path d="M21 3v6h-6" />
// // // // //         </svg>
// // // // //       </button>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default function Mapview() {
// // // // //   const markerRefs = useRef<(HTMLElement | null)[]>([]);

// // // // //   const { data, isLoading, isFetching, refetch } = useGetMapDataQuery(
// // // // //     undefined,
// // // // //     {
// // // // //       refetchOnMountOrArgChange: true,
// // // // //       refetchOnFocus: true,
// // // // //       refetchOnReconnect: true,
// // // // //     },
// // // // //   );

// // // // //   const locations: MappedLocation[] = useMemo(() => {
// // // // //     const groupedLocations = new Map<string, MappedLocation>();

// // // // //     const apiItems = (data?.data ?? []) as ApiMapItem[];

// // // // //     apiItems.forEach(item => {
// // // // //       const resolvedCountry = resolveCountryLocation(item.country);

// // // // //       if (!resolvedCountry) {
// // // // //         console.warn('[Mapview] Unknown country value:', item.country);
// // // // //         return;
// // // // //       }

// // // // //       const count = Number(item.count) || 0;
// // // // //       const existingLocation = groupedLocations.get(resolvedCountry.isoCode);

// // // // //       if (existingLocation) {
// // // // //         existingLocation.count += count;
// // // // //       } else {
// // // // //         groupedLocations.set(resolvedCountry.isoCode, {
// // // // //           country: resolvedCountry.isoCode,
// // // // //           displayName: resolvedCountry.name,
// // // // //           count,
// // // // //           lat: resolvedCountry.lat,
// // // // //           lng: resolvedCountry.lng,
// // // // //         });
// // // // //       }
// // // // //     });

// // // // //     return Array.from(groupedLocations.values());
// // // // //   }, [data]);

// // // // //   useEffect(() => {
// // // // //     markerRefs.current = markerRefs.current.slice(0, locations.length);
// // // // //   }, [locations.length]);

// // // // //   useEffect(() => {
// // // // //     const style = document.createElement('style');

// // // // //     style.innerHTML = `
// // // // //       .leaflet-container {
// // // // //         background: #f5f7f6 !important;
// // // // //         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// // // // //       }

// // // // //       .leaflet-tile-pane {
// // // // //         filter: brightness(1.05) saturate(0.85) hue-rotate(-5deg);
// // // // //       }

// // // // //       .leaflet-popup-content-wrapper {
// // // // //         border-radius: 12px !important;
// // // // //         box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
// // // // //         border: 1px solid rgba(0,0,0,0.05);
// // // // //       }

// // // // //       .leaflet-popup-tip {
// // // // //         background: white !important;
// // // // //       }

// // // // //       /* পারফেক্টলি সেন্টারড করার জন্য আপডেটেড সিএসএস স্টাইল */
// // // // //       .custom-map-cluster {
// // // // //         background: #7FFF00;
// // // // //         border: 2px solid #32CD32;
// // // // //         color: #1f2937;
// // // // //         font-weight: bold;
// // // // //         font-size: 12px;
// // // // //         border-radius: 50%;
// // // // //         box-shadow: 0 2px 6px rgba(0,0,0,0.2);
// // // // //         transition: transform 0.2s ease, background-color 0.2s ease;
// // // // //       }

// // // // //       /* ভেতরের টেক্সট কন্টেইনারকে মিডল এলাইন করার জন্য */
// // // // //       .custom-map-cluster div {
// // // // //         width: 100%;
// // // // //         height: 100%;
// // // // //         display: flex;
// // // // //         align-items: center;
// // // // //         justifyContent: center;
// // // // //         text-align: center;
// // // // //       }

// // // // //       .custom-map-cluster:hover {
// // // // //         background: rgba(127, 255, 0, 0.5) !important;
// // // // //         transform: scale(1.1);
// // // // //       }
// // // // //     `;

// // // // //     document.head.appendChild(style);

// // // // //     return () => {
// // // // //       if (document.head.contains(style)) {
// // // // //         document.head.removeChild(style);
// // // // //       }
// // // // //     };
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     if (!isLoading && locations.length > 0) {
// // // // //       markerRefs.current.forEach((ref, index) => {
// // // // //         if (ref) {
// // // // //           gsap.fromTo(
// // // // //             ref,
// // // // //             { scale: 0, opacity: 0 },
// // // // //             {
// // // // //               scale: 1,
// // // // //               opacity: 1,
// // // // //               duration: 0.6,
// // // // //               delay: index * 0.15,
// // // // //               ease: 'back.out(1.7)',
// // // // //             },
// // // // //           );
// // // // //         }
// // // // //       });
// // // // //     }
// // // // //   }, [isLoading, locations]);

// // // // //   const createClusterIcon = (count: number) => {
// // // // //     return L.divIcon({
// // // // //       // টেক্সট এলিমেন্টটিকে একটি চাইল্ড ডিভ দিয়ে র‍্যাপ করা হয়েছে সেন্টার করার স্বার্থে
// // // // //       html: `<div style="width:100%; height:100%; font-family:inherit;">${count}</div>`,
// // // // //       className: 'custom-map-cluster',
// // // // //       iconSize: L.point(32, 32),
// // // // //       iconAnchor: [16, 16],
// // // // //     });
// // // // //   };

// // // // //   return (
// // // // //     <div
// // // // //       className="w-full h-[620px] rounded-xl overflow-hidden relative"
// // // // //       style={{
// // // // //         background: '#f5f7f6',
// // // // //         boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
// // // // //       }}
// // // // //     >
// // // // //       <MapContainer
// // // // //         center={[20, 0]}
// // // // //         zoom={2}
// // // // //         minZoom={2}
// // // // //         maxZoom={6}
// // // // //         className="h-full w-full relative"
// // // // //         scrollWheelZoom={true}
// // // // //         attributionControl={false}
// // // // //         zoomControl={false}
// // // // //       >
// // // // //         <TileLayer
// // // // //           url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
// // // // //           attribution="&copy; OpenStreetMap, &copy; CARTO"
// // // // //         />

// // // // //         <MapControls onRefresh={refetch} isRefreshing={isFetching} />

// // // // //         {locations.map((loc, index) => (
// // // // //           <Marker
// // // // //             key={loc.country}
// // // // //             position={[loc.lat, loc.lng]}
// // // // //             icon={createClusterIcon(loc.count)}
// // // // //             eventHandlers={{
// // // // //               add: e => {
// // // // //                 markerRefs.current[index] =
// // // // //                   e.target.getElement() as HTMLElement;
// // // // //               },
// // // // //             }}
// // // // //           >
// // // // //             <Popup>
// // // // //               <div
// // // // //                 style={{
// // // // //                   background: 'white',
// // // // //                   padding: '14px 18px',
// // // // //                   borderRadius: '8px',
// // // // //                   minWidth: '160px',
// // // // //                 }}
// // // // //               >
// // // // //                 <p
// // // // //                   style={{
// // // // //                     fontSize: '15px',
// // // // //                     fontWeight: '600',
// // // // //                     color: '#1f2937',
// // // // //                     margin: '0 0 6px 0',
// // // // //                     letterSpacing: '-0.01em',
// // // // //                   }}
// // // // //                 >
// // // // //                   {loc.displayName}
// // // // //                 </p>

// // // // //                 <p
// // // // //                   style={{
// // // // //                     fontSize: '13px',
// // // // //                     color: '#6b7280',
// // // // //                     margin: 0,
// // // // //                     fontWeight: '500',
// // // // //                   }}
// // // // //                 >
// // // // //                   {loc.count} {loc.count === 1 ? 'User' : 'Users'}
// // // // //                 </p>
// // // // //               </div>
// // // // //             </Popup>
// // // // //           </Marker>
// // // // //         ))}
// // // // //       </MapContainer>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // 'use client';

// // // // import {
// // // //   MapContainer,
// // // //   GeoJSON,
// // // //   Tooltip,
// // // //   CircleMarker,
// // // //   useMap,
// // // // } from 'react-leaflet';
// // // // import 'leaflet/dist/leaflet.css';
// // // // import { useEffect, useMemo, useState } from 'react';
// // // // import { State, Country } from 'country-state-city';
// // // // import { useGetMapDataQuery } from '@/app/redux/api/mapApi';

// // // // type ApiMapItem = {
// // // //   country: string;
// // // //   count: number | string;
// // // // };

// // // // type MappedLocation = {
// // // //   key: string;
// // // //   displayName: string;
// // // //   count: number;
// // // //   lat: number;
// // // //   lng: number;
// // // // };

// // // // // বিশ্ব মানচিত্রের প্রফেশনাল ভেক্টর জিওমেট্রি লেআউট ডেটা
// // // // const WORLD_GEOJSON_URL =
// // // //   'https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson';

// // // // const LOCATION_INDEX: Record<
// // // //   string,
// // // //   { name: string; lat: number; lng: number }
// // // // > = (() => {
// // // //   const index: Record<string, { name: string; lat: number; lng: number }> = {};
// // // //   const clean = (txt: string) =>
// // // //     txt
// // // //       .trim()
// // // //       .toLowerCase()
// // // //       .replace(/[^a-z0-9]/g, '');

// // // //   Country.getAllCountries().forEach(c => {
// // // //     if (c.latitude && c.longitude) {
// // // //       index[clean(c.name)] = {
// // // //         name: c.name,
// // // //         lat: Number(c.latitude),
// // // //         lng: Number(c.longitude),
// // // //       };
// // // //       index[clean(c.isoCode)] = {
// // // //         name: c.name,
// // // //         lat: Number(c.latitude),
// // // //         lng: Number(c.longitude),
// // // //       };
// // // //     }
// // // //   });

// // // //   State.getAllStates().forEach(s => {
// // // //     if (s.latitude && s.longitude) {
// // // //       index[clean(s.name)] = {
// // // //         name: s.name,
// // // //         lat: Number(s.latitude),
// // // //         lng: Number(s.longitude),
// // // //       };
// // // //     }
// // // //   });

// // // //   // পিক্সেল পারফেক্ট পিন ড্রপের জন্য কাস্টম কোঅর্ডিনেটস ওভাররাইড
// // // //   const precisionFixes: Record<
// // // //     string,
// // // //     { name: string; lat: number; lng: number }
// // // //   > = {
// // // //     california: { name: 'California', lat: 37.25, lng: -119.75 },
// // // //     virginia: { name: 'Virginia', lat: 37.5, lng: -78.5 },
// // // //     italy: { name: 'Italy', lat: 42.5, lng: 12.5 },
// // // //     southafrica: { name: 'South Africa', lat: -29.0, lng: 24.0 },
// // // //     bangladesh: { name: 'Bangladesh', lat: 23.8, lng: 90.3 },
// // // //   };

// // // //   return { ...index, ...precisionFixes };
// // // // })();

// // // // const resolveLocation = (query?: string | null) => {
// // // //   if (!query) return null;
// // // //   return (
// // // //     LOCATION_INDEX[
// // // //       query
// // // //         .trim()
// // // //         .toLowerCase()
// // // //         .replace(/[^a-z0-9]/g, '')
// // // //     ] ?? null
// // // //   );
// // // // };

// // // // function MapControls() {
// // // //   const map = useMap();
// // // //   const btnClass =
// // // //     'w-8 h-8 flex items-center justify-center bg-white text-slate-500 border border-slate-200/60 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:text-slate-800 hover:border-slate-300 transition-all active:scale-95';

// // // //   return (
// // // //     <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[500] flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/40 shadow-sm">
// // // //       <button
// // // //         onClick={() => map.flyTo([25, 0], 2.2, { duration: 1 })}
// // // //         className={btnClass}
// // // //         title="Recenter"
// // // //       >
// // // //         <svg
// // // //           width="13"
// // // //           height="13"
// // // //           viewBox="0 0 24 24"
// // // //           fill="none"
// // // //           stroke="currentColor"
// // // //           strokeWidth="2.5"
// // // //         >
// // // //           <circle cx="12" cy="12" r="3" />
// // // //           <circle cx="12" cy="12" r="10" />
// // // //         </svg>
// // // //       </button>
// // // //       <button onClick={() => map.zoomIn()} className={btnClass} title="Zoom In">
// // // //         <svg
// // // //           width="13"
// // // //           height="13"
// // // //           viewBox="0 0 24 24"
// // // //           fill="none"
// // // //           stroke="currentColor"
// // // //           strokeWidth="2.5"
// // // //         >
// // // //           <line x1="12" y1="5" x2="12" y2="19" />
// // // //           <line x1="5" y1="12" x2="19" y2="12" />
// // // //         </svg>
// // // //       </button>
// // // //       <button
// // // //         onClick={() => map.zoomOut()}
// // // //         className={btnClass}
// // // //         title="Zoom Out"
// // // //       >
// // // //         <svg
// // // //           width="14"
// // // //           height="14"
// // // //           viewBox="0 0 24 24"
// // // //           fill="none"
// // // //           stroke="currentColor"
// // // //           strokeWidth="2.5"
// // // //         >
// // // //           <line x1="5" y1="12" x2="19" y2="12" />
// // // //         </svg>
// // // //       </button>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default function Mapview() {
// // // //   const { data } = useGetMapDataQuery(undefined, {
// // // //     refetchOnMountOrArgChange: true,
// // // //     refetchOnFocus: true,
// // // //     refetchOnReconnect: true,
// // // //   });

// // // //   const [geoJsonData, setGeoJsonData] = useState<any>(null);
// // // //   const [hoveredKey, setHoveredKey] = useState<string | null>(null);

// // // //   useEffect(() => {
// // // //     fetch(WORLD_GEOJSON_URL)
// // // //       .then(res => res.json())
// // // //       .then(json => setGeoJsonData(json))
// // // //       .catch(err => console.error('Error loading map layout:', err));
// // // //   }, []);

// // // //   const locations: MappedLocation[] = useMemo(() => {
// // // //     const grouped = new Map<string, MappedLocation>();
// // // //     const apiItems = (data?.data ?? []) as ApiMapItem[];

// // // //     apiItems.forEach(item => {
// // // //       const resolved = resolveLocation(item.country);
// // // //       if (!resolved) return;

// // // //       const count = Number(item.count) || 0;
// // // //       const existing = grouped.get(resolved.name);

// // // //       if (existing) {
// // // //         existing.count += count;
// // // //       } else {
// // // //         grouped.set(resolved.name, {
// // // //           key: resolved.name,
// // // //           displayName: resolved.name,
// // // //           count,
// // // //           lat: resolved.lat,
// // // //           lng: resolved.lng,
// // // //         });
// // // //       }
// // // //     });
// // // //     return Array.from(grouped.values());
// // // //   }, [data]);

// // // //   useEffect(() => {
// // // //     const style = document.createElement('style');
// // // //     style.innerHTML = `
// // // //       /* কন্টেইনার ব্যাকগ্রাউন্ড কালার - পিওর হোয়াইট বাদ দিয়ে স্ক্রিনশটের মতো প্রিমিয়াম গ্রে করা হয়েছে */
// // // //       .leaflet-container {
// // // //         background: #f4f7f6 !important;
// // // //         font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
// // // //       }
// // // //       .leaflet-tooltip {
// // // //         background: transparent !important;
// // // //         border: none !important;
// // // //         box-shadow: none !important;
// // // //         padding: 0 !important;
// // // //         opacity: 1 !important;
// // // //       }
// // // //       .leaflet-tooltip-left::before, .leaflet-tooltip-right::before {
// // // //         display: none !important;
// // // //       }
// // // //       .dashboard-premium-popup {
// // // //         transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
// // // //       }
// // // //     `;
// // // //     document.head.appendChild(style);
// // // //     return () => {
// // // //       if (document.head.contains(style)) document.head.removeChild(style);
// // // //     };
// // // //   }, []);

// // // //   return (
// // // //     <div className="w-full h-[620px] rounded-3xl overflow-hidden relative bg-[#f4f7f6] border border-slate-200/50 shadow-sm">
// // // //       <MapContainer
// // // //         center={[30, -10]}
// // // //         zoom={2.2}
// // // //         minZoom={2}
// // // //         maxZoom={5}
// // // //         className="h-full w-full"
// // // //         scrollWheelZoom={true}
// // // //         attributionControl={false}
// // // //         zoomControl={false}
// // // //       >
// // // //         {/* ভেক্টর ল্যান্ডমাস স্টাইলিং - ল্যান্ড ও কন্টিনেন্ট কালার ম্যাপিং */}
// // // //         {geoJsonData && (
// // // //           <GeoJSON
// // // //             data={geoJsonData}
// // // //             style={feature => {
// // // //               const name = feature?.properties?.name?.toLowerCase() || '';

// // // //               // স্ক্রিনশট (Screenshot From 2026-06-03 12-40-44_2.png) অনুযায়ী নির্দিষ্ট ডেনসিটি দেশগুলোর কালার কোড
// // // //               const isDarkGreenCountry = [
// // // //                 'brazil',
// // // //                 'russia',
// // // //                 'china',
// // // //                 'india',
// // // //                 'congo',
// // // //                 'greenland',
// // // //                 'nigeria',
// // // //                 'australia',
// // // //               ].includes(name);
// // // //               const isMediumGreenCountry = [
// // // //                 'canada',
// // // //                 'united states of america',
// // // //                 'argentina',
// // // //                 'kazakhstan',
// // // //                 'saudi arabia',
// // // //               ].includes(name);

// // // //               return {
// // // //                 fillColor: isDarkGreenCountry
// // // //                   ? '#1e533c'
// // // //                   : isMediumGreenCountry
// // // //                     ? '#4ca374'
// // // //                     : '#dae6df',
// // // //                 fillOpacity: 0.9,
// // // //                 color: '#f4f7f6', // বর্ডার বাউন্ডারি লাইন যা ব্যাকগ্রাউন্ডের সাথে ফ্লুইড মিশে যাবে
// // // //                 weight: 1.5,
// // // //               };
// // // //             }}
// // // //           />
// // // //         )}

// // // //         <MapControls />

// // // //         {locations.map(loc => {
// // // //           const isHovered = hoveredKey === loc.key;

// // // //           return (
// // // //             <div key={loc.key}>
// // // //               {/* ১. আউটার ওভাল লাইট-গ্রিন ট্র্যান্সপারেন্ট আভা */}
// // // //               <CircleMarker
// // // //                 center={[loc.lat, loc.lng]}
// // // //                 radius={isHovered ? 40 : 34}
// // // //                 pathOptions={{
// // // //                   fillColor: '#4ca374',
// // // //                   fillOpacity: isHovered ? 0.48 : 0.38,
// // // //                   weight: 0,
// // // //                 }}
// // // //                 eventHandlers={{
// // // //                   mouseover: () => setHoveredKey(loc.key),
// // // //                   mouseout: () => setHoveredKey(null),
// // // //                 }}
// // // //               />

// // // //               {/* ২. সেন্টার কোর ডিপ গ্রিন ডট */}
// // // //               <CircleMarker
// // // //                 center={[loc.lat, loc.lng]}
// // // //                 radius={4.5}
// // // //                 pathOptions={{
// // // //                   fillColor: '#008a4b',
// // // //                   fillOpacity: 1,
// // // //                   weight: 0,
// // // //                 }}
// // // //                 eventHandlers={{
// // // //                   mouseover: () => setHoveredKey(loc.key),
// // // //                   mouseout: () => setHoveredKey(null),
// // // //                 }}
// // // //               >
// // // //                 {/* ৩. নাম এবং ইউজার সংখ্যা অলওয়েজ ভিজিবল প্রমিয়াম পপআপ কার্ড */}
// // // //                 <Tooltip
// // // //                   permanent
// // // //                   direction={loc.lng < 0 ? 'right' : 'left'}
// // // //                   offset={loc.lng < 0 ? [30, 0] : [-30, 0]}
// // // //                   interactive
// // // //                 >
// // // //                   {/* কার্ড স্টাইলিং এবং শ্যাডো যা অফ-হোয়াইট ব্যাকগ্রাউন্ডের ওপর ক্রিস্প পপআউট করবে */}
// // // //                   <div
// // // //                     className={`dashboard-premium-popup relative bg-white px-6 py-3.5 rounded-2xl border border-slate-100/70 text-center min-w-[135px]
// // // //                     ${isHovered ? 'shadow-[0_20px_40px_rgba(15,23,42,0.12)] scale-[1.03]' : 'shadow-[0_12px_30px_rgba(15,23,42,0.06)]'}
// // // //                   `}
// // // //                   >
// // // //                     <h4 className="m-0 text-[14px] font-bold text-slate-800 tracking-tight leading-none">
// // // //                       {loc.displayName}
// // // //                     </h4>
// // // //                     <p className="m-0 mt-1.5 text-[12px] text-slate-400 font-medium">
// // // //                       {loc.count} Users
// // // //                     </p>

// // // //                     {/* স্পাইক অ্যারো ইন্ডিকেটর */}
// // // //                     <div
// // // //                       className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-slate-100/70
// // // //                       ${
// // // //                         loc.lng < 0
// // // //                           ? 'left-[-6px] border-l border-b'
// // // //                           : 'right-[-6px] border-r border-t'
// // // //                       }`}
// // // //                     />
// // // //                   </div>
// // // //                 </Tooltip>
// // // //               </CircleMarker>
// // // //             </div>
// // // //           );
// // // //         })}
// // // //       </MapContainer>
// // // //     </div>
// // // //   );
// // // // }

// // // 'use client';

// // // import {
// // //   MapContainer,
// // //   TileLayer,
// // //   Tooltip,
// // //   CircleMarker,
// // //   useMap,
// // // } from 'react-leaflet';
// // // import 'leaflet/dist/leaflet.css';
// // // import L from 'leaflet';
// // // import { useEffect, useMemo, useState } from 'react';
// // // import { State, Country } from 'country-state-city';
// // // import { useGetMapDataQuery } from '@/app/redux/api/mapApi';

// // // type ApiMapItem = {
// // //   country: string;
// // //   count: number | string;
// // // };

// // // type MappedLocation = {
// // //   key: string;
// // //   displayName: string;
// // //   count: number;
// // //   lat: number;
// // //   lng: number;
// // // };

// // // const LOCATION_INDEX: Record<
// // //   string,
// // //   { name: string; lat: number; lng: number }
// // // > = (() => {
// // //   const index: Record<string, { name: string; lat: number; lng: number }> = {};
// // //   const clean = (txt: string) =>
// // //     txt
// // //       .trim()
// // //       .toLowerCase()
// // //       .replace(/[^a-z0-9]/g, '');

// // //   Country.getAllCountries().forEach(c => {
// // //     if (c.latitude && c.longitude) {
// // //       index[clean(c.name)] = {
// // //         name: c.name,
// // //         lat: Number(c.latitude),
// // //         lng: Number(c.longitude),
// // //       };
// // //       index[clean(c.isoCode)] = {
// // //         name: c.name,
// // //         lat: Number(c.latitude),
// // //         lng: Number(c.longitude),
// // //       };
// // //     }
// // //   });

// // //   State.getAllStates().forEach(s => {
// // //     if (s.latitude && s.longitude) {
// // //       index[clean(s.name)] = {
// // //         name: s.name,
// // //         lat: Number(s.latitude),
// // //         lng: Number(s.longitude),
// // //       };
// // //     }
// // //   });

// // //   const precisionFixes: Record<
// // //     string,
// // //     { name: string; lat: number; lng: number }
// // //   > = {
// // //     california: { name: 'California', lat: 37.25, lng: -119.75 },
// // //     virginia: { name: 'Virginia', lat: 37.5, lng: -78.5 },
// // //     italy: { name: 'Italy', lat: 42.5, lng: 12.5 },
// // //     southafrica: { name: 'South Africa', lat: -29.0, lng: 24.0 },
// // //     bangladesh: { name: 'Bangladesh', lat: 23.8, lng: 90.3 },
// // //   };

// // //   return { ...index, ...precisionFixes };
// // // })();

// // // const resolveLocation = (query?: string | null) => {
// // //   if (!query) return null;
// // //   return (
// // //     LOCATION_INDEX[
// // //       query
// // //         .trim()
// // //         .toLowerCase()
// // //         .replace(/[^a-z0-9]/g, '')
// // //     ] ?? null
// // //   );
// // // };

// // // function MapControls() {
// // //   const map = useMap();
// // //   const btnClass =
// // //     'w-8 h-8 flex items-center justify-center bg-white text-slate-500 border border-slate-200/70 rounded-lg shadow-sm hover:text-slate-800 transition-all active:scale-95';

// // //   return (
// // //     <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[500] flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/40 shadow-sm">
// // //       <button
// // //         onClick={() => map.flyTo([30, -10], 2.2, { duration: 1 })}
// // //         className={btnClass}
// // //         title="Recenter"
// // //       >
// // //         <svg
// // //           width="13"
// // //           height="13"
// // //           viewBox="0 0 24 24"
// // //           fill="none"
// // //           stroke="currentColor"
// // //           strokeWidth="2.5"
// // //         >
// // //           <circle cx="12" cy="12" r="3" />
// // //           <circle cx="12" cy="12" r="10" />
// // //         </svg>
// // //       </button>
// // //       <button onClick={() => map.zoomIn()} className={btnClass} title="Zoom In">
// // //         <svg
// // //           width="13"
// // //           height="13"
// // //           viewBox="0 0 24 24"
// // //           fill="none"
// // //           stroke="currentColor"
// // //           strokeWidth="2.5"
// // //         >
// // //           <line x1="12" y1="5" x2="12" y2="19" />
// // //           <line x1="5" y1="12" x2="19" y2="12" />
// // //         </svg>
// // //       </button>
// // //       <button
// // //         onClick={() => map.zoomOut()}
// // //         className={btnClass}
// // //         title="Zoom Out"
// // //       >
// // //         <svg
// // //           width="14"
// // //           height="14"
// // //           viewBox="0 0 24 24"
// // //           fill="none"
// // //           stroke="currentColor"
// // //           strokeWidth="2.5"
// // //         >
// // //           <line x1="5" y1="12" x2="19" y2="12" />
// // //         </svg>
// // //       </button>
// // //     </div>
// // //   );
// // // }

// // // export default function Mapview() {
// // //   const { data } = useGetMapDataQuery(undefined, {
// // //     refetchOnMountOrArgChange: true,
// // //     refetchOnFocus: true,
// // //     refetchOnReconnect: true,
// // //   });

// // //   const [hoveredKey, setHoveredKey] = useState<string | null>(null);

// // //   const locations: MappedLocation[] = useMemo(() => {
// // //     const grouped = new Map<string, MappedLocation>();
// // //     const apiItems = (data?.data ?? []) as ApiMapItem[];

// // //     apiItems.forEach(item => {
// // //       const resolved = resolveLocation(item.country);
// // //       if (!resolved) return;

// // //       const count = Number(item.count) || 0;
// // //       const existing = grouped.get(resolved.name);

// // //       if (existing) {
// // //         existing.count += count;
// // //       } else {
// // //         grouped.set(resolved.name, {
// // //           key: resolved.name,
// // //           displayName: resolved.name,
// // //           count,
// // //           lat: resolved.lat,
// // //           lng: resolved.lng,
// // //         });
// // //       }
// // //     });
// // //     return Array.from(grouped.values());
// // //   }, [data]);

// // //   useEffect(() => {
// // //     const style = document.createElement('style');
// // //     style.innerHTML = `
// // //       /* ম্যাপের ল্যান্ডমাস ও বাউন্ডারি কালারকে আপনার স্ক্রিনশটের মতো নিখুঁত গ্রাফিক্স টোনে কনভার্ট করার সিএসএস ফিল্টার */
// // //       .premium-vector-labels-map {
// // //         filter: contrast(0.95) brightness(1.02) sepia(0.05) saturate(0.85);
// // //       }
// // //       .leaflet-container {
// // //         background: #f4f7f6 !important;
// // //         font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
// // //       }
// // //       .leaflet-tooltip {
// // //         background: transparent !important;
// // //         border: none !important;
// // //         box-shadow: none !important;
// // //         padding: 0 !important;
// // //         opacity: 1 !important;
// // //       }
// // //       .leaflet-tooltip-left::before, .leaflet-tooltip-right::before {
// // //         display: none !important;
// // //       }
// // //       .dashboard-card-popup {
// // //         transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
// // //       }
// // //     `;
// // //     document.head.appendChild(style);
// // //     return () => {
// // //       if (document.head.contains(style)) document.head.removeChild(style);
// // //     };
// // //   }, []);

// // //   return (
// // //     <div className="w-full h-[620px] rounded-3xl overflow-hidden relative bg-[#f4f7f6] border border-slate-200/60 shadow-sm">
// // //       <MapContainer
// // //         center={[30, -10]}
// // //         zoom={2.2}
// // //         minZoom={2}
// // //         maxZoom={7}
// // //         className="h-full w-full"
// // //         scrollWheelZoom={true}
// // //         attributionControl={false}
// // //         zoomControl={false}
// // //       >
// // //         {/* রিয়েল টাইল লেয়ার উইথ লেবেলস: যা জুম-ইন করলে অটোমেটিক দেশের নাম, শহরের নাম এবং স্টেট নাম নিখুঁতভাবে দেখাবে */}
// // //         <TileLayer
// // //           url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
// // //           className="premium-vector-labels-map"
// // //         />

// // //         <MapControls />

// // //         {locations.map(loc => {
// // //           const isHovered = hoveredKey === loc.key;

// // //           return (
// // //             <div key={loc.key}>
// // //               {/* ১. আউটার ওভাল লাইট-গ্রিন ট্রান্সপারেন্ট গ্লো */}
// // //               <CircleMarker
// // //                 center={[loc.lat, loc.lng]}
// // //                 radius={isHovered ? 42 : 34}
// // //                 pathOptions={{
// // //                   fillColor: '#4ca374',
// // //                   fillOpacity: isHovered ? 0.45 : 0.32,
// // //                   weight: 0,
// // //                 }}
// // //                 eventHandlers={{
// // //                   mouseover: () => setHoveredKey(loc.key),
// // //                   mouseout: () => setHoveredKey(null),
// // //                 }}
// // //               />

// // //               {/* ২. সেন্টার কোর ডিপ গ্রিন ডট */}
// // //               <CircleMarker
// // //                 center={[loc.lat, loc.lng]}
// // //                 radius={4.5}
// // //                 pathOptions={{
// // //                   fillColor: '#008a4b',
// // //                   fillOpacity: 1,
// // //                   weight: 0,
// // //                 }}
// // //                 eventHandlers={{
// // //                   mouseover: () => setHoveredKey(loc.key),
// // //                   mouseout: () => setHoveredKey(null),
// // //                 }}
// // //               >
// // //                 {/* ৩. নাম এবং ইউজার সংখ্যা সম্বলিত প্রফেশনাল ইউজার কার্ড */}
// // //                 <Tooltip
// // //                   permanent
// // //                   direction={loc.lng < 0 ? 'right' : 'left'}
// // //                   offset={loc.lng < 0 ? [30, 0] : [-30, 0]}
// // //                   interactive
// // //                 >
// // //                   <div
// // //                     className={`dashboard-card-popup relative bg-white px-5 py-3 rounded-2xl border border-slate-100/80 text-center min-w-[130px]
// // //                     ${isHovered ? 'shadow-[0_20px_40px_rgba(15,23,42,0.12)] scale-[1.03]' : 'shadow-[0_10px_25px_rgba(15,23,42,0.05)]'}
// // //                   `}
// // //                   >
// // //                     <h4 className="m-0 text-[13.5px] font-bold text-slate-800 tracking-tight leading-none">
// // //                       {loc.displayName}
// // //                     </h4>
// // //                     <p className="m-0 mt-1.5 text-[11.5px] text-slate-400 font-medium">
// // //                       {loc.count} Users
// // //                     </p>

// // //                     {/* স্পাইক অ্যারো ইন্ডিকেটor */}
// // //                     <div
// // //                       className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-slate-100/80
// // //                       ${
// // //                         loc.lng < 0
// // //                           ? 'left-[-6px] border-l border-b'
// // //                           : 'right-[-6px] border-r border-t'
// // //                       }`}
// // //                     />
// // //                   </div>
// // //                 </Tooltip>
// // //               </CircleMarker>
// // //             </div>
// // //           );
// // //         })}
// // //       </MapContainer>
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import {
// //   MapContainer,
// //   TileLayer,
// //   GeoJSON,
// //   Tooltip,
// //   CircleMarker,
// //   useMap,
// // } from 'react-leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import { useEffect, useMemo, useState } from 'react';
// // import { State, Country } from 'country-state-city';
// // import { useGetMapDataQuery } from '@/app/redux/api/mapApi';

// // type ApiMapItem = {
// //   country: string;
// //   count: number | string;
// // };

// // type MappedLocation = {
// //   key: string;
// //   displayName: string;
// //   count: number;
// //   lat: number;
// //   lng: number;
// // };

// // // আপনার পছন্দের প্রফেশনাল ভেক্টর জিওমেট্রি লেআউট
// // const WORLD_GEOJSON_URL =
// //   'https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson';

// // const LOCATION_INDEX: Record<
// //   string,
// //   { name: string; lat: number; lng: number }
// // > = (() => {
// //   const index: Record<string, { name: string; lat: number; lng: number }> = {};
// //   const clean = (txt: string) =>
// //     txt
// //       .trim()
// //       .toLowerCase()
// //       .replace(/[^a-z0-9]/g, '');

// //   Country.getAllCountries().forEach(c => {
// //     if (c.latitude && c.longitude) {
// //       index[clean(c.name)] = {
// //         name: c.name,
// //         lat: Number(c.latitude),
// //         lng: Number(c.longitude),
// //       };
// //       index[clean(c.isoCode)] = {
// //         name: c.name,
// //         lat: Number(c.latitude),
// //         lng: Number(c.longitude),
// //       };
// //     }
// //   });

// //   State.getAllStates().forEach(s => {
// //     if (s.latitude && s.longitude) {
// //       index[clean(s.name)] = {
// //         name: s.name,
// //         lat: Number(s.latitude),
// //         lng: Number(s.longitude),
// //       };
// //     }
// //   });

// //   const precisionFixes: Record<
// //     string,
// //     { name: string; lat: number; lng: number }
// //   > = {
// //     california: { name: 'California', lat: 37.25, lng: -119.75 },
// //     virginia: { name: 'Virginia', lat: 37.5, lng: -78.5 },
// //     italy: { name: 'Italy', lat: 42.5, lng: 12.5 },
// //     southafrica: { name: 'South Africa', lat: -29.0, lng: 24.0 },
// //     bangladesh: { name: 'Bangladesh', lat: 23.8, lng: 90.3 },
// //   };

// //   return { ...index, ...precisionFixes };
// // })();

// // const resolveLocation = (query?: string | null) => {
// //   if (!query) return null;
// //   return (
// //     LOCATION_INDEX[
// //       query
// //         .trim()
// //         .toLowerCase()
// //         .replace(/[^a-z0-9]/g, '')
// //     ] ?? null
// //   );
// // };

// // function MapControls() {
// //   const map = useMap();
// //   const btnClass =
// //     'w-8 h-8 flex items-center justify-center bg-white text-slate-500 border border-slate-200/60 rounded-lg shadow-sm hover:text-slate-800 transition-all active:scale-95';

// //   return (
// //     <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[500] flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/40 shadow-sm">
// //       <button
// //         onClick={() => map.flyTo([30, -10], 2.2, { duration: 1 })}
// //         className={btnClass}
// //         title="Recenter"
// //       >
// //         <svg
// //           width="13"
// //           height="13"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2.5"
// //         >
// //           <circle cx="12" cy="12" r="3" />
// //           <circle cx="12" cy="12" r="10" />
// //         </svg>
// //       </button>
// //       <button onClick={() => map.zoomIn()} className={btnClass} title="Zoom In">
// //         <svg
// //           width="13"
// //           height="13"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2.5"
// //         >
// //           <line x1="12" y1="5" x2="12" y2="19" />
// //           <line x1="5" y1="12" x2="19" y2="12" />
// //         </svg>
// //       </button>
// //       <button
// //         onClick={() => map.zoomOut()}
// //         className={btnClass}
// //         title="Zoom Out"
// //       >
// //         <svg
// //           width="14"
// //           height="14"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2.5"
// //         >
// //           <line x1="5" y1="12" x2="19" y2="12" />
// //         </svg>
// //       </button>
// //     </div>
// //   );
// // }

// // export default function Mapview() {
// //   const { data } = useGetMapDataQuery(undefined, {
// //     refetchOnMountOrArgChange: true,
// //     refetchOnFocus: true,
// //     refetchOnReconnect: true,
// //   });

// //   const [geoJsonData, setGeoJsonData] = useState<any>(null);
// //   const [hoveredKey, setHoveredKey] = useState<string | null>(null);

// //   useEffect(() => {
// //     fetch(WORLD_GEOJSON_URL)
// //       .then(res => res.json())
// //       .then(json => setGeoJsonData(json))
// //       .catch(err => console.error('Error loading map layout:', err));
// //   }, []);

// //   const locations: MappedLocation[] = useMemo(() => {
// //     const grouped = new Map<string, MappedLocation>();
// //     const apiItems = (data?.data ?? []) as ApiMapItem[];

// //     apiItems.forEach(item => {
// //       const resolved = resolveLocation(item.country);
// //       if (!resolved) return;

// //       const count = Number(item.count) || 0;
// //       const existing = grouped.get(resolved.name);

// //       if (existing) {
// //         existing.count += count;
// //       } else {
// //         grouped.set(resolved.name, {
// //           key: resolved.name,
// //           displayName: resolved.name,
// //           count,
// //           lat: resolved.lat,
// //           lng: resolved.lng,
// //         });
// //       }
// //     });
// //     return Array.from(grouped.values());
// //   }, [data]);

// //   useEffect(() => {
// //     const style = document.createElement('style');
// //     style.innerHTML = `
// //       .leaflet-container {
// //         background: #f4f7f6 !important;
// //         font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
// //       }
// //       /* টেক্সট লেবেল টাইল লেয়ারের কন্ট্রাস্ট কন্ট্রোল */
// //       .base-labels-layer {
// //         filter: contrast(1.1) brightness(0.95);
// //       }
// //       /* আপনার প্রিয় গ্রিন জিওজেসন লেয়ারের ব্লেন্ডিং মোড—যা নিচের টেক্সটকে ওপরে ফুটিয়ে তুলবে */
// //       .premium-geojson-layer {
// //         mix-blend-mode: multiply;
// //         pointer-events: none !important;
// //       }
// //       .leaflet-tooltip {
// //         background: transparent !important;
// //         border: none !important;
// //         box-shadow: none !important;
// //         padding: 0 !important;
// //         opacity: 1 !important;
// //       }
// //       .leaflet-tooltip-left::before, .leaflet-tooltip-right::before {
// //         display: none !important;
// //       }
// //       .dashboard-card-popup {
// //         transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
// //       }
// //     `;
// //     document.head.appendChild(style);
// //     return () => {
// //       if (document.head.contains(style)) document.head.removeChild(style);
// //     };
// //   }, []);

// //   return (
// //     <div className="w-full h-[620px] rounded-3xl overflow-hidden relative bg-[#f4f7f6] border border-slate-200/60 shadow-sm">
// //       <MapContainer
// //         center={[30, -10]}
// //         zoom={2.2}
// //         minZoom={2}
// //         maxZoom={7}
// //         className="h-full w-full"
// //         scrollWheelZoom={true}
// //         attributionControl={false}
// //         zoomControl={false}
// //       >
// //         {/* ১. নিচের লেয়ার: এটি ব্যাকগ্রাউন্ডে থেকে জুম ইন করলে স্টেট ও সিটির নাম সাপ্লাই করবে */}
// //         <TileLayer
// //           url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
// //           className="base-labels-layer"
// //         />

// //         {/* ২. ওপরের লেয়ার: আপনার সেই পছন্দের প্রিমিয়াম সেজ-গ্রিন ভেক্টর ডিজাইন */}
// //         {geoJsonData && (
// //           <GeoJSON
// //             data={geoJsonData}
// //             className="premium-geojson-layer"
// //             style={feature => {
// //               const name = feature?.properties?.name?.toLowerCase() || '';
// //               const isDarkGreenCountry = [
// //                 'brazil',
// //                 'russia',
// //                 'china',
// //                 'india',
// //                 'congo',
// //                 'greenland',
// //                 'nigeria',
// //                 'australia',
// //               ].includes(name);
// //               const isMediumGreenCountry = [
// //                 'canada',
// //                 'united states of america',
// //                 'argentina',
// //                 'kazakhstan',
// //                 'saudi arabia',
// //               ].includes(name);

// //               return {
// //                 fillColor: isDarkGreenCountry
// //                   ? '#1e533c'
// //                   : isMediumGreenCountry
// //                     ? '#4ca374'
// //                     : '#dae6df',
// //                 fillOpacity: 0.9,
// //                 color: '#f4f7f6',
// //                 weight: 1.2,
// //               };
// //             }}
// //           />
// //         )}

// //         <MapControls />

// //         {locations.map(loc => {
// //           const isHovered = hoveredKey === loc.key;

// //           return (
// //             <div key={loc.key}>
// //               <CircleMarker
// //                 center={[loc.lat, loc.lng]}
// //                 radius={isHovered ? 42 : 34}
// //                 pathOptions={{
// //                   fillColor: '#4ca374',
// //                   fillOpacity: isHovered ? 0.45 : 0.32,
// //                   weight: 0,
// //                 }}
// //                 eventHandlers={{
// //                   mouseover: () => setHoveredKey(loc.key),
// //                   mouseout: () => setHoveredKey(null),
// //                 }}
// //               />

// //               <CircleMarker
// //                 center={[loc.lat, loc.lng]}
// //                 radius={4.5}
// //                 pathOptions={{
// //                   fillColor: '#008a4b',
// //                   fillOpacity: 1,
// //                   weight: 0,
// //                 }}
// //                 eventHandlers={{
// //                   mouseover: () => setHoveredKey(loc.key),
// //                   mouseout: () => setHoveredKey(null),
// //                 }}
// //               >
// //                 <Tooltip
// //                   permanent
// //                   direction={loc.lng < 0 ? 'right' : 'left'}
// //                   offset={loc.lng < 0 ? [30, 0] : [-30, 0]}
// //                   interactive
// //                 >
// //                   <div
// //                     className={`dashboard-card-popup relative bg-white px-5 py-3 rounded-2xl border border-slate-100/80 text-center min-w-[130px]
// //                     ${isHovered ? 'shadow-[0_20px_40px_rgba(15,23,42,0.12)] scale-[1.03]' : 'shadow-[0_10px_25px_rgba(15,23,42,0.05)]'}
// //                   `}
// //                   >
// //                     <h4 className="m-0 text-[13.5px] font-bold text-slate-800 tracking-tight leading-none">
// //                       {loc.displayName}
// //                     </h4>
// //                     <p className="m-0 mt-1.5 text-[11.5px] text-slate-400 font-medium">
// //                       {loc.count} Users
// //                     </p>

// //                     <div
// //                       className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-slate-100/80
// //                       ${
// //                         loc.lng < 0
// //                           ? 'left-[-6px] border-l border-b'
// //                           : 'right-[-6px] border-r border-t'
// //                       }`}
// //                     />
// //                   </div>
// //                 </Tooltip>
// //               </CircleMarker>
// //             </div>
// //           );
// //         })}
// //       </MapContainer>
// //     </div>
// //   );
// // }

// 'use client';

// import {
//   MapContainer,
//   TileLayer,
//   GeoJSON,
//   Tooltip,
//   CircleMarker,
//   useMap,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { useEffect, useMemo, useState } from 'react';
// import { State, Country } from 'country-state-city';
// import { useGetMapDataQuery } from '@/app/redux/api/mapApi';

// type ApiMapItem = {
//   country: string;
//   count: number | string;
// };

// type MappedLocation = {
//   key: string;
//   displayName: string;
//   count: number;
//   lat: number;
//   lng: number;
// };

// const WORLD_GEOJSON_URL =
//   'https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson';

// const LOCATION_INDEX: Record<
//   string,
//   { name: string; lat: number; lng: number }
// > = (() => {
//   const index: Record<string, { name: string; lat: number; lng: number }> = {};
//   const clean = (txt: string) =>
//     txt
//       .trim()
//       .toLowerCase()
//       .replace(/[^a-z0-9]/g, '');

//   Country.getAllCountries().forEach(c => {
//     if (c.latitude && c.longitude) {
//       index[clean(c.name)] = {
//         name: c.name,
//         lat: Number(c.latitude),
//         lng: Number(c.longitude),
//       };
//       index[clean(c.isoCode)] = {
//         name: c.name,
//         lat: Number(c.latitude),
//         lng: Number(c.longitude),
//       };
//     }
//   });

//   State.getAllStates().forEach(s => {
//     if (s.latitude && s.longitude) {
//       index[clean(s.name)] = {
//         name: s.name,
//         lat: Number(s.latitude),
//         lng: Number(s.longitude),
//       };
//     }
//   });

//   const precisionFixes: Record<
//     string,
//     { name: string; lat: number; lng: number }
//   > = {
//     california: { name: 'California', lat: 37.25, lng: -119.75 },
//     virginia: { name: 'Virginia', lat: 37.5, lng: -78.5 },
//     italy: { name: 'Italy', lat: 42.5, lng: 12.5 },
//     southafrica: { name: 'South Africa', lat: -29.0, lng: 24.0 },
//     bangladesh: { name: 'Bangladesh', lat: 23.8, lng: 90.3 },
//   };

//   return { ...index, ...precisionFixes };
// })();

// const resolveLocation = (query?: string | null) => {
//   if (!query) return null;
//   return (
//     LOCATION_INDEX[
//       query
//         .trim()
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, '')
//     ] ?? null
//   );
// };

// function MapControls() {
//   const map = useMap();
//   const btnClass =
//     'w-8 h-8 flex items-center justify-center bg-white text-slate-500 border border-slate-200/60 rounded-lg shadow-sm hover:text-slate-800 transition-all active:scale-95';

//   return (
//     <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[500] flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/40 shadow-sm">
//       <button
//         onClick={() => map.flyTo([30, -10], 2.2, { duration: 1 })}
//         className={btnClass}
//         title="Recenter"
//       >
//         <svg
//           width="13"
//           height="13"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.5"
//         >
//           <circle cx="12" cy="12" r="3" />
//           <circle cx="12" cy="12" r="10" />
//         </svg>
//       </button>
//       <button onClick={() => map.zoomIn()} className={btnClass} title="Zoom In">
//         <svg
//           width="13"
//           height="13"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.5"
//         >
//           <line x1="12" y1="5" x2="12" y2="19" />
//           <line x1="5" y1="12" x2="19" y2="12" />
//         </svg>
//       </button>
//       <button
//         onClick={() => map.zoomOut()}
//         className={btnClass}
//         title="Zoom Out"
//       >
//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.5"
//         >
//           <line x1="5" y1="12" x2="19" y2="12" />
//         </svg>
//       </button>
//     </div>
//   );
// }

// export default function Mapview() {
//   const { data } = useGetMapDataQuery(undefined, {
//     refetchOnMountOrArgChange: true,
//     refetchOnFocus: true,
//     refetchOnReconnect: true,
//   });

//   const [geoJsonData, setGeoJsonData] = useState<any>(null);
//   const [hoveredKey, setHoveredKey] = useState<string | null>(null);

//   useEffect(() => {
//     fetch(WORLD_GEOJSON_URL)
//       .then(res => res.json())
//       .then(json => setGeoJsonData(json))
//       .catch(err => console.error('Error loading map layout:', err));
//   }, []);

//   const locations: MappedLocation[] = useMemo(() => {
//     const grouped = new Map<string, MappedLocation>();
//     const apiItems = (data?.data ?? []) as ApiMapItem[];

//     apiItems.forEach(item => {
//       const resolved = resolveLocation(item.country);
//       if (!resolved) return;

//       const count = Number(item.count) || 0;
//       const existing = grouped.get(resolved.name);

//       if (existing) {
//         existing.count += count;
//       } else {
//         grouped.set(resolved.name, {
//           key: resolved.name,
//           displayName: resolved.name,
//           count,
//           lat: resolved.lat,
//           lng: resolved.lng,
//         });
//       }
//     });
//     return Array.from(grouped.values());
//   }, [data]);

//   useEffect(() => {
//     const style = document.createElement('style');
//     style.innerHTML = `
//       .leaflet-container {
//         background: #f4f7f6 !important;
//         font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
//       }

//       .base-labels-layer {
//         filter: contrast(1.1) brightness(0.95);
//       }

//       .premium-geojson-layer {
//         mix-blend-mode: multiply;
//         pointer-events: none !important;
//       }
//       .leaflet-tooltip {
//         background: transparent !important;
//         border: none !important;
//         box-shadow: none !important;
//         padding: 0 !important;
//         opacity: 1 !important;
//       }
//       .leaflet-tooltip-left::before, .leaflet-tooltip-right::before {
//         display: none !important;
//       }
//       .dashboard-card-popup {
//         transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => {
//       if (document.head.contains(style)) document.head.removeChild(style);
//     };
//   }, []);

//   return (
//     <div className="w-full h-[620px] rounded-3xl overflow-hidden relative bg-[#f4f7f6] border border-slate-200/60 shadow-sm">
//       <MapContainer
//         center={[30, -10]}
//         zoom={2.2}
//         minZoom={2}
//         maxZoom={7}
//         className="h-full w-full"
//         scrollWheelZoom={true}
//         attributionControl={false}
//         zoomControl={false}
//       >

//         <TileLayer
//           url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
//           className="base-labels-layer"
//         />

//         {geoJsonData && (
//           <GeoJSON
//             data={geoJsonData}

//             onEachFeature={(feature, layer: any) => {
//               layer.on('add', () => {
//                 if (layer._path) {
//                   layer._path.classList.add('premium-geojson-layer');
//                 }
//               });
//             }}
//             style={feature => {
//               const name = feature?.properties?.name?.toLowerCase() || '';
//               const isDarkGreenCountry = [
//                 'brazil',
//                 'russia',
//                 'china',
//                 'india',
//                 'congo',
//                 'greenland',
//                 'nigeria',
//                 'australia',
//               ].includes(name);
//               const isMediumGreenCountry = [
//                 'canada',
//                 'united states of america',
//                 'argentina',
//                 'kazakhstan',
//                 'saudi arabia',
//               ].includes(name);

//               return {
//                 fillColor: isDarkGreenCountry
//                   ? '#1e533c'
//                   : isMediumGreenCountry
//                     ? '#4ca374'
//                     : '#dae6df',
//                 fillOpacity: 0.9,
//                 color: '#f4f7f6',
//                 weight: 1.2,
//               };
//             }}
//           />
//         )}

//         <MapControls />

//         {locations.map(loc => {
//           const isHovered = hoveredKey === loc.key;

//           return (
//             <div key={loc.key}>

//               <CircleMarker
//                 center={[loc.lat, loc.lng]}
//                 radius={isHovered ? 42 : 34}
//                 pathOptions={{
//                   fillColor: '#4ca374',
//                   fillOpacity: isHovered ? 0.45 : 0.32,
//                   weight: 0,
//                 }}
//                 eventHandlers={{
//                   mouseover: () => setHoveredKey(loc.key),
//                   mouseout: () => setHoveredKey(null),
//                 }}
//               />

//               <CircleMarker
//                 center={[loc.lat, loc.lng]}
//                 radius={4.5}
//                 pathOptions={{
//                   fillColor: '#008a4b',
//                   fillOpacity: 1,
//                   weight: 0,
//                 }}
//                 eventHandlers={{
//                   mouseover: () => setHoveredKey(loc.key),
//                   mouseout: () => setHoveredKey(null),
//                 }}
//               >

//                 <Tooltip
//                   permanent
//                   direction={loc.lng < 0 ? 'right' : 'left'}
//                   offset={loc.lng < 0 ? [30, 0] : [-30, 0]}
//                   interactive
//                 >
//                   <div
//                     className={`dashboard-card-popup relative bg-white px-5 py-3 rounded-2xl border border-slate-100/80 text-center min-w-[130px]
//                     ${isHovered ? 'shadow-[0_20px_40px_rgba(15,23,42,0.12)] scale-[1.03]' : 'shadow-[0_10px_25px_rgba(15,23,42,0.05)]'}
//                   `}
//                   >
//                     <h4 className="m-0 text-[13.5px] font-bold text-slate-800 tracking-tight leading-none">
//                       {loc.displayName}
//                     </h4>
//                     <p className="m-0 mt-1.5 text-[11.5px] text-slate-400 font-medium">
//                       {loc.count} Users
//                     </p>

//                     <div
//                       className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-slate-100/80
//                       ${
//                         loc.lng < 0
//                           ? 'left-[-6px] border-l border-b'
//                           : 'right-[-6px] border-r border-t'
//                       }`}
//                     />
//                   </div>
//                 </Tooltip>
//               </CircleMarker>
//             </div>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// }

'use client';

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Tooltip,
  CircleMarker,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import { State, Country } from 'country-state-city';
import { useGetMapDataQuery } from '@/app/redux/api/mapApi';

type ApiMapItem = {
  country: string;
  count: number | string;
};

type MappedLocation = {
  key: string;
  displayName: string;
  count: number;
  lat: number;
  lng: number;
};

const WORLD_GEOJSON_URL =
  'https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson';

const LOCATION_INDEX: Record<
  string,
  { name: string; lat: number; lng: number }
> = (() => {
  const index: Record<string, { name: string; lat: number; lng: number }> = {};
  const clean = (txt: string) =>
    txt
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

  Country.getAllCountries().forEach(c => {
    if (c.latitude && c.longitude) {
      index[clean(c.name)] = {
        name: c.name,
        lat: Number(c.latitude),
        lng: Number(c.longitude),
      };
      index[clean(c.isoCode)] = {
        name: c.name,
        lat: Number(c.latitude),
        lng: Number(c.longitude),
      };
    }
  });

  State.getAllStates().forEach(s => {
    if (s.latitude && s.longitude) {
      index[clean(s.name)] = {
        name: s.name,
        lat: Number(s.latitude),
        lng: Number(s.longitude),
      };
    }
  });

  const precisionFixes: Record<
    string,
    { name: string; lat: number; lng: number }
  > = {
    california: { name: 'California', lat: 37.25, lng: -119.75 },
    virginia: { name: 'Virginia', lat: 37.5, lng: -78.5 },
    italy: { name: 'Italy', lat: 42.5, lng: 12.5 },
    southafrica: { name: 'South Africa', lat: -29.0, lng: 24.0 },
    bangladesh: { name: 'Bangladesh', lat: 23.8, lng: 90.3 },
  };

  return { ...index, ...precisionFixes };
})();

const resolveLocation = (query?: string | null) => {
  if (!query) return null;
  return (
    LOCATION_INDEX[
      query
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
    ] ?? null
  );
};

function MapControls() {
  const map = useMap();
  const btnClass =
    'w-8 h-8 flex items-center justify-center bg-white text-slate-500 border border-slate-200/60 rounded-lg shadow-sm hover:text-slate-800 transition-all active:scale-95';

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[500] flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/40 shadow-sm">
      <button
        onClick={() => map.flyTo([30, -10], 2.2, { duration: 1 })}
        className={btnClass}
        title="Recenter"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      </button>
      <button onClick={() => map.zoomIn()} className={btnClass} title="Zoom In">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button
        onClick={() => map.zoomOut()}
        className={btnClass}
        title="Zoom Out"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}

export default function Mapview() {
  const { data } = useGetMapDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    fetch(WORLD_GEOJSON_URL)
      .then(res => res.json())
      .then(json => setGeoJsonData(json))
      .catch(err => console.error('Error loading map layout:', err));
  }, []);

  const locations: MappedLocation[] = useMemo(() => {
    const grouped = new Map<string, MappedLocation>();
    const apiItems = (data?.data ?? []) as ApiMapItem[];

    apiItems.forEach(item => {
      const resolved = resolveLocation(item.country);
      if (!resolved) return;

      const count = Number(item.count) || 0;
      const existing = grouped.get(resolved.name);

      if (existing) {
        existing.count += count;
      } else {
        grouped.set(resolved.name, {
          key: resolved.name,
          displayName: resolved.name,
          count,
          lat: resolved.lat,
          lng: resolved.lng,
        });
      }
    });
    return Array.from(grouped.values());
  }, [data]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-container {
        background: #f4f7f6 !important; 
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
      }
    
      .base-labels-layer {
        filter: contrast(1.1) brightness(0.95);
      }

      .premium-geojson-layer {
        mix-blend-mode: multiply;
        pointer-events: none !important;
      }
      .leaflet-tooltip {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        opacity: 1 !important;
      }
      .leaflet-tooltip-left::before, .leaflet-tooltip-right::before {
        display: none !important;
      }
      .dashboard-card-popup {
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
      }
      
      .centered-number-tooltip {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full h-[620px] rounded-3xl overflow-hidden relative bg-[#f4f7f6] border border-slate-200/60 shadow-sm">
      <MapContainer
        center={[30, -10]}
        zoom={2.2}
        minZoom={2}
        maxZoom={7}
        className="h-full w-full"
        scrollWheelZoom={true}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          className="base-labels-layer"
        />

        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            onEachFeature={(feature, layer: any) => {
              layer.on('add', () => {
                if (layer._path) {
                  layer._path.classList.add('premium-geojson-layer');
                }
              });
            }}
            style={feature => {
              const name = feature?.properties?.name?.toLowerCase() || '';
              const isDarkGreenCountry = [
                'brazil',
                'russia',
                'china',
                'india',
                'congo',
                'greenland',
                'nigeria',
                'australia',
              ].includes(name);
              const isMediumGreenCountry = [
                'canada',
                'united states of america',
                'argentina',
                'kazakhstan',
                'saudi arabia',
              ].includes(name);

              return {
                fillColor: isDarkGreenCountry
                  ? '#1e533c'
                  : isMediumGreenCountry
                    ? '#4ca374'
                    : '#dae6df',
                fillOpacity: 0.9,
                color: '#f4f7f6',
                weight: 1.2,
              };
            }}
          />
        )}

        <MapControls />

        {locations.map(loc => {
          const isHovered = hoveredKey === loc.key;

          return (
            <div key={loc.key}>
              
              <CircleMarker
                center={[loc.lat, loc.lng]}
                radius={isHovered ? 42 : 34}
                pathOptions={{
                  fillColor: '#4ca374',
                  fillOpacity: isHovered ? 0.45 : 0.32,
                  weight: 0,
                }}
                eventHandlers={{
                  mouseover: () => setHoveredKey(loc.key),
                  mouseout: () => setHoveredKey(null),
                }}
              />

              
              <CircleMarker
                center={[loc.lat, loc.lng]}
                radius={13} 
                pathOptions={{
                  fillColor: '#008a4b',
                  fillOpacity: 1,
                  weight: 0,
                }}
                eventHandlers={{
                  mouseover: () => setHoveredKey(loc.key),
                  mouseout: () => setHoveredKey(null),
                }}
              >
               
                <Tooltip
                  permanent
                  direction="center"
                  className="centered-number-tooltip"
                >
                  <span className="text-white text-[11px] font-bold select-none leading-none">
                    {loc.count}
                  </span>
                </Tooltip>

               
                {isHovered && (
                  <Tooltip
                    permanent={false}
                    direction="top"
                    offset={[0, -15]}
                    interactive
                  >
                    <div className="dashboard-card-popup relative bg-white px-5 py-3 rounded-2xl border border-slate-100/80 text-center min-w-[130px] shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
                      <h4 className="m-0 text-[13.5px] font-bold text-slate-800 tracking-tight leading-none">
                        {loc.displayName}
                      </h4>
                      <p className="m-0 mt-1.5 text-[11.5px] text-slate-400 font-medium">
                        {loc.count} Users
                      </p>

                     
                      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-100/80" />
                    </div>
                  </Tooltip>
                )}
              </CircleMarker>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}