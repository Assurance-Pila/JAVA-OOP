import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeaveRequest() {
  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    endDate: ''
  });
  const [message, setMessage] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/leave-requests', formData);
      if (response.status === 201 || response.status === 200) {
        setMessage('Leave request submitted successfully!');
        setFormData({ reason: '', startDate: '', endDate: '' });
        fetchLeaveRequests();
      } else {
        setMessage('Failed to submit leave request.');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/leave-requests');
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Request Leave</h2>
      {message && <div className="alert alert-info">{message}</div>}
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Reason for Leave</label>
          <input
            type="text"
            name="reason"
            className="form-control"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            name="startDate"
            className="form-control"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            name="endDate"
            className="form-control"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Submit Leave Request</button>
      </form>

      <h4>My Leave Requests</h4>
      <ul className="list-group">
        {leaveRequests.map((req) => (
          <li key={req.id} className="list-group-item">
            {req.startDate} to {req.endDate} — {req.reason} ({req.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
