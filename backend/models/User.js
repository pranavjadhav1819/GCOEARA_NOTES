const bcrypt = require('bcryptjs');
const supabase = require('../config/db');

const toSafeObject = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  branch: user.branch,
  year: user.year,
  role: user.role,
  createdAt: user.created_at
});

const findByEmail = async (email, includePassword = false) => {
  const { data, error } = await supabase
    .from('users')
    .select(includePassword ? '*' : 'id, name, email, branch, year, role, created_at')
    .eq('email', email.toLowerCase())
    .single();
  if (error) return null;
  return data;
};

const findById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, branch, year, role, created_at')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
};

const createUser = async ({ name, email, password, branch, year, role = 'student' }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email: email.toLowerCase(), password: hashedPassword, branch: branch || null, year: year || null, role }])
    .select('id, name, email, branch, year, role, created_at')
    .single();
  if (error) throw error;
  return data;
};

const matchPassword = async (enteredPassword, hashedPassword) => {
  return bcrypt.compare(enteredPassword, hashedPassword);
};

const updateRole = async (email, role) => {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('email', email.toLowerCase())
    .select()
    .single();
  if (error) throw error;
  return data;
};

module.exports = { findByEmail, findById, createUser, matchPassword, updateRole, toSafeObject };