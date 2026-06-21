const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connect } = require('../db');

function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const db = connect();
  const user = db.prepare('SELECT id, first_name, last_name, email, password, role_id, active FROM users WHERE email = ?').get(email.toLowerCase());
  db.close();
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (!user.active) {
    return res.status(403).json({ error: 'User account is inactive' });
  }
  const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  });
  res.json({ token, user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role_id: user.role_id } });
}

function profile(req, res) {
  res.json({ user: req.user });
}

module.exports = {
  login,
  profile
};
