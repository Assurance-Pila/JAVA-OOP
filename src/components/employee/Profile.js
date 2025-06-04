import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Card } from 'react-bootstrap';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h4>Please log in to view your profile.</h4>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-3">My Profile</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </Card.Body>
      </Card>
    </Container>
  );
}
