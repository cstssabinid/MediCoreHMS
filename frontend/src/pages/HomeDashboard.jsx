import { useEffect, useState } from 'react';
import { fetchPatients, fetchAppointments, fetchReports } from '../services/api';

function HomeDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    fetchPatients().then((res) => setPatients(res.data.patients.slice(0, 5))).catch(console.error);
    fetchAppointments().then((res) => setAppointments(res.data.appointments.slice(0, 5))).catch(console.error);
    fetchReports().then((res) => setReports(res.data.totals)).catch(console.error);
  }, []);

  return (
    <div>
      <div className="card-grid">
        <div className="card"><h3>Total Patients</h3><strong>{reports?.totalPatients ?? '—'}</strong></div>
        <div className="card"><h3>Appointments</h3><strong>{reports?.totalAppointments ?? '—'}</strong></div>
        <div className="card"><h3>Revenue</h3><strong>${reports?.totalRevenue?.toFixed(2) ?? '—'}</strong></div>
        <div className="card"><h3>Lab Requests</h3><strong>{reports?.labRequests ?? '—'}</strong></div>
      </div>
      <div className="card table-card">
        <h3>Recent Patients</h3>
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Insurance</th></tr></thead>
          <tbody>{patients.map((patient) => (<tr key={patient.id}><td>{patient.first_name} {patient.last_name}</td><td>{patient.phone}</td><td>{patient.insurance_provider || 'None'}</td></tr>))}</tbody>
        </table>
      </div>
      <div className="card table-card">
        <h3>Today&apos;s Appointments</h3>
        <table>
          <thead><tr><th>Patient</th><th>Department</th><th>Status</th></tr></thead>
          <tbody>{appointments.map((item) => (<tr key={item.id}><td>{item.patient_first_name} {item.patient_last_name}</td><td>{item.department}</td><td><span className="status-badge">{item.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

export default HomeDashboard;
