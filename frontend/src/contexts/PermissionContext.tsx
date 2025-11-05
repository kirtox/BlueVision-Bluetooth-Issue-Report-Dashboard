import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Report {
    id: number;
    op_name: string;
    [key: string]: any;
}

interface PermissionContextType {
    // Role checks
    isAdmin: () => boolean;
    isUser: () => boolean;
    isGuest: () => boolean;

    // Feature permission checks
    canCreateReport: () => boolean;
    canEditReport: (report: Report) => boolean;
    canDeleteReport: (report: Report) => boolean;
    canViewReports: () => boolean;
    canExportReports: () => boolean;
    canManageUsers: () => boolean;
    canViewLogs: () => boolean;
    canManagePlatforms: () => boolean;
    canEditProfile: () => boolean;

    // General permission checks
    hasRole: (role: string) => boolean;
    canAccess: (feature: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (context === undefined) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
};

interface PermissionProviderProps {
    children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
    const { user } = useAuth();

    // Role checks
    const isAdmin = (): boolean => {
        return user?.role === 'Administrator';
    };

    const isUser = (): boolean => {
        return user?.role === 'User';
    };

    const isGuest = (): boolean => {
        return user?.role === 'Guest';
    };

    const hasRole = (role: string): boolean => {
        return user?.role === role;
    };

    // Feature permission checks
    const canCreateReport = (): boolean => {
        if (!user) return false;
        return ['Administrator', 'User'].includes(user.role);
    };

    const canEditReport = (report: Report): boolean => {
        if (!user) return false;
        if (user.role === 'Administrator') return true;
        if (user.role === 'User') return report.op_name === user.username;
        return false;
    };

    const canDeleteReport = (report: Report): boolean => {
        if (!user) return false;
        if (user.role === 'Administrator') return true;
        if (user.role === 'User') return report.op_name === user.username;
        return false;
    };

    const canViewReports = (): boolean => {
        if (!user) return false;
        return ['Administrator', 'User', 'Guest'].includes(user.role);
    };

    const canExportReports = (): boolean => {
        if (!user) return false;
        return ['Administrator', 'User'].includes(user.role);
    };

    const canManageUsers = (): boolean => {
        if (!user) return false;
        return user.role === 'Administrator';
    };

    const canViewLogs = (): boolean => {
        if (!user) return false;
        return user.role === 'Administrator';
    };

    const canManagePlatforms = (): boolean => {
        if (!user) return false;
        return user.role === 'Administrator';
    };

    const canEditProfile = (): boolean => {
        if (!user) return false;
        return ['Administrator', 'User'].includes(user.role);
    };

    // General permission checks
    const canAccess = (feature: string): boolean => {
        if (!user) return false;

        const permissions: Record<string, string[]> = {
            'reports.view': ['Administrator', 'User', 'Guest'],
            'reports.create': ['Administrator', 'User'],
            'reports.export': ['Administrator', 'User'],
            'users.manage': ['Administrator'],
            'logs.view': ['Administrator'],
            'platforms.manage': ['Administrator'],
            'profile.edit': ['Administrator', 'User'],
        };

        const allowedRoles = permissions[feature];
        return allowedRoles ? allowedRoles.includes(user.role) : false;
    };

    const value: PermissionContextType = {
        isAdmin,
        isUser,
        isGuest,
        canCreateReport,
        canEditReport,
        canDeleteReport,
        canViewReports,
        canExportReports,
        canManageUsers,
        canViewLogs,
        canManagePlatforms,
        canEditProfile,
        hasRole,
        canAccess,
    };

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};