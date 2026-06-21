import { useState, useEffect } from 'react';
import api from '../../services/api';

function AppointmentsPublic() {
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patient_name: '', patient_phone: '', patient_email: '', patient_dob: '', gender: '', location_id: '', department_id: '', doctor_id: '', appointment_type: 'In-person', scheduled_at: '' });

  useEffect(() => {
    api.get('/public/locations').then(r => setLocations(r.data.locations)).catch(console.error);
    api.get('/public/departments').then(r => setDepartments(r.data.departments)).catch(console.error);
    api.get('/public/doctors').then(r => setDoctors(r.data.doctors)).catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); api.post('/public/appointments', form).then(r => alert('Appointment requested: ' + r.data.appointment.reference)).catch(err => alert(err.response?.data?.error || 'Error')); };

  return (
    <div>
      <div className="card"><h3>Book an Appointment</h3><p>Follow the steps to request an appointment.</p></div>
      <div className="card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field"><label>Full name</label><input name="patient_name" value={form.patient_name} onChange={handleChange} required /></div>
          <div className="form-field"><label>Phone</label><input name="patient_phone" value={form.patient_phone} onChange={handleChange} required /></div>
          <div className="form-field"><label>Email</label><input name="patient_email" value={form.patient_email} onChange={handleChange} /></div>
          <div className="form-field"><label>Location</label><select name="location_id" value={form.location_id} onChange={handleChange}><option value="">Select</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
          <div className="form-field"><label>Department</label><select name="department_id" value={form.department_id} onChange={handleChange}><option value="">Select</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div className="form-field"><label>Doctor</label><select name="doctor_id" value={form.doctor_id} onChange={handleChange}><option value="">Any</option>{doctors.map(d => <option key={d.id} value={d.id}>{d.first_name} {d.last_name}</option>)}</select></div>
          <div className="form-field"><label>Date & Time</label><input type="datetime-local" name="scheduled_at" value={form.scheduled_at} onChange={handleChange} required /></div>
          <div style={{ gridColumn: '1 / -1' }}><button className="button-primary" type="submit">Request Appointment</button></div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentsPublic;
