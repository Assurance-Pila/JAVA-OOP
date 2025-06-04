import { mockDatabase } from './mockDatabase';

export const staffApi = {
  // Authentication
  login: async (formData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockDatabase.users.find(u => 
      u.email === formData.email && u.password === formData.password
    );
    
    if (user) {
      return { data: { success: true, user: { ...user, password: undefined } } };
    } else {
      throw { response: { data: { message: 'Invalid credentials' } } };
    }
  },

  // Employee Recruitment/Signup
  recruitEmployee: async (employeeData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const existingUser = mockDatabase.users.find(u => u.email === employeeData.email);
    if (existingUser) {
      throw { response: { data: { message: 'Email already exists' } } };
    }

    // Generate avatar based on gender or random
    const avatars = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🔧', '👩‍🔧'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newEmployee = {
      id: mockDatabase.nextId++,
      ...employeeData,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: randomAvatar,
      status: 'active',
      rating: 0
    };

    mockDatabase.users.push(newEmployee);
    return { data: { success: true, employee: { ...newEmployee, password: undefined } } };
  },

  // Get all users
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: mockDatabase.users.map(user => ({ ...user, password: undefined }))
    };
  },

  // Leave Requests
  getLeaveRequests: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: mockDatabase.leaveRequests };
  },

  submitLeaveRequest: async (requestData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRequest = {
      id: Date.now(),
      ...requestData
    };
    mockDatabase.leaveRequests.push(newRequest);
    return { data: { success: true } };
  },

  updateLeaveRequest: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const requestIndex = mockDatabase.leaveRequests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      mockDatabase.leaveRequests[requestIndex].status = status;
    }
    return { data: { success: true } };
  },

  // Tasks
  getTasks: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: mockDatabase.tasks };
  },

  assignTask: async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTask = {
      id: Date.now(),
      ...taskData
    };
    mockDatabase.tasks.push(newTask);
    return { data: { success: true } };
  },

  updateTaskStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const taskIndex = mockDatabase.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      mockDatabase.tasks[taskIndex].status = status;
    }
    return { data: { success: true } };
  },

  // Reports
  getReports: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: mockDatabase.reports };
  },

  submitReport: async (reportData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newReport = {
      id: Date.now(),
      ...reportData
    };
    mockDatabase.reports.push(newReport);
    return { data: { success: true } };
  },

  updateReportStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const reportIndex = mockDatabase.reports.findIndex(report => report.id === id);
    if (reportIndex !== -1) {
      mockDatabase.reports[reportIndex].status = status;
    }
    return { data: { success: true } };
  },

  // Payroll
  getPayroll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: mockDatabase.payroll };
  },

  processPayroll: async (payrollId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const payrollIndex = mockDatabase.payroll.findIndex(pay => pay.id === payrollId);
    if (payrollIndex !== -1) {
      mockDatabase.payroll[payrollIndex].status = 'processed';
    }
    return { data: { success: true } };
  },

  // Employee Rating
  rateEmployee: async (employeeId, rating, comments) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const employeeIndex = mockDatabase.users.findIndex(emp => emp.id === employeeId);
    if (employeeIndex !== -1) {
      mockDatabase.users[employeeIndex].rating = rating;
      mockDatabase.users[employeeIndex].lastRatingComment = comments;
    }
    return { data: { success: true } };
  },

  // Update Employee
  updateEmployee: async (employeeId, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const employeeIndex = mockDatabase.users.findIndex(emp => emp.id === employeeId);
    if (employeeIndex !== -1) {
      mockDatabase.users[employeeIndex] = { 
        ...mockDatabase.users[employeeIndex], 
        ...updateData 
      };
    }
    return { data: { success: true } };
  },

  // Delete Employee
  deleteEmployee: async (employeeId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const employeeIndex = mockDatabase.users.findIndex(emp => emp.id === employeeId);
    if (employeeIndex !== -1) {
      mockDatabase.users[employeeIndex].status = 'inactive';
    }
    return { data: { success: true } };
  }
};