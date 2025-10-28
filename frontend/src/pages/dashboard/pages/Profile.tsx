// import node module libraries
import { Col, Row, Container, Card, Image, Badge } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { useRef, useState } from "react";

const Profile = () => {
  const { user, updateAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
                  <p className="mb-0">{user.username}</p>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>


    </Container>
  );
};

export default Profile;
