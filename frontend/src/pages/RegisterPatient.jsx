import { useState } from 'react';
import { createPatient } from '../services/api';

function RegisterPatient() {
  const [form, setForm] = useState({ first_name: '', last_name: '', date_of_birth: '', gender: '', phone: '', address: '', national_id: '', insurance_provider: '', emergency_contact_name: '', emergency_contact_phone: '', medical_history: '', allergies: '' });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await createPatient(form);
      setSuccess('Patient registered successfully.');
      setForm({ first_name: '', last_name: '', date_of_birth: '', gender: '', phone: '', address: '', national_id: '', insurance_provider: '', emergency_contact_name: '', emergency_contact_phone: '', medical_history: '', allergies: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to save patient');
    }
  };

  return (
    <div className="form-card">
      <div className="card">
        <h3>Register New Patient</h3>
        <p>Collect patient demographic details and emergency contact information.</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-field"><label htmlFor="first_name">First Name</label><input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required /></div>
          <div className="form-field"><label htmlFor="last_name">Last Name</label><input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required /></div>
          <div className="form-field"><label htmlFor="date_of_birth">Date of Birth</label><input id="date_of_birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} /></div>
          <div className="form-field"><label htmlFor="gender">Gender</label><select id="gender" name="gender" value={form.gender} onChange={handleChange}><option value="">Select</option><option value="Female">Female</option><option value="Male">Male</option><option value="Other">Other</option></select></div>
          <div className="form-field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" value={form.phone} onChange={handleChange} /></div>
          <div className="form-field"><label htmlFor="address">Address</label><input id="address" name="address" value={form.address} onChange={handleChange} /></div>
          <div className="form-field"><label htmlFor="national_id">National ID</label><input id="national_id" name="national_id" value={form.national_id} onChange={handleChange} /></div>
          <div className="form-field"><label htmlFor="insurance_provider">Insurance Provider</label><input id="insurance_provider" name="insurance_provider" value={form.insurance_provider} onChange={handleChange} /></div>
          <div className="form-field"><label htmlFor="emergency_contact_name">Emergency Contact</label><input id="emergency_contact_name" name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} /></div>
          <div className="form-field"><label htmlFor="emergency_contact_phone">Emergency Phone</label><input id="emergency_contact_phone" name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} /></div>
          <div className="form-field"><label htmlFor="medical_history">Medical History</label><textarea id="medical_history" name="medical_history" value={form.medical_history} onChange={handleChange} rows="3" /></div>
          <div className="form-field"><label htmlFor="allergies">Allergies</label><textarea id="allergies" name="allergies" value={form.allergies} onChange={handleChange} rows="3" /></div>
          {error && <p style={{ color: '#ac2f2f' }}>{error}</p>}
          {success && <p style={{ color: '#166534' }}>{success}</p>}
          <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="button-primary">Save Patient</button></div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPatient;
