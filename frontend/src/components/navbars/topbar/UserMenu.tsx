import { Dropdown, Image, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useRef, useState } from "react";

export const UserMenu: React.FC = () => {
  const { user, logout, isAuthenticated, updateAvatar } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleLogin = () => {
    navigate('/signin');
  };

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

  if (!isAuthenticated) {
    return (
      <div className="d-flex align-items-center">
        <Button
          variant="outline-primary"
          size="sm"
          className="me-2"
          onClick={handleLogin}
        >
          Log in
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <Dropdown className="ms-2">
        <Dropdown.Toggle
          as="a"
          bsPrefix=" "
          className="rounded-circle"
          id="dropdownUser"
          style={{ cursor: 'pointer' }}
        >
          <div className="avatar avatar-md avatar-indicators avatar-online">
            <Image
              alt="avatar"
              src={user?.avatar || "/images/avatar/avatar-default.jpg"}
              className="rounded-circle"
              style={{
                opacity: isUploading ? 0.6 : 1,
                transition: 'opacity 0.3s ease'
              }}
            />
            {isUploading && (
              <div
                className="position-absolute top-50 start-50 translate-middle"
                style={{ fontSize: '12px', color: '#007bff' }}
              >
                Uploading...
              </div>
            )}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu
          className="dropdown-menu dropdown-menu-end"
          align="end"
          aria-labelledby="dropdownUser"
        >
          <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=" ">
            <div className="lh-1">
              <h5 className="mb-1">{user?.username}</h5>
              <Link to="#" className="text-inherit fs-6">
                {user?.username}
              </Link>
            </div>
            <div className="dropdown-divider mt-3 mb-2"></div>
          </Dropdown.Item>
          <Dropdown.Item onClick={handleAvatarClick} disabled={isUploading}>
            <i className="fe fe-camera me-2"></i> Change avatar
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/pages/profile">
            <i className="fe fe-user me-2"></i> Profile
          </Dropdown.Item>
          {/* <Dropdown.Item as={Link} to="/activity">
          <i className="fe fe-activity me-2"></i> Activity
        </Dropdown.Item> */}
          {/* <Dropdown.Item as={Link} to="/settings">
          <i className="fe fe-settings me-2"></i> Settings
        </Dropdown.Item> */}
          <Dropdown.Item onClick={handleLogout}>
            <i className="fe fe-power me-2"></i> Log out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};