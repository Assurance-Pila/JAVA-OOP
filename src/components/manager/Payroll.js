import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';

export default function Payroll() {
  const [payrollData, setPayrollData] = useState([]);
  const [editedSalaries, setEditedSalaries] = useState({});

  useEffect(() => {
    // Fetch payroll data from backend (mocked for now)
    axios.get('http://localhost:8080/api/payroll')
      .then(res => setPayrollData(res.data))
      .catch(err => console.error('Error fetching payroll:', err));
  }, []);

  const handleSalaryChange = (employeeId, newSalary) => {
    setEditedSalaries(prev => ({
      ...prev,
      [employeeId]: newSalary
    }));
  };

  const handleUpdate = (employeeId) => {
    const newSalary = editedSalaries[employeeId];
    axios.put(`http://localhost:8080/api/payroll/${employeeId}`, { salary: newSalary })
      .then(res => {
        alert('Salary updated successfully');
        // Refresh data
        setPayrollData(data =>
          data.map(emp =>
            emp.id === employeeId ? { ...emp, salary: newSalary } : emp
          )
        );
      })
      .catch(err => console.error('Error updating salary:', err));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Payroll Management</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Current Salary</th>
            <th>New Salary</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payrollData.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>${employee.salary}</td>
              <td>
                <Form.Control
                  type="number"
                  placeholder="Enter new salary"
                  value={editedSalaries[employee.id] || ''}
                  onChange={e => handleSalaryChange(employee.id, e.target.value)}
                />
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleUpdate(employee.id)}
                  disabled={!editedSalaries[employee.id]}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
