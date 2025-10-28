// import node module libraries
import { Col, Row, Container, Card, Image, Badge, Button, Modal, Form, Alert } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { useRef, useState } from "react";
import { formatUsernameForDisplay } from "../../../utils/formatUtils";

const Profile = () => {
  const { user, updateAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Change Password Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('The file size cannot exceed 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const success = await updateAvatar(file);
      if (success) {
        console.log('Avatar updated successfully');
      } else {
        alert('Avatar update failed, please try again later');
      }
    } catch (error) {
      console.error('Avatar update error:', error);
      alert('Avatar update failed, please try again later');
    } finally {
      setIsUploading(false);
      // Clear input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administrator':
        return 'danger';
      case 'user':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const handlePasswordModalOpen = () => {
    setPasswordForm({
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswordModal(true);
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordForm.email) {
      setPasswordError('Please enter your email address');
      return;
    }

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordError('Please enter a new password');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    // Check if email matches user's registered email
    if (user?.email && passwordForm.email !== user.email) {
      setPasswordError('Email address does not match your registered email');
      return;
    }

    setIsChangingPassword(true);

    try {
      // TODO: Implement password change API call
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          email: passwordForm.email,
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Password change failed');
      }

      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => {
        handlePasswordModalClose();
      }, 2000);

    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError(error instanceof Error ? error.message : 'Password change failed. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <Container fluid className="p-6">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <h4>Loading user profile...</h4>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">User Profile</h1>
              <p className="mb-0">Manage your account information and settings</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Profile Card */}
        <Col lg={4} md={6} sm={12} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center d-flex align-items-center justify-content-center" style={{ minHeight: '280px' }}>
              <div className="position-relative d-inline-block">
                <Image
                  src={user.avatar || "/images/avatar/avatar-default.jpg"}
                  alt="User Avatar"
                  roundedCircle
                  className="border border-3 border-white shadow"
                  style={{
                    width: '80%',
                    maxWidth: '220px',
                    minWidth: '120px',
                    aspectRatio: '1 / 1',
                    opacity: isUploading ? 0.6 : 1,
                    transition: 'opacity 0.3s ease',
                    cursor: 'pointer',
                    objectFit: 'cover'
                  }}
                  onClick={handleAvatarClick}
                />
                {isUploading && (
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Uploading...</span>
                    </div>
                  </div>
                )}
                <div
                  className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-3"
                  style={{ cursor: 'pointer' }}
                  onClick={handleAvatarClick}
                >
                  <i className="fe fe-camera text-white" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Account Information */}
        <Col lg={8} md={6} sm={12} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Account Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <div className="border-bottom pb-2 mb-2">
                    <small className="text-muted text-uppercase fw-bold">User ID</small>
                  </div>
                  <p className="mb-0">{user.id}</p>
                </Col>

                <Col md={6} className="mb-3">
                  <div className="border-bottom pb-2 mb-2">
                    <small className="text-muted text-uppercase fw-bold">Username</small>
                  </div>
                  <p className="mb-0">{formatUsernameForDisplay(user.username)}</p>
                </Col>

                <Col md={6} className="mb-3">
                  <div className="border-bottom pb-2 mb-2">
                    <small className="text-muted text-uppercase fw-bold">Email Address</small>
                  </div>
                  <p className="mb-0">{user.email || 'Not provided'}</p>
                </Col>

                <Col md={6} className="mb-3">
                  <div className="border-bottom pb-2 mb-2">
                    <small className="text-muted text-uppercase fw-bold">Role</small>
                  </div>
                  <Badge bg={getRoleBadgeColor(user.role)} className="fs-6">
                    {user.role}
                  </Badge>
                </Col>

                <Col md={6} className="mb-3">
                  <div className="border-bottom pb-2 mb-2">
                    <small className="text-muted text-uppercase fw-bold">Account Status</small>
                  </div>
                  <Badge bg="success" className="fs-6">
                    <i className="fe fe-check-circle me-1"></i>
                    Active
                  </Badge>
                </Col>

                <Col md={6} className="mb-3">
                  <div className="border-bottom pb-2 mb-2">
                    <small className="text-muted text-uppercase fw-bold">Avatar</small>
                  </div>
                  <p className="mb-0">
                    {user.avatar ? (
                      <span className="text-success">
                        <i className="fe fe-check-circle me-1"></i>
                        Custom avatar uploaded
                      </span>
                    ) : (
                      <span className="text-muted">
                        <i className="fe fe-user me-1"></i>
                        Using default avatar
                      </span>
                    )}
                  </p>
                </Col>
              </Row>

              <hr className="my-4" />

              <Row>
                <Col md={12} className="text-center">
                  <Button
                    variant="outline-primary"
                    onClick={handlePasswordModalOpen}
                    className="me-2"
                  >
                    <i className="fe fe-lock me-2"></i>
                    Change Password
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={handlePasswordModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordSubmit}>
          <Modal.Body>
            {passwordError && (
              <Alert variant="danger" className="mb-3">
                <i className="fe fe-alert-circle me-2"></i>
                {passwordError}
              </Alert>
            )}

            {passwordSuccess && (
              <Alert variant="success" className="mb-3">
                <i className="fe fe-check-circle me-2"></i>
                {passwordSuccess}
              </Alert>
            )}

            <div className="mb-3">
              <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your registered email address"
                value={passwordForm.email}
                onChange={(e) => handlePasswordFormChange('email', e.target.value)}
                required
                disabled={isChangingPassword}
              />
              <Form.Text className="text-muted">
                Please enter the email address you used when registering your account.
              </Form.Text>
            </div>

            <div className="mb-3">
              <Form.Label>Current Password <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your current password"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                required
                disabled={isChangingPassword}
              />
            </div>

            <div className="mb-3">
              <Form.Label>New Password <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                required
                disabled={isChangingPassword}
                minLength={6}
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long.
              </Form.Text>
            </div>

            <div className="mb-3">
              <Form.Label>Confirm New Password <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                required
                disabled={isChangingPassword}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handlePasswordModalClose}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Changing...
                </>
              ) : (
                <>
                  <i className="fe fe-save me-2"></i>
                  Change Password
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Profile;
