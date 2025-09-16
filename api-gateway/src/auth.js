const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Simulated users (username, password hash, role)
const users = [
  { username: 'farmer', password: bcrypt.hashSync('farmerpw', 8), role: 'farmer' },
  { username: 'processor', password: bcrypt.hashSync('processorpw', 8), role: 'processor' },
  { username: 'lab', password: bcrypt.hashSync('labpw', 8), role: 'lab' },
  { username: 'manufacturer', password: bcrypt.hashSync('manufacturerpw', 8), role: 'manufacturer' }
];

function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = { authenticateJWT, users, JWT_SECRET };
