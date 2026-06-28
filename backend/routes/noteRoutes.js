const express = require('express');
const { uploadNote, getNotes, getNoteById, downloadNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getNotes);
router.get('/:id', getNoteById);
router.get('/:id/download', downloadNote);
router.post('/', protect, upload.single('file'), uploadNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;
