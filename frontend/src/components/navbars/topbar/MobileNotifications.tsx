import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { NotificationList } from "./NotificationList";
import { NotificationProps } from "types";

interface MobileNotificationProps {
  data: NotificationProps[];
}

export const MobileNotifications: React.FC<MobileNotificationProps> = ({
  data,
}) => {
  return (
    <Dropdown className="stopevent">
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
          {/* <div className="border-top px-3 pt-3 pb-3">
            <Link
              to="/dashboard/notification-history"
              className="text-link fw-semi-bold"
            >
              See all Notifications
            </Link>
          </div> */}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
