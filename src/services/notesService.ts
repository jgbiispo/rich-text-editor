import { supabase } from '../supabase/client';
import { Note } from '../types/note';

export const createNote = async (userId: string, noteData: Omit<Note, 'id'>) => {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: userId,
      title: noteData.title,
      content: noteData.content,
      history: noteData.history.map((entry) => ({
        timestamp: entry.timestamp.toISOString(),
        content: entry.content,
      })),
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return { id: data.id };
};

export const getNotes = async (userId: string) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return data.map((note) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    updatedAt: new Date(note.updated_at),
    history: (note.history || []).map((entry: { timestamp: string; content: string }) => ({
      timestamp: new Date(entry.timestamp),
      content: entry.content,
    })),
  } as Note));
};

export const updateNote = async (
  userId: string,
  noteId: string,
  updates: Partial<Note>
) => {
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) {
    updateData.title = updates.title;
  }

  if (updates.content !== undefined) {
    updateData.content = updates.content;
  }

  if (updates.history !== undefined) {
    updateData.history = updates.history.map((entry) => ({
      timestamp: entry.timestamp.toISOString(),
      content: entry.content,
    }));
  }

  const { error } = await supabase
    .from('notes')
    .update(updateData)
    .eq('id', noteId)
    .eq('user_id', userId);

  if (error) throw error;
};

export const deleteNote = async (userId: string, noteId: string) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', userId);

  if (error) throw error;
};
