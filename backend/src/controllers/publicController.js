const { connect } = require('../db');

function listDepartments(req, res) {
  const db = connect();
  const depts = db.prepare('SELECT * FROM departments ORDER BY name').all();
  db.close();
  res.json({ departments: depts });
}

function listLocations(req, res) {
  const db = connect();
  const locs = db.prepare('SELECT * FROM locations ORDER BY name').all();
  db.close();
  res.json({ locations: locs });
}

function listDoctors(req, res) {
  const { department_id, location, q } = req.query;
  let sql = 'SELECT d.*, dep.name AS department_name FROM doctors d LEFT JOIN departments dep ON d.department_id = dep.id WHERE 1=1 ';
  const params = [];
  if (department_id) { sql += ' AND d.department_id = ?'; params.push(department_id); }
  if (location) { sql += ' AND d.locations LIKE ?'; params.push(`%${location}%`); }
  if (q) { sql += ' AND (LOWER(d.first_name) LIKE ? OR LOWER(d.last_name) LIKE ? OR LOWER(d.bio) LIKE ?)'; params.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`); }
  const db = connect();
  const rows = db.prepare(sql + ' ORDER BY d.first_name').all(...params);
  db.close();
  res.json({ doctors: rows });
}

function getDoctor(req, res) {
  const db = connect();
  const doc = db.prepare('SELECT d.*, dep.name AS department_name FROM doctors d LEFT JOIN departments dep ON d.department_id = dep.id WHERE d.id = ?').get(req.params.id);
  const schedules = db.prepare('SELECT ds.*, l.name AS location_name FROM doctor_schedules ds LEFT JOIN locations l ON ds.location_id = l.id WHERE ds.doctor_id = ? ORDER BY ds.day_of_week').all(req.params.id);
  db.close();
  if (!doc) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ doctor: doc, schedules });
}

function createPublicAppointment(req, res) {
  const { patient_name, patient_phone, patient_email, patient_dob, gender, location_id, department_id, doctor_id, appointment_type, scheduled_at } = req.body;
  if (!patient_name || !patient_phone || !scheduled_at) return res.status(400).json({ error: 'Required fields missing' });
  const reference = `PA-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*1000)}`;
  const db = connect();
  const info = db.prepare('INSERT INTO public_appointments (reference, patient_name, patient_phone, patient_email, patient_dob, gender, location_id, department_id, doctor_id, appointment_type, scheduled_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(reference, patient_name, patient_phone, patient_email || null, patient_dob || null, gender || null, location_id || null, department_id || null, doctor_id || null, appointment_type || 'In-person', scheduled_at, 'Requested');
  const appt = db.prepare('SELECT * FROM public_appointments WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ appointment: appt });
}

function createOnlineConsultation(req, res) {
  const { patient_name, patient_phone, patient_email, speciality_id, doctor_id, scheduled_at, fee } = req.body;
  if (!patient_name || !patient_phone || !scheduled_at) return res.status(400).json({ error: 'Required fields missing' });
  const reference = `OC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*1000)}`;
  const db = connect();
  const info = db.prepare('INSERT INTO online_consultations (reference, patient_name, patient_phone, patient_email, speciality_id, doctor_id, scheduled_at, fee, status, video_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(reference, patient_name, patient_phone, patient_email || null, speciality_id || null, doctor_id || null, scheduled_at, fee || 0, 'Requested', null);
  const oc = db.prepare('SELECT * FROM online_consultations WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ consultation: oc });
}

function createInquiry(req, res) {
  const { type, name, email, phone, message } = req.body;
  const db = connect();
  const info = db.prepare('INSERT INTO inquiries (type, name, email, phone, message) VALUES (?, ?, ?, ?, ?)').run(type || 'general', name || null, email || null, phone || null, message || null);
  const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ inquiry });
}

function listPosts(req, res) {
  const db = connect();
  const posts = db.prepare('SELECT id, slug, title, excerpt, author, published_at FROM blog_posts ORDER BY published_at DESC LIMIT 20').all();
  db.close();
  res.json({ posts });
}

function getPost(req, res) {
  const db = connect();
  const post = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(req.params.slug);
  db.close();
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json({ post });
}

module.exports = {
  listDepartments,
  listLocations,
  listDoctors,
  getDoctor,
  createPublicAppointment,
  createOnlineConsultation,
  createInquiry,
  listPosts,
  getPost
};
