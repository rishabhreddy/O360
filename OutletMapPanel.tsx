
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React + Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// This component uses the useMap hook to fit bounds after the map is created
const FitBounds = ({ sourceCoords, suggestedCoords }: { sourceCoords: [number, number]; suggestedCoords: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    const bounds = L.latLngBounds([sourceCoords, suggestedCoords]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, sourceCoords, suggestedCoords]);
  
  return null;
};

interface OutletMapPanelProps {
  sourceCoords: [number, number];
  suggestedCoords: [number, number];
  outletData: {
    sourceName: string;
    sourceAddress: string;
    suggestedName: string;
    suggestedAddress: string;
  };
}

const OutletMapPanel = ({ sourceCoords, suggestedCoords, outletData }: OutletMapPanelProps) => {
  // Calculate center point between source and suggested coordinates
  const center: [number, number] = [
    (sourceCoords[0] + suggestedCoords[0]) / 2,
    (sourceCoords[1] + suggestedCoords[1]) / 2
  ];

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <MapContainer
        className="h-[400px] w-full"
        center={center}
        zoom={13}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds sourceCoords={sourceCoords} suggestedCoords={suggestedCoords} />
        
        <Marker position={sourceCoords}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold mb-1">Source Outlet</h3>
              <p className="text-sm">{outletData.sourceName}</p>
              <p className="text-sm text-muted-foreground">{outletData.sourceAddress}</p>
            </div>
          </Popup>
        </Marker>
        
        <Marker position={suggestedCoords}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold mb-1">Suggested Outlet</h3>
              <p className="text-sm">{outletData.suggestedName}</p>
              <p className="text-sm text-muted-foreground">{outletData.suggestedAddress}</p>
            </div>
          </Popup>
        </Marker>
        
        <Polyline 
          positions={[sourceCoords, suggestedCoords]} 
          pathOptions={{ color: 'blue', weight: 2, opacity: 0.6 }}
        />
      </MapContainer>
    </div>
  );
};

export default OutletMapPanel;
