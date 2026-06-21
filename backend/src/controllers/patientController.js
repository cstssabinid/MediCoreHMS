const { connect } = require('../db');
const { v4: uuidv4 } = require('uuid');

function createPatient(req, res) {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    address,
    national_id,
    insurance_provider,
    emergency_contact_name,
    emergency_contact_phone,
    medical_history,
    allergies
  } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }
  const patientId = `P-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  const db = connect();
  const stmt = db.prepare(`INSERT INTO patients (
    patient_id, first_name, last_name, date_of_birth, gender, phone, address,
    national_id, insurance_provider, emergency_contact_name, emergency_contact_phone,
    medical_history, allergies
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(
    patientId,
    first_name,
    last_name,
    date_of_birth || null,
    gender || null,
    phone || null,
    address || null,
    national_id || null,
    insurance_provider || null,
    emergency_contact_name || null,
    emergency_contact_phone || null,
    medical_history || null,
    allergies || null
  );
  const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ patient });
}

function getPatients(req, res) {
  const db = connect();
  const patients = db.prepare('SELECT * FROM patients ORDER BY created_at DESC LIMIT 200').all();
  db.close();
  res.json({ patients });
}

function getPatientById(req, res) {
  const db = connect();
  const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
  db.close();
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json({ patient });
}

function updatePatient(req, res) {
  const fields = req.body;
  const db = connect();
  const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
  if (!patient) {
    db.close();
    return res.status(404).json({ error: 'Patient not found' });
  }
  const updateStmt = db.prepare(`UPDATE patients SET
    first_name = coalesce(?, first_name),
    last_name = coalesce(?, last_name),
    date_of_birth = coalesce(?, date_of_birth),
    gender = coalesce(?, gender),
    phone = coalesce(?, phone),
    address = coalesce(?, address),
    national_id = coalesce(?, national_id),
    insurance_provider = coalesce(?, insurance_provider),
    emergency_contact_name = coalesce(?, emergency_contact_name),
    emergency_contact_phone = coalesce(?, emergency_contact_phone),
    medical_history = coalesce(?, medical_history),
    allergies = coalesce(?, allergies)
    WHERE id = ?`);
  updateStmt.run(
    fields.first_name,
    fields.last_name,
    fields.date_of_birth,
    fields.gender,
    fields.phone,
    fields.address,
    fields.national_id,
    fields.insurance_provider,
    fields.emergency_contact_name,
    fields.emergency_contact_phone,
    fields.medical_history,
    fields.allergies,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
  db.close();
  res.json({ patient: updated });
}

function searchPatients(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  const searchTerm = `%${query.toLowerCase()}%`;
  const db = connect();
  const patients = db.prepare(`SELECT * FROM patients WHERE
    LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(phone) LIKE ? OR LOWER(national_id) LIKE ? OR LOWER(patient_id) LIKE ?
    ORDER BY created_at DESC`).all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  db.close();
  res.json({ patients });
}

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  searchPatients
};
