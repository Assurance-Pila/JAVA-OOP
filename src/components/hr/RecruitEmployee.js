import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecruitEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
  });

  const [message, setMessage] = useState('');
  const [employeeList, setEmployeeList] = useState([]);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/employees', formData);
      if (res.status === 201 || res.status === 200) {
        setMessage('Employee recruited successfully!');
        setFormData({ name: '', email: '', role: '', department: '' });
        fetchEmployees();
      } else {
        setMessage('Failed to recruit employee.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error occurred while recruiting.');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/employees');
      setEmployeeList(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Recruit New Employee</h2>
      {message && <div className="alert alert-info">{message}</div>}
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <input
            type="text"
            className="form-control"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. employee, manager"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Department</label>
          <input
            type="text"
            className="form-control"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Recruit Employee</button>
      </form>

      <h4>Current Employees</h4>
      <ul className="list-group">
        {employeeList.map(emp => (
          <li key={emp.id} className="list-group-item">
            {emp.name} - {emp.email} - {emp.role} ({emp.department})
          </li>
        ))}
      </ul>
    </div>
  );
}
