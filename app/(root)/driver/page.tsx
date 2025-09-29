'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { SidebarSeparator, SidebarTrigger } from '@/components/ui/sidebar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useGetAllDriverQuery } from '@/features/driver/api/driverApi'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { driverColumns } from '@/features/driver/utils/driverTableData'
import { Button } from '@/components/ui/button'

export default function DriverPages() {
  const [globalFilter, setGlobalFilter] = useState("")

  const { data: drivers } = useGetAllDriverQuery()

  const table = useReactTable({
    data: drivers ?? [],
    columns: driverColumns(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  })

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
                <BreadcrumbPage>Drivers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all driver users</p>
          </div>
          {/* <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Driver
          </Button> */}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Drivers</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search drivers..."
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
              {table.getHeaderGroups().map((headerGroups) => (
                <TableRow key={headerGroups.id}>
                  {headerGroups.headers.map((header) => {
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
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell className='p-6' key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} drivers
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}