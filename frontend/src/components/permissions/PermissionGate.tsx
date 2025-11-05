import React, { ReactNode } from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

interface PermissionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  // Role permissions
  adminOnly?: boolean;
  userOnly?: boolean;
  guestOnly?: boolean;
  roles?: string[];
  // Feature permissions
  feature?: string;
  // Custom permission check
  condition?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  fallback = null,
  adminOnly = false,
  userOnly = false,
  guestOnly = false,
  roles = [],
  feature,
  condition
}) => {
  const permissions = usePermissions();

  // Custom condition check
  if (condition !== undefined) {
    return condition ? <>{children}</> : <>{fallback}</>;
  }

  // Role checks
  if (adminOnly && !permissions.isAdmin()) {
    return <>{fallback}</>;
  }

  if (userOnly && !permissions.isUser()) {
    return <>{fallback}</>;
  }

  if (guestOnly && !permissions.isGuest()) {
    return <>{fallback}</>;
  }

  if (roles.length > 0 && !roles.some(role => permissions.hasRole(role))) {
    return <>{fallback}</>;
  }

  // Feature permission check
  if (feature && !permissions.canAccess(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Convenience components
export const AdminOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <PermissionGate adminOnly fallback={fallback}>
    {children}
  </PermissionGate>
);

export const UserOrAdmin: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <PermissionGate roles={['Administrator', 'User']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const AuthenticatedOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <PermissionGate roles={['Administrator', 'User', 'Guest']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const GuestRestricted: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <PermissionGate roles={['Administrator', 'User']} fallback={fallback}>
    {children}
  </PermissionGate>
);