import React, { useEffect } from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import { Report } from "types";
import { useAuth } from "../../contexts/AuthContext";

interface ReportEditFormProps {
  report: Report | null;
  onChange: (report: Report) => void;
  readonly?: boolean;
}

const ReportEditForm: React.FC<ReportEditFormProps> = ({ report, onChange, readonly = false }) => {
  const { user } = useAuth();

  // Auto-fill op_name with username for new reports
  useEffect(() => {
    if (report && report.id === 0 && user && !report.op_name) {
      onChange({ ...report, op_name: user.username });
    }
  }, [report, user]);

  if (!report) return null;

  const handleFieldChange = (field: keyof Report, value: any) => {
    onChange({ ...report, [field]: value });
  };

  const renderField = (
    label: string,
    field: keyof Report,
    type: string = "text",
    colSize: number = 6,
    customReadOnly?: boolean
  ) => (
    <Form.Group as={Col} md={colSize} className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Control
        type={type}
        value={report[field] || ""}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        readOnly={customReadOnly !== undefined ? customReadOnly : readonly}
      />
    </Form.Group>
  );

  const renderSelectField = (
    label: string,
    field: keyof Report,
    options: string[],
    colSize: number = 6
  ) => (
    <Form.Group as={Col} md={colSize} className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Select
        value={report[field] || ""}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        // onChange={(e) => {
        //     const value = e.target.value;
        //     handleFieldChange(field, value);
    
        //     // If Modern Standby is selected as N, clear dependent fields
        //     if (field === "modern_standby" && value === "N") {
        //       handleFieldChange("ms_period", "");
        //       handleFieldChange("ms_os_waiting_time", "");
        //     }
    
        //     // If Hibernation is selected as N, clear dependent fields
        //     if (field === "s4" && value === "N") {
        //       handleFieldChange("s4_period", "");
        //       handleFieldChange("s4_os_waiting_time", "");
        //     }
    
        //     // If Warm Boot is selected as N, clear dependent fields
        //     if (field === "warm_boot" && value === "N") {
        //       handleFieldChange("wb_period", "");
        //       handleFieldChange("wb_os_waiting_time", "");
        //     }
    
        //     // If Cold Boot is selected as N, clear dependent fields
        //     if (field === "cold_boot" && value === "N") {
        //       handleFieldChange("cb_period", "");
        //       handleFieldChange("cb_os_waiting_time", "");
        //     }
    
        //     // APM clear APM period
        //     if (field === "apm" && value === "N") {
        //       handleFieldChange("apm_period", "");
        //     }
        // }}
        disabled={readonly}
      >
        <option value="" disabled hidden>-- Please select --</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </Form.Select>
    </Form.Group>
  );
  

  return (
    <Form>

      {/* Basic Info. */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">Operator</Card.Title>
          <Row>
            {renderField(
              "Operator", 
              "op_name", 
              "text", 
              6, 
              // User role cannot edit op_name, Administrator can
              user?.role === "User" || readonly
            )}
          </Row>
          <hr></hr>
          <Card.Title className="fw-bold">Date</Card.Title>
          <Row>
            {renderField("Date", "date", "datetime-local")}
          </Row>
          <Card.Title className="fw-bold">Serial Number</Card.Title>
          <Row>
            {renderField("Serial Number", "serial_num")}
          </Row>
        </Card.Body>
      </Card>

      {/* System Info. */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
            <Card.Title className="fw-bold">System Information</Card.Title>
          <Row>
            {renderField("OS Version", "os_version")}
            {renderField("Platform Brand", "platform_brand")}
            {renderField("Platform", "platform")}
            {renderField("Platform Phase", "platform_phase")}
            {renderField("Platform BIOS", "platform_bios")}
            {renderField("CPU", "cpu")}
            {renderField("MS Teams Version", "msft_teams_version")}
            {renderSelectField("Power Type", "power_type", ["AC", "DC"])}
          </Row>
        </Card.Body>
      </Card>

      {/* Wireless Info. */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">Wireless Module</Card.Title>
          <Row>
            {renderField("WLAN", "wlan")}
            {renderField("WLAN Phase", "wlan_phase")}
            {renderField("WiFi Name", "wifi_name")}
            {renderField("WiFi Band", "wifi_band")}
            {renderField("Bluetooth Interface", "bt_interface")}
          </Row>
          <hr></hr>
          <Card.Title className="fw-bold">Drivers Version</Card.Title>
          <Row>
            {renderField("Bluetooth Driver", "bt_driver")}
            {renderField("WiFi Driver", "wifi_driver")}
            {renderField("Audio Driver", "audio_driver")}
          </Row>
        </Card.Body>
      </Card>

      {/* WRT settings */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">WRT Info.</Card.Title>
          <Row>
            {renderField("WRT Version", "wrt_version")}
            {renderField("WRT Preset", "wrt_preset")}
          </Row>
        </Card.Body>
      </Card>

      {/* Test scenario */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">Test Scenario</Card.Title>
          <Row>
            {renderField("Scenario", "scenario")}
          </Row>
          <hr></hr>
          <Card.Title className="fw-bold">Test Accessories</Card.Title>
          <Row>
            {renderField("Mouse Brand", "mouse_brand")}
            {renderField("Mouse BT", "mouse_bt")}
            {renderField("Mouse", "mouse")}
            {renderField("Mouse Click Period", "mouse_click_period")}
            {renderField("Keyboard Brand", "keyboard_brand")}
            {renderField("Keyboard BT", "keyboard_bt")}
            {renderField("Keyboard", "keyboard")}
            {renderField("Keyboard Click Period", "keyboard_click_period")}
            {renderField("Headset Brand", "headset_brand")}
            {renderField("Headset BT", "headset_bt")}
            {renderField("Headset", "headset")}
            {renderField("Speaker Brand", "Speaker_brand")}
            {renderField("Speaker BT", "Speaker_bt")}
            {renderField("Speaker", "Speaker")}
            {renderField("Phone Brand", "phone_brand")}
            {renderField("Phone", "phone")}
            {renderField("Device1 Brand", "device1_brand")}
            {renderField("Device", "device1")}
          </Row>
        </Card.Body>
      </Card>

      {/* Power Cycles */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">Power Cycles</Card.Title>
          <Row>
            {renderSelectField("Modern Standby", "modern_standby", ["Y", "N"])}
            {renderField("MS Period", "ms_period")}
            {renderField("MS Waiting Time", "ms_os_waiting_time")}

            {renderSelectField("Hibernation", "s4", ["Y", "N"])}
            {renderField("Hibernation Period", "s4_period")}
            {renderField("Hibernation Waiting Time", "s4_os_waiting_time")}

            {renderSelectField("Warm Boot", "warm_boot", ["Y", "N"])}
            {renderField("WB Period", "wb_period")}
            {renderField("WB Waiting Time", "wb_os_waiting_time")}

            {renderSelectField("Cold Boot", "cold_boot", ["Y", "N"])}
            {renderField("CB Period", "cb_period")}
            {renderField("CB Waiting Time", "cb_os_waiting_time")}
          </Row>
          <hr></hr>
          <Card.Title className="fw-bold">Other functions</Card.Title>
          <Row>
            {renderSelectField("APM", "apm", ["Y", "N"])}
            {renderField("APM Period", "apm_period")}
            {renderSelectField("OPP", "opp", ["Y", "N"])}
            {renderSelectField("Swift Pair", "swift_pair", ["Y", "N"])}
          </Row>
        </Card.Body>
      </Card>

      {/* Issue Info. */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">Issue Info.</Card.Title>
          <Row>
            {renderSelectField("Urgent Level", "urgent_level", ["Fireball", "P1", "P2", "P3"])}
            {renderField("Fix in ? WW", "fix_work_week")}
            {renderField("Fix in ? BT driver", "fix_bt_driver")}
            {renderField("Jira ID", "jira_id")}
            {renderField("IPS ID", "ips_id")}
            {renderField("HSD ID", "hsd_id")}
          </Row>
        </Card.Body>
      </Card>

      {/* Summary */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">Summary</Card.Title>
          <Row>
            {renderSelectField("Result", "result", ["Pass", "Fail", "On-Going"])}
            {renderField("Cycles", "cycles")}
            {renderField("Fail Cycles", "fail_cycles")}
            {renderField("Duration (seconds)", "duration")}
            {renderField("Log Path", "log_path")}
            {/* {renderSelectField("Current Status", "current_status", ["Finish", "Running", "Stop"])} */}
          </Row>
        </Card.Body>
      </Card>

      {/* Add other area, for example: test scenario, device Info., etc. */}
    </Form>
  );
};

export default ReportEditForm;
