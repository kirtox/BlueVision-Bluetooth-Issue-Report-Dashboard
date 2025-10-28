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
              <h1 className="mb-1 h2 fw-bold">認證測試頁面</h1>
              <p className="mb-0">測試用戶登入系統是否正常運作</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={6} md={12} sm={12}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">用戶資訊</h4>
            </Card.Header>
            <Card.Body>
              {user ? (
                <div>
                  <p><strong>用戶 ID:</strong> {user.id}</p>
                  <p><strong>用戶名:</strong> {user.username}</p>
                  <p><strong>角色:</strong> {user.role}</p>
                  <p><strong>頭像:</strong> {user.avatar || '無'}</p>
                  <Button variant="danger" onClick={logout} className="mt-3">
                    登出
                  </Button>
                </div>
              ) : (
                <p>未找到用戶資訊</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} md={12} sm={12}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">系統狀態</h4>
            </Card.Header>
            <Card.Body>
              <p><strong>認證狀態:</strong> 
                <Badge bg="success" className="ms-2">已登入</Badge>
              </p>
              <p><strong>認證模式:</strong> 
                <Badge bg="info" className="ms-2">
                  API 模式
                </Badge>
              </p>
              <p><strong>本地存儲:</strong></p>
              <ul>
                <li>Token: {localStorage.getItem('authToken') ? '存在' : '不存在'}</li>
                <li>用戶數據: {localStorage.getItem('userData') ? '存在' : '不存在'}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthTest;