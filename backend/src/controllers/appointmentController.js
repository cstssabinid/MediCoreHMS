const { connect } = require('../db');

function createAppointment(req, res) {
  const { patient_id, doctor_id, department, scheduled_at, notes } = req.body;
  if (!patient_id || !scheduled_at) {
    return res.status(400).json({ error: 'Patient and schedule time are required' });
  }
  const appointmentCode = `A-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  const db = connect();
  const stmt = db.prepare(`INSERT INTO appointments (
    appointment_code, patient_id, doctor_id, department, scheduled_at, notes
  ) VALUES (?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(appointmentCode, patient_id, doctor_id || null, department || null, scheduled_at, notes || null);
  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ appointment });
}

function getAppointments(req, res) {
  const db = connect();
  const appointments = db.prepare('SELECT a.*, p.patient_id, p.first_name AS patient_first_name, p.last_name AS patient_last_name, u.first_name AS doctor_first_name, u.last_name AS doctor_last_name FROM appointments a LEFT JOIN patients p ON a.patient_id = p.id LEFT JOIN users u ON a.doctor_id = u.id ORDER BY scheduled_at DESC LIMIT 200').all();
  db.close();
  res.json({ appointments });
}

function getTodayAppointments(req, res) {
  const db = connect();
  const today = new Date().toISOString().slice(0, 10);
  const appointments = db.prepare('SELECT a.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name FROM appointments a LEFT JOIN patients p ON a.patient_id = p.id WHERE DATE(scheduled_at) = ? ORDER BY scheduled_at ASC').all(today);
  db.close();
  res.json({ appointments });
}

function getAppointmentById(req, res) {
  const db = connect();
  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  db.close();
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
  res.json({ appointment });
}

function updateAppointment(req, res) {
  const { status, doctor_id, scheduled_at, department, notes } = req.body;
  const db = connect();
  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  if (!appointment) {
    db.close();
    return res.status(404).json({ error: 'Appointment not found' });
  }
  const stmt = db.prepare(`UPDATE appointments SET
    doctor_id = coalesce(?, doctor_id),
    department = coalesce(?, department),
    scheduled_at = coalesce(?, scheduled_at),
    status = coalesce(?, status),
    notes = coalesce(?, notes)
    WHERE id = ?`);
  stmt.run(doctor_id || null, department || null, scheduled_at || null, status || null, notes || null, req.params.id);
  const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  db.close();
  res.json({ appointment: updated });
}

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  getTodayAppointments
};
