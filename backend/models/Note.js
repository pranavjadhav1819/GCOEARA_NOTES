const supabase = require('../config/db');

const SAFE_SELECT = 'id, title, subject, description, year, branch, type, file_name, file_size, mime_type, uploaded_by, uploader_name, downloads, created_at';

const createNote = async (noteData) => {
  const { data, error } = await supabase
    .from('notes')
    .insert([{
      title: noteData.title,
      subject: noteData.subject,
      description: noteData.description || '',
      year: noteData.year,
      branch: noteData.branch,
      type: noteData.type,
      file_name: noteData.fileName,
      stored_file_name: noteData.storedFileName,
      file_size: noteData.fileSize,
      mime_type: noteData.mimeType,
      uploaded_by: noteData.uploadedBy,
      uploader_name: noteData.uploaderName
    }])
    .select(SAFE_SELECT)
    .single();
  if (error) throw error;
  return data;
};

const getNotes = async ({ year, branch, type, subject, q, page = 1, limit = 20 }) => {
  let query = supabase.from('notes').select(SAFE_SELECT, { count: 'exact' });
  if (year) query = query.eq('year', year);
  if (branch) query = query.eq('branch', branch);
  if (type) query = query.eq('type', type);
  if (subject) query = query.ilike('subject', `%${subject}%`);
  if (q) query = query.or(`title.ilike.%${q}%,subject.ilike.%${q}%`);
  const from = (page - 1) * limit;
  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, from + limit - 1);
  if (error) throw error;
  return { notes: data, total: count };
};

const getNoteById = async (id, includeStoredFileName = false) => {
  const { data, error } = await supabase
    .from('notes')
    .select(includeStoredFileName ? '*' : SAFE_SELECT)
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
};

const incrementDownloads = async (id) => {
  await supabase.rpc('increment_note_downloads', { note_id: id });
};

const deleteNote = async (id) => {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
};

module.exports = { createNote, getNotes, getNoteById, incrementDownloads, deleteNote };