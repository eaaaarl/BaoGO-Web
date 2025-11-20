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

interface UserDeleteModalProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  onConfirm?: (profile: Profile) => void;
}

export default function UserDeleteModal({
  onClose,
  open,
  profile,
  onConfirm
}: UserDeleteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm?.(profile);
      setConfirmText(''); // Reset confirmation text
      onClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setConfirmText(''); // Reset on cancel
      onClose();
    }
  };

  const isConfirmValid = confirmText.toLowerCase() === 'delete';

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <span className="font-medium text-gray-900">{profile?.full_name || profile?.email}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Confirmation Input */}
        <div className="my-4">
          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-semibold text-red-600">DELETE</span> to confirm
          </label>
          <input
            id="confirm"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            placeholder="Type DELETE"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                <li>User account and profile</li>
                <li>All associated data</li>
                <li>Access permissions</li>
              </ul>
            </div>
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
            disabled={isSubmitting || !isConfirmValid}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}