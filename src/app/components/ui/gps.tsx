import { useState } from "react";
import { MapPin, Navigation, Loader2, AlertCircle, Phone, Star, Clock } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { getCurrentLocation, findNearestClinics, openGoogleMapsDirections, searchNearbyDoctors, formatDistance, type Clinic, type GPSLocation } from "../../api/gps";

interface GPSProps {
  className?: string;
}

export function GPSLocator({ className }: GPSProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearestClinics, setNearestClinics] = useState<Clinic[]>([]);
  const [userLocation, setUserLocation] = useState<GPSLocation | null>(null);

  const handleFindNearbyClinics = async () => {
    setIsLoading(true);
    setError(null);
    setNearestClinics([]);

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      const clinics = findNearestClinics(location, 5);
      setNearestClinics(clinics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDirections = (clinic: Clinic) => {
    if (userLocation) {
      openGoogleMapsDirections(clinic, userLocation);
    } else {
      openGoogleMapsDirections(clinic);
    }
  };

  const handleSearchNearby = () => {
    if (userLocation) {
      searchNearbyDoctors(userLocation);
    } else {
      // Fallback to search without location
      window.open("https://www.google.com/maps/search/doctor+medical+clinic+near+me", "_blank");
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto border-2 border-blue-200 shadow-lg ${className}`}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-500 to-emerald-500 p-4 rounded-full">
              <MapPin className="size-8 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🗺️ Find Nearby Clinics</h3>
            <p className="text-gray-600">
              Get directions to the nearest medical facilities
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="size-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleFindNearbyClinics}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-lg py-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="size-5 animate-spin" />
                  <span>Finding clinics...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Navigation className="size-5" />
                  <span>Find Nearby Clinics</span>
                </div>
              )}
            </Button>

            <Button
              onClick={handleSearchNearby}
              variant="outline"
              className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg py-4"
            >
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="size-5" />
                <span>Search on Google Maps</span>
              </div>
            </Button>
          </div>

          {nearestClinics.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900">🏥 Nearest Clinics:</h4>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {nearestClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-bold text-lg text-gray-900">{clinic.name}</h5>
                        <p className="text-gray-600 mt-1">{clinic.address}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Phone className="size-4" />
                            <span>{clinic.phone}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="size-4" />
                            <span>{clinic.type}</span>
                          </span>
                        </div>
                        {clinic.rating && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Star className="size-4 text-yellow-500 fill-current" />
                            <span className="text-gray-600">{clinic.rating} ⭐</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 space-y-2">
                        <div className="text-lg font-bold text-blue-600">
                          {clinic.distance && formatDistance(clinic.distance)}
                        </div>
                        <Button
                          onClick={() => handleGetDirections(clinic)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          🗺️ Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {userLocation && (
            <div className="text-sm text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
              📍 Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
