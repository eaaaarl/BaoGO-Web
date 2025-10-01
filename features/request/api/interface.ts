export interface RideRequest {
  id: string;
  rider_id: string;
  driver_id: string;
  pickup: string;
  destination: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  status: "Accepted" | string;
  created_at: string;
  rider: Profiles;
  driver: Driver;
}

export interface Profiles {
  id: string;
  email: string;
  userRole: "Driver" | string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  phone_number: string | null;
}

export interface Driver {
  id: string;
  vehicle_type: string;
  license_number: string;
  vehicle_color: string;
  vehicle_year: number;
  total_rides: number;
  is_available: boolean;
  created_at: string;
  latitude: number;
  longitude: number;
  last_location_update: string;
  profiles: Profiles;
}

export interface QueryPayload {
  status?: string;
  search?: string;
}
