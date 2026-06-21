const { connect } = require('../db');

function createConsultation(req, res) {
  const { patient_id, doctor_id, appointment_id, visit_reason, history_present_illness, past_medical_history, physical_exam, diagnosis, treatment_plan, referral_notes, follow_up_date } = req.body;
  if (!patient_id || !doctor_id) {
    return res.status(400).json({ error: 'Patient and doctor are required' });
  }
  const db = connect();
  const stmt = db.prepare(`INSERT INTO consultations (
    patient_id, doctor_id, appointment_id, visit_reason, history_present_illness,
    past_medical_history, physical_exam, diagnosis, treatment_plan, referral_notes, follow_up_date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(patient_id, doctor_id, appointment_id || null, visit_reason || null, history_present_illness || null, past_medical_history || null, physical_exam || null, diagnosis || null, treatment_plan || null, referral_notes || null, follow_up_date || null);
  const consultation = db.prepare('SELECT * FROM consultations WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ consultation });
}

function getConsultations(req, res) {
  const db = connect();
  const consultations = db.prepare('SELECT c.*, p.patient_id, p.first_name AS patient_first_name, p.last_name AS patient_last_name, u.first_name AS doctor_first_name, u.last_name AS doctor_last_name FROM consultations c JOIN patients p ON c.patient_id = p.id JOIN users u ON c.doctor_id = u.id ORDER BY c.created_at DESC LIMIT 200').all();
  db.close();
  res.json({ consultations });
}

function getConsultationById(req, res) {
  const db = connect();
  const consultation = db.prepare('SELECT * FROM consultations WHERE id = ?').get(req.params.id);
  db.close();
  if (!consultation) return res.status(404).json({ error: 'Consultation not found' });
  res.json({ consultation });
}

module.exports = { createConsultation, getConsultations, getConsultationById };
