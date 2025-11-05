import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { usePermissions } from '../../contexts/PermissionContext';

interface Report {
    id: number;
    op_name: string;
    [key: string]: any;
}

interface ReportActionsProps {
    report: Report;
    onEdit?: (report: Report) => void;
    onDelete?: (report: Report) => void;
    onView?: (report: Report) => void;
    size?: 'sm' | 'lg';
    variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary';
}

export const ReportActions: React.FC<ReportActionsProps> = ({
    report,
    onEdit,
    onDelete,
    onView,
    size = 'sm',
    variant = 'outline-primary'
}) => {
    const permissions = usePermissions();

    const canEdit = permissions.canEditReport(report);
    const canDelete = permissions.canDeleteReport(report);
    const canView = permissions.canViewReports();

    return (
        <ButtonGroup size={size}>
            {canView && onView && (
                <Button
                    variant={variant}
                    onClick={() => onView(report)}
                    title="View Report"
                >
                    <i className="fe fe-eye"></i>
                </Button>
            )}

            {canEdit && onEdit && (
                <Button
                    variant={variant}
                    onClick={() => onEdit(report)}
                    title="Edit Report"
                >
                    <i className="fe fe-edit"></i>
                </Button>
            )}

            {canDelete && onDelete && (
                <Button
                    variant="outline-danger"
                    onClick={() => onDelete(report)}
                    title="Delete Report"
                >
                    <i className="fe fe-trash-2"></i>
                </Button>
            )}
        </ButtonGroup>
    );
};

// Individual action button components
export const EditReportButton: React.FC<{
    report: Report;
    onClick: (report: Report) => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
}> = ({ report, onClick, disabled = false, size = 'sm' }) => {
    const permissions = usePermissions();

    if (!permissions.canEditReport(report)) {
        return null;
    }

    return (
        <Button
            variant="outline-primary"
            size={size}
            onClick={() => onClick(report)}
            disabled={disabled}
            title="Edit Report"
        >
            <i className="fe fe-edit me-1"></i>
            Edit
        </Button>
    );
};

export const DeleteReportButton: React.FC<{
    report: Report;
    onClick: (report: Report) => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
}> = ({ report, onClick, disabled = false, size = 'sm' }) => {
    const permissions = usePermissions();

    if (!permissions.canDeleteReport(report)) {
        return null;
    }

    return (
        <Button
            variant="outline-danger"
            size={size}
            onClick={() => onClick(report)}
            disabled={disabled}
            title="Delete Report"
        >
            <i className="fe fe-trash-2 me-1"></i>
            Delete
        </Button>
    );
};