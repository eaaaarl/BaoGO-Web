'use client'

import React from 'react';
import { Users, Car, TrendingUp, MapPin, Clock, AlertCircle, CheckCircle, Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { useGetDriversQuery, useGetRequestRideQuery, useGetRidesQuery, useGetUsersQuery } from '@/features/dashboard/api/dashboardApi';

export default function Dashboard() {

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-800 border-green-200",
      "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return styles[status] || styles.pending;
  };

  const { data: users } = useGetUsersQuery()
  const { data: rides } = useGetRidesQuery()
  const { data: drivers } = useGetDriversQuery()
  const { data: requestRides } = useGetRequestRideQuery()

  const completedRides = rides?.filter(r => r.status === 'completed').length || 0
  const activeRides = rides?.filter(ar => ar.status === 'started').length || 0
  const totalUsers = users?.length || 0
  const activeDrivers = drivers?.filter(ad => ad.is_available === true).length || 0
  const pendingRequestRide = requestRides?.filter(prr => prr.status === 'Pending').length || 0
  const totalRides = rides?.length || 0

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return { change: "N/A", trend: "neutral" };
    const percentChange = ((current - previous) / previous) * 100;
    return {
      change: `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`,
      trend: percentChange >= 0 ? "up" : "down"
    };
  };

  // Get last month's data (you'll need to filter by date range)
  const lastMonthStart = new Date();
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
  lastMonthStart.setDate(1);
  const lastMonthEnd = new Date();
  lastMonthEnd.setDate(0);

  const lastMonthRides = rides?.filter(r => {
    const rideDate = new Date(r.created_at);
    return rideDate >= lastMonthStart && rideDate <= lastMonthEnd && r.status === 'started';
  }).length || 0;

  const lastMonthUsers = users?.filter(u => {
    const userDate = new Date(u.created_at);
    return userDate >= lastMonthStart && userDate <= lastMonthEnd;
  }).length || 0;

  const activeRidesChange = calculateChange(activeRides, lastMonthRides);
  const totalUsersChange = calculateChange(totalUsers - lastMonthUsers, lastMonthUsers);

  const stats = [
    {
      title: "Active Rides",
      value: activeRides,
      change: activeRidesChange.change,
      trend: activeRidesChange.trend,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: totalUsers,
      change: totalUsersChange.change,
      trend: totalUsersChange.trend,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const quickStats = [
    { label: "Pending Requests", value: pendingRequestRide, icon: Clock, color: "text-yellow-600" },
    { label: "Active Drivers", value: activeDrivers, icon: Activity, color: "text-green-600" },
    { label: "Completed Today", value: completedRides, icon: CheckCircle, color: "text-blue-600" },
    { label: "Issues Reported", value: "0", icon: AlertCircle, color: "text-red-600" },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center gap-1 text-sm">
                      {stat.trend === "up" ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500">vs last month</span>
                    </div>
                  </div>
                  <div className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Rides - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Ride Requests
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {rides?.map((ride) => (
                  <div key={ride.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{ride.id}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusBadge(ride.status)}`}>
                          {ride.status}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-900 font-medium">{ride.pickup_location}</p>
                          <p className="text-gray-600">→ {ride.destination_location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Rider: {ride.rider_id}</span>
                        <span>Driver: {ride.driver_id}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1 ml-4">
                      {/*  <p className="text-lg font-bold text-gray-900">{ride.fare}</p> */}
                      <p className="text-xs text-gray-500">{ride.created_at}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                View All Requests
              </button>
            </div>
          </div>

          {/* Activity Summary - Takes 1 column */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Today&apos;s Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed Rides</span>
                    <span className="font-semibold text-gray-900">{completedRides}/{totalRides}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${totalRides > 0 ? (completedRides / totalRides) * 100 : 0}%` }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Drivers</span>
                    <span className="font-semibold text-gray-900">{activeDrivers}/{drivers?.length || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${drivers?.length ? (activeDrivers / drivers.length) * 100 : 0}%` }}></div>
                  </div>
                </div>


                {/*  <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Peak Hours Today</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">8:00 AM - 10:00 AM</span>
                      <span className="font-medium text-gray-900">32 rides</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">5:00 PM - 7:00 PM</span>
                      <span className="font-medium text-gray-900">28 rides</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}