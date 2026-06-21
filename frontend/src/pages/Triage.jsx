import { useState } from 'react';

function Triage() {
  const [form, setForm] = useState({ blood_pressure: '', pulse_rate: '', respiratory_rate: '', temperature: '', oxygen_saturation: '', weight: '', height: '', bmi: '', chief_complaint: '', notes: '' });

  const handleChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === 'weight' || e.target.name === 'height') {
      const weight = Number(next.weight);
      const height = Number(next.height);
      if (weight > 0 && height > 0) {
        next.bmi = (weight / ((height / 100) ** 2)).toFixed(1);
      }
    }
    setForm(next);
  };

  return (
    <div className="form-card">
      <div className="card"><h3>Nurse Triage</h3><p>Record vital signs and chief complaints for triage review.</p></div>
      <div className="card">
        <form className="form-grid">
          {['blood_pressure', 'pulse_rate', 'respiratory_rate', 'temperature', 'oxygen_saturation', 'weight', 'height', 'bmi'].map((field) => (
            <div className="form-field" key={field}>
              <label htmlFor={field}>{field.replace('_', ' ').toUpperCase()}</label>
              <input id={field} name={field} value={form[field]} onChange={handleChange} readOnly={field === 'bmi'} />
            </div>
          ))}
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="chief_complaint">Chief Complaint</label>
            <textarea id="chief_complaint" name="chief_complaint" rows="3" value={form.chief_complaint} onChange={handleChange} />
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="notes">Triage Notes</label>
            <textarea id="notes" name="notes" rows="4" value={form.notes} onChange={handleChange} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}><button type="button" className="button-primary">Save Triage Record</button></div>
        </form>
      </div>
    </div>
  );
}

export default Triage;
