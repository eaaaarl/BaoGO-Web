"use client"

import React, { useState, useMemo } from 'react'
import { Search, MoreHorizontal, Eye, Edit, Trash2, MapPin, Clock, DollarSign, Users, Car } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbList, BreadcrumbItem } from '@/components/ui/breadcrumb'
import { useGetAllRidesQuery } from '@/features/ride/api/rideApi'

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

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  ongoing: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-blue-100 text-blue-800',
  accepted: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  requested: 'bg-yellow-100 text-yellow-800'
}


// Helper function to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return `${distance.toFixed(1)} km`;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-PH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

// Helper function to calculate estimated fare (you can adjust this logic)
const calculateEstimatedFare = (distance: number): number => {
  const baseFare = 50;
  const ratePerKm = 15;
  return baseFare + (distance * ratePerKm);
}

// Helper function to get status display text
const getStatusDisplay = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'requested': 'Pending',
    'accepted': 'Ongoing',
    'in_progress': 'Ongoing',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

// Helper function to get normalized status for filtering
const getNormalizedStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'requested': 'pending',
    'accepted': 'ongoing',
    'in_progress': 'ongoing',
    'completed': 'completed',
    'cancelled': 'cancelled'
  };
  return statusMap[status] || status;
}

export default function Ride() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: ridesResponse, isLoading, error } = useGetAllRidesQuery()

  const rides = useMemo(() => ridesResponse || [], [ridesResponse])

  const filteredRides = useMemo(() => {
    return rides.filter(ride => {
      const matchesSearch =
        ride.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.driver_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.rider_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.destination_location.toLowerCase().includes(searchTerm.toLowerCase())

      const normalizedStatus = getNormalizedStatus(ride.status);
      const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [rides, searchTerm, statusFilter])

  const stats = useMemo(() => {
    const completed = rides.filter(r => r.status === 'completed')
    const ongoing = rides.filter(r => ['accepted', 'in_progress'].includes(r.status))
    const cancelled = rides.filter(r => r.status === 'cancelled')
    const pending = rides.filter(r => r.status === 'requested')

    // Calculate total estimated revenue for completed rides
    const totalRevenue = completed.reduce((sum, ride) => {
      const distance = parseFloat(calculateDistance(
        ride.pickup_latitude,
        ride.pickup_longitude,
        ride.destination_latitude,
        ride.destination_longitude
      ));
      return sum + calculateEstimatedFare(distance);
    }, 0);

    return {
      total: rides.length,
      completed: completed.length,
      ongoing: ongoing.length,
      cancelled: cancelled.length,
      pending: pending.length,
      totalRevenue
    }
  }, [rides])

  if (isLoading) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Rides</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Rides</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-2">Error loading rides</div>
              <p className="text-gray-600">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Rides</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ride Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all ride bookings</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rides</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ongoing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.ongoing}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/*   <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Est. Revenue</p>
                <p className="text-2xl font-bold text-green-600">₱{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div> */}
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search rides by ID, driver, rider, or location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rides Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Rides</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ride Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance & Est. Fare
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRides.map((ride) => {
                  const distance = calculateDistance(
                    ride.pickup_latitude,
                    ride.pickup_longitude,
                    ride.destination_latitude,
                    ride.destination_longitude
                  );
                  const distanceNum = parseFloat(distance);
                  const estimatedFare = calculateEstimatedFare(distanceNum);

                  return (
                    <tr key={ride.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ride.id}</div>
                          <div className="text-sm text-gray-500">Driver: {ride.driver.profiles.full_name}</div>
                          <div className="text-sm text-gray-500">Rider: {ride.rider.full_name}</div>
                          <div className="text-xs text-gray-400">{formatDate(ride.created_at)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="truncate max-w-xs" title={ride.pickup_location}>
                              {ride.pickup_location}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                            <span className="truncate max-w-xs" title={ride.destination_location}>
                              {ride.destination_location}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[getNormalizedStatus(ride.status)] || statusColors.pending
                          }`}>
                          {getStatusDisplay(ride.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/*   <div className="text-sm text-gray-900">₱{estimatedFare.toFixed(2)}</div> */}
                        <div className="text-sm text-gray-500">{distance}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Requested: {formatDate(ride.requested_at)}</div>
                          {ride.accepted_at && (
                            <div>Accepted: {formatDate(ride.accepted_at)}</div>
                          )}
                          {ride.completed_at && (
                            <div>Completed: {formatDate(ride.completed_at)}</div>
                          )}
                          {ride.cancelled_at && (
                            <div>Cancelled: {formatDate(ride.cancelled_at)}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            title="Edit Ride"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="More Actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredRides.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {rides.length === 0 ? 'No rides available' : 'No rides found matching your criteria'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}