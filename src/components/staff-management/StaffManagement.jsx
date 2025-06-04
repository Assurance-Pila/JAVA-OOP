// src/components/staff-management/index.js

// Auth
export { default as Login } from '../auth/Login';
export { default as SignUp } from '../auth/SignUp';

// Dashboard
export { default as Dashboard } from '../dashboard/Dashboard';

// HR
export { default as RecruitEmployee } from '../hr/RecruitEmployee';
export { default as LeaveRequests } from '../hr/LeaveRequests';
export { default as EmployeeRecords } from '../hr/EmployeeRecords';

// Manager
export { default as AssignTask } from '../manager/AssignTask';
export { default as RateEmployee } from '../manager/RateEmployee';
export { default as Payroll } from '../manager/Payroll';

// Employee
export { default as RequestLeave } from '../employee/RequestLeave';
export { default as SubmitReport } from '../employee/SubmitReport';
export { default as EmployeeProfile } from '../employee/Profile';

// Root Management Component
export { default as StaffManagement } from './StaffManagement';
