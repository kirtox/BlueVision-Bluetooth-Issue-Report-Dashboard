import { useState } from "react";
import { Container, Tab, Nav, Row, Col, Card, Badge, Accordion, Alert, Button } from "react-bootstrap";

// Download file definitions — update filename/description/size as needed
const DOWNLOAD_FILES = [
  {
    id: 1,
    filename: "tool-setup.zip",
    description: "Main tool installer package",
    size: "—",
    path: "/downloads/tool-setup.zip",
  },
  {
    id: 2,
    filename: "config-template.zip",
    description: "Configuration file templates",
    size: "—",
    path: "/downloads/config-template.zip",
  },
];

// Overview component cards — update name/description as needed
const COMPONENTS = [
  {
    id: 1,
    icon: "cpu",
    name: "Arduino Board",
    description: "Collects Bluetooth test data from the DUT under test and forwards it to the BlueVision.",
  },
  {
    id: 2,
    icon: "terminal",
    name: "Python Script",
    description: "Runs on the DUT with a GUI interface. Guides the user through UX test setup, reads environment data and logs from both the Arduino board and the DUT, then uploads the collected results to BlueVision.",
  },
  {
    id: 3,
    icon: "database",
    name: "BlueVision Backend",
    description: "Receives the uploaded data via REST API and stores it in the PostgreSQL database.",
  },
];

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "What should I do if the Arduino is not detected?",
    answer: "Check that the USB driver is installed correctly. Open Device Manager and verify the COM port is listed without errors. Try a different USB cable or port.",
  },
  {
    id: "faq-2",
    question: "The Python script fails to connect to the backend. What should I check?",
    answer: "Verify the backend URL and API token in the config file. Ensure the BlueVision server is running and accessible from the machine running the script.",
  },
  {
    id: "faq-3",
    question: "How do I verify that data was uploaded successfully?",
    answer: "Check the Dashboard page on BlueVision. New reports should appear within a few seconds after the script completes.",
  },
];

