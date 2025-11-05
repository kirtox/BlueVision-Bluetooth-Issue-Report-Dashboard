// import node module libraries
import { Row, Col, Card, Form, Button, Image, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

//import custom hook
import { useMounted } from "hooks/useMounted";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { formatUsernameForStorage } from "../../utils/formatUtils";


const SignUp = () => {
  const hasMounted = useMounted();
  const { register, isAuthenticated } = useAuth();
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
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({
    checking: false,
    available: null,
    message: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Debounced username availability check
  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      if (!username || username.length < 3) {
        setUsernameStatus({
          checking: false,
          available: null,
          message: username.length > 0 && username.length < 3 ? 'Username must be at least 3 characters' : ''
        });
        return;
      }

      setUsernameStatus(prev => ({ ...prev, checking: true }));

      try {
        const result = await authService.checkUsernameAvailability(username);
        setUsernameStatus({
          checking: false,
          available: result.available,
          message: result.available ? 'Username is available' : 'Username is already taken'
        });
      } catch (error) {
        setUsernameStatus({
          checking: false,
          available: null,
          message: 'Error checking username availability'
        });
      }
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'username') {
      // Convert username to lowercase
      const lowercaseValue = formatUsernameForStorage(value);
      setFormData({
        ...formData,
        [name]: lowercaseValue
      });
      
      // Debounced username availability check
      const timeoutId = setTimeout(() => {
        checkUsernameAvailability(lowercaseValue);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setFormData({
        ...formData,
        [name]: name === 'email' ? value.toLowerCase() : value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password confirmation does not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (usernameStatus.available === false) {
      setError('Username is already taken, please choose another one');
      return;
    }

    if (usernameStatus.available === null && formData.username.length >= 3) {
      setError('Please wait for username availability check');
      return;
    }

    setIsSubmitting(true);

    try {
      // Username is already in lowercase format, use directly
      const success = await register(formData.username, formData.password, formData.email);
      if (success) {
        navigate('/');
      } else {
        setError('Registration failed, please try again later');
      }
    } catch (err) {
      setError('An error occurred while registering, please try again later');
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
              <p className="mb-6">Please fill in your registration information</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {hasMounted && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Please enter username (at least 3 characters)"
                    value={formData.username}
                    onChange={handleChange}
                    isValid={usernameStatus.available === true}
                    isInvalid={usernameStatus.available === false}
                    required
                  />
                  {usernameStatus.checking && (
                    <Form.Text className="text-muted">
                      Checking username availability...
                    </Form.Text>
                  )}
                  {usernameStatus.message && !usernameStatus.checking && (
                    <Form.Text className={usernameStatus.available ? "text-success" : "text-danger"}>
                      {usernameStatus.message}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Please enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Please enter a password (at least 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Please enter password again"
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
                      I agree to the <Link to="#"> Terms of Service </Link> and{" "}
                      <Link to="#"> Privacy Policy</Link>.
                    </Form.Check.Label>
                  </Form.Check>
                </div>

                <div>
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={isSubmitting || !agreed || usernameStatus.available === false || usernameStatus.checking}
                    >
                      {isSubmitting ? 'Registering...' : 'Create an account'}
                    </Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <Link to="/signin" className="fs-5">
                        Already membe? Login
                      </Link>
                    </div>
                    <div>
                      <Link
                        to="/forget-password"
                        className="text-inherit fs-5"
                      >
                        Forgot your password?
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
