const bcrypt = require('bcryptjs');
const { connect } = require('../db');

function listUsers(req, res) {
  const db = connect();
  const users = db.prepare('SELECT u.id, u.first_name, u.last_name, u.email, u.role_id, u.active, u.created_at, r.name AS role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC').all();
  db.close();
  res.json({ users });
}

function createUser(req, res) {
  const { first_name, last_name, email, password, role_id, active } = req.body;
  if (!first_name || !last_name || !email || !password || !role_id) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }
  const db = connect();
  const hashed = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (first_name, last_name, email, password, role_id, active) VALUES (?, ?, ?, ?, ?, ?)');
  const info = stmt.run(first_name, last_name, email.toLowerCase(), hashed, role_id, active ? 1 : 0);
  const user = db.prepare('SELECT id, first_name, last_name, email, role_id, active, created_at FROM users WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ user });
}

function updateUser(req, res) {
  const { first_name, last_name, email, password, role_id, active } = req.body;
  const db = connect();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) {
    db.close();
    return res.status(404).json({ error: 'User not found' });
  }
  const hashed = password ? bcrypt.hashSync(password, 10) : null;
  db.prepare(`UPDATE users SET
    first_name = coalesce(?, first_name),
    last_name = coalesce(?, last_name),
    email = coalesce(?, email),
    password = coalesce(?, password),
    role_id = coalesce(?, role_id),
    active = coalesce(?, active)
    WHERE id = ?`).run(
    first_name,
    last_name,
    email ? email.toLowerCase() : null,
    hashed,
    role_id,
    typeof active === 'boolean' ? (active ? 1 : 0) : null,
    req.params.id
  );
  const updated = db.prepare('SELECT id, first_name, last_name, email, role_id, active, created_at FROM users WHERE id = ?').get(req.params.id);
  db.close();
  res.json({ user: updated });
}

function getUserActivity(req, res) {
  const db = connect();
  const activity = db.prepare('SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 100').all(req.params.id);
  db.close();
  res.json({ activity });
}

module.exports = { listUsers, createUser, updateUser, getUserActivity };
