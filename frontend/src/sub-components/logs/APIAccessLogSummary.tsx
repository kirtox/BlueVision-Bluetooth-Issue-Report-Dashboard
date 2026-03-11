import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { APIAccessLog } from "types";

interface APIAccessLogSummaryProps {
  logs: APIAccessLog[];
}

const APIAccessLogSummary: React.FC<APIAccessLogSummaryProps> = ({ logs }) => {
  // Calculate statistics
  const totalRequests = logs.length;

  const methodStats = logs.reduce((acc, log) => {
    acc[log.method] = (acc[log.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusStats = logs.reduce((acc, log) => {
    if (log.response_status) {
      const statusRange = Math.floor(log.response_status / 100) * 100;
      const key = `${statusRange}xx`;
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const avgResponseTime = logs.length > 0
    ? Math.round(logs.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / logs.length)
    : 0;

  const userStats = logs.reduce((acc, log) => {
    const username = log.username || 'Anonymous';
    acc[username] = (acc[username] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueUsers = Object.keys(userStats).length;





  const getStatusColor = (status: string) => {
    if (status.startsWith('2')) return 'success';
    if (status.startsWith('3')) return 'info';
    if (status.startsWith('4')) return 'warning';
    if (status.startsWith('5')) return 'danger';
    return 'secondary';
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      'GET': 'primary',
      'POST': 'success',
      'PUT': 'warning',
      'DELETE': 'danger',
      'PATCH': 'info'
    };
    return colors[method] || 'secondary';
  };

  return (
    <Row className="mb-4">
      {/* Total Requests */}
      <Col lg={3} md={6} className="mb-3">
        <Card className="h-100">
          <Card.Body className="text-center">
            <h3 className="text-primary mb-1">{totalRequests.toLocaleString()}</h3>
            <p className="mb-0 text-muted">Total Requests</p>
          </Card.Body>
        </Card>
      </Col>

      {/* Unique Users */}
      <Col lg={3} md={6} className="mb-3">
        <Card className="h-100">
          <Card.Body className="text-center">
            <h3 className="text-info mb-1">{uniqueUsers}</h3>
            <p className="mb-0 text-muted">Unique Users</p>
          </Card.Body>
        </Card>
      </Col>

      {/* Average Response Time */}
      <Col lg={3} md={6} className="mb-3">
        <Card className="h-100">
          <Card.Body className="text-center">
            <h3 className="text-warning mb-1">{avgResponseTime}ms</h3>
            <p className="mb-0 text-muted">Avg Response Time</p>
          </Card.Body>
        </Card>
      </Col>

      {/* Success Rate */}
      <Col lg={3} md={6} className="mb-3">
        <Card className="h-100">
          <Card.Body className="text-center">
            <h3 className="text-success mb-1">
              {totalRequests > 0
                ? Math.round(((statusStats['200xx'] || 0) / totalRequests) * 100)
                : 0}%
            </h3>
            <p className="mb-0 text-muted">Success Rate (200xx)</p>
          </Card.Body>
        </Card>
      </Col>

      {/* HTTP Methods */}
      <Col lg={6} md={12} className="mb-3">
        <Card className="h-100">
          <Card.Header>
            <h6 className="mb-0">HTTP Methods</h6>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(methodStats)
                .sort(([, a], [, b]) => b - a)
                .map(([method, count]) => (
                  <span key={method} className={`badge bg-${getMethodColor(method)} fs-6`}>
                    {method}: {count}
                  </span>
                ))}
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Status Codes */}
      <Col lg={6} md={12} className="mb-3">
        <Card className="h-100">
          <Card.Header>
            <h6 className="mb-0">Status Codes</h6>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(statusStats)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => (
                  <span key={status} className={`badge bg-${getStatusColor(status)} fs-6`}>
                    {status}: {count}
                  </span>
                ))}
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Top Users */}
      <Col lg={12} md={12} className="mb-3">
        <Card className="h-100">
          <Card.Header>
            <h6 className="mb-0">Top Users</h6>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(userStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([username, count]) => (
                  <span key={username} className="badge bg-secondary fs-6">
                    {username}: {count}
                  </span>
                ))}
            </div>
          </Card.Body>
        </Card>
      </Col>


    </Row>
  );
};

export default APIAccessLogSummary;