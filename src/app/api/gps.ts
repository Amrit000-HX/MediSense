// GPS and clinic location services
export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  type: string;
  rating?: number;
  distance?: number;
}

export interface GPSLocation {
  lat: number;
  lng: number;
}

// Sample clinic database (in a real app, this would come from a database)
export const CLINIC_DATABASE: Clinic[] = [
  {
    id: "1",
    name: "City General Hospital",
    address: "123 Main Street, New York, NY 10001",
    phone: "+1-212-555-1234",
    lat: 40.7128,
    lng: -74.0060,
    type: "Hospital",
    rating: 4.5
  },
  {
    id: "2",
    name: "Manhattan Medical Center",
    address: "456 5th Avenue, New York, NY 10118",
    phone: "+1-212-555-5678",
    lat: 40.7589,
    lng: -73.9851,
    type: "Medical Center",
    rating: 4.7
  },
  {
    id: "3",
    name: "Brooklyn Family Clinic",
    address: "789 Atlantic Ave, Brooklyn, NY 11201",
    phone: "+1-718-555-9012",
    lat: 40.6892,
    lng: -73.9442,
    type: "Family Practice",
    rating: 4.3
  },
  {
    id: "4",
    name: "Queens Urgent Care",
    address: "321 Queens Blvd, Queens, NY 11375",
    phone: "+1-718-555-3456",
    lat: 40.7282,
    lng: -73.7949,
    type: "Urgent Care",
    rating: 4.1
  },
  {
    id: "5",
    name: "Bronx Children's Hospital",
    address: "654 Grand Concourse, Bronx, NY 10451",
    phone: "+1-718-555-7890",
    lat: 40.8448,
    lng: -73.8648,
    type: "Children's Hospital",
    rating: 4.6
  },
  {
    id: "6",
    name: "Staten Island Medical Center",
    address: "987 Richmond Terrace, Staten Island, NY 10301",
    phone: "+1-718-555-2345",
    lat: 40.5795,
    lng: -74.1502,
    type: "Medical Center",
    rating: 4.2
  }
];

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get user's current location
export function getCurrentLocation(): Promise<GPSLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error(`Error getting location: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

// Find nearest clinics to user's location
export function findNearestClinics(userLocation: GPSLocation, limit: number = 5): Clinic[] {
  const clinicsWithDistance = CLINIC_DATABASE.map(clinic => ({
    ...clinic,
    distance: calculateDistance(userLocation.lat, userLocation.lng, clinic.lat, clinic.lng)
  }));

  // Sort by distance and return top results
  return clinicsWithDistance
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, limit);
}

// Open Google Maps with directions to clinic
export function openGoogleMapsDirections(clinic: Clinic, userLocation?: GPSLocation): void {
  let url: string;
  
  if (userLocation) {
    // Directions from user's location to clinic
    url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${clinic.lat},${clinic.lng}&destination_place_id=${clinic.name}`;
  } else {
    // Just show clinic location
    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name + ' ' + clinic.address)}`;
  }
  
  window.open(url, '_blank');
}

// Open Google Maps to search for nearby doctors/clinics
export function searchNearbyDoctors(userLocation: GPSLocation): void {
  const url = `https://www.google.com/maps/search/?api=1&query=doctor+medical+clinic+near+${userLocation.lat},${userLocation.lng}`;
  window.open(url, '_blank');
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  } else {
    return `${distance.toFixed(1)}km away`;
  }
}