const ToolTutorial = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Container fluid className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold">Tool Tutorial</h2>
        <p className="text-muted mb-0">
          Step-by-step guide for setting up and using the Bluetooth data collection tool.
        </p>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || "overview")}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="overview">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="prerequisites">Prerequisites & Setup</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="notes">Notes</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="faq">FAQ</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* ── Tab 1: Overview ── */}
          <Tab.Pane eventKey="overview">
            {/* Architecture diagram */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <p className="text-muted mb-3">Architecture Diagram</p>
                {/* Replace with your actual image path under frontend/public/images/tutorial/ */}
                <img
                  src="/images/tutorial/architecture.png"
                  alt="Tool Architecture"
                  className="img-fluid rounded"
                  style={{ maxHeight: 400 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="text-muted small mt-2">
                  Place your architecture image at:{" "}
                  <code>frontend/public/images/tutorial/architecture.png</code>
                </div>
              </Card.Body>
            </Card>

            {/* Component cards */}
            <h5 className="fw-semibold mb-3">Components</h5>
            <Row xs={1} md={3} className="g-3">
              {COMPONENTS.map((c) => (
                <Col key={c.id}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body>
                      <div className="mb-2">
                        <i className={`fe fe-${c.icon} fs-4 text-primary`} />
                      </div>
                      <Card.Title className="fs-6 fw-semibold">{c.name}</Card.Title>
                      <Card.Text className="text-muted small">{c.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab.Pane>

          {/* ── Tab 2: Prerequisites & Setup ── */}
          <Tab.Pane eventKey="prerequisites">
            {/* Hardware */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-semibold mb-3">Hardware Requirements</h5>
                <ul className="mb-0">
                  <li>Arduino board</li>
                  <li>USB cable</li>
                </ul>
              </Card.Body>
            </Card>

            {/* Software */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-semibold mb-3">Software Requirements</h5>
                <p className="text-muted small mb-2">The installers below are available in the <strong>Downloads</strong> section.</p>
                <ul className="mb-0">
                  <li>Python 3.13.9</li>
                  <li>Git</li>
                  <li>Required Python packages (listed in <code>requirements.txt</code>)</li>
                  <li>WMIC</li>
                  <li>Tesseract OCR</li>
                  <li>Arduino IDE (for flashing Arduino firmware) (Optional)</li>
                </ul> 
              </Card.Body>
            </Card>

            {/* Downloads */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-semibold mb-3">Downloads</h5>
                <p className="text-muted small mb-3">
                  Place zip files at <code>frontend/public/downloads/</code>
                </p>
                <Row xs={1} md={2} className="g-3">
                  {DOWNLOAD_FILES.map((f) => (
                    <Col key={f.id}>
                      <Card className="h-100 bg-light border-0">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                          <div>
                            <div className="fw-semibold">
                              <i className="fe fe-archive me-2 text-primary" />
                              {f.filename}
                            </div>
                            <div className="text-muted small">{f.description}</div>
                            {f.size !== "—" && (
                              <Badge bg="secondary" className="mt-1">{f.size}</Badge>
                            )}
                          </div>
                          <a href={f.path} download>
                            <Button variant="outline-primary" size="sm">
                              <i className="fe fe-download me-1" />
                              Download
                            </Button>
                          </a>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Setup steps */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-semibold mb-3">Setup Steps</h5>
                <h6 className="fw-semibold mb-2 border-start border-3 border-primary ps-2">1. Python Setup</h6>
                <p className="text-muted small mb-2">Please remove any other versions of Python before installing Python <strong>3.13.9</strong>.</p>
                <p className="text-muted small mb-2">If the Downloads section is not available, please download Python <strong>3.13.9</strong> from the{" "}<a href="https://www.python.org/downloads/release/python-3139/" target="_blank" rel="noreferrer">official website</a>.</p>
                  <img src="/images/tutorial/python_download.png" alt="Python Download" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                <ol className="mb-0">
                  <li className="mb-2">Install the Python <strong>3.13.9</strong> provided in <strong>Downloads</strong> section.</li>
                  <li className="mb-2">Please make sure to select <strong>Use admin privileges when installing py.exe</strong> and <strong>Add python.exe to PATH</strong>. Choose <strong>Customize installation</strong>.</li>
                    <img src="/images/tutorial/python_install_1.png" alt="Python Install Step 1" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                  <li className="mb-2">Click <strong>Next</strong>.</li>
                    <img src="/images/tutorial/python_install_2.png" alt="Python Install Step 2" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                  <li className="mb-2">Please make sure to select <strong>Install Python 3.13 for all users</strong>.</li>
                    <img src="/images/tutorial/python_install_3.png" alt="Python Install Step 3" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                  <li className="mb-2">Open <strong>Settings</strong>{" › "}<strong>Apps</strong>{" › "}<strong>Advanced app settings</strong>{" › "}<strong>App execution aliases</strong>. Turn off <strong>python.exe</strong> and <strong>python3.exe</strong> here.</li>
                    <img src="/images/tutorial/python_install_4.png" alt="Python Install Step 4" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                  <li className="mb-2">After installation, open a new terminal and run <code>python --version</code> to verify Python 3.13.9 is installed correctly.</li>
                </ol>

                <h6 className="fw-semibold mt-4 mb-2 border-start border-3 border-primary ps-2">2. Git Setup</h6>
                <p className="text-muted small mb-2">If the Downloads section is not available, please download Git from the{" "}<a href="https://git-scm.com/downloads" target="_blank" rel="noreferrer">official website</a>.</p>
                  <img src="/images/tutorial/git_download.png" alt="Git Download" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                <ol className="mb-0">
                  <li className="mb-2">Install <code>Git-*-bit.exe</code> included in tool-setup.zip.</li>
                  <li className="mb-2">Open Git Bash.</li>
                  <li className="mb-2">Run the following commands to create a folder named <code>auto_workspace</code> and clone the repository.</li>
                  <ul className="mb-0">
                    <li className="mb-2">
                      <code>
                        cd ~ <br />
                        cd Desktop <br />
                        mkdir auto_workspace/ <br />
                        cd auto_workspace/ <br />
                        git clone https://github.com/benlai810122/auto_test
                      </code>
                    </li>
                  </ul>
                    <img src="/images/tutorial/git_clone.png" alt="Git Clone" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                    <div className="mb-3" />
                    <img src="/images/tutorial/git_folder.png" alt="Git Folder" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                </ol>
                
                <h6 className="fw-semibold mt-4 mb-2 border-start border-3 border-primary ps-2">3. Install required Python packages</h6>
                <ol className="mb-0">
                  <li className="mb-2">Open Command Prompt.</li>
                  <li className="mb-2">Navigate to the cloned repository's directory and run the following command to install required Python packages.</li>
                  <ul className="mb-0">
                    <li className="mb-2">
                      <code>
                        cd ~/Desktop/auto_workspace/auto_test <br />
                        pip install -r requirements.txt
                      </code>
                    </li>
                  </ul>
                    <img src="/images/tutorial/pip_install.png" alt="Pip Install" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                </ol>

                <h6 className="fw-semibold mt-4 mb-2 border-start border-3 border-primary ps-2">4. Install WMIC</h6>
                <p className="text-muted small mb-2">WMIC is used for collecting system information. It is included by default in Windows 10 and later.</p>
                <ol className="mb-0">
                  <li className="mb-2">Open <strong>Settings</strong>{" › "}<strong>System</strong>{" › "}<strong>Optional features</strong>{" › "}<strong>View features</strong>{" › "}<strong>See available features</strong>.</li>
                  <li className="mb-2">Search for <strong>WMIC</strong>. If it is not installed, select it and click <strong>Add</strong>.</li>
                    <img src="/images/tutorial/wmic_install_1.png" alt="WMIC Install — search for WMIC in Optional Features" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                    <div className="mb-3" />
                    <img src="/images/tutorial/wmic_install_2.png" alt="WMIC Install — select and add WMIC feature" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                </ol>

                <h6 className="fw-semibold mt-4 mb-2 border-start border-3 border-primary ps-2">5. Install Tesseract OCR</h6>
                <p className="text-muted small mb-2">Tesseract OCR is used for extracting text from images. If the Downloads section is not available, please download Tesseract OCR from the{" "}<a href="https://tesseract-ocr.github.io/tessdoc/Downloads.html" target="_blank" rel="noreferrer">official Tesseract OCR GitHub</a>.</p>
                <ol className="mb-0">
                  <li className="mb-2">Install <code>tesseract-ocr-w64-setup-*.exe</code> included in tool-setup.zip.</li>
                  <li className="mb-2">Select <strong>Install for anyone using this computer</strong>.</li>
                    <img src="/images/tutorial/tesseract_install_1.png" alt="Tesseract Install Step 1" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                    <div className="mb-3" />
                    <img src="/images/tutorial/tesseract_install_2.png" alt="Tesseract Install Step 2" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                </ol>

                <h6 className="fw-semibold mt-4 mb-2 border-start border-3 border-primary ps-2">6. Install Arduino IDE</h6>
                <p className="text-muted small mb-2">Arduino IDE is used for flashing firmware to the Arduino board. This step is optional if the Arduino board is already flashed with the required firmware.</p>
                <p className="text-muted small mb-2">If the Downloads section is not available, please download Arduino IDE from the{" "}<a href="https://www.arduino.cc/en/software" target="_blank" rel="noreferrer">official website</a>.</p>
                  <img src="/images/tutorial/arduino_download.png" alt="Arduino Download" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                <ol className="mb-0">
                  <li className="mb-2">Install <code>arduino-ide_*_Windows_64bit.exe</code> included in tool-setup.zip.</li>
                  <li className="mb-2">Follow the installation prompts to complete the Arduino IDE setup.</li>
                    <img src="/images/tutorial/arduino_install.png" alt="Arduino Install" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                </ol>
              </Card.Body>
            </Card>

            {/* Arduino firmware flash */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-semibold mb-3">Flash Arduino firmware</h5>
                <p className="text-muted small">If your Arduino board is not pre-flashed with the required firmware, please follow the steps below to flash it using the Arduino IDE.</p>
                <ol className="mb-0">
                  <li className="mb-2">Open Arduino IDE.</li>
                    <img src="/images/tutorial/arduino_open_ide.png" alt="Arduino Open IDE" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                  <li className="mb-2">Go to <strong>File</strong>{" › "}<strong>Open</strong> and navigate to the firmware file (e.g., <code>arduino_firmware.ino</code>) provided in the tool-setup.zip. Open the .ino file.</li>
                    <img src="/images/tutorial/arduino_open_path.png" alt="Arduino Open Firmware" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                  <li className="mb-2">Connect your Arduino board to the computer using the USB cable.</li>
                  <li className="mb-2">In Arduino IDE, select the <strong>Arduino Uno</strong>.</li>
                    <img src="/images/tutorial/arduino_select.png" alt="Arduino Select Board and Port" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                  <li className="mb-2">Click the <strong>Upload</strong> button (right arrow icon) to compile and upload the firmware to the Arduino board.</li>
                    <img src="/images/tutorial/arduino_upload.png" alt="Arduino Upload Firmware" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                  <li className="mb-2">Wait for the upload to complete. You should see a "Done uploading" message in the status bar.</li>
                </ol>

                <h5 className="fw-semibold mb-3">Verify the Arduino Board is Ready</h5>
                <p className="text-muted small mb-2">Click the <strong>Serial Monitor</strong> button in the top-right corner of Arduino IDE. The Serial Monitor panel will appear at the bottom as shown below. Set the baud rate to <strong>115200</strong>.</p>
                  <img src="/images/tutorial/arduino_serial_monitor.png" alt="Arduino Serial Monitor" className="img-fluid rounded mb-3" style={{ maxHeight: 500 }} />
                <p className="text-muted small mb-2">Input the following command in the Serial Monitor and press <strong>Enter</strong>:</p>
                <ol className="mb-0">
                  <li className="mb-2">Command <code>1</code>: test sound detector module — returns <code>0</code> if no sound is detected, or <code>1</code> if sound is detected.</li>
                    <img src="/images/tutorial/arduino_cmd_1.png" alt="Serial Monitor output for Command 1 — sound detector test result" className="img-fluid rounded mb-3" />
                  <li className="mb-2">Command <code>2</code>: test buzzer sound module — you should hear the buzzer sound after sending the command.</li>
                    <img src="/images/tutorial/arduino_cmd_2.png" alt="Serial Monitor output for Command 2 — buzzer test result" className="img-fluid rounded mb-3" />
                  <li className="mb-2">Command <code>3</code>: test mouse servo motor module — the mouse servo motor should start spinning after sending the command.</li>
                    <img src="/images/tutorial/arduino_cmd_3.png" alt="Serial Monitor output for Command 3 — mouse servo motor test result" className="img-fluid rounded mb-3" />
                  <li className="mb-2">Command <code>6</code>: test keyboard servo motor module — the keyboard servo motor should start spinning after sending the command.</li>
                    <img src="/images/tutorial/arduino_cmd_6.png" alt="Serial Monitor output for Command 6 — keyboard servo motor test result" className="img-fluid rounded mb-3" />
                </ol>
              </Card.Body>
            </Card>

            
          </Tab.Pane>

          {/* ── Tab 3: Notes ── */}
          <Tab.Pane eventKey="notes">
            <Alert variant="warning">
              <Alert.Heading>
                <i className="fe fe-alert-triangle me-2" />
                Important Notes
              </Alert.Heading>
              <ul className="mb-0">
                <li className="mb-2">Always verify the COM port assignment before running the script.</li>
                <li className="mb-2">Do not disconnect the Arduino while data collection is in progress.</li>
                <li>Ensure the BlueVision backend is running before starting the script.</li>
              </ul>
            </Alert>

            <Alert variant="info">
              <Alert.Heading>
                <i className="fe fe-info me-2" />
                Tips
              </Alert.Heading>
              <ul className="mb-0">
                <li className="mb-2">Run the script in a terminal to see real-time log output.</li>
                <li>Use the Dashboard to verify data was received correctly after each session.</li>
              </ul>
            </Alert>
          </Tab.Pane>

          {/* ── Tab 4: FAQ ── */}
          <Tab.Pane eventKey="faq">
            <Accordion>
              {FAQ_ITEMS.map((item, idx) => (
                <Accordion.Item key={item.id} eventKey={String(idx)}>
                  <Accordion.Header>{item.question}</Accordion.Header>
                  <Accordion.Body className="text-muted">{item.answer}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default ToolTutorial;
