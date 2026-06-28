const jwt = require('jsonwebtoken');
const { findById } = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized. Please log in.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User no longer exists.' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required.' });
};

module.exports = { protect, adminOnly };