import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HRDashboard = () => {
  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">HR Dashboard</h2>
      <Row className="justify-content-center">

        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Recruit Employee</Card.Title>
              <Card.Text>Hire and onboard new employees.</Card.Text>
              <Button as={Link} to="/hr/recruit-employee" variant="primary">Recruit Now</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Leave Requests</Card.Title>
              <Card.Text>Review leave requests submitted by employees.</Card.Text>
              <Button as={Link} to="/hr/leave-requests" variant="primary">View Requests</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Employee Records</Card.Title>
              <Card.Text>Access and manage employee information.</Card.Text>
              <Button as={Link} to="/hr/employee-records" variant="primary">Manage Records</Button>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
};

export default HRDashboard;
