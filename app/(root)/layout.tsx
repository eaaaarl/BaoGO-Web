import ProtectedRoute from '@/components/ProtectedRoute'
import React, { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>{children}</ProtectedRoute>
  )
}
