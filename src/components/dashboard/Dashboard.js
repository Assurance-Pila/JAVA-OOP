import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

const Dashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchLeaveRequests();
  }, []);

  user = JSON.parse(localStorage.getItem('user'));
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/all`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leave-requests/all`);
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleLeaveRequestChange = (e) => {
    setNewLeaveRequest({
      ...newLeaveRequest,
      [e.target.name]: e.target.value
    });
  };

  const submitLeaveRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const requestData = {
        ...newLeaveRequest,
        userId: user.id,
        userName: user.name,
        status: 'pending'
      };
      
      const response = await axios.post(`${API_BASE_URL}/leave-requests/save`, requestData);
      if (response.data.success) {
        setMessage('Leave request submitted successfully!');
        setNewLeaveRequest({
          leaveType: '',
          startDate: '',
          endDate: '',
          reason: ''
        });
        
        // Add the new request to the local state
        const newRequest = {
          id: Date.now(),
          ...requestData
        };
        setLeaveRequests(prev => [...prev, newRequest]);
        
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error submitting leave request');
      setTimeout(() => setMessage(''), 3000);
    }
    setIsLoading(false);
  };

  const updateLeaveRequestStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/leave-requests/${id}/status`, status);
      setLeaveRequests(prev => 
        prev.map(req => 
          req.id === id ? { ...req, status } : req
        )
      );
      setMessage(`Leave request ${status} successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating leave request');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const canApproveLeave = () => {
    return user.role === 'manager' || user.role === 'hr';
  };

  const getUserLeaveRequests = () => {
    return leaveRequests.filter(req => req.userId === user.id);
  };

  const getAllLeaveRequests = () => {
    return leaveRequests;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const tabStyle = (tabName) => ({
    padding: '0.75rem 1.5rem',
    backgroundColor: activeTab === tabName ? '#007bff' : '#f8f9fa',
    color: activeTab === tabName ? 'white' : '#495057',
    border: '1px solid #dee2e6',
    cursor: 'pointer',
    borderRadius: '4px 4px 0 0',
    marginRight: '0.25rem'
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#343a40',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>Staff Management System</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, {user.name} ({user.role})</span>
          <button
            onClick={onLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '1rem',
          margin: '1rem 2rem',
          backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724',
          border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ padding: '0 2rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #dee2e6' }}>
          <div style={tabStyle('dashboard')} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </div>
          <div style={tabStyle('leave')} onClick={() => setActiveTab('leave')}>
            Leave Requests
          </div>
          {(user.role === 'manager' || user.role === 'hr') && (
            <div style={tabStyle('staff')} onClick={() => setActiveTab('staff')}>
              Staff Management
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '2rem' }}>
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2>Dashboard Overview</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>Total Staff</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#333' }}>{users.length}</p>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#28a745' }}>Pending Requests</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#333' }}>
                  {leaveRequests.filter(req => req.status === 'pending').length}
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffc107' }}>My Requests</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#333' }}>
                  {getUserLeaveRequests().length}
                </p>
              </div>
            </div>

            {/* Recent Leave Requests */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3>Recent Leave Requests</h3>
              {leaveRequests.slice(0, 3).map(request => (
                <div key={request.id} style={{
                  padding: '1rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{request.userName}</strong> - {request.leaveType} Leave
                    <br />
                    <small>{request.startDate} to {request.endDate}</small>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: getStatusColor(request.status),
                    color: 'white'
                  }}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leave Requests Tab */}
        {activeTab === 'leave' && (
          <div>
            <h2>Leave Management</h2>
            
            {/* Submit New Leave Request */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h3>Submit Leave Request</h3>
              <form onSubmit={submitLeaveRequest} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Leave Type:</label>
                  <select
                    name="leaveType"
                    value={newLeaveRequest.leaveType}
                    onChange={handleLeaveRequestChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">Select Type</option>
                    <option value="Annual">Annual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Personal">Personal Leave</option>
                    <option value="Maternity">Maternity Leave</option>
                    <option value="Emergency">Emergency Leave</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newLeaveRequest.startDate}
                    onChange={handleLeaveRequestChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newLeaveRequest.endDate}
                    onChange={handleLeaveRequestChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Reason:</label>
                  <textarea
                    name="reason"
                    value={newLeaveRequest.reason}
                    onChange={handleLeaveRequestChange}
                    required
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      resize: 'vertical'
                    }}
                    placeholder="Please provide a reason for your leave request..."
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: isLoading ? '#6c757d' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>

            {/* Leave Requests List */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3>{canApproveLeave() ? 'All Leave Requests' : 'My Leave Requests'}</h3>
              
              {(canApproveLeave() ? getAllLeaveRequests() : getUserLeaveRequests()).map(request => (
                <div key={request.id} style={{
                  padding: '1.5rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>{request.userName}</h4>
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        <strong>Type:</strong> {request.leaveType} Leave
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        <strong>Duration:</strong> {request.startDate} to {request.endDate}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        <strong>Reason:</strong> {request.reason}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        backgroundColor: getStatusColor(request.status),
                        color: 'white'
                      }}>
                        {request.status.toUpperCase()}
                      </span>
                      
                      {canApproveLeave() && request.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => updateLeaveRequestStatus(request.id, 'approved')}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateLeaveRequestStatus(request.id, 'rejected')}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {(canApproveLeave() ? getAllLeaveRequests() : getUserLeaveRequests()).length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                  No leave requests found.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Staff Management Tab */}
        {activeTab === 'staff' && (user.role === 'manager' || user.role === 'hr') && (
          <div>
            <h2>Staff Management</h2>
            
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3>Staff Directory</h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Role</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(staffUser => (
                      <tr key={staffUser.id}>
                        <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{staffUser.name}</td>
                        <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{staffUser.email}</td>
                        <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            backgroundColor: staffUser.role === 'hr' ? '#dc3545' : staffUser.role === 'manager' ? '#ffc107' : '#007bff',
                            color: 'white'
                          }}>
                            {staffUser.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{staffUser.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
