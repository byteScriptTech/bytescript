'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { useAppSelector } from '@/store/hooks';
import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '@/store/slices/notesSlice';
import { EditableNote, Note } from '@/store/slices/notesSlice';

export const useNotesRedux = () => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<EditableNote>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const userId = currentUser?.uid;

  const {
    data: notes = [],
    isLoading,
    error,
    refetch,
  } = useGetNotesQuery(userId!, {
    skip: !userId,
  });

  const [createNoteMutation] = useCreateNoteMutation();
  const [updateNoteMutation] = useUpdateNoteMutation();
  const [deleteNoteMutation] = useDeleteNoteMutation();

  const handleCreateNote = useCallback(async () => {
    if (!newNoteContent.trim() || !userId) return;

    try {
      await createNoteMutation({ content: newNoteContent, userId }).unwrap();
      setNewNoteContent('');
      toast.success('Note created successfully!');
      refetch();
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note. Please try again.');
    }
  }, [newNoteContent, userId, createNoteMutation, refetch]);

  const handleUpdateNote = useCallback(
    async (note: Note) => {
      if (!userId) return;

      try {
        await updateNoteMutation({
          userId,
          noteId: note.id,
          content: note.content,
        }).unwrap();
        setEditingNote(null);
        toast.success('Note updated successfully!');
        refetch();
      } catch (error) {
        console.error('Error updating note:', error);
        toast.error('Failed to update note. Please try again.');
      }
    },
    [userId, updateNoteMutation, refetch]
  );

  const handleDeleteNote = useCallback(
    async (id: string) => {
      if (!userId) return;

      try {
        await deleteNoteMutation({ userId, noteId: id }).unwrap();
        toast.success('Note deleted successfully!');
        refetch();
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note. Please try again.');
      }
    },
    [userId, deleteNoteMutation, refetch]
  );

  const loadNotes = useCallback(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  return {
    notes,
    newNoteContent,
    editingNote,
    loading: isLoading,
    error,
    loadNotes,
    handleCreateNote,
    handleUpdateNote,
    handleDeleteNote,
    setNewNoteContent,
    setEditingNote,
  };
};
