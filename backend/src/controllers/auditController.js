const { connect } = require('../db');

function getAuditLogs(req, res) {
  const db = connect();
  const logs = db.prepare('SELECT a.*, u.first_name || " " || u.last_name AS user_name FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id ORDER BY created_at DESC LIMIT 200').all();
  db.close();
  res.json({ logs });
}

module.exports = { getAuditLogs };
