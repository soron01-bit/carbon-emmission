import { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Crosshair, MapPin, AlertTriangle } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom component to handle map flying
const MapController = ({ center }) => {
  const map = useMap();
  if (center) {
    map.flyTo(center, 14, { duration: 1.5 });
  }
  return null;
};

const CityMap = ({ mapData, onLocationChange }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  if (!mapData) return null;

  const handleLocate = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
        if (onLocationChange) {
          onLocationChange(latitude, longitude);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please check permissions.");
        setIsLocating(false);
      }
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-panel w-full h-[500px] p-2 relative overflow-hidden flex flex-col"
    >
      <div className="px-4 py-3 flex justify-between items-center border-b border-zinc-800/50">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MapPin size={18} className="text-cyan-400" />
          Live Environmental Topography
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span> High Traffic
            </span>
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-red-500/50"></span> Pollution
            </span>
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate
            </span>
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Smooth
            </span>
          </div>
          
          <button 
            onClick={handleLocate}
            disabled={isLocating}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 text-xs font-medium whitespace-nowrap
              ${isLocating 
                ? 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-wait' 
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50'
              }`}
          >
            <Crosshair size={14} className={isLocating ? 'animate-spin' : ''} />
            {isLocating ? 'Scanning...' : 'My Location'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 rounded-lg overflow-hidden relative m-2">
        <MapContainer 
          center={mapData.center} 
          zoom={13} 
          style={{ height: '100%', width: '100%', background: '#09090b' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <MapController center={userLocation} />

          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <div className="font-sans text-xs">
                  <strong className="text-cyan-500">YOU ARE HERE</strong>
                  <br />
                  Real-time GPS Node active
                </div>
              </Popup>
            </Marker>
          )}

          {/* Render Road Traffic Signals */}
          {mapData.roads && mapData.roads.map((road) => (
            <Polyline
              key={road.id}
              positions={road.path}
              pathOptions={{ 
                color: road.color, 
                weight: road.congestion > 80 ? 6 : 4,
                opacity: 0.8,
                dashArray: road.congestion > 80 ? '1, 10' : '' 
              }}
            >
              <Popup>
                <div className="font-sans text-xs">
                  <strong style={{ color: road.color }}>{road.name}</strong>
                  <br />
                  Congestion: {road.congestion}%
                  {road.congestion > 80 && (
                    <div className="mt-1 flex items-center gap-1 text-red-500 font-bold">
                      <AlertTriangle size={12} /> RED ALERT
                    </div>
                  )}
                </div>
              </Popup>
            </Polyline>
          ))}
          
          {mapData.zones.map((zone) => (
            <Circle
              key={zone.id}
              center={zone.position}
              pathOptions={{ fillColor: zone.color, color: zone.color, fillOpacity: 0.4, weight: 1 }}
              radius={zone.radius}
            >
              <Popup className="cyber-popup">
                <div className="font-sans">
                  <strong style={{ color: zone.color }}>{zone.type.toUpperCase()}</strong>
                  <br />
                  {zone.value}
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
        
        {/* Futuristic map overlay scanner effect */}
        <div className="absolute inset-0 pointer-events-none border border-cyan-500/20 rounded-lg">
          <div className="w-full h-[1px] bg-cyan-500/30 absolute animate-[scan_4s_ease-in-out_infinite]" style={{ boxShadow: '0 0 10px rgba(0, 243, 255, 0.5)' }}></div>
        </div>
      </div>
    </motion.div>
  );
};

export default CityMap;
