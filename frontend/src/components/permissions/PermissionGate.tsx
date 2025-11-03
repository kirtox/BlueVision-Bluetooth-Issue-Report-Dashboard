import React, { ReactNode } from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

interface PermissionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  // 角色權限
  adminOnly?: boolean;
  userOnly?: boolean;
  guestOnly?: boolean;
  roles?: string[];
  // 功能權限
  feature?: string;
  // 自定義權限檢查
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

  // 自定義條件檢查
  if (condition !== undefined) {
    return condition ? <>{children}</> : <>{fallback}</>;
  }

  // 角色檢查
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

  // 功能權限檢查
  if (feature && !permissions.canAccess(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// 便捷組件
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