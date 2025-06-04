export const mockDatabase = {
    users: [
      { id: 1, name: 'Thelma Johnson', email: 'thelma@example.com', role: 'employee', salary: 45000, department: 'Marketing', joinDate: '2023-01-15', avatar: '👩‍💼', phone: '+1234567890', address: '123 Main St', emergencyContact: 'Jane Johnson - +1234567891', status: 'active', password: 'password123' },
      { id: 2, name: 'Divine Smith', email: 'divine@example.com', role: 'manager', salary: 75000, department: 'Sales', joinDate: '2022-03-10', avatar: '👨‍💼', phone: '+1234567892', address: '456 Oak Ave', emergencyContact: 'Mary Smith - +1234567893', status: 'active', password: 'password123' },
      { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'hr', salary: 65000, department: 'Human Resources', joinDate: '2021-08-20', avatar: '👩‍🔧', phone: '+1234567894', address: '789 Pine Rd', emergencyContact: 'Bob Admin - +1234567895', status: 'active', password: 'admin123' },
      { id: 4, name: 'John Doe', email: 'john@example.com', role: 'employee', salary: 55000, department: 'IT', joinDate: '2023-06-01', avatar: '👨‍💻', phone: '+1234567896', address: '321 Elm St', emergencyContact: 'Sarah Doe - +1234567897', status: 'active', password: 'password123' },
      { id: 5, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'employee', salary: 50000, department: 'Finance', joinDate: '2023-02-14', avatar: '👩‍💻', phone: '+1234567898', address: '654 Maple Dr', emergencyContact: 'Tom Wilson - +1234567899', status: 'active', password: 'password123' }
    ],
    leaveRequests: [
      { id: 1, userId: 1, userName: 'Thelma Johnson', leaveType: 'Annual', startDate: '2025-06-15', endDate: '2025-06-20', reason: 'Family vacation', status: 'pending', submittedDate: '2025-06-01', days: 6 },
      { id: 2, userId: 4, userName: 'John Doe', leaveType: 'Sick', startDate: '2025-06-10', endDate: '2025-06-12', reason: 'Medical appointment', status: 'approved', submittedDate: '2025-05-28', days: 3 },
      { id: 3, userId: 5, userName: 'Sarah Wilson', leaveType: 'Personal', startDate: '2025-07-01', endDate: '2025-07-03', reason: 'Family event', status: 'rejected', submittedDate: '2025-05-25', days: 3 }
    ],
    tasks: [
      { id: 1, title: 'Q2 Marketing Campaign Analysis', description: 'Analyze performance metrics for Q2 marketing campaigns', assignedTo: 1, assignedBy: 2, assignedToName: 'Thelma Johnson', assignedByName: 'Divine Smith', priority: 'high', status: 'in-progress', dueDate: '2025-06-10', createdDate: '2025-06-01', progress: 60 },
      { id: 2, title: 'Website Security Audit', description: 'Conduct comprehensive security audit of company website', assignedTo: 4, assignedBy: 2, assignedToName: 'John Doe', assignedByName: 'Divine Smith', priority: 'high', status: 'pending', dueDate: '2025-06-15', createdDate: '2025-06-02', progress: 0 }
    ],
    reports: [
      { id: 1, title: 'Marketing ROI Analysis', type: 'Marketing', submittedBy: 1, submittedByName: 'Thelma Johnson', submittedDate: '2025-06-01', status: 'reviewed', content: 'Comprehensive analysis showing 18% improvement in ROI compared to Q1.', category: 'performance' }
    ],
    payroll: [
      { id: 1, employeeId: 1, employeeName: 'Thelma Johnson', baseSalary: 45000, bonus: 2000, deductions: 3500, netPay: 43500, payPeriod: 'June 2025', status: 'processed', overtimeHours: 8, overtimePay: 400 }
    ],
    nextId: 6
  };
  