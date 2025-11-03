import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionContext';
import { 
  PermissionGate, 
  AdminOnly, 
  UserOrAdmin, 
  AuthenticatedOnly, 
  GuestRestricted 
} from '../../components/permissions/PermissionGate';
import { ReportActions } from '../../components/permissions/ReportActions';

const PermissionTest: React.FC = () => {
  const { user } = useAuth();
  const permissions = usePermissions();

  // 模擬報告數據
  const sampleReports = [
    { id: 1, op_name: user?.username || 'testuser', title: 'My Report' },
    { id: 2, op_name: 'otheruser', title: 'Other User Report' },
    { id: 3, op_name: 'admin', title: 'Admin Report' }
  ];

  const handleEdit = (report: any) => {
    alert(`Editing report: ${report.title}`);
  };

  const handleDelete = (report: any) => {
    alert(`Deleting report: ${report.title}`);
  };

  const handleView = (report: any) => {
    alert(`Viewing report: ${report.title}`);
  };

  return (
    <Container fluid className="p-6">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Permission System Test</h1>
            <Badge bg={
              user?.role === 'Administrator' ? 'success' : 
              user?.role === 'User' ? 'primary' : 'secondary'
            }>
              {user?.role || 'Not logged in'}
            </Badge>
          </div>
        </Col>
      </Row>

      {/* 用戶信息 */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Current User Information</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Username:</strong> {user?.username || 'Not logged in'}</p>
              <p><strong>Role:</strong> {user?.role || 'None'}</p>
              <p><strong>Email:</strong> {user?.email || 'Not provided'}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 權限檢查結果 */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Permission Check Results</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Role Checks:</h6>
                  <ul>
                    <li>Is Admin: {permissions.isAdmin() ? '✅' : '❌'}</li>
                    <li>Is User: {permissions.isUser() ? '✅' : '❌'}</li>
                    <li>Is Guest: {permissions.isGuest() ? '✅' : '❌'}</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Feature Permissions:</h6>
                  <ul>
                    <li>Can Create Report: {permissions.canCreateReport() ? '✅' : '❌'}</li>
                    <li>Can View Reports: {permissions.canViewReports() ? '✅' : '❌'}</li>
                    <li>Can Export Reports: {permissions.canExportReports() ? '✅' : '❌'}</li>
                    <li>Can Manage Users: {permissions.canManageUsers() ? '✅' : '❌'}</li>
                    <li>Can View Logs: {permissions.canViewLogs() ? '✅' : '❌'}</li>
                    <li>Can Manage Platforms: {permissions.canManagePlatforms() ? '✅' : '❌'}</li>
                    <li>Can Edit Profile: {permissions.canEditProfile() ? '✅' : '❌'}</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 權限組件測試 */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Permission Gate Components Test</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <AdminOnly fallback={<Badge bg="secondary">Admin Only Content (Hidden)</Badge>}>
                  <Badge bg="success">Admin Only Content (Visible)</Badge>
                </AdminOnly>
              </div>

              <div className="mb-3">
                <UserOrAdmin fallback={<Badge bg="secondary">User/Admin Content (Hidden)</Badge>}>
                  <Badge bg="primary">User/Admin Content (Visible)</Badge>
                </UserOrAdmin>
              </div>

              <div className="mb-3">
                <AuthenticatedOnly fallback={<Badge bg="secondary">Authenticated Content (Hidden)</Badge>}>
                  <Badge bg="info">Authenticated Content (Visible)</Badge>
                </AuthenticatedOnly>
              </div>

              <div className="mb-3">
                <GuestRestricted fallback={<Badge bg="secondary">Non-Guest Content (Hidden)</Badge>}>
                  <Badge bg="warning">Non-Guest Content (Visible)</Badge>
                </GuestRestricted>
              </div>

              <div className="mb-3">
                <PermissionGate 
                  feature="reports.create" 
                  fallback={<Button variant="secondary" disabled>Create Report (No Permission)</Button>}
                >
                  <Button variant="success">Create Report (Allowed)</Button>
                </PermissionGate>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 報告操作權限測試 */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Report Actions Permission Test</h5>
            </Card.Header>
            <Card.Body>
              {sampleReports.map(report => (
                <div key={report.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                  <div>
                    <strong>{report.title}</strong>
                    <br />
                    <small className="text-muted">Owner: {report.op_name}</small>
                  </div>
                  <ReportActions
                    report={report}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PermissionTest;