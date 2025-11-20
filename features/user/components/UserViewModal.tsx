"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Profile } from "../api/interface";

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {user.avatar_url ? (
              <Image src={user.avatar_url} alt={user.full_name} width={96} height={96} />
            ) : (
              <span className="text-xl font-semibold">{initials}</span>
            )}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold">{user.full_name}</h3>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-500">{user.phone_number || "No phone"}</p>
          </div>

          <div className="w-full mt-4 space-y-1">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Role:</strong> {user.userRole}</p>
            <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
