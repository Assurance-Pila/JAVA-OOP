import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssignTask() {
  const [formData, setFormData] = useState({
    employeeName: '',
    taskDescription: ''
  });
  const [message, setMessage] = useState('');
  const [assignedTasks, setAssignedTasks] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/tasks', formData);
      if (res.status === 201 || res.status === 200) {
        setMessage('Task assigned successfully!');
        setFormData({ employeeName: '', taskDescription: '' });
        fetchAssignedTasks();
      } else {
        setMessage('Failed to assign task.');
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      setMessage('An error occurred while assigning task.');
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/tasks');
      setAssignedTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Assign Task</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Employee Name</label>
          <input
            type="text"
            name="employeeName"
            className="form-control"
            value={formData.employeeName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Task Description</label>
          <textarea
            name="taskDescription"
            className="form-control"
            value={formData.taskDescription}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Assign</button>
      </form>

      <h4 className="mt-5">Assigned Tasks</h4>
      <ul className="list-group">
        {assignedTasks.map((task) => (
          <li key={task.id} className="list-group-item">
            {task.employeeName}: {task.taskDescription}
          </li>
        ))}
      </ul>
    </div>
  );
}
