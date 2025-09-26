"use client"

import React, { useState, useMemo } from 'react'
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, MapPin, Clock, DollarSign, Users, Car } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbList, BreadcrumbItem } from '@/components/ui/breadcrumb'

// Mock ride data
const mockRides = [
  {
    id: 'RD001',
    driver: 'John Smith',
    passenger: 'Alice Johnson',
    pickup: 'Mall of Asia',
    destination: 'Makati CBD',
    status: 'completed',
    fare: 350.00,
    distance: '12.5 km',
    duration: '25 mins',
    vehicleType: 'Sedan',
    createdAt: '2025-09-26 14:30',
    rating: 4.8
  },
  {
    id: 'RD002',
    driver: 'Maria Santos',
    passenger: 'Bob Wilson',
    pickup: 'BGC Taguig',
    destination: 'NAIA Terminal 3',
    status: 'ongoing',
    fare: 480.00,
    distance: '18.2 km',
    duration: '35 mins',
    vehicleType: 'SUV',
    createdAt: '2025-09-26 15:45',
    rating: null
  },
  {
    id: 'RD003',
    driver: 'Carlos Rodriguez',
    passenger: 'Diana Chen',
    pickup: 'Quezon City',
    destination: 'Ortigas Center',
    status: 'cancelled',
    fare: 0,
    distance: '8.7 km',
    duration: '20 mins',
    vehicleType: 'Hatchback',
    createdAt: '2025-09-26 13:15',
    rating: null
  },
  {
    id: 'RD004',
    driver: 'Lisa Garcia',
    passenger: 'Mike Thompson',
    pickup: 'Alabang Town Center',
    destination: 'Makati Avenue',
    status: 'pending',
    fare: 420.00,
    distance: '15.3 km',
    duration: '30 mins',
    vehicleType: 'Sedan',
    createdAt: '2025-09-26 16:20',
    rating: null
  },
  {
    id: 'RD005',
    driver: 'Robert Kim',
    passenger: 'Sarah Davis',
    pickup: 'SM North EDSA',
    destination: 'UP Diliman',
    status: 'completed',
    fare: 180.00,
    distance: '5.8 km',
    duration: '15 mins',
    vehicleType: 'Motorcycle',
    createdAt: '2025-09-26 12:00',
    rating: 5.0
  },
  {
    id: 'RD006',
    driver: 'Ana Martinez',
    passenger: 'Tom Brown',
    pickup: 'Eastwood City',
    destination: 'Manila Bay',
    status: 'ongoing',
    fare: 520.00,
    distance: '22.1 km',
    duration: '45 mins',
    vehicleType: 'SUV',
    createdAt: '2025-09-26 16:50',
    rating: null
  }
]

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  ongoing: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
}

const vehicleIcons = {
  Sedan: Car,
  SUV: Car,
  Hatchback: Car,
  Motorcycle: Car
}

export default function Ride() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vehicleFilter, setVehicleFilter] = useState('all')

  const filteredRides = useMemo(() => {
    return mockRides.filter(ride => {
      const matchesSearch =
        ride.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.destination.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || ride.status === statusFilter
      const matchesVehicle = vehicleFilter === 'all' || ride.vehicleType === vehicleFilter

      return matchesSearch && matchesStatus && matchesVehicle
    })
  }, [searchTerm, statusFilter, vehicleFilter])

  const stats = {
    total: mockRides.length,
    completed: mockRides.filter(r => r.status === 'completed').length,
    ongoing: mockRides.filter(r => r.status === 'ongoing').length,
    cancelled: mockRides.filter(r => r.status === 'cancelled').length,
    totalRevenue: mockRides.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.fare, 0)
  }

  return (

    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">₱{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search rides by ID, driver, passenger, or location..."
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

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
              >
                <option value="all">All Vehicles</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Motorcycle">Motorcycle</option>
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
                    Fare & Distance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRides.map((ride) => {
                  const VehicleIcon = vehicleIcons[ride.vehicleType] || Car
                  return (
                    <tr key={ride.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ride.id}</div>
                          <div className="text-sm text-gray-500">Driver: {ride.driver}</div>
                          <div className="text-sm text-gray-500">Passenger: {ride.passenger}</div>
                          <div className="text-xs text-gray-400">{ride.createdAt}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="truncate">{ride.pickup}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                            <span className="truncate">{ride.destination}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ride.status]}`}>
                          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₱{ride.fare.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{ride.distance}</div>
                        <div className="text-xs text-gray-400">{ride.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <VehicleIcon className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-900">{ride.vehicleType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ride.rating ? (
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{ride.rating}</span>
                            <span className="text-yellow-400 ml-1">★</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No rating</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-green-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
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

          {filteredRides.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No rides found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}