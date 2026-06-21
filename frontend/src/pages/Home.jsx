import { useEffect, useState } from 'react';
import { fetchReports } from '../services/api';
import { Link } from 'react-router-dom';

function Home() {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    fetchReports().then((r) => setSummary(r.data.totals)).catch(() => {});
  }, []);
  return (
    <div>
      <div className="card">
        <h3>Welcome to BERWA HOSPITALS</h3>
        <p>Your trusted partner in healthcare. Book an appointment or find a doctor.</p>
        <div style={{ marginTop: 12 }}>
          <Link to="/public/doctors" className="button-primary">Find Doctors</Link>&nbsp; 
          <Link to="/public/appointments" className="button-secondary">Book Appointment</Link>
        </div>
      </div>

      <div className="card-grid">
        <div className="card"><h3>Patients</h3><strong>{summary?.totalPatients ?? '—'}</strong></div>
        <div className="card"><h3>Appointments</h3><strong>{summary?.totalAppointments ?? '—'}</strong></div>
        <div className="card"><h3>Labs</h3><strong>{summary?.labRequests ?? '—'}</strong></div>
      </div>
    </div>
  );
}

export default Home;
