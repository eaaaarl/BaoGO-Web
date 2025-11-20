"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Profile } from "../api/interface";
import { Car, MapPin, Calendar, Phone, Mail, Hash, Shield } from "lucide-react";

interface UserViewModalProps {
  open: boolean;
  onClose: () => void;
  user: Profile | null;
}

export default function UserViewModal({ open, onClose, user }: UserViewModalProps) {
  if (!user) return null;

  const initials = user.full_name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isDriver = user.userRole?.toLowerCase() === 'driver';
  const driverData = user.driver; // Assuming the driver data is nested in the profile

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deleted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'driver':
        return 'bg-blue-100 text-blue-800';
      case 'rider':
      case 'passenger':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 pb-4">
          <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.full_name}
                width={96}
                height={96}
                className="object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-gray-600">{initials}</span>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold">{user.full_name}</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge className={getRoleColor(user.userRole)}>
                {user.userRole}
              </Badge>
              <Badge className={getStatusColor(user.status)}>
                {user.status}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium">{user.id.slice(0, 8)}...</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone_number || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver-Specific Information */}
        {isDriver && driverData && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Car className="h-5 w-5" />
                Driver Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium">{driverData.license_number}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Type</p>
                    <p className="font-medium">{driverData.vehicle_type}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-400 mt-0.5" style={{ backgroundColor: driverData.vehicle_color }} />
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Color</p>
                    <p className="font-medium capitalize">{driverData.vehicle_color}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Year</p>
                    <p className="font-medium">{driverData.vehicle_year}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Total Rides</p>
                    <p className="font-medium text-lg">{driverData.total_rides}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`h-3 w-3 rounded-full mt-1.5 ${driverData.is_available ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className="font-medium">
                      {driverData.is_available ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                </div>
                {driverData.last_location_update && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Last Location Update</p>
                      <p className="font-medium">
                        {new Date(driverData.last_location_update).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Coordinates: {driverData.latitude.toFixed(6)}, {driverData.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}