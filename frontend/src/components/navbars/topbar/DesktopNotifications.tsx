import { ListGroup, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotificationProps } from "types";
import { NotificationList } from "./NotificationList";

interface DesktopNotificationProps {
  data: NotificationProps[];
}

export const DesktopNotifications: React.FC<DesktopNotificationProps> = ({
  data,
}) => {
  return (
    <ListGroup
      as="ul"
      bsPrefix="navbar-nav"
      className="navbar-right-wrap ms-auto d-flex nav-top-wrap"
    >
      <Dropdown as="li" className="stopevent">
        <Dropdown.Toggle
          as="a"
          bsPrefix=" "
          id="dropdownNotification"
          className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted"
        >
          <i className="fe fe-bell"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu
          className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
          aria-labelledby="dropdownNotification"
          align="end"
          show
        >
          <Dropdown.Item className="mt-3" bsPrefix=" " as="div">
            <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
              <span className="h4 mb-0">Notifications</span>
              <Link to="/" className="text-muted">
                <span className="align-middle">
                  <i className="fe fe-settings me-1"></i>
                </span>
              </Link>
            </div>

            <NotificationList notificationItems={data} />
            <div className="border-top px-3 pt-3 pb-3">
              <Link
                to="/dashboard/notification-history"
                className="text-link fw-semi-bold"
              >
                See all Notifications
              </Link>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

    </ListGroup>
  );
};
