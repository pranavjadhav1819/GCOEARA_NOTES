const multer = require('multer');
const path = require('path');
const { ALLOWED_FILE_EXTENSIONS } = require('../config/constants');

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_FILE_EXTENSIONS.includes(ext)) return cb(null, true);
  cb(new Error(`File type not allowed. Accepted: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`));
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 15) * 1024 * 1024 }
});

module.exports = upload;