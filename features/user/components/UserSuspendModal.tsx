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

interface UserSuspendModalProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  onConfirm?: (profile: Profile, reason?: string) => void;
}

export default function UserSuspendModal({
  onClose,
  open,
  profile,
  onConfirm
}: UserSuspendModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      onConfirm?.(profile, reason);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error suspending user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason('');
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suspend User Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to suspend <span className="font-medium text-gray-900">{profile?.full_name || profile?.email}</span>?
            This will prevent them from accessing their account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
            Reason for suspension (optional)
          </label>
          <textarea
            id="reason"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm"
            placeholder="Enter the reason for suspending this account..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-yellow-800">
              {" This action will immediately suspend the user's account. You can reactivate it later if needed."}
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
            className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
          >
            {isSubmitting ? 'Suspending...' : 'Suspend Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}