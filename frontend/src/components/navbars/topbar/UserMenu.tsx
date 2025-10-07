import { Dropdown, Image, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export const UserMenu: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleLogin = () => {
    navigate('/signin');
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
          登入
        </Button>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => navigate('/signup')}
        >
          註冊
        </Button>
      </div>
    );
  }

  return (
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
            src={user?.avatar || "/images/avatar/avatar-1.jpg"}
            className="rounded-circle"
          />
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
              {user?.email}
            </Link>
          </div>
          <div className="dropdown-divider mt-3 mb-2"></div>
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/profile">
          <i className="fe fe-user me-2"></i> 編輯個人資料
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/activity">
          <i className="fe fe-activity me-2"></i> 活動記錄
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/settings">
          <i className="fe fe-settings me-2"></i> 帳戶設定
        </Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>
          <i className="fe fe-power me-2"></i> 登出
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};