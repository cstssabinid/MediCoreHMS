import { useState } from 'react';

function Consultation() {
  const [form, setForm] = useState({ visit_reason: '', history_present_illness: '', past_medical_history: '', physical_exam: '', diagnosis: '', treatment_plan: '', referral_notes: '', follow_up_date: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div className="form-card">
      <div className="card"><h3>Doctor Consultation</h3><p>Document consultation details, diagnosis, and treatment plans.</p></div>
      <div className="card">
        <form className="form-grid">
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label>Patient Summary</label>
            <p style={{ margin: 0 }}>Review patient history, appointments, and prior exam notes before consulting.</p>
          </div>
          {['visit_reason', 'history_present_illness', 'past_medical_history', 'physical_exam', 'diagnosis', 'treatment_plan', 'referral_notes'].map((field) => (
            <div className="form-field" key={field} style={{ gridColumn: '1 / -1' }}>
              <label htmlFor={field}>{field.replace(/_/g, ' ').replace('history present illness', 'History of present illness')}</label>
              <textarea id={field} name={field} rows="4" value={form[field]} onChange={handleChange} />
            </div>
          ))}
          <div className="form-field">
            <label htmlFor="follow_up_date">Follow-up Date</label>
            <input id="follow_up_date" name="follow_up_date" type="date" value={form.follow_up_date} onChange={handleChange} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="button" className="button-primary">Save Consultation</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Consultation;
