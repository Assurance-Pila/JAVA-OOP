import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { employeeAPI } from '../../services/api';

const SubmitReport = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    reportType: '',
    description: '',
    workDone: '',
    challenges: '',
    nextSteps: '',
    dateFrom: '',
    dateTo: ''
  });
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await employeeAPI.getMyReports();
      setReports(response.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Please provide a report title';
    if (!formData.reportType) return 'Please select a report type';
    if (!formData.description.trim()) return 'Please provide a description';
    if (!formData.workDone.trim()) return 'Please describe work completed';
    if (!formData.dateFrom) return 'Please select start date';
    if (!formData.dateTo) return 'Please select end date';
    
    const startDate = new Date(formData.dateFrom);
    const endDate = new Date(formData.dateTo);
    
    if (endDate < startDate) return 'End date cannot be before start date';
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const reportData = {
        ...formData,
        employeeId: user.id,
        submissionDate: new Date().toISOString(),
        status: 'SUBMITTED'
      };
      
      await employeeAPI.submitReport(reportData);
      
      setSuccess('Report submitted successfully!');
      setFormData({
        title: '',
        reportType: '',
        description: '',
        workDone: '',
        challenges: '',
        nextSteps: '',
        dateFrom: '',
        dateTo: ''
      });
      
      fetchReports();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'SUBMITTED': { variant: 'info', text: 'Submitted' },
      'REVIEWED': { variant: 'success', text: 'Reviewed' },
      'NEEDS_REVISION': { variant: 'warning', text: 'Needs Revision' },
      'APPROVED': { variant: 'success', text: 'Approved' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getReportTypeBadge = (type) => {
    const typeConfig = {
      'DAILY': { variant: 'primary', text: 'Daily' },
      'WEEKLY': { variant: 'success', text: 'Weekly' },
      'MONTHLY': { variant: 'info', text: 'Monthly' },
      'PROJECT': { variant: 'warning', text: 'Project' },
      'INCIDENT': { variant: 'danger', text: 'Incident' }
    };
    
    const config = typeConfig[type] || { variant: 'secondary', text: type };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Submit Report</h4>
            </Card.Header>
            <Card.Body>
              <>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Report Type</Form.Label>
                        <Form.Select
                          name="reportType"
                          value={formData.reportType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="DAILY">Daily</option>
                          <option value="WEEKLY">Weekly</option>
                          <option value="MONTHLY">Monthly</option>
                          <option value="PROJECT">Project</option>
                          <option value="INCIDENT">Incident</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Work Done</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="workDone"
                          value={formData.workDone}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Challenges</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="challenges"
                          value={formData.challenges}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Next Steps</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="nextSteps"
                          value={formData.nextSteps}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date From</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateFrom"
                          value={formData.dateFrom}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date To</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateTo"
                          value={formData.dateTo}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Report'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Previous Reports</h4>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.title}</td>
                      <td>{getReportTypeBadge(report.reportType)}</td>
                      <td>{getStatusBadge(report.status)}</td>
                      <td>
                        <Button variant="info" size="sm" onClick={() => handleViewReport(report)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedReport?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div>
              <p><strong>Type:</strong> {getReportTypeBadge(selectedReport.reportType)}</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedReport.status)}</p>
              <p><strong>Description:</strong> {selectedReport.description}</p>
              <p><strong>Work Done:</strong> {selectedReport.workDone}</p>
              <p><strong>Challenges:</strong> {selectedReport.challenges}</p>
              <p><strong>Next Steps:</strong> {selectedReport.nextSteps}</p>
              <p><strong>Date From:</strong> {selectedReport.dateFrom}</p>
              <p><strong>Date To:</strong> {selectedReport.dateTo}</p>
              <p><strong>Submission Date:</strong> {new Date(selectedReport.submissionDate).toLocaleDateString()}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SubmitReport;