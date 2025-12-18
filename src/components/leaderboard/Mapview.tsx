'use client';

import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import { CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

export default function Mapview() {
  return (
    <div className="md:h-[620px] mx-w-[1321px] w-full overflow-hidden rounded-xl map-border z-20">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer
          className=""
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          
        />

        {locations.map(loc => (
          <CircleMarker
            key={loc.city}
            center={[loc.lat, loc.lng]}
            radius={18}
            pathOptions={{
              color: '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: 0.25,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">
                  {loc.city}, {loc.country}
                </p>
                <p>{loc.users} Users</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
