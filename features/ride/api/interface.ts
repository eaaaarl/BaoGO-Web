export interface Ride {
  id: string
  driver_id: string
  rider_id: string
  chat_room_id: string
  pickup_location: string
  destination_location: string
  pickup_latitude: number
  pickup_longitude: number
  destination_latitude: number
  destination_longitude: number
  status: "cancelled" | "completed" | string
  requested_at: string
  accepted_at: string
  started_at: string
  completed_at: string | null
  cancelled_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}
