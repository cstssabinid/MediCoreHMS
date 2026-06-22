import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Public from './pages/Public';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import { OurStory, CurrentWork, FutureVision, Stories, StoryDetail, HealthEducation, EducationDetail, Contact } from './pages/MissionPages';
import { Donate, RequestGuidance, GetInvolved } from './pages/SupportPages';

function App() {
  return (
    <>
      <ThemeToggle />
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Public />} />
      <Route path="/public" element={<Public />} />
      <Route path="/our-story" element={<OurStory />} />
      <Route path="/current-work" element={<CurrentWork />} />
      <Route path="/future-hospital-vision" element={<FutureVision />} />
      <Route path="/health-education" element={<HealthEducation />} />
      <Route path="/health-education/:slug" element={<EducationDetail />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/stories/:slug" element={<StoryDetail />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/request-guidance" element={<RequestGuidance />} />
      <Route path="/get-involved" element={<GetInvolved />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/public/doctors" element={<Navigate to="/future-hospital-vision" replace />} />
      <Route path="/public/doctors/:id" element={<Navigate to="/future-hospital-vision" replace />} />
      <Route path="/public/appointments" element={<Navigate to="/request-guidance" replace />} />
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
