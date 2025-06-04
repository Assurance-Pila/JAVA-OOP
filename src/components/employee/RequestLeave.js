// src/components/employee/RequestLeave.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { employeeAPI } from '../../services/api';

const RequestLeave = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: ''
  });
  
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await employeeAPI.getMyLeaveRequests();
      setLeaveRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const validateForm = () => {
    if (!formData.leaveType) return 'Please select a leave type';
    if (!formData.startDate) return 'Please select start date';
    if (!formData.endDate) return 'Please select end date';
    if (!formData.reason.trim()) return 'Please provide a reason for leave';
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();
    
    if (startDate < today) return 'Start date cannot be in the past';
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
      const leaveData = {
        ...formData,
        employeeId: user.id,
        numberOfDays: calculateDays(),
        status: 'PENDING'
      };
      
      await employeeAPI.requestLeave(leaveData);
      
      setSuccess('Leave request submitted successfully!');
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
        emergencyContact: ''
      });
      
      fetchLeaveRequests(); // Refresh the list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { variant: 'warning', text: 'Pending' },
      'APPROVED': { variant: 'success', text: 'Approved' },
      'REJECTED': { variant: 'danger', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Request Leave</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Leave Type *</Form.Label>
                      <Form.Select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Select Leave Type --</option>
                        <option value="ANNUAL">Annual Leave</option>
                        <option value="SICK">Sick Leave</option>
                        <option value="MATERNITY">Maternity Leave</option>
                        <option value="PATERNITY">Paternity Leave</option>
                        <option value="EMERGENCY">Emergency Leave</option>
                        <option value="BEREAVEMENT">Bereavement Leave</option>
                        <option value="UNPAID">Unpaid Leave</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Emergency Contact</Form.Label>
                      <Form.Control
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder="Emergency contact number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {formData.startDate && formData.endDate && (
                  <Alert variant="info">
                    <strong>Total Days:</strong> {calculateDays()} day(s)
                  </Alert>
                )}

                <Form.Group className="mb-4">
                  <Form.Label>Reason for Leave *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Please provide detailed reason for your leave request..."
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Leave Request'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Leave Balance</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <h4 className="text-primary">25 Days</h4>
                <p className="text-muted">Annual Leave Remaining</p>
                
                <hr />
                
                <Row className="text-center">
                  <Col>
                    <strong>12</strong><br />
                    <small className="text-muted">Used</small>
                  </Col>
                  <Col>
                    <strong>3</strong><br />
                    <small className="text-muted">Pending</small>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leave Requests History */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">My Leave Requests</h5>
            </Card.Header>
            <Card.Body>
              {leaveRequests.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <p>No leave requests found</p>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Status</th>
                      <th>Applied On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td>
                          <Badge bg="info">{request.leaveType}</Badge>
                        </td>
                        <td>{new Date(request.startDate).toLocaleDateString()}</td>
                        <td>{new Date(request.endDate).toLocaleDateString()}</td>
                        <td>{request.numberOfDays}</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td>{new Date(request.appliedDate).toLocaleDateString()}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleViewRequest(request)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leave Request Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Leave Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              <Row className="mb-3">
                <Col sm={4}><strong>Leave Type:</strong></Col>
                <Col sm={8}><Badge bg="info">{selectedRequest.leaveType}</Badge></Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Duration:</strong></Col>
                <Col sm={8}>
                  {new Date(selectedRequest.startDate).toLocaleDateString()} - {new Date(selectedRequest.endDate).toLocaleDateString()}
                  <br />
                  <small className="text-muted">({selectedRequest.numberOfDays} days)</small>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Status:</strong></Col>
                <Col sm={8}>{getStatusBadge(selectedRequest.status)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Applied On:</strong></Col>
                <Col sm={8}>{new Date(selectedRequest.appliedDate).toLocaleDateString()}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Reason:</strong></Col>
                <Col sm={8}>{selectedRequest.reason}</Col>
              </Row>
              {selectedRequest.emergencyContact && (
                <Row className="mb-3">
                  <Col sm={4}><strong>Emergency Contact:</strong></Col>
                  <Col sm={8}>{selectedRequest.emergencyContact}</Col>
                </Row>
              )}
              {selectedRequest.managerComments && (
                <Row className="mb-3">
                  <Col sm={4}><strong>Manager Comments:</strong></Col>
                  <Col sm={8}>
                    <Alert variant={selectedRequest.status === 'APPROVED' ? 'success' : 'danger'}>
                      {selectedRequest.managerComments}
                    </Alert>
                  </Col>
                </Row>
              )}
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

export default RequestLeave;