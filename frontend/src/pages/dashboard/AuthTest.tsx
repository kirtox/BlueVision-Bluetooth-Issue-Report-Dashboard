import { Card, Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";

const AuthTest = () => {
  const { user, logout } = useAuth();

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Authentication Test Page</h1>
              <p className="mb-0">Test if user login system is working properly</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={6} md={12} sm={12}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">User Information</h4>
            </Card.Header>
            <Card.Body>
              {user ? (
                <div>
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Avatar:</strong> {user.avatar || 'None'}</p>
                  <Button variant="danger" onClick={logout} className="mt-3">
                    Logout
                  </Button>
                </div>
              ) : (
                <p>User information not found</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} md={12} sm={12}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">System Status</h4>
            </Card.Header>
            <Card.Body>
              <p><strong>Authentication Status:</strong> 
                <Badge bg="success" className="ms-2">Logged In</Badge>
              </p>
              <p><strong>Authentication Mode:</strong> 
                <Badge bg="info" className="ms-2">
                  API Mode
                </Badge>
              </p>
              <p><strong>Local Storage:</strong></p>
              <ul>
                <li>Token: {localStorage.getItem('authToken') ? 'Exists' : 'Not Exists'}</li>
                <li>User Data: {localStorage.getItem('userData') ? 'Exists' : 'Not Exists'}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthTest;