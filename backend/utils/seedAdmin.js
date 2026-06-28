require('dotenv').config();
const { findByEmail, createUser, updateRole } = require('../models/User');

(async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first.');
    process.exit(1);
  }
  try {
    const existing = await findByEmail(ADMIN_EMAIL);
    if (existing) {
      await updateRole(ADMIN_EMAIL, 'admin');
      console.log(`Existing user ${ADMIN_EMAIL} upgraded to admin.`);
    } else {
      const user = await createUser({ name: ADMIN_NAME || 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
      console.log(`Admin account created: ${user.email}`);
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
  process.exit(0);
})();