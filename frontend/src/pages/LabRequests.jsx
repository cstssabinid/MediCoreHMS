import { useState } from 'react';

function LabRequests() {
  const [form, setForm] = useState({ patient_id: '', test_name: '', priority: 'Routine', notes: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div className="form-card">
      <div className="card"><h3>Lab Request</h3><p>Create test requests with priority and notes for laboratory staff.</p></div>
      <div className="card">
        <form className="form-grid">
          <div className="form-field"><label htmlFor="patient_id">Patient ID</label><input id="patient_id" name="patient_id" value={form.patient_id} onChange={handleChange} /></div>
          <div className="form-field"><label htmlFor="test_name">Test Name</label><input id="test_name" name="test_name" value={form.test_name} onChange={handleChange} /></div>
          <div className="form-field"><label htmlFor="priority">Priority</label><select id="priority" name="priority" value={form.priority} onChange={handleChange}><option>Routine</option><option>Urgent</option></select></div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}><label htmlFor="notes">Notes</label><textarea id="notes" name="notes" rows="3" value={form.notes} onChange={handleChange} /></div>
          <div style={{ gridColumn: '1 / -1' }}><button type="button" className="button-primary">Submit Lab Request</button></div>
        </form>
      </div>
    </div>
  );
}

export default LabRequests;
