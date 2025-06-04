// src/components/employee/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../../services/api';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState({
    tasks: [],
    leaveRequests: [],
    reports: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [dashboardResponse, tasksResponse, leaveResponse, reportsResponse] = await Promise.all([
        employeeAPI.getDashboardData(),
        employeeAPI.getMyTasks(),
        employeeAPI.getMyLeaveRequests(),
        employeeAPI.getMyReports()
      ]);
      
      setDashboardData({
        stats: dashboardResponse.data,
        tasks: tasksResponse.data || [],
        leaveRequests: leaveResponse.data || [],
        reports: reportsResponse.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      await employeeAPI.updateTaskStatus(taskId, newStatus);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      setError('Failed to update task status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { variant: 'warning', text: 'Pending' },
      'IN_PROGRESS': { variant: 'info', text: 'In Progress' },
      'COMPLETED': { variant: 'success', text: 'Completed' },
      'APPROVED': { variant: 'success', text: 'Approved' },
      'REJECTED': { variant: 'danger', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const calculateTaskProgress = () => {
    if (dashboardData.tasks.length === 0) return 0;
    const completedTasks = dashboardData.tasks.filter(task => task.status === 'COMPLETED').length;
    return (completedTasks / dashboardData.tasks.length) * 100;
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <h2>Employee Dashboard</h2>
          <p className="text-muted">Welcome back, {user.firstName || user.username}!</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center bg-primary text-white">
            <Card.Body>
              <h3>{dashboardData.tasks.length}</h3>
              <p className="mb-0">Total Tasks</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-success text-white">
            <Card.Body>
              <h3>{dashboardData.tasks.filter(task => task.status === 'COMPLETED').length}</h3>
              <p className="mb-0">Completed Tasks</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-warning text-white">
            <Card.Body>
              <h3>{dashboardData.leaveRequests.filter(req => req.status === 'PENDING').length}</h3>
              <p className="mb-0">Pending Leaves</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-info text-white">
            <Card.Body>
              <h3>{dashboardData.reports.length}</h3>
              <p className="mb-0">Reports Submitted</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Task Progress */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Task Progress</h5>
            </Card.Header>
            <Card.Body>
              <ProgressBar 
                now={calculateTaskProgress()} 
                label={`${Math.round(calculateTaskProgress())}%`}
                variant="success"
              />
              <small className="text-muted mt-2 d-block">
                {dashboardData.tasks.filter(task => task.status === 'COMPLETED').length} of {dashboardData.tasks.length} tasks completed
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* My Tasks */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Tasks</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => navigate('/employee/task-management')}
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {dashboardData.tasks.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <p>No tasks assigned yet</p>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Priority</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.tasks.slice(0, 5).map((task) => (
                      <tr key={task.id}>
                        <td>
                          <strong>{task.title}</strong>
                          <br />
                          <small className="text-muted">{task.description}</small>
                        </td>
                        <td>
                          <Badge bg={task.priority === 'HIGH' ? 'danger' : task.priority === 'MEDIUM' ? 'warning' : 'info'}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td>{getStatusBadge(task.status)}</td>
                        <td>
                          {task.status === 'PENDING' && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleTaskStatusUpdate(task.id, 'IN_PROGRESS')}
                            >
                              Start
                            </Button>
                          )}
                          {task.status === 'IN_PROGRESS' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleTaskStatusUpdate(task.id, 'COMPLETED')}
                            >
                              Complete
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Leave Requests */}
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Leave Requests</h5>
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => navigate('/employee/request-leave')}
              >
                New Request
              </Button>
            </Card.Header>
            <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {dashboardData.leaveRequests.length === 0 ? (
                <div className="text-center text-muted">
                  <p>No leave requests</p>
                </div>
              ) : (
                dashboardData.leaveRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="border-bottom pb-2 mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{request.leaveType}</h6>
                        <small className="text-muted">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </small>
                        <br />
                        <small>{getStatusBadge(request.status)}</small>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary"
                  onClick={() => navigate('/employee/request-leave')}
                >
                  Request Leave
                </Button>
                <Button 
                  variant="outline-success"
                  onClick={() => navigate('/employee/submit-report')}
                >
                  Submit Report
                </Button>
                <Button 
                  variant="outline-info"
                  onClick={() => navigate('/employee/profile')}
                >
                  Update Profile
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeDashboard;