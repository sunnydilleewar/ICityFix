import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';

// Custom Pin Icon using HTML/SVG (zero external image dependencies)
const createPickerIcon = () =>
  L.divIcon({
    className: 'custom-pin-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; background: #0270C7; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;">
        <div style="transform: rotate(45deg); width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

function LocationMarker({ position, setPosition, onAddressFound }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      reverseGeocode(lat, lng, onAddressFound);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { duration: 1 });
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
          reverseGeocode(lat, lng, onAddressFound);
        },
      }}
      icon={createPickerIcon()}
    />
  );
}

// OpenStreetMap Nominatim reverse geocoding
async function reverseGeocode(lat, lng, callback) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    const data = await res.json();
    if (data && data.display_name) {
      callback(data.display_name);
    }
  } catch (err) {
    console.warn('Geocoding lookup failed:', err.message);
    callback(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
  }
}

export default function CivicMapPicker({
  initialCoordinates = [77.6412, 12.9716], // [lng, lat]
  onLocationSelect,
}) {
  // Leaflet uses [lat, lng]
  const [position, setPosition] = useState([
    initialCoordinates[1] || 12.9716,
    initialCoordinates[0] || 77.6412,
  ]);
  const [address, setAddress] = useState('CMH Road, Indiranagar, Bengaluru, Karnataka');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handlePositionChange = (newPos) => {
    setPosition(newPos);
    // [lat, lng] -> [lng, lat]
    onLocationSelect({
      coordinates: [newPos[1], newPos[0]],
      address,
    });
  };

  const handleAddressFound = (newAddress) => {
    setAddress(newAddress);
    onLocationSelect({
      coordinates: [position[1], position[0]],
      address: newAddress,
    });
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCoords = [latitude, longitude];
        setPosition(newCoords);
        reverseGeocode(latitude, longitude, handleAddressFound);
        onLocationSelect({
          coordinates: [longitude, latitude],
          address: 'Current Detected Location',
        });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocationError(
          'Location access was declined. You can click on the map to manually drop a pin.'
        );
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3">
      {/* Location Bar & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-civic-100 text-civic-700">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {address || 'Pin drop location'}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
        >
          {isLocating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-civic-600" />
              Detecting GPS...
            </>
          ) : (
            <>
              <Crosshair className="h-3.5 w-3.5 text-civic-600" />
              Use Current Location
            </>
          )}
        </button>
      </div>

      {locationError && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 border border-amber-200">
          {locationError}
        </p>
      )}

      {/* Map Canvas */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-xl border border-slate-300 shadow-inner">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={handlePositionChange}
            onAddressFound={handleAddressFound}
          />
        </MapContainer>

        <div className="absolute bottom-2 left-2 z-[400] rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium text-slate-600 backdrop-blur shadow">
          Click or drag pin to adjust exact location
        </div>
      </div>
    </div>
  );
}
