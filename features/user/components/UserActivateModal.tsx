import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Profile } from '../api/interface';

interface UserActivateModalProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  onConfirm?: (profile: Profile) => void;
}

export default function UserActivateModal({
  onClose,
  open,
  profile,
  onConfirm
}: UserActivateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm?.(profile);
      onClose();
    } catch (error) {
      console.error('Error activating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Activate User Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to activate <span className="font-medium text-gray-900">{profile?.full_name || profile?.email}</span>?
            This will restore their access to their account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Info Alert */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-800">
              {"This action will immediately activate the user's account and allow them to log in."}
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
          >
            {isSubmitting ? 'Activating...' : 'Activate Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}