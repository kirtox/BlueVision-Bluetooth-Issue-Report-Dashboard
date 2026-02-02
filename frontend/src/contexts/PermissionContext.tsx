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
    isAuditor: () => boolean;

    // Feature permission checks
    canCreateReport: () => boolean;
    canEditReport: (report: Report) => boolean;
    canEditAllReports: () => boolean;
    canDeleteReport: (report: Report) => boolean;
    canViewReports: () => boolean;
    canViewAllReports: () => boolean;
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

    const isAuditor = (): boolean => {
        return user?.role === 'Auditor';
    };

    const hasRole = (role: string): boolean => {
        return user?.role === role;
    };

    // Feature permission checks
    const canCreateReport = (): boolean => {
        if (!user) return false;
        return ['Administrator', 'User', 'Auditor'].includes(user.role);
    };

    const canEditReport = (report: Report): boolean => {
        if (!user) return false;
        if (user.role === 'Administrator' || user.role === 'Auditor') return true;
        if (user.role === 'User') {
            // Case-insensitive comparison
            const canEdit = report.op_name?.toLowerCase() === user.username?.toLowerCase();
            console.log('canEditReport:', {
                reportOpName: report.op_name,
                username: user.username,
                canEdit
            });
            return canEdit;
        }
        return false;
    };

    const canEditAllReports = (): boolean => {
        if (!user) return false;
        return ['Administrator', 'Auditor'].includes(user.role);
    };

    const canDeleteReport = (report: Report): boolean => {
        if (!user) return false;
        // ==========================================================================
        // Backup logic for User role deletion permission
        // if (user.role === 'Administrator' || user.role === 'Auditor') return true;
        // if (user.role === 'User') {
        //     // Case-insensitive comparison
        //     const canDelete = report.op_name?.toLowerCase() === user.username?.toLowerCase();
        //     console.log('canDeleteReport:', {
        //         reportOpName: report.op_name,
        //         username: user.username,
        //         canDelete
        //     });
        //     return canDelete;
        // }
        // return false;
        // ==========================================================================
        // Only Administrators and Auditors can delete reports
        return ['Administrator', 'Auditor'].includes(user.role);
    };

    const canViewReports = (): boolean => {
        if (!user) return false;
        return ['Administrator', 'User', 'Guest', 'Auditor'].includes(user.role);
    };

    const canViewAllReports = (): boolean => {
        if (!user) return false;
        return ['Administrator', 'Auditor'].includes(user.role);
    };

    const canExportReports = (): boolean => {
        if (!user) return false;
        return ['Administrator', 'User', 'Auditor'].includes(user.role);
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
        return ['Administrator', 'User', 'Auditor'].includes(user.role);
    };

    // General permission checks
    const canAccess = (feature: string): boolean => {
        if (!user) return false;

        const permissions: Record<string, string[]> = {
            'reports.view': ['Administrator', 'User', 'Guest', 'Auditor'],
            'reports.create': ['Administrator', 'User', 'Auditor'],
            'reports.export': ['Administrator', 'User', 'Auditor'],
            'users.manage': ['Administrator'],
            'logs.view': ['Administrator'],
            'platforms.manage': ['Administrator'],
            'profile.edit': ['Administrator', 'User', 'Auditor'],
        };

        const allowedRoles = permissions[feature];
        return allowedRoles ? allowedRoles.includes(user.role) : false;
    };

    const value: PermissionContextType = {
        isAdmin,
        isUser,
        isGuest,
        isAuditor,
        canCreateReport,
        canEditReport,
        canEditAllReports,
        canDeleteReport,
        canViewReports,
        canViewAllReports,
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