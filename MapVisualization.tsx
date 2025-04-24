
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';
import { Suggestion } from '@/services/mockData';
import { formatDistance } from '@/utils/formatters';

interface MapVisualizationProps {
  suggestion: Suggestion;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({ suggestion }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!suggestion.geoLocation) {
    return null;
  }
  
  const { sourceLatitude, sourceLongitude, suggestedLatitude, suggestedLongitude } = suggestion.geoLocation;
  
  // Function to format coordinates for display
  const formatCoordinates = (lat: number, long: number) => {
    const latDirection = lat >= 0 ? 'N' : 'S';
    const longDirection = long >= 0 ? 'E' : 'W';
    
    return `${Math.abs(lat).toFixed(6)}° ${latDirection}, ${Math.abs(long).toFixed(6)}° ${longDirection}`;
  };
  
  // Generate a Google Maps URL for the location
  const getGoogleMapsUrl = () => {
    const midLat = (sourceLatitude + suggestedLatitude) / 2;
    const midLong = (sourceLongitude + suggestedLongitude) / 2;
    
    return `https://www.google.com/maps/dir/?api=1&origin=${sourceLatitude},${sourceLongitude}&destination=${suggestedLatitude},${suggestedLongitude}`;
  };
  
  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const distance = calculateDistance(sourceLatitude, sourceLongitude, suggestedLatitude, suggestedLongitude);
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex items-center justify-between">
          <div className="flex items-center">
            <Map className="mr-2 h-5 w-5" />
            Location Information
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Show Less' : 'Show Map'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Source Location</p>
            <p className="text-sm font-medium">{formatCoordinates(sourceLatitude, sourceLongitude)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Suggested Location</p>
            <p className="text-sm font-medium">{formatCoordinates(suggestedLatitude, suggestedLongitude)}</p>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-muted rounded-md flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Distance Between Points</p>
            <p className="text-sm font-semibold">{formatDistance(distance)}</p>
          </div>
          
          <Button variant="secondary" size="sm" onClick={() => window.open(getGoogleMapsUrl(), '_blank')}>
            View Route
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-4">
            <div className="border rounded-md h-64 flex items-center justify-center bg-muted">
              <div className="text-center p-4">
                <p className="text-muted-foreground mb-2">
                  Interactive map would be displayed here in a production environment.
                </p>
                <p className="text-xs text-muted-foreground">
                  Requires a mapping service integration like Google Maps, Mapbox, or Leaflet.
                </p>
                <Button className="mt-3" variant="outline" size="sm" onClick={() => window.open(getGoogleMapsUrl(), '_blank')}>
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapVisualization;
