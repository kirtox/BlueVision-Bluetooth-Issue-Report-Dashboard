import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col, Tab, Tabs, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Report } from "types";
import { useAuth } from "../../contexts/AuthContext";

interface ReportEditFormProps {
  report: Report | null;
  onChange: (report: Report) => void;
  readonly?: boolean;
}

const ReportEditForm: React.FC<ReportEditFormProps> = ({ report, onChange, readonly = false }) => {
  const { user } = useAuth();
  const [expandedAccessories, setExpandedAccessories] = useState<Record<string, boolean>>({});

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

  // ─── Section Header ────────────────────────────────────────────────────────
  const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
    <div className="d-flex align-items-center mb-3 mt-2">
      <div
        className="d-flex align-items-center justify-content-center rounded me-2 text-white"
        style={{ width: 28, height: 28, backgroundColor: "var(--bs-primary)", fontSize: 13, flexShrink: 0 }}
      >
        <i className={icon} />
      </div>
      <span className="fw-semibold text-dark" style={{ fontSize: "0.95rem", letterSpacing: "0.01em" }}>
        {title}
      </span>
    </div>
  );

  // ─── Plain text field ──────────────────────────────────────────────────────
  const renderField = (
    label: string,
    field: keyof Report,
    type: string = "text",
    colSize: number = 6,
    customReadOnly?: boolean
  ) => {
    const isAutoFilled = customReadOnly === true && customReadOnly !== readonly;
    return (
      <Form.Group as={Col} md={colSize} className="mb-3">
        <Form.Label className="fw-semibold text-secondary d-flex align-items-center gap-1" style={{ fontSize: "0.82rem" }}>
          {label}
          {isAutoFilled && (
            <OverlayTrigger placement="top" overlay={<Tooltip>Auto-filled based on CPU</Tooltip>}>
              <i className="fas fa-lock text-muted" style={{ fontSize: "0.68rem", cursor: "help" }} />
            </OverlayTrigger>
          )}
        </Form.Label>
        <Form.Control
          type={type}
          value={report[field] || ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          readOnly={customReadOnly !== undefined ? customReadOnly : readonly}
          style={{
            fontSize: "0.9rem",
            backgroundColor: isAutoFilled ? "#f3f4f6" : undefined,
            color: isAutoFilled ? "#6c757d" : undefined,
          }}
        />
      </Form.Group>
    );
  };

  // ─── Select field ──────────────────────────────────────────────────────────
  const renderSelectField = (
    label: string,
    field: keyof Report,
    options: string[],
    colSize: number = 6
  ) => (
    <Form.Group as={Col} md={colSize} className="mb-3">
      <Form.Label className="fw-semibold text-secondary" style={{ fontSize: "0.82rem" }}>{label}</Form.Label>
      <Form.Select
        value={report[field] || ""}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        disabled={readonly}
        style={{ fontSize: "0.9rem" }}
      >
        <option value="" disabled hidden>-- Please select --</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </Form.Select>
    </Form.Group>
  );

  // ─── Toggle switch (Y/N) ───────────────────────────────────────────────────
  const renderToggle = (label: string, field: keyof Report) => {
    const isOn = report[field] === "Y";
    return (
      <div className="d-flex align-items-center gap-2 mb-1">
        <span className="fw-semibold text-secondary" style={{ fontSize: "0.82rem", minWidth: 140 }}>{label}</span>
        <Form.Check
          type="switch"
          id={`switch-${field as string}`}
          checked={isOn}
          onChange={(e) => handleFieldChange(field, e.target.checked ? "Y" : "N")}
          disabled={readonly}
          className="mb-0"
        />
        <span
          className={`badge ${isOn ? "bg-success" : "bg-secondary"}`}
          style={{ fontSize: "0.72rem", minWidth: 24, opacity: 0.85 }}
        >
          {isOn ? "Y" : "N"}
        </span>
      </div>
    );
  };

  // ─── Result selector (colored buttons) ────────────────────────────────────
  const resultConfig: Record<string, { color: string; icon: string }> = {
    Pass:    { color: "#198754", icon: "fas fa-check-circle" },
    Fail:    { color: "#dc3545", icon: "fas fa-times-circle" },
    Warning: { color: "#fd7e14", icon: "fas fa-exclamation-triangle" },
    Block:   { color: "#6c757d", icon: "fas fa-ban" },
    Triaged: { color: "#0d6efd", icon: "fas fa-search" },
  };

  const ResultSelector = () => (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold text-secondary d-block" style={{ fontSize: "0.82rem" }}>Result</Form.Label>
      <div className="d-flex flex-wrap gap-2">
        {Object.entries(resultConfig).map(([opt, cfg]) => {
          const selected = report.result === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => !readonly && handleFieldChange("result", opt)}
              style={{
                border: `2px solid ${cfg.color}`,
                borderRadius: 8,
                padding: "5px 18px",
                background: selected ? cfg.color : "transparent",
                color: selected ? "#fff" : cfg.color,
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: readonly ? "default" : "pointer",
                transition: "all 0.15s",
                opacity: readonly && !selected ? 0.35 : 1,
              }}
            >
              <i className={`${cfg.icon} me-1`} />{opt}
            </button>
          );
        })}
      </div>
    </Form.Group>
  );

  // ─── Urgent level selector (colored buttons) ───────────────────────────────
  const urgentConfig: Record<string, { color: string; label: string; textDark?: boolean }> = {
    None: { color: "#adb5bd", label: "None" },
    P1:   { color: "#dc3545", label: "P1 — Critical" },
    P2:   { color: "#fd7e14", label: "P2 — High" },
    P3:   { color: "#ffc107", label: "P3 — Medium", textDark: true },
  };

  const UrgentSelector = () => (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold text-secondary d-block" style={{ fontSize: "0.82rem" }}>Urgent Level</Form.Label>
      <div className="d-flex flex-wrap gap-2">
        {Object.entries(urgentConfig).map(([opt, cfg]) => {
          const selected = report.urgent_level === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => !readonly && handleFieldChange("urgent_level", opt)}
              style={{
                border: `2px solid ${cfg.color}`,
                borderRadius: 8,
                padding: "5px 18px",
                background: selected ? cfg.color : "transparent",
                color: selected ? (cfg.textDark ? "#333" : "#fff") : cfg.color,
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: readonly ? "default" : "pointer",
                transition: "all 0.15s",
                opacity: readonly && !selected ? 0.35 : 1,
              }}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>
    </Form.Group>
  );

  // ─── Collapsible accessory group ──────────────────────────────────────────
  const AccessoryGroup = ({
    groupKey,
    title,
    fields,
    children,
  }: {
    groupKey: string;
    title: string;
    fields: (keyof Report)[];
    children: React.ReactNode;
  }) => {
    const hasData = fields.some((f) => report[f]);
    const isExpanded = expandedAccessories[groupKey] ?? hasData;
    return (
      <div className="border rounded mb-2" style={{ overflow: "hidden" }}>
        <button
          type="button"
          className="w-100 d-flex align-items-center justify-content-between px-3 py-2 border-0"
          style={{ background: hasData ? "#eef3ff" : "#f8f9fa", cursor: "pointer" }}
          onClick={() => setExpandedAccessories((prev) => ({ ...prev, [groupKey]: !isExpanded }))}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: hasData ? "var(--bs-primary)" : "#6c757d" }}>
            {hasData && <i className="fas fa-circle me-2" style={{ fontSize: "0.5rem", verticalAlign: "middle" }} />}
            {title}
          </span>
          <i className={`fas fa-chevron-${isExpanded ? "up" : "down"} text-muted`} style={{ fontSize: "0.72rem" }} />
        </button>
        {isExpanded && (
          <div className="px-3 pt-3 pb-1">
            <Row>{children}</Row>
          </div>
        )}
      </div>
    );
  };

  // ─── Power cycle row ──────────────────────────────────────────────────────
  const PowerCycleRow = ({
    label,
    enableField,
    periodField,
    waitField,
  }: {
    label: string;
    enableField: keyof Report;
    periodField: keyof Report;
    waitField: keyof Report;
  }) => {
    const isEnabled = report[enableField] === "Y";
    return (
      <Row className="align-items-center py-2 border-bottom mx-0 gx-2">
        <Col md={4} className="d-flex align-items-center">
          {renderToggle(label, enableField)}
        </Col>
        <Col md={4}>
          <Form.Control
            size="sm"
            type="text"
            value={report[periodField] || ""}
            onChange={(e) => handleFieldChange(periodField, e.target.value)}
            readOnly={readonly || !isEnabled}
            placeholder={isEnabled ? "" : "—"}
            style={{
              fontSize: "0.88rem",
              backgroundColor: !isEnabled ? "#f3f4f6" : undefined,
              color: !isEnabled ? "#adb5bd" : undefined,
            }}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            size="sm"
            type="text"
            value={report[waitField] || ""}
            onChange={(e) => handleFieldChange(waitField, e.target.value)}
            readOnly={readonly || !isEnabled}
            placeholder={isEnabled ? "" : "—"}
            style={{
              fontSize: "0.88rem",
              backgroundColor: !isEnabled ? "#f3f4f6" : undefined,
              color: !isEnabled ? "#adb5bd" : undefined,
            }}
          />
        </Col>
      </Row>
    );
  };


  return (
    <Form>

      {/* ── Readonly Banner ─────────────────────────────────────────────── */}
      {readonly && (
        <Alert variant="info" className="py-2 mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.88rem" }}>
          <i className="fas fa-eye" />
          <span>This report is in <strong>view-only</strong> mode.</span>
        </Alert>
      )}

      <Tabs defaultActiveKey="basic" className="mb-4" fill>

        {/* ── Tab 1: Basic Info ─────────────────────────────────────────── */}
        <Tab eventKey="basic" title={<><i className="fas fa-user me-2" />Basic Info</>}>
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body className="p-4">
              <SectionHeader icon="fas fa-id-badge" title="Basic Information" />
              <Row>
                {renderField("Operator", "op_name", "text", 4, user?.role === "User" || readonly)}
                {renderField("Date", "date", "datetime-local", 4)}
                {renderField("Serial Number", "serial_num", "text", 4)}
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body className="p-4">
              <SectionHeader icon="fas fa-desktop" title="System Information" />
              <Row>
                {renderField("OS Version", "os_version", "text", 4)}
                {renderField("Platform Brand", "short_platform_brand", "text", 4)}
                {renderField("Platform", "short_platform", "text", 4)}
                {renderField("Platform Phase", "platform_phase", "text", 4)}
                {renderField("Platform BIOS", "platform_bios", "text", 4)}
                {renderField("CPU", "cpu", "text", 4)}
                {renderField("CPU Codename", "cpu_codename", "text", 4, true)}
                {renderField("MS Teams Version", "msft_teams_version", "text", 4)}
                {renderSelectField("Power Type", "power_type", ["AC", "DC"], 4)}
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        {/* ── Tab 2: Wireless ───────────────────────────────────────────── */}
        <Tab eventKey="wireless" title={<><i className="fas fa-wifi me-2" />Wireless</>}>
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body className="p-4">
              <SectionHeader icon="fas fa-broadcast-tower" title="Wireless Module" />
              <Row>
                {renderField("WLAN", "wlan", "text", 4)}
                {renderField("WLAN Phase", "wlan_phase", "text", 4)}
                {renderField("WiFi Name", "wifi_name", "text", 4)}
                {renderField("WiFi Band", "wifi_band", "text", 4)}
                {renderField("Bluetooth Interface", "bt_interface", "text", 4)}
              </Row>
              <SectionHeader icon="fas fa-microchip" title="Drivers Version" />
              <Row>
                {renderField("Bluetooth Driver", "bt_driver", "text", 4)}
                {renderField("WiFi Driver", "wifi_driver", "text", 4)}
                {renderField("Audio Driver", "audio_driver", "text", 4)}
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body className="p-4">
              <SectionHeader icon="fas fa-sliders-h" title="WRT Info." />
              <Row>
                {renderField("WRT Version", "wrt_version", "text", 4)}
                {renderField("WRT Preset", "wrt_preset", "text", 4)}
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        {/* ── Tab 3: Test Scenario ──────────────────────────────────────── */}
        <Tab eventKey="test" title={<><i className="fas fa-clipboard-list me-2" />Test Scenario</>}>
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body className="p-4">
              <SectionHeader icon="fas fa-vial" title="Test Scenario" />
              <Row>
                {renderField("Scenario", "short_scenario", "text", 6)}
                {renderField("Detailed Scenario", "scenario", "text", 6)}
              </Row>

              <SectionHeader icon="fas fa-toolbox" title="Test Accessories" />
              <p className="text-muted mb-2" style={{ fontSize: "0.78rem" }}>
                <i className="fas fa-info-circle me-1" />
                Groups with filled data are highlighted. Click to expand / collapse.
              </p>
              <AccessoryGroup groupKey="mouse" title="Mouse" fields={["mouse_brand", "mouse_bt", "mouse", "mouse_click_period"]}>
                {renderField("Brand", "mouse_brand", "text", 3)}
                {renderField("BT Version", "mouse_bt", "text", 3)}
                {renderField("Model", "mouse", "text", 3)}
                {renderField("Click Period", "mouse_click_period", "text", 3)}
              </AccessoryGroup>
              <AccessoryGroup groupKey="keyboard" title="Keyboard" fields={["keyboard_brand", "keyboard_bt", "keyboard", "keyboard_click_period"]}>
                {renderField("Brand", "keyboard_brand", "text", 3)}
                {renderField("BT Version", "keyboard_bt", "text", 3)}
                {renderField("Model", "keyboard", "text", 3)}
                {renderField("Click Period", "keyboard_click_period", "text", 3)}
              </AccessoryGroup>
              <AccessoryGroup groupKey="headset" title="Headset" fields={["headset_brand", "headset_bt", "headset"]}>
                {renderField("Brand", "headset_brand", "text", 4)}
                {renderField("BT Version", "headset_bt", "text", 4)}
                {renderField("Model", "headset", "text", 4)}
              </AccessoryGroup>
              <AccessoryGroup groupKey="speaker" title="Speaker" fields={["speaker_brand", "speaker_bt", "speaker"]}>
                {renderField("Brand", "speaker_brand", "text", 4)}
                {renderField("BT Version", "speaker_bt", "text", 4)}
                {renderField("Model", "speaker", "text", 4)}
              </AccessoryGroup>
              <AccessoryGroup groupKey="phone" title="Phone" fields={["phone_brand", "phone"]}>
                {renderField("Brand", "phone_brand", "text", 6)}
                {renderField("Model", "phone", "text", 6)}
              </AccessoryGroup>
              <AccessoryGroup groupKey="device1" title="Other Device" fields={["device1_brand", "device1"]}>
                {renderField("Brand", "device1_brand", "text", 6)}
                {renderField("Model", "device1", "text", 6)}
              </AccessoryGroup>
            </Card.Body>
          </Card>
        </Tab>

        {/* ── Tab 4: Power Cycles ───────────────────────────────────────── */}
        <Tab eventKey="power" title={<><i className="fas fa-bolt me-2" />Power Cycles</>}>
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body className="p-4">
              <SectionHeader icon="fas fa-sync-alt" title="Power Cycles" />
              <Row className="mx-0 mb-1 gx-2">
                <Col md={4}><span className="text-muted" style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Cycle Type</span></Col>
                <Col md={4}><span className="text-muted" style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Period</span></Col>
                <Col md={4}><span className="text-muted" style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Waiting Time</span></Col>
              </Row>
              <div className="border rounded overflow-hidden mb-4">
                <PowerCycleRow label="Modern Standby" enableField="modern_standby" periodField="ms_period" waitField="ms_os_waiting_time" />
                <PowerCycleRow label="Hibernation (S4)" enableField="s4" periodField="s4_period" waitField="s4_os_waiting_time" />
                <PowerCycleRow label="Warm Boot" enableField="warm_boot" periodField="wb_period" waitField="wb_os_waiting_time" />
                <PowerCycleRow label="Cold Boot" enableField="cold_boot" periodField="cb_period" waitField="cb_os_waiting_time" />
              </div>

              <SectionHeader icon="fas fa-cogs" title="Other Functions" />
              <Row className="mb-2">
                <Col md={2} className="mb-3">
                  <Form.Label className="fw-semibold text-secondary d-block" style={{ fontSize: "0.82rem" }}>APM</Form.Label>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <Form.Check
                      type="switch"
                      id="switch-apm"
                      checked={report.apm === "Y"}
                      onChange={(e) => handleFieldChange("apm", e.target.checked ? "Y" : "N")}
                      disabled={readonly}
                      className="mb-0"
                    />
                    <span className={`badge ${report.apm === "Y" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "0.72rem" }}>
                      {report.apm === "Y" ? "Y" : "N"}
                    </span>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Label className="fw-semibold text-secondary d-block" style={{ fontSize: "0.82rem" }}>APM Period</Form.Label>
                  <Form.Control
                    type="text"
                    value={report.apm_period || ""}
                    onChange={(e) => handleFieldChange("apm_period", e.target.value)}
                    readOnly={readonly || report.apm !== "Y"}
                    style={{
                      fontSize: "0.9rem",
                      backgroundColor: report.apm !== "Y" ? "#f3f4f6" : undefined,
                      color: report.apm !== "Y" ? "#adb5bd" : undefined,
                    }}
                  />
                </Col>
                <Col md={2} className="mb-3">
                  <Form.Label className="fw-semibold text-secondary d-block" style={{ fontSize: "0.82rem" }}>OPP</Form.Label>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <Form.Check
                      type="switch"
                      id="switch-opp"
                      checked={report.opp === "Y"}
                      onChange={(e) => handleFieldChange("opp", e.target.checked ? "Y" : "N")}
                      disabled={readonly}
                      className="mb-0"
                    />
                    <span className={`badge ${report.opp === "Y" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "0.72rem" }}>
                      {report.opp === "Y" ? "Y" : "N"}
                    </span>
                  </div>
                </Col>
                <Col md={2} className="mb-3">
                  <Form.Label className="fw-semibold text-secondary d-block" style={{ fontSize: "0.82rem" }}>Swift Pair</Form.Label>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <Form.Check
                      type="switch"
                      id="switch-swift_pair"
                      checked={report.swift_pair === "Y"}
                      onChange={(e) => handleFieldChange("swift_pair", e.target.checked ? "Y" : "N")}
                      disabled={readonly}
                      className="mb-0"
                    />
                    <span className={`badge ${report.swift_pair === "Y" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "0.72rem" }}>
                      {report.swift_pair === "Y" ? "Y" : "N"}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row>
                {renderSelectField("Music Type", "music_type", ["None", "WAV", "MP3"], 4)}
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        {/* ── Tab 5: Issue & Result ─────────────────────────────────────── */}
        <Tab eventKey="result" title={<><i className="fas fa-flag me-2" />Issue & Result</>}>
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body className="p-4">
              <SectionHeader icon="fas fa-exclamation-circle" title="Issue Info." />
              <UrgentSelector />
              <Row>
                {renderField("Fix in ? WW", "fix_work_week", "text", 4)}
                {renderField("Fix in ? BT Driver", "fix_bt_driver", "text", 4)}
              </Row>
              <Row>
                {renderField("Jira ID", "jira_id", "text", 4)}
                {renderField("IPS ID", "ips_id", "text", 4)}
                {renderField("HSD ID", "hsd_id", "text", 4)}
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body className="p-4">
              <SectionHeader icon="fas fa-chart-bar" title="Summary" />
              <ResultSelector />
              <Row>
                {renderField("Cycles", "cycles", "text", 3)}
                {renderField("Fail Cycles", "fail_cycles", "text", 3)}
                {renderField("Duration (sec)", "duration", "text", 3)}
                {renderField("Log Path", "log_path", "text", 9)}
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-secondary" style={{ fontSize: "0.82rem" }}>System Event Log</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={report.sys_event_log || ""}
                  onChange={(e) => handleFieldChange("sys_event_log", e.target.value)}
                  readOnly={readonly}
                  placeholder="System event log information..."
                  style={{ fontSize: "0.88rem", fontFamily: "monospace" }}
                />
              </Form.Group>

              <Form.Group className="mb-0">
                <Form.Label className="fw-semibold text-secondary" style={{ fontSize: "0.82rem" }}>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={report.comment || ""}
                  onChange={(e) => handleFieldChange("comment", e.target.value)}
                  readOnly={readonly}
                  placeholder="Add any additional comments or notes..."
                  style={{ fontSize: "0.9rem" }}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Tab>

      </Tabs>
    </Form>
  );
};

export default ReportEditForm;
