import { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import APIAccessLogTable from "../../sub-components/logs/APIAccessLogTable";
import APIAccessLogSummary from "../../sub-components/logs/APIAccessLogSummary";
import { APIAccessLog } from "types";
import { usePermissions } from "../../contexts/PermissionContext";

const APIAccessLogs = () => {
  const permissions = usePermissions();
  const [logs, setLogs] = useState<APIAccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api-logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLogs(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching API access logs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permissions.canViewLogs()) {
      fetchLogs();
    } else {
      setLoading(false);
    }
  }, [permissions]);

  // Permission check
  if (!permissions.canViewLogs()) {
    return (
      <Container fluid className="p-6">
        <Alert variant="warning">
          <h4>Access Denied</h4>
          <p>You don't have permission to view API access logs. Only administrators can access this page.</p>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container fluid className="p-6">
        <Row>
          <Col lg={12} md={12} sm={12}>
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="p-6">
        <Row>
          <Col lg={12} md={12} sm={12}>
            <div className="alert alert-danger" role="alert">
              Error loading API access logs: {error}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">API Access Logs</h1>
              <p className="mb-0">Monitor and track API access activity</p>
            </div>
          </div>
        </Col>
      </Row>
      {/* Summary Statistics */}
      <APIAccessLogSummary logs={logs} />
      
      <Row>
        <Col lg={12} md={12} sm={12}>
          <APIAccessLogTable logs={logs} onReload={fetchLogs} />
        </Col>
      </Row>
    </Container>
  );
};

export default APIAccessLogs;