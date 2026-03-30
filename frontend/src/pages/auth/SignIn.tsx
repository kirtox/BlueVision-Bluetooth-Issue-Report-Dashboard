//import node module libraries
import { Row, Col, Card, Form, Button, Image, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

//import custom hook
import { useMounted } from "hooks/useMounted";
import { useAuth } from "../../contexts/AuthContext";
import { formatUsernameForStorage } from "../../utils/formatUtils";

const SignIn = () => {
  const hasMounted = useMounted();
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Load saved username from localStorage and auto-fill on page load
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      setFormData({ username: savedUsername, password: '' });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'username' ? formatUsernameForStorage(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        // Save username to localStorage after successful login
        localStorage.setItem('savedUsername', formData.username);
        navigate('/');
      } else {
        setError('Login failed, please check your username and password');
      }
    } catch (err) {
      setError('An error occurred while logging in. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login('guest', 'guest123');
      if (success) {
        navigate('/');
      } else {
        setError('Guest login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while logging in as guest. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link to="/">
                <Image
                  src="/images/banner/logo-bluevision-light.svg"
                  className="mb-2"
                  alt=""
                />
              </Link>
              <p className="mb-6">Please enter your user information.</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {hasMounted && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username here"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="**********"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div>
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Logging...' : 'Login'}
                    </Button>
                  </div>
                  <div className="d-grid mt-3">
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={handleGuestLogin}
                      disabled={isSubmitting}
                    >
                      Guest Login
                    </Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <Link to="/signup" className="fs-5">
                        Create An Account
                      </Link>
                    </div>
                    <div>
                      <Link
                        to="/forget-password"
                        className="text-inherit fs-5"
                      >
                        Forget your password？
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

export default SignIn;
