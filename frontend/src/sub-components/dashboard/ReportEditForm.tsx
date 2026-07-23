import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col, Tab, Tabs, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Report } from "types";
import { useAuth } from "../../contexts/AuthContext";

// ─── Collapsible accessory group ──────────────────────────────────────────
const AccessoryGroup = ({
  groupKey,
  title,
  fields,
  report,
  expandedAccessories,
  setExpandedAccessories,
  children,
}: {
  groupKey: string;
  title: string;
  fields: (keyof Report)[];
  report: Report;
  expandedAccessories: Record<string, boolean>;
  setExpandedAccessories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  children: React.ReactNode;
}) => {
  const hasData = fields.some((f) => report[f] && report[f] !== "None");
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
  report,
  readonly,
  handleFieldChange,
}: {
  label: string;
  enableField: keyof Report;
  periodField: keyof Report;
  waitField: keyof Report;
  report: Report;
  readonly: boolean;
  handleFieldChange: (field: keyof Report, value: any) => void;
}) => {
  const isEnabled = report[enableField] === "Y";
  const isOn = isEnabled;
  return (
    <Row className="align-items-center py-2 border-bottom mx-0 gx-2">
      <Col md={4} className="d-flex align-items-center">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="fw-semibold text-secondary" style={{ fontSize: "0.82rem", minWidth: 140 }}>{label}</span>
          <Form.Check
            type="switch"
            id={`switch-${enableField as string}`}
            checked={isOn}
            onChange={(e) => handleFieldChange(enableField, e.target.checked ? "Y" : "N")}
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
    customReadOnly?: boolean,
    showTooltip?: boolean
  ) => {
    const isAutoFilled = customReadOnly === true && customReadOnly !== readonly;
    const value = (report[field] as string) || "";
    const control = (
      <Form.Control
        type={type}
        value={value}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        readOnly={customReadOnly !== undefined ? customReadOnly : readonly}
        style={{
          fontSize: "0.9rem",
          backgroundColor: isAutoFilled ? "#f3f4f6" : undefined,
          color: isAutoFilled ? "#6c757d" : undefined,
        }}
      />
    );
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
        {showTooltip && value ? (
          <OverlayTrigger placement="top" overlay={<Tooltip>{value}</Tooltip>}>
            <div>{control}</div>
          </OverlayTrigger>
        ) : control}
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

  // ─── Accessory option lists ───────────────────────────────────────────────
  const BT_TYPE_OPTIONS = ["Classic", "LE"];
  const BT_BRAND_OPTIONS = ["Microsoft", "Dell", "HP", "Apple", "Logitech", "Jabra", "Sony", "Other"];

  // Map: model field key → dependent brand / bt fields
  const accessoryModelMap: Record<string, { brandField: keyof Report; btField?: keyof Report }> = {
    mouse:    { brandField: "mouse_brand",    btField: "mouse_bt" },
    keyboard: { brandField: "keyboard_brand", btField: "keyboard_bt" },
    headset:  { brandField: "headset_brand",  btField: "headset_bt" },
    speaker:  { brandField: "speaker_brand",  btField: "speaker_bt" },
  };

  // When model is cleared, reset brand & BT to "None"
  const handleModelChange = (modelKey: string, field: keyof Report, value: string) => {
    let updated: Report = { ...report, [field]: value };
    if (!value) {
      const map = accessoryModelMap[modelKey];
      if (map) {
        updated = { ...updated, [map.brandField]: "None" };
        if (map.btField) updated = { ...updated, [map.btField]: "None" };
      }
    }
    onChange(updated);
  };

  // Dropdown for brand / BT type — disabled with "None" when model is empty
  const renderAccessorySelect = (
    label: string,
    field: keyof Report,
    modelField: keyof Report,
    options: string[],
    colSize: number = 3
  ) => {
    const modelEmpty = !report[modelField];
    return (
      <Form.Group as={Col} md={colSize} className="mb-3">
        <Form.Label className="fw-semibold text-secondary" style={{ fontSize: "0.82rem" }}>{label}</Form.Label>
        <Form.Select
          value={modelEmpty ? "None" : (report[field] || "")}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          disabled={readonly || modelEmpty}
          style={{ fontSize: "0.9rem", backgroundColor: modelEmpty ? "#f3f4f6" : undefined, color: modelEmpty ? "#adb5bd" : undefined }}
        >
          <option value="None">None</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </Form.Select>
      </Form.Group>
    );
  };

  // Text field for accessory model — triggers auto-reset of brand/BT on clear
  const renderModelField = (
    label: string,
    field: keyof Report,
    modelKey: string,
    colSize: number = 3
  ) => {
    const value = (report[field] as string) || "";
    const input = (
      <Form.Control
        type="text"
        value={value}
        onChange={(e) => handleModelChange(modelKey, field, e.target.value)}
        readOnly={readonly}
        style={{ fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      />
    );
    return (
      <Form.Group as={Col} md={colSize} className="mb-3">
        <Form.Label className="fw-semibold text-secondary" style={{ fontSize: "0.82rem" }}>{label}</Form.Label>
        {value ? (
          <OverlayTrigger placement="top" overlay={<Tooltip>{value}</Tooltip>}>
            <div>{input}</div>
          </OverlayTrigger>
        ) : input}
      </Form.Group>
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
                {renderField("Detailed Scenario", "scenario", "text", 6, undefined, true)}
              </Row>

              <div className="d-flex align-items-center mb-3 mt-2">
                <div className="d-flex align-items-center justify-content-center rounded me-2 text-white" style={{ width: 28, height: 28, backgroundColor: "var(--bs-primary)", fontSize: 13, flexShrink: 0 }}>
                  <i className="fas fa-toolbox" />
                </div>
                <span className="fw-semibold text-dark me-2" style={{ fontSize: "0.95rem", letterSpacing: "0.01em" }}>Test Accessories</span>
                <OverlayTrigger placement="right" overlay={<Tooltip>Groups with filled data are highlighted. Click to expand / collapse.</Tooltip>}>
                  <i className="fas fa-info-circle text-muted" style={{ fontSize: "0.85rem", cursor: "help" }} />
                </OverlayTrigger>
              </div>
              <AccessoryGroup groupKey="mouse" title="Mouse" fields={["mouse_brand", "mouse_bt", "mouse", "mouse_click_period"]} report={report} expandedAccessories={expandedAccessories} setExpandedAccessories={setExpandedAccessories}>
                {renderAccessorySelect("Brand", "mouse_brand", "mouse", BT_BRAND_OPTIONS, 3)}
                {renderAccessorySelect("BT Type", "mouse_bt", "mouse", BT_TYPE_OPTIONS, 3)}
                {renderModelField("Model", "mouse", "mouse", 3)}
                {renderField("Click Period", "mouse_click_period", "text", 3)}
              </AccessoryGroup>
              <AccessoryGroup groupKey="keyboard" title="Keyboard" fields={["keyboard_brand", "keyboard_bt", "keyboard", "keyboard_click_period"]} report={report} expandedAccessories={expandedAccessories} setExpandedAccessories={setExpandedAccessories}>
                {renderAccessorySelect("Brand", "keyboard_brand", "keyboard", BT_BRAND_OPTIONS, 3)}
                {renderAccessorySelect("BT Type", "keyboard_bt", "keyboard", BT_TYPE_OPTIONS, 3)}
                {renderModelField("Model", "keyboard", "keyboard", 3)}
                {renderField("Click Period", "keyboard_click_period", "text", 3)}
              </AccessoryGroup>
              <AccessoryGroup groupKey="headset" title="Headset" fields={["headset_brand", "headset_bt", "headset"]} report={report} expandedAccessories={expandedAccessories} setExpandedAccessories={setExpandedAccessories}>
                {renderAccessorySelect("Brand", "headset_brand", "headset", BT_BRAND_OPTIONS, 4)}
                {renderAccessorySelect("BT Type", "headset_bt", "headset", BT_TYPE_OPTIONS, 4)}
                {renderModelField("Model", "headset", "headset", 4)}
              </AccessoryGroup>
              <AccessoryGroup groupKey="speaker" title="Speaker" fields={["speaker_brand", "speaker_bt", "speaker"]} report={report} expandedAccessories={expandedAccessories} setExpandedAccessories={setExpandedAccessories}>
                {renderAccessorySelect("Brand", "speaker_brand", "speaker", BT_BRAND_OPTIONS, 4)}
                {renderAccessorySelect("BT Type", "speaker_bt", "speaker", BT_TYPE_OPTIONS, 4)}
                {renderModelField("Model", "speaker", "speaker", 4)}
              </AccessoryGroup>
              <AccessoryGroup groupKey="phone" title="Phone" fields={["phone_brand", "phone"]} report={report} expandedAccessories={expandedAccessories} setExpandedAccessories={setExpandedAccessories}>
                {renderField("Brand", "phone_brand", "text", 6)}
                {renderField("Model", "phone", "text", 6)}
              </AccessoryGroup>
              <AccessoryGroup groupKey="device1" title="Other Device" fields={["device1_brand", "device1"]} report={report} expandedAccessories={expandedAccessories} setExpandedAccessories={setExpandedAccessories}>
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
                <PowerCycleRow label="Modern Standby" enableField="modern_standby" periodField="ms_period" waitField="ms_os_waiting_time" report={report} readonly={readonly} handleFieldChange={handleFieldChange} />
                <PowerCycleRow label="Hibernation (S4)" enableField="s4" periodField="s4_period" waitField="s4_os_waiting_time" report={report} readonly={readonly} handleFieldChange={handleFieldChange} />
                <PowerCycleRow label="Warm Boot" enableField="warm_boot" periodField="wb_period" waitField="wb_os_waiting_time" report={report} readonly={readonly} handleFieldChange={handleFieldChange} />
                <PowerCycleRow label="Cold Boot" enableField="cold_boot" periodField="cb_period" waitField="cb_os_waiting_time" report={report} readonly={readonly} handleFieldChange={handleFieldChange} />
              </div>

              <SectionHeader icon="fas fa-cogs" title="Other Functions" />
              <Row className="mx-0 mb-1 gx-2">
                <Col md={3}><span className="text-muted" style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Function</span></Col>
                <Col md={3}><span className="text-muted" style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Period</span></Col>
              </Row>
              <div className="border rounded overflow-hidden mb-4">
                {/* APM row */}
                <Row className="align-items-center py-2 border-bottom mx-0 gx-2">
                  <Col md={3} className="d-flex align-items-center">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-semibold text-secondary" style={{ fontSize: "0.82rem", minWidth: 100 }}>APM</span>
                      <Form.Check
                        type="switch"
                        id="switch-apm"
                        checked={report.apm === "Y"}
                        onChange={(e) => handleFieldChange("apm", e.target.checked ? "Y" : "N")}
                        disabled={readonly}
                        className="mb-0"
                      />
                      <span className={`badge ${report.apm === "Y" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "0.72rem", minWidth: 24, opacity: 0.85 }}>
                        {report.apm === "Y" ? "Y" : "N"}
                      </span>
                    </div>
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={report.apm_period || ""}
                      onChange={(e) => handleFieldChange("apm_period", e.target.value)}
                      readOnly={readonly || report.apm !== "Y"}
                      placeholder={report.apm === "Y" ? "" : "—"}
                      style={{
                        fontSize: "0.88rem",
                        backgroundColor: report.apm !== "Y" ? "#f3f4f6" : undefined,
                        color: report.apm !== "Y" ? "#adb5bd" : undefined,
                      }}
                    />
                  </Col>
                </Row>
                {/* OPP row */}
                <Row className="align-items-center py-2 border-bottom mx-0 gx-2">
                  <Col md={3} className="d-flex align-items-center">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-semibold text-secondary" style={{ fontSize: "0.82rem", minWidth: 100 }}>OPP</span>
                      <Form.Check
                        type="switch"
                        id="switch-opp"
                        checked={report.opp === "Y"}
                        onChange={(e) => handleFieldChange("opp", e.target.checked ? "Y" : "N")}
                        disabled={readonly}
                        className="mb-0"
                      />
                      <span className={`badge ${report.opp === "Y" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "0.72rem", minWidth: 24, opacity: 0.85 }}>
                        {report.opp === "Y" ? "Y" : "N"}
                      </span>
                    </div>
                  </Col>
                </Row>
                {/* Swift Pair row */}
                <Row className="align-items-center py-2 mx-0 gx-2">
                  <Col md={3} className="d-flex align-items-center">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-semibold text-secondary" style={{ fontSize: "0.82rem", minWidth: 100 }}>Swift Pair</span>
                      <Form.Check
                        type="switch"
                        id="switch-swift_pair"
                        checked={report.swift_pair === "Y"}
                        onChange={(e) => handleFieldChange("swift_pair", e.target.checked ? "Y" : "N")}
                        disabled={readonly}
                        className="mb-0"
                      />
                      <span className={`badge ${report.swift_pair === "Y" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "0.72rem", minWidth: 24, opacity: 0.85 }}>
                        {report.swift_pair === "Y" ? "Y" : "N"}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
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
