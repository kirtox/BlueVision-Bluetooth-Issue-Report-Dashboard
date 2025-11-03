// import node module libraries
import { Fragment } from "react";
// import { Link } from "react-router-dom";
import { Container, Col, Row, Card } from "react-bootstrap";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
// import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

// import cpu icon selection
import { getCpuIcon } from "../../data/dashboard/CPUIcon";

// import required data files
// import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import { useCPUStats } from "../../data/dashboard/CPUStats";
import ReportTable from "sub-components/dashboard/ReportTable";
import { useState, useEffect } from "react";

import ReportFilters from "sub-components/filters/ReportFilters";
import { Report } from "types";
import { usePermissions } from "../../contexts/PermissionContext";
import { Button, Modal } from "react-bootstrap";
import ReportEditForm from "sub-components/dashboard/ReportEditForm";

// import ReportPieChart from "sub-components/dashboard/ReportPieChart";
// import ReportDoughnutChart from "sub-components/dashboard/ReportDoughnutChart";
// import ReportBarChart from "sub-components/dashboard/ReportBarChart";

// Need to fix
import PlatformStatusDashboard from "sub-components/dashboard/PlatformStatusDashboard";


import ReportMultipleCrossBarChart from "sub-components/dashboard/ReportMultipleCrossBarChart";
// import ReportDurationChart from "sub-components/dashboard/ReportDurationChart";
import ReportMultipleDurationCrossBarChart from "sub-components/dashboard/ReportMultipleDurationCrossBarChart";
// import ReportGaugeChart from "sub-components/dashboard/ReportGaugeChart";
import ReportMultipleGaugeChart from "sub-components/dashboard/ReportMultipleGaugeChart";

