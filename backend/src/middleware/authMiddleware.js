const jwt = require('jsonwebtoken');
const { connect } = require('../db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token missing' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function attachUser(req, res, next) {
  if (!req.user) return next();
  const db = connect();
  const user = db.prepare('SELECT id, first_name, last_name, email, role_id, active FROM users WHERE id = ?').get(req.user.id);
  db.close();
  if (!user) return res.status(401).json({ error: 'User not found' });
  req.user = user;
  next();
}

module.exports = {
  authenticateToken,
  attachUser
};
