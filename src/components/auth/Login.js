import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, user } = await login({ email, username, password, role });
    if (!success) {
      setError('Invalid credentials. Please try again.');
    } else {
      setError('');

      // Redirect based on role
      if (user?.role === 'manager') {
        navigate('/manager/dashboard');
      } else if (user?.role === 'employee') {
        navigate('/employee/dashboard');
      } else if (user?.role === 'hr') {
        navigate('/hr/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card className="p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formRole" className="mb-4">
            <Form.Label>Select Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">-- Select Role --</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
