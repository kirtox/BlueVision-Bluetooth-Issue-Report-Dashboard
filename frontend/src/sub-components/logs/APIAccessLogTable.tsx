// import node module libraries
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Table, Dropdown, Badge } from "react-bootstrap";
import { MoreVertical } from "react-feather";

import { APIAccessLogTableProps, APIAccessLog } from "types";
import APIAccessLogFilters from "./APIAccessLogFilters";

function APIAccessLogTable({ logs, onReload }: APIAccessLogTableProps) {
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [selectedStatusCodes, setSelectedStatusCodes] = useState<string[]>([]);
  const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>([]);

  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Auto reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMethods, selectedStatusCodes, selectedEndpoints, dateRange]);

  const ActionMenu = ({ onView }: { onView: () => void }) => (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <MoreVertical size="15px" className="text-muted" />
      </Dropdown.Toggle>
      <Dropdown.Menu align={"end"}>
        <Dropdown.Item eventKey="1" onClick={onView}>View Details</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const CustomToggle = React.forwardRef<HTMLAnchorElement, { children: React.ReactNode; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }>(
    ({ children, onClick }, ref) => (
      <Link
        to=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        className="text-muted text-primary-hover"
      >
        {children}
      </Link>
    )
  );

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Function to normalize endpoints by replacing IDs with patterns
  const normalizeEndpoint = (endpoint: string): string => {
    // Replace numeric IDs with {id} pattern
    return endpoint.replace(/\/\d+/g, '/{id}');
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedMethods([]);
    setSelectedStatusCodes([]);
    setSelectedEndpoints([]);
    setDateRange({ startDate: null, endDate: null });
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const searchableFields = [
        log.method,
        log.endpoint,
        log.username || '',
        log.user_agent || '',
        log.host || '',
        log.referer || '',
        log.response_status?.toString() || '',
        log.request_body || ''
      ];

      if (!searchableFields.some(field => field.toLowerCase().includes(searchLower))) {
        return false;
      }
    }

    // Method filter
    if (selectedMethods.length > 0 && !selectedMethods.includes(log.method)) {
      return false;
    }

    // Status code filter
    if (selectedStatusCodes.length > 0 && !selectedStatusCodes.includes(log.response_status?.toString() || '')) {
      return false;
    }

    // Endpoint filter - compare normalized endpoints
    if (selectedEndpoints.length > 0 && !selectedEndpoints.includes(normalizeEndpoint(log.endpoint))) {
      return false;
    }



    // Date range filter
    if (dateRange.startDate || dateRange.endDate) {
      const logDate = new Date(log.timestamp);

      if (dateRange.startDate && logDate < dateRange.startDate) {
        return false;
      }

      if (dateRange.endDate && logDate > dateRange.endDate) {
        return false;
      }
    }

    return true;
  });

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA == null && fieldB == null) return 0;
    if (fieldA == null) return 1;
    if (fieldB == null) return -1;

    if (sortField === 'timestamp') {
      const dateA = new Date(fieldA);
      const dateB = new Date(fieldB);
      if (dateA < dateB) return sortOrder === 'asc' ? -1 : 1;
      if (dateA > dateB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedLogs.length / rowsPerPage);

  const getStatusBadge = (status?: number) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;

    if (status >= 200 && status < 300) {
      return <Badge bg="success">{status}</Badge>;
    } else if (status >= 300 && status < 400) {
      return <Badge bg="info">{status}</Badge>;
    } else if (status >= 400 && status < 500) {
      return <Badge bg="warning">{status}</Badge>;
    } else if (status >= 500) {
      return <Badge bg="danger">{status}</Badge>;
    }
    return <Badge bg="secondary">{status}</Badge>;
  };

  const getMethodBadge = (method: string) => {
    const methodColors: { [key: string]: string } = {
      'GET': 'primary',
      'POST': 'success',
      'PUT': 'warning',
      'DELETE': 'danger',
      'PATCH': 'info'
    };
    return <Badge bg={methodColors[method] || 'secondary'}>{method}</Badge>;
  };

  const handleViewDetails = (log: APIAccessLog) => {
    // For now, just show an alert with details
    // You can implement a modal later if needed
    const details = `
      Timestamp: ${new Date(log.timestamp).toLocaleString()}
      Method: ${log.method}
      Endpoint: ${log.endpoint}
      Username: ${log.username || 'N/A'}
      User Agent: ${log.user_agent || 'N/A'}
      Response Status: ${log.response_status || 'N/A'}
      Response Time: ${log.response_time_ms ? log.response_time_ms + 'ms' : 'N/A'}
      Host: ${log.host || 'N/A'}
      Referer: ${log.referer || 'N/A'}
      Request Body: ${log.request_body || 'N/A'}
    `;
    alert(details);
  };

  return (
    <>
      {/* Filters */}
      <Card className="p-3 mb-4">
        <APIAccessLogFilters
          logs={logs}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedMethods={selectedMethods}
          setSelectedMethods={setSelectedMethods}
          selectedStatusCodes={selectedStatusCodes}
          setSelectedStatusCodes={setSelectedStatusCodes}
          selectedEndpoints={selectedEndpoints}
          setSelectedEndpoints={setSelectedEndpoints}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onClearFilters={clearAllFilters}
        />
      </Card>


      <Card className="h-100">
        <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-2">API Access Logs</h4>
            <p className="mb-0 text-muted">
              Showing {currentLogs.length} of {filteredLogs.length} logs
              {filteredLogs.length !== logs.length && ` (filtered from ${logs.length} total)`}
            </p>
          </div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={onReload}
            title="Refresh logs"
          >
            🔄 Refresh
          </button>
        </Card.Header>

        <Table responsive className="text-nowrap">
          <thead className="table-light">
            <tr>
              <th onClick={() => handleSort('timestamp')} style={{ cursor: 'pointer' }}>
                Timestamp {sortField === 'timestamp' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('method')} style={{ cursor: 'pointer' }}>
                Method {sortField === 'method' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('endpoint')} style={{ cursor: 'pointer' }}>
                Endpoint {sortField === 'endpoint' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('username')} style={{ cursor: 'pointer' }}>
                Username {sortField === 'username' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('response_status')} style={{ cursor: 'pointer' }}>
                Status {sortField === 'response_status' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('response_time_ms')} style={{ cursor: 'pointer' }}>
                Response Time {sortField === 'response_time_ms' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('user_agent')} style={{ cursor: 'pointer' }}>
                User Agent {sortField === 'user_agent' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log) => {
              return (
                <tr key={log.id}>
                  <td className="align-middle">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="align-middle">{getMethodBadge(log.method)}</td>
                  <td className="align-middle">
                    <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }} title={log.endpoint}>
                      {log.endpoint}
                    </span>
                  </td>
                  <td className="align-middle">
                    <span className="text-truncate d-inline-block" style={{ maxWidth: '100px' }} title={log.username || 'N/A'}>
                      {log.username || 'N/A'}
                    </span>
                  </td>
                  <td className="align-middle">{getStatusBadge(log.response_status)}</td>
                  <td className="align-middle">
                    {log.response_time_ms ? `${log.response_time_ms}ms` : 'N/A'}
                  </td>
                  <td className="align-middle">
                    <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }} title={log.user_agent || 'N/A'}>
                      {log.user_agent || 'N/A'}
                    </span>
                  </td>
                  <td className="align-middle">
                    <ActionMenu onView={() => handleViewDetails(log)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* Pagination controls */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <span>Rows per page </span>
            <select
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ width: 70, display: 'inline-block' }}
            >
              {[5, 10, 20, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span> , Showing: {filteredLogs.length} / Total: {logs.length} logs</span>
          </div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
              </li>
              <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>‹</button>
              </li>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              ).map(pageNum => (
                <li key={pageNum} className={`page-item${currentPage === pageNum ? ' active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>
                </li>
              ))}
              <li className={`page-item${currentPage === totalPages || totalPages === 0 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>›</button>
              </li>
              <li className={`page-item${currentPage === totalPages || totalPages === 0 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0}>»</button>
              </li>
            </ul>
          </nav>
        </div>
      </Card>
    </>
  );
}

export default APIAccessLogTable;