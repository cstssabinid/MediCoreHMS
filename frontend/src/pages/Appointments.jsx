import { useEffect, useState } from 'react';
import { fetchAppointments } from '../services/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    fetchAppointments().then((res) => setAppointments(res.data.appointments)).catch(console.error);
  }, []);
  return (
    <div>
      <div className="card"><h3>Appointments</h3><p>Review scheduled appointments and status information.</p></div>
      <div className="card table-card">
        <table>
          <thead><tr><th>Code</th><th>Patient</th><th>Doctor</th><th>When</th><th>Status</th></tr></thead>
          <tbody>{appointments.map((appointment) => (<tr key={appointment.id}><td>{appointment.appointment_code}</td><td>{appointment.patient_first_name} {appointment.patient_last_name}</td><td>{appointment.doctor_first_name} {appointment.doctor_last_name}</td><td>{new Date(appointment.scheduled_at).toLocaleString()}</td><td><span className="status-badge">{appointment.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;
