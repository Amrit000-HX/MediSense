import { useState } from "react";
import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

interface MiniGPSProps {
  className?: string;
}

export function MiniGPS({ className }: MiniGPSProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearestClinics, setNearestClinics] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);

  const handleFindNearbyClinics = async () => {
    setIsLoading(true);
    setError(null);
    setNearestClinics([]);

    try {
      // Get user location
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setUserLocation(location);

      // Sample clinics
      const clinics = [
        {
          id: "1",
          name: "City General Hospital",
          address: "123 Main Street, New York, NY 10001",
          phone: "+1-212-555-1234",
          lat: 40.7128,
          lng: -74.0060,
          type: "Hospital",
          rating: 4.5,
          distance: calculateDistance(location.lat, location.lng, 40.7128, -74.0060)
        },
        {
          id: "2",
          name: "Manhattan Medical Center",
          address: "456 5th Avenue, New York, NY 10118",
          phone: "+1-212-555-5678",
          lat: 40.7589,
          lng: -73.9851,
          type: "Medical Center",
          rating: 4.7,
          distance: calculateDistance(location.lat, location.lng, 40.7589, -73.9851)
        }
      ];

      // Sort by distance and return top 2
      const sortedClinics = clinics
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2);
      
      setNearestClinics(sortedClinics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  };

  const handleGetDirections = (clinic: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${clinic.lat},${clinic.lng}&destination_place_id=${clinic.name}`;
    window.open(url, '_blank');
  };

  const handleSearchNearby = () => {
    if (userLocation) {
      const url = `https://www.google.com/maps/search/?api=1&query=doctor+medical+clinic+near+${userLocation.lat},${userLocation.lng}`;
      window.open(url, '_blank');
    } else {
      window.open("https://www.google.com/maps/search/doctor+medical+clinic+near+me", "_blank");
    }
  };

  return (
    <div className={`w-full p-2 bg-white border border-blue-300 rounded shadow-sm ${className}`}>
      <div className="text-center mb-2">
        <div className="inline-block bg-blue-500 text-white p-1.5 rounded-full mb-1">
          <MapPin className="size-3" />
        </div>
        <h3 className="text-xs font-bold text-gray-900">🗺️ Clinics</h3>
      </div>

      {error && (
        <div className="p-1.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <Button
          onClick={handleFindNearbyClinics}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-1">
              <Loader2 className="size-3 animate-spin" />
              <span>Finding...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-1">
              <Navigation className="size-3" />
              <span>Find</span>
            </div>
          )}
        </Button>

        <Button
          onClick={handleSearchNearby}
          variant="outline"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-xs py-1.5"
        >
          <div className="flex items-center justify-center space-x-1">
            <MapPin className="size-3" />
            <span>Maps</span>
          </div>
        </Button>
      </div>

      {nearestClinics.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-gray-900">🏥 Nearby:</h4>
          <div className="space-y-0.5">
            {nearestClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="p-1.5 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="text-xs font-semibold text-gray-900 truncate">{clinic.name}</h5>
                    <p className="text-xs text-gray-500 truncate">{clinic.address}</p>
                    <div className="text-xs font-bold text-blue-600">
                      {formatDistance(clinic.distance)}
                    </div>
                  </div>
                  <div className="ml-1">
                    <Button
                      onClick={() => handleGetDirections(clinic)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-1 py-0.5"
                    >
                      🗺️
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
