// import node module libraries
import { useState } from "react";
import { Card, Table, Spinner, Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";

import { ReportTableProps, Report } from "types";
import ReportEditForm from "./ReportEditForm";
import { ReportActions } from "../../components/permissions/ReportActions";

function ReportTable({ reports, onReload }: ReportTableProps) {
  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // const [searchTerm, setSearchTerm] = useState<string>('');

  // For ReportFilters use
  // const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  // const [selectedResults, setSelectedResults] = useState<string[]>([]);
  // const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  // const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // 10 data per page

  // Auto reset to first page while changing filters
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchTerm, selectedPlatforms, selectedResults, selectedStatuses, dateRange]);

  // const clearAllFilters = () => {
  //   setSearchTerm('');
  //   setSelectedPlatforms([]);
  //   setSelectedResults([]);
  //   setSelectedStatuses([]);
  //   setDateRange({ startDate: null, endDate: null });
  // };

  // ...Origin state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [editForm, setEditForm] = useState<Report | null>(null);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingReport, setDeletingReport] = useState<Report | null>(null);

  // Close edit window
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingReport(null);
    setEditForm(null); // 清空表單狀態
  };

  // Open edit window
  const handleEdit = (report: Report) => {
    setEditingReport(report);
    setEditForm({ ...report }); // Copy one as the form
    setShowEditModal(true);
  };

  // Define API_BASE_URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSave = async () => {
    if (!editForm) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/reports/${editForm.id}`, {
        method: "PATCH", // Use PATCH method
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error("Update failed");
      // Optional : Update front-end data
      if (onReload) onReload(); // Notified parent layer to fetch data
      setShowEditModal(false);
      setEditingReport(null);
      setEditForm(null); // 清空表單狀態
      // Trigger parent layer to fetch data again here OR update "reports" in front-end directly
    } catch (err) {
      alert("Update data failed!");
    }
  };





  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sort
  const sortedReports = [...reports].sort((a, b) => {
    const fieldA =
      sortField === 'short_platform_brand'
        ? (a.short_platform_brand || a.platform_brand)
        : sortField === 'short_platform'
          ? (a.short_platform || a.platform)
          : a[sortField];
    const fieldB =
      sortField === 'short_platform_brand'
        ? (b.short_platform_brand || b.platform_brand)
        : sortField === 'short_platform'
          ? (b.short_platform || b.platform)
          : b[sortField];

    if (fieldA == null && fieldB == null) return 0;
    if (fieldA == null) return 1;
    if (fieldB == null) return -1;

    if (sortField === 'date') {
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

  // Paging
  const currentReports = sortedReports.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedReports.length / rowsPerPage);


  // const currentReports = reports.slice(indexOfFirstRow, indexOfLastRow);
  // const totalPages = Math.ceil(reports.length / rowsPerPage);

  // const currentReports = filteredReports.slice(indexOfFirstRow, indexOfLastRow);
  // const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  const handleDeleteClick = (report: Report) => {
    setDeletingReport(report);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingReport) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/reports/${deletingReport.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Delete failed");
      setShowDeleteModal(false);
      setDeletingReport(null);
      if (onReload) onReload();
    } catch (err) {
      alert("Delete data failed!");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingReport(null);
  };

  return (
    <>
      <style>{`
        .tooltip-sys-event .tooltip-inner {
          max-width: 1500px !important;
          text-align: left;
        }
        .tooltip-sys-event {
          max-width: 1500px !important;
        }
      `}</style>
      <Card className="h-100">

        {/* <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Daily Reports</h4>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control w-25"
          />
        </Card.Header> */}

        {/* Pie chart summary area */}
        {/* <div className="mb-4">
          <Card className="p-3">
            <ReportSummary reports={filteredReports} />
          </Card>
        </div> */}

        <Card.Header className="bg-white py-4">
          <h4 className="mb-2">Reports</h4>
        </Card.Header>

        <Table responsive className="text-nowrap">
          <thead className="table-light">
            <tr>
              {/* <th onClick={() => handleSort('op_name')} style={{ cursor: 'pointer' }}>
                Operator {sortField === 'op_name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th> */}
              <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                Date {sortField === 'date' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('short_platform_brand')} style={{ cursor: 'pointer' }}>
                Platform Brand {sortField === 'short_platform_brand' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('short_platform')} style={{ cursor: 'pointer' }}>
                Platform {sortField === 'short_platform' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('cpu_codename')} style={{ cursor: 'pointer' }}>
                CPU Codename {sortField === 'cpu_codename' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('wlan')} style={{ cursor: 'pointer' }}>
                WLAN {sortField === 'wlan' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('wifi_name')} style={{ cursor: 'pointer' }}>
                WiFi AP Name {sortField === 'wifi_name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('short_scenario')} style={{ cursor: 'pointer' }}>
                Scenario {sortField === 'short_scenario' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('bt_driver')} style={{ cursor: 'pointer' }}>
                BT Driver {sortField === 'bt_driver' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('wifi_driver')} style={{ cursor: 'pointer' }}>
                WiFi Driver {sortField === 'wifi_driver' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('result')} style={{ cursor: 'pointer' }}>
                Result {sortField === 'result' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('fail_rate')} style={{ cursor: 'pointer' }}>
                Fail Rate {sortField === 'fail_rate' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('sys_event_log')} style={{ cursor: 'pointer' }}>
                System Event Log {sortField === 'sys_event_log' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('comment')} style={{ cursor: 'pointer' }}>
                Comment {sortField === 'comment' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('jira_id')} style={{ cursor: 'pointer' }}>
                Jira ID {sortField === 'jira_id' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('hsd_id')} style={{ cursor: 'pointer' }}>
                HSD ID {sortField === 'hsd_id' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((item) => {
              const displayPlatformBrand = item.short_platform_brand || item.platform_brand || '';
              const displayPlatform = item.short_platform || item.platform || '';

              return (
                <tr key={item.id}>
                  {/* <td className="align-middle">{item.op_name}</td> */}
                  <td className="align-middle">{new Date(item.date).toLocaleString()}</td>
                  {/* <td className="align-middle">{item.platform_brand}</td> */}
                  <td className="align-middle">
                    {displayPlatformBrand && displayPlatformBrand.length > 15 ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-platform_brand-${item.id}`}>
                            <div style={{ maxWidth: '400px', whiteSpace: 'pre-line', wordWrap: 'break-word', textAlign: 'left' }}>
                              {displayPlatformBrand.replace(/\] \[/g, ']\n[')}
                            </div>
                          </Tooltip>
                        }
                      >
                        <div style={{ cursor: 'pointer' }}>
                          {displayPlatformBrand.substring(0, 12)}...
                        </div>
                      </OverlayTrigger>
                    ) : (
                      <div>
                        {displayPlatformBrand}
                      </div>
                    )}
                  </td>
                  <td className="align-middle">{displayPlatform}</td>
                  <td className="align-middle">{item.cpu_codename || item.cpu}</td>
                  <td className="align-middle">{item.wlan}</td>
                  <td className="align-middle">{item.wifi_name || ''}</td>
                  <td className="align-middle">{item.short_scenario || item.scenario}</td>
                  <td className="align-middle">{item.bt_driver}</td>
                  <td className="align-middle">{item.wifi_driver}</td>
                  <td className="align-middle">
                    {item.result?.toUpperCase() === 'PASS' ? (
                      <span className="badge bg-success d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                        {item.result}
                      </span>
                    ) : item.result?.toUpperCase() === 'FAIL' ? (
                      <span className="badge bg-danger d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                        {item.result}
                      </span>
                    ) : item.result?.toUpperCase() === 'TRIAGED' ? (
                      <span className="badge d-flex align-items-center justify-content-center" style={{ backgroundColor: "#8f8c8c", height: "2em" }}>
                        {item.result}
                      </span>
                    ) : item.result?.toUpperCase() === 'BLOCK' ? (
                      <span className="badge bg-dark d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                        {item.result}
                      </span>
                    ) : item.result?.toUpperCase() === 'WARNING' ? (
                      <span className="badge bg-secondary d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                        {item.result}
                      </span>
                    ) : (
                      <span className="badge bg-info d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-1"
                        />
                        {item.result || ''}
                      </span>
                    )}
                  </td>
                  {/* <td className="align-middle">{item.fail_rate}</td> */}
                  <td className="align-middle">
                    {item.result?.toUpperCase() === 'ON-GOING' ? (
                      ""
                    ) : (
                      item.fail_cycles + "/" + item.cycles
                    )}
                  </td>
                  <td className="align-middle">
                    {item.sys_event_log && item.sys_event_log.length > 20 ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-sys-event-${item.id}`} className="tooltip-sys-event">
                            <div style={{ maxWidth: '1500px', whiteSpace: 'pre-line', wordWrap: 'break-word', textAlign: 'left' }}>
                              {item.sys_event_log.replace(/\] \[/g, ']\n[')}
                            </div>
                          </Tooltip>
                        }
                      >
                        <div style={{ cursor: 'pointer' }}>
                          {item.sys_event_log.substring(0, 20)}...
                        </div>
                      </OverlayTrigger>
                    ) : (
                      <div>
                        {item.sys_event_log || ''}
                      </div>
                    )}
                  </td>
                  <td className="align-middle">
                    {item.comment && item.comment.length > 20 ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-comment-${item.id}`}>
                            <div style={{ maxWidth: '400px', whiteSpace: 'pre-line', wordWrap: 'break-word', textAlign: 'left' }}>
                              {item.comment.replace(/\] \[/g, ']\n[')}
                            </div>
                          </Tooltip>
                        }
                      >
                        <div style={{ cursor: 'pointer' }}>
                          {item.comment.substring(0, 20)}...
                        </div>
                      </OverlayTrigger>
                    ) : (
                      <div>
                        {item.comment || ''}
                      </div>
                    )}
                  </td>
                  <td className="align-middle">{item.jira_id || ''}</td>
                  <td className="align-middle">{item.hsd_id || ''}</td>
                  <td className="align-middle">
                    {/* <ActionMenu /> */}
                    <ReportActions
                      report={item}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDeleteClick(item)}
                    />
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
            <span> , Total: {reports.length} data</span>
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

        <Modal show={showEditModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingReport && (
              <ReportEditForm report={editForm} onChange={f => setEditForm(f)} />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={handleCancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {deletingReport && (
              <div>
                <p>Are you sure you want to delete this report?</p>
                <ul>
                  <li><b>Operator:</b> {deletingReport.op_name}</li>
                  <li><b>Date:</b> {new Date(deletingReport.date).toLocaleString()}</li>
                  <li><b>Platform Brand:</b> {deletingReport.short_platform_brand || deletingReport.platform_brand}</li>
                  <li><b>Platform:</b> {deletingReport.short_platform || deletingReport.platform}</li>
                  <li><b>CPU:</b> {deletingReport.cpu_codename || deletingReport.cpu}</li>
                  <li><b>WLAN:</b> {deletingReport.wlan}</li>
                  <li><b>BT driver:</b> {deletingReport.bt_driver}</li>
                  <li><b>Wi-Fi driver:</b> {deletingReport.wifi_driver}</li>
                  <li><b>Scenario:</b> {deletingReport.short_scenario || deletingReport.scenario}</li>
                  <li><b>Fail Rate:</b> {deletingReport.fail_rate}</li>
                  <li><b>Result:</b> {deletingReport.result}</li>
                  {/* Add more columns */}
                </ul>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDelete}>
              No
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </>
  );
}

export default ReportTable;