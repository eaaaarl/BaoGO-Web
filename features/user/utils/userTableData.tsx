import { createColumnHelper } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, User } from 'lucide-react';
import { Profile } from "../api/interface";
import Image from "next/image";

interface userColumnProps {
  onView: (profile: Profile) => void;
  onEdit: (profile: Profile) => void;
  onSuspend: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
  onActivate: (profile: Profile) => void;
}

const columnHelper = createColumnHelper<Profile>();
export const userColumn = ({ onView, onEdit, onSuspend, onActivate, onDelete }: userColumnProps) => {
  return [
    columnHelper.accessor('full_name', {
      header: () => 'User',
      cell: (info) => {
        const profile = info.row.original;
        const fullName = info.getValue() || 'Unknown User';
        const avatarUrl = profile.avatar_url;

        const initials = fullName
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {initials || <User className="h-4 w-4" />}
                </span>
              )}
            </div>
            <div>
              <div className="font-medium">{fullName}</div>
              <div className="text-sm text-gray-500">ID: {profile.id.slice(0, 8)}...</div>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor('email', {
      header: () => 'Contact',
      cell: (info) => {
        const profile = info.row.original;
        return (
          <div>
            <div className="text-sm font-medium">{info.getValue()}</div>
            <div className="text-sm text-gray-500">
              {profile.phone_number || 'No phone number'}
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor('userRole', {
      header: () => 'Role',
      cell: (info) => {
        const role = info.getValue();

        const getRoleColor = (role: string) => {
          switch (role?.toLowerCase()) {
            case 'driver':
              return 'bg-blue-100 text-blue-800';
            case 'rider':
            case 'passenger':
              return 'bg-green-100 text-green-800';
            case 'admin':
              return 'bg-red-100 text-red-800';
            case 'moderator':
              return 'bg-purple-100 text-purple-800';
            default:
              return 'bg-gray-100 text-gray-800';
          }
        };

        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(role)}`}>
            {role}
          </span>
        );
      },
    }),

    columnHelper.accessor('created_at', {
      header: () => 'Join Date',
      cell: (info) => {
        const date = info.getValue();
        if (!date) return 'N/A';

        const joinDate = new Date(date);
        const now = new Date();
        const diffTime = now.getTime() - joinDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let timeAgo = '';
        if (diffDays === 0) {
          timeAgo = 'Today';
        } else if (diffDays === 1) {
          timeAgo = '1 day ago';
        } else if (diffDays < 30) {
          timeAgo = `${diffDays} days ago`;
        } else if (diffDays < 365) {
          const months = Math.floor(diffDays / 30);
          timeAgo = `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
          const years = Math.floor(diffDays / 365);
          timeAgo = `${years} year${years > 1 ? 's' : ''} ago`;
        }

        return (
          <div>
            <div className="text-sm font-medium">
              {joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-xs text-gray-500">{timeAgo}</div>
          </div>
        );
      },
    }),

    columnHelper.display({
      id: 'account_status',
      header: () => 'Status',
      cell: (info) => {
        const profile = info.row.original;
        let status = '';
        let colorClasses = '';

        if (profile.status === 'active') {
          status = 'Active';
          colorClasses = 'bg-green-100 text-green-800 border-green-200';
        } else if (profile.status === 'inactive') {
          status = 'Inactive';
          colorClasses = 'bg-gray-100 text-gray-800 border-gray-200';
        } else if (profile.status === 'deleted') {
          status = 'Deleted';
          colorClasses = 'bg-red-100 text-red-800 border-red-200';
        } else if (profile.status === 'suspended') {
          status = 'Suspended';
          colorClasses = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}>
            {status}
          </span>
        );
      },
    }),

    columnHelper.display({
      id: 'actions',
      header: () => '',
      cell: (info) => {
        const profile = info.row.original;

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
                onClick={() => onView(profile)}
              >
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(profile)}
              >
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {profile.status === 'suspended' ? (
                <DropdownMenuItem onClick={() => onActivate(profile)}>
                  Activate Account
                </DropdownMenuItem>
              ) : profile.status === 'active' || profile.status === 'inactive' ? (
                <DropdownMenuItem onClick={() => onSuspend(profile)}>
                  Suspend Account
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(profile)}
              >
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu >
        );
      },
    }),
  ];
};