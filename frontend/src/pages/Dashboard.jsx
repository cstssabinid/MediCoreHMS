import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Patients from './Patients';
import RegisterPatient from './RegisterPatient';
import Appointments from './Appointments';
import Triage from './Triage';
import Consultation from './Consultation';
import LabRequests from './LabRequests';
import Pharmacy from './Pharmacy';
import Billing from './Billing';
import Reports from './Reports';
import Users from './Users';
import AuditLogs from './AuditLogs';
import Settings from './Settings';
import HomeDashboard from './HomeDashboard';
import { DonationsAdmin, CampaignsAdmin, StoriesAdmin, GuidanceAdmin, InvolvedAdmin, ImpactAdmin } from './InitiativeAdmin';

function Dashboard() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Berwa HMS Dashboard" />
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/new" element={<RegisterPatient />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/triage" element={<Triage />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/labs" element={<LabRequests />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="donations" element={<DonationsAdmin />} />
          <Route path="campaigns" element={<CampaignsAdmin />} />
          <Route path="stories" element={<StoriesAdmin />} />
          <Route path="guidance-requests" element={<GuidanceAdmin />} />
          <Route path="get-involved" element={<InvolvedAdmin />} />
          <Route path="impact" element={<ImpactAdmin />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;
