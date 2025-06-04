import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container className="mt-5">
      <h2>Welcome, {user?.username || 'Manager'}</h2>
      <p>This is the Manager Dashboard</p>

      <Button variant="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default ManagerDashboard;
