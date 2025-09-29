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
}
