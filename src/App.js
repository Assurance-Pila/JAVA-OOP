import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';

import Login from './components/auth/Login';
import Register from './components/auth/SignUp'; // Update this line if needed
import Dashboard from './components/dashboard/Dashboard';

import RequestLeave from './components/employee/RequestLeave';
import SubmitReport from './components/employee/SubmitReport';
import EmployeeProfile from './components/employee/Profile';
import EmployeeDashboard from './components/employee/EmployeeDashboard'; // ✅ New

import AssignTask from './components/manager/AssignTask';
import RateEmployee from './components/manager/RateEmployee';
import Payroll from './components/manager/Payroll';
import ManagerDashboard from './components/manager/ManagerDashboard';

import RecruitEmployee from './components/hr/RecruitEmployee';
import LeaveRequests from './components/hr/LeaveRequests';
import EmployeeRecords from './components/hr/EmployeeRecords';
import HRDashboard from './components/hr/HRDashboard'; // ✅ New

import { AuthProvider, useAuth } from './contexts/AuthContext';

// 🔐 ProtectedRoute to restrict access
function ProtectedRoute({ element, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;

  return element;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          

          {/* Shared dashboard */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />

          {/* Manager routes */}
          <Route
            path="/manager/dashboard"
            element={<ProtectedRoute element={<ManagerDashboard />} allowedRoles={['manager']} />}
          />
          <Route
            path="/manager/assign-task"
            element={<ProtectedRoute element={<AssignTask />} allowedRoles={['manager']} />}
          />
          <Route
            path="/manager/rate-employee"
            element={<ProtectedRoute element={<RateEmployee />} allowedRoles={['manager']} />}
          />
          <Route
            path="/manager/payroll"
            element={<ProtectedRoute element={<Payroll />} allowedRoles={['manager']} />}
          />

          {/* Employee routes */}
          <Route
            path="/employee/dashboard"
            element={<ProtectedRoute element={<EmployeeDashboard />} allowedRoles={['employee']} />}
          />
          <Route
            path="/employee/request-leave"
            element={<ProtectedRoute element={<RequestLeave />} allowedRoles={['employee']} />}
          />
          <Route
            path="/employee/submit-report"
            element={<ProtectedRoute element={<SubmitReport />} allowedRoles={['employee']} />}
          />
          <Route
            path="/employee/profile"
            element={<ProtectedRoute element={<EmployeeProfile />} allowedRoles={['employee']} />}
          />

          {/* HR routes */}
          <Route
            path="/hr/dashboard"
            element={<ProtectedRoute element={<HRDashboard />} allowedRoles={['hr']} />}
          />
          <Route
            path="/hr/recruit-employee"
            element={<ProtectedRoute element={<RecruitEmployee />} allowedRoles={['hr']} />}
          />
          <Route
            path="/hr/leave-requests"
            element={<ProtectedRoute element={<LeaveRequests />} allowedRoles={['hr']} />}
          />
          <Route
            path="/hr/employee-records"
            element={<ProtectedRoute element={<EmployeeRecords />} allowedRoles={['hr']} />}
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