const Dashboard = () => {
  const { stats, loading } = useCPUStats();
  const permissions = usePermissions();

  // reports data and filter condition
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatformBrands, setSelectedPlatformBrands] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCPUs, setSelectedCPUs] = useState<string[]>([]);
  const [selectedWlans, setSelectedWlans] = useState<string[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [selectedBTDrivers, setSelectedBTDrivers] = useState<string[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);

  // 創建報告相關狀態
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReport, setNewReport] = useState<Report | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });

  // useEffect(() => {
  //   fetch('http://localhost:8000/reports')
  //     .then(res => res.json())
  //     .then(data => setReports(data));
  // }, []);

  // Define API_BASE_URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchReports = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${API_BASE_URL}/reports`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch reports');
        }
        return res.json();
      })
      .then(data => setReports(data))
      .catch(error => {
        console.error('Error fetching reports:', error);
        // 可以在這裡添加錯誤處理，比如顯示錯誤訊息
      });
  };
  
  useEffect(() => {
    fetchReports();
  }, []);

  // 創建報告相關函數
  const handleCreateReport = () => {
    // 創建一個新的空報告對象
    const emptyReport: Report = {
      id: 0, // 新報告ID為0
      op_name: '', // 這會在後端自動設置
      date: new Date().toISOString(),
      serial_num: '',
      os_version: '',
      platform_brand: '',
      platform: '',
      platform_phase: '',
      platform_bios: '',
      cpu: '',
      wlan: '',
      wlan_phase: '',
      wifi_name: '',
      wifi_band: '',
      bt_driver: '',
      bt_interface: '',
      wifi_driver: '',
      audio_driver: '',
      wrt_version: '',
      wrt_preset: '',
      msft_teams_version: '',
      scenario: '',
      mouse_bt: '',
      mouse_brand: '',
      mouse: '',
      mouse_click_period: '',
      keyboard_bt: '',
      keyboard_brand: '',
      keyboard: '',
      keyboard_click_period: '',
      headset_bt: '',
      headset_brand: '',
      headset: '',
      speaker_bt: '',
      speaker_brand: '',
      speaker: '',
      phone_brand: '',
      phone: '',
      device1_brand: '',
      device1: '',
      modern_standby: '',
      ms_period: '',
      ms_os_waiting_time: '',
      s4: '',
      s4_period: '',
      s4_os_waiting_time: '',
      warm_boot: '',
      wb_period: '',
      wb_os_waiting_time: '',
      cold_boot: '',
      cb_period: '',
      cb_os_waiting_time: '',
      microsoft_teams: '',
      apm: '',
      apm_period: '',
      opp: '',
      swift_pair: '',
      power_type: '',
      urgent_level: '',
      fix_work_week: '',
      fix_bt_driver: '',
      jira_id: '',
      ips_id: '',
      hsd_id: '',
      result: '',
      fail_rate: '',
      fail_cycles: '',
      cycles: '',
      duration: '',
      log_path: ''
    };
    
    setNewReport(emptyReport);
    setShowCreateModal(true);
  };

  const handleSaveNewReport = async () => {
    if (!newReport) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newReport),
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      setShowCreateModal(false);
      setNewReport(null);
      fetchReports(); // 重新載入報告列表
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to create report');
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewReport(null);
  };

  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.op_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform_brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cpu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wlan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bt_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wifi_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.toLowerCase().includes(searchTerm.toLowerCase());
      // item.current_status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatformBrand =
      selectedPlatformBrands.length === 0 || selectedPlatformBrands.includes(item.platform_brand);
    const matchesPlatform =
      selectedPlatforms.length === 0 || selectedPlatforms.includes(item.platform);
    const matchesCPU =
      selectedCPUs.length === 0 || selectedCPUs.includes(item.cpu);
    const matchesWlan =
      selectedWlans.length === 0 || selectedWlans.includes(item.wlan);
    const matchesScenario =
      selectedScenarios.length === 0 || selectedScenarios.includes(item.scenario);
    const matchesBTDriver =
      selectedBTDrivers.length === 0 || selectedBTDrivers.includes(item.bt_driver);
    const matchesResult =
      selectedResults.length === 0 || selectedResults.includes(item.result?.toUpperCase() || '');
    const reportDate = new Date(item.date);
    const start = dateRange.startDate;
    const end = dateRange.endDate ? new Date(new Date(dateRange.endDate).setHours(23, 59, 59, 999)) : null;
    const matchesDate = !start || !end || (reportDate >= start && reportDate <= end);
    return matchesSearch && matchesPlatformBrand && matchesPlatform && matchesCPU && matchesWlan && matchesScenario 
            && matchesBTDriver && matchesResult && matchesDate;
  });


  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPlatformBrands([]);
    setSelectedPlatforms([]);
    setSelectedCPUs([]);
    setSelectedWlans([]);
    setSelectedScenarios([]);
    setSelectedBTDrivers([]);
    setSelectedResults([]);
    setDateRange({ startDate: null, endDate: null });
  };

  console.log("Dashboard");
  return (
    <Fragment>
      <div className="pt-10 pb-21" style={{ backgroundImage: "url(/images/background/banner_adobestock1.jpeg)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-2 mb-lg-0">
                  <h1 className="mb-0  text-white">Intel Bluetooth Issue Report Dashboard</h1>
                </div>
                <div>
                  {permissions.canCreateReport() && (
                    <Button 
                      variant="light" 
                      onClick={handleCreateReport}
                      className="me-2"
                    >
                      <i className="fe fe-plus me-1"></i>
                      Create Report
                    </Button>
                  )}
                </div>
                {/* <div>
                  <Link to="#" className="btn btn-white">
                    Create New Project
                  </Link>
                </div> */}
              </div>
            </div>
          </Col>
          {/* {ProjectsStatsData.map((item, index) => {
            console.log('ProjectsStatsData item:', item, 'index:', index);
            return (
              <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                <StatRightTopIcon info={item} />
              </Col>
            );
          })} */}
          <Row>
            {loading ? (
              <div>Loading...</div>
            ) : (
              stats.map((item, index) => (
                <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                  <StatRightTopIcon
                    info={{
                      id: index,
                      cpu: item.cpu,
                      count: item.count,
                      icon: getCpuIcon(item.cpu),
                    }}
                  />
                </Col>
              ))
            )}
          </Row>
        </Row>

        {/* Platform Status Area */}
        <Row className="my-6 scroll-section">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <h3 className="mb-2">Platform Status Dashboard</h3>
              <Row className="my-4">
                <PlatformStatusDashboard />
              </Row>
            </Card>
          </Col>
        </Row>


        {/* Filter area */}
        <Row className="my-6 scroll-section">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <h3 className="mb-2">Report Filters</h3>

              <ReportFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                
                // platformBrandOptions={[...new Set(reports.map(r => r.platform_brand))]}
                // selectedPlatformBrands={selectedPlatformBrands}
                // setSelectedPlatformBrands={setSelectedPlatformBrands}

                platformOptions={[...new Set(reports.map(r => r.platform))]}
                selectedPlatforms={selectedPlatforms}
                setSelectedPlatforms={setSelectedPlatforms}

                cpuOptions={[...new Set(reports.map(r => r.cpu))]}
                selectedCPUs={selectedCPUs}
                setSelectedCPUs={setSelectedCPUs}

                wlanOptions={[...new Set(reports.map(r => r.wlan))]}
                selectedWlans={selectedWlans}
                setSelectedWlans={setSelectedWlans}

                scenarioOptions={[...new Set(reports.map(r => r.scenario))]}
                selectedScenarios={selectedScenarios}
                setSelectedScenarios={setSelectedScenarios}

                btDriverOptions={[...new Set(reports.map(r => r.bt_driver))]}
                selectedBTDrivers={selectedBTDrivers}
                setSelectedBTDrivers={setSelectedBTDrivers}

                resultOptions={['PASS', 'FAIL', '']}
                selectedResults={selectedResults}
                setSelectedResults={setSelectedResults}

                dateRange={dateRange}
                setDateRange={setDateRange}
                onClear={clearAllFilters}
              />
            </Card>
          </Col>
          
          {/* Table area */}
          <Col lg={12} md={12} xs={12}>
            <ReportTable reports={filteredReports} onReload={fetchReports} />
          </Col>
        </Row>

        {/* Gauge chart summary area */}
        <Row className="my-6 scroll-section">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              {/* <Row className="my-4">
                <Col lg={12} md={12} xs={12}>
                  <ReportGaugeChart
                    reports={filteredReports}
                    groupBy="bt_driver"
                    calcField="duration"
                    calcType="sum"
                    max={720}
                    thresholds={[
                      { value: 72, color: "#82ca9d" },  // 綠82ca9d
                      { value: 360, color: "#ffc658" },  // 黃ffc658
                      { value: 720, color: "#ff7f50" }, // 紅ff7f50
                    ]}
                    title="Driver Duration Dashboard"
                  />
                </Col>
              </Row> */}
              <Row className="my-4">
                <Col lg={12} md={12} xs={12}>
                  <ReportMultipleGaugeChart
                    reports={filteredReports}
                    groupBy="bt_driver"
                    calcField="duration"
                    calcType="sum"
                    max={720}
                    thresholds={[
                      { value: 336, color: "#A3D1D1", label: "Low" },
                      { value: 504, color: "#6FB7B7", label: "Medium" },
                      { value: 720, color: "#408080", label: "High" },
                    ]}
                    title="Bluetooth Driver Durability"
                  />
                </Col>
              </Row>
              <Row className="my-4">
                <Col lg={12} md={12} xs={12}>
                  <ReportMultipleGaugeChart
                    reports={filteredReports}
                    groupBy="scenario"
                    calcField="duration"
                    calcType="sum"
                    max={720}
                    thresholds={[
                      { value: 336, color: "#C7C7E2", label: "Low" },
                      { value: 504, color: "#9999CC", label: "Medium" },
                      { value: 720, color: "#5A5AAD", label: "High" },
                    ]}
                    title="Integration Test"
                  />
                </Col>
              </Row>
              <Row className="my-4">
                <Col lg={12} md={12} xs={12}>
                  <ReportMultipleGaugeChart
                    reports={filteredReports}
                    groupBy="platform"
                    calcField="duration"
                    calcType="sum"
                    max={720}
                    thresholds={[
                      { value: 336, color: "#FFC78E", label: "Low" },
                      { value: 504, color: "#FFA042", label: "Medium" },
                      { value: 720, color: "#EA7500", label: "High" },
                    ]}
                    title="Platform Summary"
                  />
                </Col>
              </Row>
              <Row className="my-4">
                <Col lg={12} md={12} xs={12}>
                  <ReportMultipleGaugeChart
                    reports={filteredReports}
                    groupBy="wlan"
                    calcField="duration"
                    calcType="sum"
                    max={720}
                    thresholds={[
                      { value: 336, color: "#84C1FF", label: "Low" },
                      { value: 504, color: "#2894FF", label: "Medium" },
                      { value: 720, color: "#0066CC", label: "High" },
                    ]}
                    title="WLAN Durability"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Pie chart summary area */}
        {/* <Row className="my-6">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <Row className="my-4">
                <Col lg={6} md={12} xs={12}>
                  <ReportDoughnutChart reports={filteredReports} field="result" title="Total test results" />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  <ReportDoughnutChart reports={filteredReports} field="bt_driver" title="Test by Bluetooth driver version" />
                </Col>
                <Col lg={12} md={12} xs={12} className="mt-4">
                  <ReportDoughnutChart reports={filteredReports} field="scenario" title="Total test by scenario" />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row> */}

        {/* Bar chart summary area */}
        {/* <Row className="my-6">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <h4 className="mb-2">Trend Charts</h4>
              <Row>
                <Col lg={6} md={12} xs={12}>
                  <ReportBarChart reports={filteredReports} field="bt_driver" title="BT drivers" />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  <ReportBarChart reports={filteredReports} field="platform_brand" title="Platform Brand" />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row> */}

        {/* Cross Bar (data) summary area */}
        <Row className="my-6 scroll-section">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <h3 className="mb-2">Key Experience Indicator Dashboard - Reliability</h3>

              <Row className="my-4">
                <Col lg={6} md={12} xs={12}>
                  <ReportMultipleCrossBarChart
                    reports={filteredReports}
                    fieldX="bt_driver"
                    fieldY="scenario"
                    title="Integration Test"
                  />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  <ReportMultipleCrossBarChart
                    reports={filteredReports}
                    fieldX="platform"
                    fieldY="scenario"
                    title="Platform Summary"
                  />
                </Col>
                
              </Row>
              <Row className="my-4">
                <Col lg={6} md={12} xs={12}>
                  <ReportMultipleCrossBarChart
                    reports={filteredReports}
                    fieldX="bt_driver"
                    fieldY="wlan"
                    title="Bluetooth Driver Reliability"
                  />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  <ReportMultipleCrossBarChart
                    reports={filteredReports}
                    fieldX="wlan"
                    fieldY="platform"
                    title="WLAN Reliability"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Cross Bar (duration) summary area */}
        <Row className="my-6 scroll-section">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <h3 className="mb-2">Key Experience Indicator Dashboard - Durability</h3>
              
              <Row className="my-4">
                <Col lg={6} md={12} xs={12}>
                  <ReportMultipleDurationCrossBarChart
                    reports={filteredReports}
                    fieldX="bt_driver"
                    fieldY="duration"
                    groupBy="scenario"
                    title="Integration Test"
                  />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  <ReportMultipleDurationCrossBarChart
                    reports={filteredReports}
                    fieldX="platform"
                    fieldY="duration"
                    groupBy="scenario"
                    title="Platform Summary"
                  />
                </Col>
              </Row>
              <Row className="my-4">
                <Col lg={6} md={12} xs={12}>
                  <ReportMultipleDurationCrossBarChart
                    reports={filteredReports}
                    fieldX="bt_driver"
                    fieldY="duration"
                    groupBy="wlan"
                    title="Bluetooth Driver Durability"
                  />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  <ReportMultipleDurationCrossBarChart
                    reports={filteredReports}
                    fieldX="wlan"
                    fieldY="duration"
                    groupBy="platform"
                    title="WLAN Durability"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* <ActiveProjects /> */}

        {/* <Row className="my-6">
          <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
            <TasksPerformance />
          </Col>

          <Col xl={8} lg={12} md={12} xs={12}>
            <Teams />
          </Col>
        </Row> */}
      </Container>

      {/* 創建報告 Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {newReport && (
            <ReportEditForm
              report={newReport}
              onChange={setNewReport}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveNewReport}>
            Create Report
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};
export default Dashboard;
