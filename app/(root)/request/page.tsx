'use client'
import React, { useState } from 'react'
import { Breadcrumb, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbList, BreadcrumbItem } from '@/components/ui/breadcrumb'
import { SidebarSeparator, SidebarTrigger } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, User, Filter, Search, XCircle, CheckCircle, Car, AlertCircle, BarChart3 } from 'lucide-react'
import { useGetAllRequestQuery } from '@/features/request/api/requestApi'
import Image from 'next/image'
import { GEOAPIFY_KEY } from '@/constant/geoapify'


const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'completed': return 'bg-green-100 text-green-800 border-green-200'
    case 'in progress': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export default function RequestPages() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: requestRides } = useGetAllRequestQuery()

  const statusCounts = {
    all: requestRides?.length ?? 0,
    pending: requestRides?.filter(r => r.status.toLowerCase() === 'pending').length,
    accepted: requestRides?.filter(r => r.status.toLowerCase() === 'accepted').length,
    'in progress': requestRides?.filter(r => r.status.toLowerCase() === 'in progress').length,
    completed: requestRides?.filter(r => r.status.toLowerCase() === 'completed').length,
    cancelled: requestRides?.filter(r => r.status.toLowerCase() === 'cancelled').length
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <SidebarSeparator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Request</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Request Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all ride requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{statusCounts.accepted}</div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{statusCounts['in progress']}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Car className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</div>
                  <div className="text-sm text-gray-600">Cancelled</div>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by pickup, destination, or request ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request List */}
        <div className="space-y-4">
          {requestRides?.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Side - Request Details */}
                  <div className="flex-1 space-y-3">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">Request #{request.id}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {formatDate(request.created_at)} at {formatTime(request.created_at)}
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Pickup</p>
                          <p className="text-sm text-gray-600">{request.pickup}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Destination</p>
                          <p className="text-sm text-gray-600">{request.destination}</p>
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-600">Rider:</span>
                        <span className="font-medium">{request.rider_id}</span>
                      </div>
                      {request.driver_id && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">Driver:</span>
                          <span className="font-medium">{request.driver_id}</span>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => { }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Right Side - Map Image */}
                  <div className="lg:w-80 flex-shrink-0">
                    <div className="rounded-lg overflow-hidden border border-gray-200 h-full min-h-[200px]">
                      <Image
                        src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat%3A${request.pickup_longitude}%2C${request.pickup_latitude}&zoom=13&marker=lonlat%3A${request.pickup_longitude}%2C${request.pickup_latitude}%3Bcolor%3A%2322c55e%3Bsize%3Alarge%3Btext%3AA%7Clonlat%3A${request.destination_longitude}%2C${request.destination_latitude}%3Bcolor%3A%23ef4444%3Bsize%3Alarge%3Btext%3AB&apiKey=${GEOAPIFY_KEY}`}
                        alt={`Map for request ${request.id}`}
                        width={320}
                        height={240}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}