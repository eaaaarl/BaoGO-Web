"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { SidebarSeparator, SidebarTrigger } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Clock, User, Car, MapPin, Phone } from 'lucide-react'
import { GEOAPIFY_KEY } from '@/constant/geoapify'
import { useGetRequestByIdQuery } from '@/features/request/api/requestApi'

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'accepted': return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'completed': return 'bg-green-100 text-green-800 border border-green-200'
    case 'in progress': return 'bg-purple-100 text-purple-800 border border-purple-200'
    case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200'
    default: return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function RequestRideDetail() {
  const params = useParams()
  const idParam = String(params?.id ?? '0000')

  const { data: request, isLoading, error } = useGetRequestByIdQuery({ id: idParam }, {
    skip: !idParam
  })

  const staticMapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=800&height=500&center=lonlat%3A${request?.pickup_longitude}%2C${request?.pickup_latitude}&zoom=10&marker=lonlat%3A${request?.pickup_longitude}%2C${request?.pickup_latitude}%3Bcolor%3A%2322c55e%3Bsize%3Alarge%3Btext%3AA%7Clonlat%3A${request?.destination_longitude}%2C${request?.destination_latitude}%3Bcolor%3A%23ef4444%3Bsize%3Alarge%3Btext%3AB&apiKey=${GEOAPIFY_KEY}`

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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/request">Request</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Request #{request?.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Request #{request?.id}</h1>
            <p className="text-gray-600 mt-1">Detailed view for a single ride request</p>
          </div>
          <Badge className={getStatusColor(request?.status as string)}>{request?.status}</Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(request?.created_at as string)} at {formatTime(request?.created_at as string)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Pickup</p>
                      <p className="text-sm text-gray-600">{request?.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Destination</p>
                      <p className="text-sm text-gray-600">{request?.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        <h3 className="font-semibold text-gray-900">Rider</h3>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">{request?.rider.full_name}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{request?.rider.phone_number || 'N/A'}</span>
                        </div>
                        <p className="text-gray-500">{request?.rider.email}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-green-600" />
                        <h3 className="font-semibold text-gray-900">Driver</h3>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">{request?.driver.profiles.full_name}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{request?.driver.profiles.phone_number || 'N/A'}</span>
                        </div>
                        <p className="text-gray-500">{request?.driver.vehicle_type} • {request?.driver.vehicle_color} • {request?.driver.vehicle_year}</p>
                        <p className="text-gray-500">Plate: {request?.driver.license_number}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={staticMapUrl}
                    alt={`Map for request ${request?.id}`}
                    width={1000}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Summary</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>Pickup: {request?.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span>Destination: {request?.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span>{formatDate(request?.created_at as string)} at {formatTime(request?.created_at as string)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
