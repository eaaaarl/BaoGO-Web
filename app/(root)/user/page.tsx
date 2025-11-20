'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select'
import { SidebarSeparator, SidebarTrigger } from '@/components/ui/sidebar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Profile } from '@/features/user/api/interface'
import { useActivateUserProfileMutation, useDeleteUserProfileMutation, useGetAllUsersQuery, useSuspendUserProfileMutation } from '@/features/user/api/userApi'
import UserActivateModal from '@/features/user/components/UserActivateModal'
import UserDeleteModal from '@/features/user/components/UserDeleteModal'
import UserEditModal from '@/features/user/components/UserEditModal'
import UserSuspendModal from '@/features/user/components/UserSuspendModal'
import UserViewModal from '@/features/user/components/UserViewModal'
import { userColumn } from '@/features/user/utils/userTableData'
import { useAppSelector } from '@/lib/redux/hooks'
import { skipToken } from '@reduxjs/toolkit/query'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function UserPage() {
  const currentUser = useAppSelector((state) => state.auth)
  const [globalFilter, setGlobalFilter] = useState("")
  const { data: users, isLoading } = useGetAllUsersQuery(
    currentUser.user?.id ? { currentUserId: currentUser.user?.id } : skipToken
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [profileToView, setProfileToView] = useState<Profile | null>(null)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null)

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [profileToSuspend, setProfileToSuspend] = useState<Profile | null>(null)

  const [activateDialogOpen, setActivateDialogOpen] = useState(false)
  const [profileToActivate, setProfileToActivate] = useState<Profile | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null)


  // Handle for OPEN DIALOG
  const handleOpenProfileDialog = (profile: Profile) => {
    setViewDialogOpen(true)
    setProfileToView(profile)
  }

  const handleOpenEditProfileDialog = (profile: Profile) => {
    setEditDialogOpen(true)
    setProfileToEdit(profile)
  }

  const handleOpenSuspendProfileDialog = (profile: Profile) => {
    setSuspendDialogOpen(true)
    setProfileToSuspend(profile)
  }

  const handleOpenActivateProfileDialog = (profile: Profile) => {
    setActivateDialogOpen(true)
    setProfileToActivate(profile)
  }

  const handleOpenDeleteDilaog = (profile: Profile) => {
    setDeleteDialogOpen(true)
    setProfileToDelete(profile)
  }

  // Mutation 
  const [suspendUserProfile] = useSuspendUserProfileMutation()
  const [activateUserProfile] = useActivateUserProfileMutation()
  const [deleteUserProfile] = useDeleteUserProfileMutation()
  // Suspend User Mutation
  const handleSuspendProfile = async (profile: Profile, reason?: string) => {
    try {
      const res = await suspendUserProfile({ userId: profile.id })
      toast.success(res.data?.meta.message)
    } catch (error) {
      console.log('error', error)
      toast.error('Failed to suspend user')
    }
  }

  const handleActivateUserProfile = async (profile: Profile) => {
    try {
      const res = await activateUserProfile({ userId: profile.id })
      toast.success(res.data?.meta.message)
    } catch (error) {
      console.log('error', error)
      toast.error('Failed to activate user')

    }
  }

  const handleDeleteUserProfile = async (profile: Profile) => {
    try {
      const res = await deleteUserProfile({ userId: profile.id })
      toast.success(res.data?.meta.message)
    } catch (error) {
      console.log('error', error)
      toast.error('Failed to delete user')
    }
  }

  // TANSTACK REACT TABLE
  const table = useReactTable({
    data: users ?? [],
    columns: userColumn({
      onView: handleOpenProfileDialog,
      onEdit: handleOpenEditProfileDialog,
      onSuspend: handleOpenSuspendProfileDialog,
      onActivate: handleOpenActivateProfileDialog,
      onDelete: handleOpenDeleteDilaog
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
      fuzzy: (row, columnId, value) => {
        const itemValue = row.getValue(columnId) as string;
        return itemValue?.toLowerCase().includes(value.toLowerCase());
      },
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
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
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all users</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Users</h2>
              <div className="flex items-center gap-4">
                <Select
                  value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                  onValueChange={(value) => {
                    table.getColumn("status")?.setFilterValue(value === "all" ? "" : value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
                  onValueChange={(value) => {
                    table.getColumn("role")?.setFilterValue(value === "all" ? "" : value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="rider">Rider</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </div>
            </div>
          </div>


          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className='p-6' key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className='p-6' key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    {globalFilter ? "No users found matching your search." : "No users found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} users
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div >

      <UserViewModal
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        user={profileToView}
      />

      <UserEditModal
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        user={profileToEdit}
      />

      <UserSuspendModal
        onClose={() => setSuspendDialogOpen(false)}
        open={suspendDialogOpen}
        profile={profileToSuspend!}
        onConfirm={handleSuspendProfile}
      />

      <UserActivateModal
        onClose={() => setActivateDialogOpen(false)}
        open={activateDialogOpen}
        profile={profileToActivate!}
        onConfirm={handleActivateUserProfile}
      />

      <UserDeleteModal
        onClose={() => setDeleteDialogOpen(false)}
        open={deleteDialogOpen}
        profile={profileToDelete!}
        onConfirm={handleDeleteUserProfile}
      />
    </>
  )
}