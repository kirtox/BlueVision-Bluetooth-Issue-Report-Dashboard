// import node module libraries
import { Row, Col, Card, Form, Button, Image, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

//import custom hook
import { useMounted } from "hooks/useMounted";
import { useAuth } from "../../contexts/AuthContext";

const SignUp = () => {
  const hasMounted = useMounted();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('請同意服務條款和隱私政策');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('密碼確認不符');
      return;
    }

    if (formData.password.length < 6) {
      setError('密碼長度至少需要 6 個字符');
      return;
    }

    setIsSubmitting(true);

    try {
      // 這裡應該調用註冊 API
      // 暫時直接登入
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/');
      } else {
        setError('註冊失敗，請稍後再試');
      }
    } catch (err) {
      setError('註冊時發生錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link to="/">
                <Image
                  src="/images/brand/logo/logo-primary.svg"
                  className="mb-2"
                  alt=""
                />
              </Link>
              <p className="mb-6">請填寫您的註冊資訊</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {hasMounted && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>用戶名</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="請輸入用戶名"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>電子郵件</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="請輸入電子郵件"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>密碼</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="請輸入密碼（至少6個字符）"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>確認密碼</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="請再次輸入密碼"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="mb-3">
                  <Form.Check type="checkbox" id="check-api-checkbox">
                    <Form.Check.Input 
                      type="checkbox" 
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <Form.Check.Label>
                      我同意 <Link to="#"> 服務條款 </Link> 和{" "}
                      <Link to="#"> 隱私政策</Link>
                    </Form.Check.Label>
                  </Form.Check>
                </div>

                <div>
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={isSubmitting || !agreed}
                    >
                      {isSubmitting ? '註冊中...' : '建立免費帳戶'}
                    </Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <Link to="/signin" className="fs-5">
                        已有帳戶？立即登入
                      </Link>
                    </div>
                    <div>
                      <Link
                        to="/forget-password"
                        className="text-inherit fs-5"
                      >
                        忘記密碼？
                      </Link>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignUp;
