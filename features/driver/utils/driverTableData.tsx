import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Driver } from "../api/interface";

const columnHelper = createColumnHelper<Driver>();

export const driverColumns = () => {
  return [
    // Driver Profile Column
    columnHelper.accessor('profiles.full_name', {
      header: () => 'Driver',
      cell: (info) => {
        const driver = info.row.original;
        const fullName = info.getValue() || 'N/A';
        const initials = fullName
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {initials}
              </span>
            </div>
            <div>
              <div className="font-medium">{fullName}</div>
              <div className="text-sm text-gray-500">ID: {driver.id}</div>
            </div>
          </div>
        );
      },
    }),

    // Contact Information Column
    columnHelper.accessor('profiles.email', {
      header: () => 'Contact',
      cell: (info) => {
        const driver = info.row.original;
        return (
          <div>
            <div className="text-sm">{info.getValue() || 'N/A'}</div>
            <div className="text-sm text-gray-500">
              {driver.profiles?.phone_number || 'No phone'}
            </div>
          </div>
        );
      },
    }),

    // License Number Column
    columnHelper.accessor('license_number', {
      header: () => 'License Number',
      cell: (info) => (
        <span className="font-mono text-sm">
          {info.getValue() || 'N/A'}
        </span>
      ),
    }),

    // Status Column
    columnHelper.accessor('is_available', {
      header: () => 'Status',
      cell: (info) => {
        const status = info.getValue();
        const getStatusVariant = (status: boolean) => {
          if (status) {
            return 'default'
          } else {
            return 'destructive'
          }
        };

        return (
          <Badge variant={getStatusVariant(status)}>
            {status || 'Unknown'}
          </Badge>
        );
      },
    }),

    // Join Date Column
    columnHelper.accessor('created_at', {
      header: () => 'Join Date',
      cell: (info) => {
        const date = info.getValue();
        return date
          ? new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
          : 'N/A';
      },
    }),

    // Total Trips Column (assuming you have this field)
    columnHelper.display({
      id: 'total_trips',
      header: () => 'Total Trips',
      cell: (info) => {
        const driver = info.row.original;
        const totalTrips = driver.rides?.length || 0;

        // Alternative if rides is a separate array passed to the component:
        // const totalTrips = rides?.filter(ride => ride.driver_id === driver.id).length || 0;

        return (
          <span className="font-medium">
            {totalTrips.toLocaleString()}
          </span>
        );
      },
    }),

    // Actions Column
    columnHelper.display({
      id: 'actions',
      header: () => '',
      cell: (info) => {
        const driver = info.row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  // Handle view details
                  console.log('View details for driver:', driver.id);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // Handle edit driver
                  console.log('Edit driver:', driver.id);
                }}
              >
                Edit Driver
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  console.log('Suspend driver:', driver.id);
                }}
              >
                {driver.is_available}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  // Handle delete driver
                  console.log('Delete driver:', driver.id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];
};