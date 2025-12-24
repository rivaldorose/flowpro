import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/api/entities';
import { Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * ProfileGuard - Redirects to profile setup if user profile is incomplete
 * Checks if user has a full_name (required field for profile completion)
 */
export default function ProfileGuard({ children }) {
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => User.me(),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-8">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Check if profile is incomplete (no full_name means profile not set up)
  if (!currentUser?.full_name) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
}

