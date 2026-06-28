const { findByEmail, createUser, matchPassword, toSafeObject } = require('../models/User');
const generateToken = require('../utils/generateToken');
const { YEARS, BRANCH_CODES } = require('../config/constants');
const supabase = require('../config/db');

// @route  POST /api/auth/register
// @access Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, branch, year } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    const allowedDomain = (process.env.ALLOWED_EMAIL_DOMAIN || '').trim();
    if (allowedDomain && !email.toLowerCase().endsWith(`@${allowedDomain.toLowerCase()}`))
      return res.status(400).json({ message: `Please register with your @${allowedDomain} email.` });
    if (branch && !BRANCH_CODES.includes(branch))
      return res.status(400).json({ message: 'Invalid branch.' });
    if (year && !YEARS.includes(year))
      return res.status(400).json({ message: 'Invalid year.' });
    const existing = await findByEmail(email);
    if (existing)
      return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await createUser({ name, email, password, branch, year });
    res.status(201).json({ user: toSafeObject(user), token: generateToken(user.id) });
  } catch (err) { next(err); }
};

// @route  POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });
    const user = await findByEmail(email, true);
    if (!user || !(await matchPassword(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password.' });
    res.json({ user: toSafeObject(user), token: generateToken(user.id) });
  } catch (err) { next(err); }
};

// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json({ user: toSafeObject(req.user) });
};

// @route  POST /api/auth/google
// @access Public — exchanges a Supabase Google token for our own JWT
const googleAuth = async (req, res, next) => {
  try {
    const { access_token } = req.body;
    if (!access_token)
      return res.status(400).json({ message: 'Access token is required.' });

    // Verify token with Supabase and get Google user info
    const { data: { user: googleUser }, error } = await supabase.auth.getUser(access_token);

    if (error || !googleUser)
      return res.status(401).json({ message: 'Invalid or expired Google token.' });

    // Find existing user or create a new one
    let user = await findByEmail(googleUser.email);

    if (!user) {
      // Generate a random secure password for Google users
      const randomPassword = Math.random().toString(36).slice(-8) +
                             Math.random().toString(36).slice(-8) + 'Gg1!';
      const fullName = googleUser.user_metadata?.full_name ||
                       googleUser.user_metadata?.name ||
                       googleUser.email.split('@')[0];

      user = await createUser({
        name: fullName,
        email: googleUser.email,
        password: randomPassword,
        role: 'student'
      });
    }

    res.json({
      user: toSafeObject(user),
      token: generateToken(user.id)
    });
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, googleAuth };
