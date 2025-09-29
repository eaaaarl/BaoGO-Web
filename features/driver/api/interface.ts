export interface DriverProfile {
  id: string
  email: string
  userRole: "Driver" | string
  full_name: string
  avatar_url: string | null
  created_at: string
  phone_number: string | null
}

export interface Ride {
  id: string
  notes: string | null
  status: "cancelled" | "completed" | string
  rider_id: string
  driver_id: string
  created_at: string
  started_at: string
  updated_at: string
  accepted_at: string
  cancelled_at: string | null
  chat_room_id: string
  completed_at: string | null
  requested_at: string
  pickup_latitude: number
  pickup_location: string
  pickup_longitude: number
  destination_latitude: number
  destination_location: string
  destination_longitude: number
}

export interface Driver {
  id: string
  vehicle_type: string
  license_number: string
  vehicle_color: string
  vehicle_year: number
  total_rides: number
  is_available: boolean
  created_at: string
  latitude: number
  longitude: number
  last_location_update: string
  profiles: DriverProfile
  rides: Ride[]
}