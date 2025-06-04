import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Make sure this path is correct

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // You must define this in your AuthContext
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">Staff Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

            {!user && (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}

            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>

                {user.role === 'manager' && (
                  <>
                    <Nav.Link as={Link} to="/manager/assign-task">Assign Task</Nav.Link>
                    <Nav.Link as={Link} to="/manager/rate-employee">Rate Employee</Nav.Link>
                    <Nav.Link as={Link} to="/manager/payroll">Payroll</Nav.Link>
                  </>
                )}

                {user.role === 'employee' && (
                  <>
                    <Nav.Link as={Link} to="/employee/request-leave">Leave Request</Nav.Link>
                    <Nav.Link as={Link} to="/employee/submit-report">Submit Report</Nav.Link>
                    <Nav.Link as={Link} to="/employee/profile">Profile</Nav.Link>
                  </>
                )}

                {user.role === 'hr' && (
                  <>
                    <Nav.Link as={Link} to="/hr/recruit-employee">Recruit</Nav.Link>
                    <Nav.Link as={Link} to="/hr/leave-requests">Leave Requests</Nav.Link>
                    <Nav.Link as={Link} to="/hr/employee-records">Employee Records</Nav.Link>
                  </>
                )}

                <NavDropdown title={user.username} id="user-nav-dropdown" align="end">
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
