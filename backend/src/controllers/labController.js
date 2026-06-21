const { connect } = require('../db');

function requestLab(req, res) {
  const { patient_id, test_name, priority, notes } = req.body;
  const requestedBy = req.user.id;
  if (!patient_id || !test_name) {
    return res.status(400).json({ error: 'Patient and test name are required' });
  }
  const db = connect();
  const stmt = db.prepare('INSERT INTO lab_requests (patient_id, requested_by, test_name, priority, notes) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(patient_id, requestedBy, test_name, priority || 'Routine', notes || null);
  const labRequest = db.prepare('SELECT * FROM lab_requests WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ labRequest });
}

function getLabRequests(req, res) {
  const db = connect();
  const requests = db.prepare('SELECT l.*, p.patient_id AS patient_code, p.first_name AS patient_first_name, p.last_name AS patient_last_name, u.first_name || " " || u.last_name AS requested_by_name FROM lab_requests l JOIN patients p ON l.patient_id = p.id JOIN users u ON l.requested_by = u.id ORDER BY l.created_at DESC LIMIT 200').all();
  db.close();
  res.json({ requests });
}

function updateLabResult(req, res) {
  const { result_text, validated } = req.body;
  const labRequestId = req.params.id;
  const validatedBy = req.user.id;
  const db = connect();
  const labRequest = db.prepare('SELECT * FROM lab_requests WHERE id = ?').get(labRequestId);
  if (!labRequest) {
    db.close();
    return res.status(404).json({ error: 'Lab request not found' });
  }
  db.prepare('INSERT INTO lab_results (lab_request_id, result_text, validated, validated_by, validated_at) VALUES (?, ?, ?, ?, datetime("now"))').run(labRequestId, result_text || null, validated ? 1 : 0, validatedBy);
  db.prepare('UPDATE lab_requests SET status = ?, result_completed_at = datetime("now") WHERE id = ?').run(validated ? 'Completed' : 'Processing', labRequestId);
  const labResult = db.prepare('SELECT * FROM lab_results WHERE lab_request_id = ? ORDER BY created_at DESC LIMIT 1').get(labRequestId);
  db.close();
  res.json({ labResult });
}

module.exports = { requestLab, getLabRequests, updateLabResult };
