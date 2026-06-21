import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Public from './pages/Public';
import Home from './pages/Home';
import Doctors from './pages/public/Doctors';
import DoctorProfile from './pages/public/DoctorProfile';
import AppointmentsPublic from './pages/public/AppointmentsPublic';
import Patients from './pages/Patients';
import RegisterPatient from './pages/RegisterPatient';
import Appointments from './pages/Appointments';
import Triage from './pages/Triage';
import Consultation from './pages/Consultation';
import LabRequests from './pages/LabRequests';
import Pharmacy from './pages/Pharmacy';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <>
      <ThemeToggle />
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Public />} />
      <Route path="/public" element={<Public />} />
      <Route path="/public/doctors" element={<Doctors />} />
      <Route path="/public/doctors/:id" element={<DoctorProfile />} />
      <Route path="/public/appointments" element={<AppointmentsPublic />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      </Routes>
    </>
  );
}

export default App;
