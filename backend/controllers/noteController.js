const path = require('path');
const crypto = require('crypto');
const supabase = require('../config/db');
const NoteModel = require('../models/Note');
const { YEARS, BRANCH_CODES, TYPE_CODES } = require('../config/constants');

const BUCKET = 'notes-files';

const uploadNote = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please attach a file.' });
    const { title, subject, description, year, branch, type } = req.body;
    if (!title || !subject || !year || !branch || !type)
      return res.status(400).json({ message: 'Title, subject, year, branch and type are required.' });
    if (!YEARS.includes(year) || !BRANCH_CODES.includes(branch) || !TYPE_CODES.includes(type))
      return res.status(400).json({ message: 'Invalid year, branch or type.' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    const storedFileName = `${crypto.randomBytes(20).toString('hex')}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storedFileName, req.file.buffer, { contentType: req.file.mimetype, upsert: false });
    if (uploadError) throw uploadError;

    const note = await NoteModel.createNote({
      title, subject, description: description || '', year, branch, type,
      fileName: req.file.originalname, storedFileName,
      fileSize: req.file.size, mimeType: req.file.mimetype,
      uploadedBy: req.user.id, uploaderName: req.user.name
    });
    res.status(201).json({ note });
  } catch (err) { next(err); }
};

const getNotes = async (req, res, next) => {
  try {
    const { year, branch, type, subject, q } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const { notes, total } = await NoteModel.getNotes({ year, branch, type, subject, q, page, limit });
    res.json({ notes, page, totalPages: Math.ceil(total / limit) || 1, total });
  } catch (err) { next(err); }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await NoteModel.getNoteById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    res.json({ note });
  } catch (err) { next(err); }
};

const downloadNote = async (req, res, next) => {
  try {
    const note = await NoteModel.getNoteById(req.params.id, true);
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(note.stored_file_name, 120);
    if (error) return res.status(404).json({ message: 'File missing from storage.' });
    await NoteModel.incrementDownloads(note.id);
    res.redirect(data.signedUrl);
  } catch (err) { next(err); }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await NoteModel.getNoteById(req.params.id, true);
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    const isOwner = note.uploaded_by === req.user.id;
    if (!isOwner && req.user.role !== 'admin')
      return res.status(403).json({ message: 'You can only delete your own uploads.' });
    await supabase.storage.from(BUCKET).remove([note.stored_file_name]);
    await NoteModel.deleteNote(note.id);
    res.json({ message: 'Note deleted.' });
  } catch (err) { next(err); }
};

module.exports = { uploadNote, getNotes, getNoteById, downloadNote, deleteNote };