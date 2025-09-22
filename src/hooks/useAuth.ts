'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;
  const user = session?.user;

  return {
    user,
    isLoading,
    isAuthenticated,
    session,
  };
}

export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  return { user, isLoading, isAuthenticated };
}

export function useRequireRole(allowedRoles: string[]) {
  const { user, isLoading, isAuthenticated } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role) {
      if (!allowedRoles.includes(user.role)) {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user?.role, allowedRoles, router]);

  const hasRole = (role: string) => user?.role === role;
  const hasAnyRole = (roles: string[]) => user?.role && roles.includes(user.role);

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin: hasRole('ADMIN'),
    isTeacher: hasRole('TEACHER'),
    isStudent: hasRole('STUDENT'),
    canManageClasses: hasAnyRole(['TEACHER', 'ADMIN']),
    canCreateAssignments: hasAnyRole(['TEACHER', 'ADMIN']),
    canGradeSubmissions: hasAnyRole(['TEACHER', 'ADMIN']),
  };
}
