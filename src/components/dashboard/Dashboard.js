import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // ✅ Correct hook name
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth(); // ✅ This now matches the hook name

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h3>Please log in to access your dashboard.</h3>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Welcome to the Dashboard, {user.username}</h2>
      <Row className="justify-content-center">

        {/* MANAGER FEATURES */}
        {user.role === 'manager' && (
          <>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Assign Task</Card.Title>
                  <Card.Text>Assign tasks to employees under your supervision.</Card.Text>
                  <Button as={Link} to="/manager/assign-task" variant="primary">Assign Task</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Rate Employee</Card.Title>
                  <Card.Text>Rate performance of employees you've supervised.</Card.Text>
                  <Button as={Link} to="/manager/rate-employee" variant="primary">Rate Employee</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Payroll Management</Card.Title>
                  <Card.Text>View and manage employee payroll records.</Card.Text>
                  <Button as={Link} to="/manager/payroll" variant="primary">Manage Payroll</Button>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {/* EMPLOYEE FEATURES */}
        {user.role === 'employee' && (
          <>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Request Leave</Card.Title>
                  <Card.Text>Submit a request for leave to HR.</Card.Text>
                  <Button as={Link} to="/employee/request-leave" variant="success">Request Leave</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Submit Report</Card.Title>
                  <Card.Text>Send in your daily or weekly report.</Card.Text>
                  <Button as={Link} to="/employee/submit-report" variant="success">Submit Report</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>View Profile</Card.Title>
                  <Card.Text>See your employee profile and personal information.</Card.Text>
                  <Button as={Link} to="/employee/profile" variant="success">View Profile</Button>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {/* HR FEATURES */}
        {user.role === 'hr' && (
          <>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Recruit Employee</Card.Title>
                  <Card.Text>Add new employees to the system.</Card.Text>
                  <Button as={Link} to="/hr/recruit-employee" variant="warning">Recruit</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Manage Leave Requests</Card.Title>
                  <Card.Text>Approve or reject leave requests from employees.</Card.Text>
                  <Button as={Link} to="/hr/leave-requests" variant="warning">Leave Requests</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Employee Records</Card.Title>
                  <Card.Text>View and update staff records and HR files.</Card.Text>
                  <Button as={Link} to="/hr/employee-records" variant="warning">Employee Records</Button>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {/* Fallback for unknown role */}
        {user.role !== 'manager' && user.role !== 'employee' && user.role !== 'hr' && (
          <Col md={8}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>Unknown Role</Card.Title>
                <Card.Text>Your user role is not recognized. Please contact admin.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Dashboard;
