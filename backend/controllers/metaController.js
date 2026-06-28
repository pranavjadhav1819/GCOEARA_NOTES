const { YEARS, BRANCHES, TYPES } = require('../config/constants');

// @route  GET /api/meta
// @access Public
const getMeta = (req, res) => {
  res.json({ years: YEARS, branches: BRANCHES, types: TYPES });
};

module.exports = { getMeta };
