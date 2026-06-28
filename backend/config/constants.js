// Single source of truth for the dropdown values used across the app.
// If your college restructures branches/years, edit ONLY this file.

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const BRANCHES = [
  { code: 'computer', label: 'Computer Engineering' },
  { code: 'entc', label: 'E&TC Engineering' },
  { code: 'mechanical', label: 'Mechanical Engineering' },
  { code: 'automobile', label: 'Automobile Engineering' },
  { code: 'instrumentation', label: 'Instrumentation Engineering' },
  { code: 'civil', label: 'Civil Engineering' }
];

const TYPES = [
  { code: 'notes', label: 'Notes' },
  { code: 'pyq', label: 'PYQ (Previous Year Questions)' },
  { code: 'imp', label: 'Important Questions' }
];

const BRANCH_CODES = BRANCHES.map((b) => b.code);
const TYPE_CODES = TYPES.map((t) => t.code);

const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'];

module.exports = {
  YEARS,
  BRANCHES,
  TYPES,
  BRANCH_CODES,
  TYPE_CODES,
  ALLOWED_FILE_EXTENSIONS
};
