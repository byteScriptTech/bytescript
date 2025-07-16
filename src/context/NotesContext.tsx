import { Timestamp } from 'firebase/firestore';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { notesService, Note } from '@/services/firebase/notesService';

export type EditableNote = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
} | null;

interface NotesContextType {
  notes: Note[];
  newNoteContent: string;
  editingNote: EditableNote;
  loadNotes: () => Promise<void>;
  handleCreateNote: () => Promise<void>;
  handleUpdateNote: (note: Note) => Promise<void>;
  handleDeleteNote: (id: string) => Promise<void>;
  setNewNoteContent: (content: string) => void;
  setEditingNote: (
    note: EditableNote | ((prev: EditableNote | null) => EditableNote | null)
  ) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<EditableNote>(null);

  // Load notes when component mounts
  const { currentUser } = useAuth();

  const loadNotes = async () => {
    try {
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }
      const fetchedNotes = await notesService.getNotes(currentUser.uid);
      const formattedNotes = fetchedNotes.map((note) => ({
        ...note,
        createdAt:
          note.createdAt instanceof Timestamp
            ? note.createdAt.toDate()
            : new Date(note.createdAt),
        updatedAt:
          note.updatedAt instanceof Timestamp
            ? note.updatedAt.toDate()
            : new Date(note.updatedAt),
      }));
      setNotes(formattedNotes);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load notes',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;

    try {
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }
      const note = await notesService.createNote(
        newNoteContent,
        currentUser.uid
      );
      setNotes((prev: Note[]) => [...prev, note]);
      setNewNoteContent('');
      toast({
        title: 'Success',
        description: 'Note created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateNote = async (note: Note) => {
    try {
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }
      await notesService.updateNote(currentUser.uid, note.id, note.content);
      setNotes((prev: Note[]) => {
        return prev.map((n: Note) => (n.id === note.id ? note : n));
      });
      setEditingNote(null);
      toast({
        title: 'Success',
        description: 'Note updated successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update note',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }
      await notesService.deleteNote(currentUser.uid, id);
      setNotes((prev: Note[]) => {
        return prev.filter((note: Note) => note.id !== id);
      });
      toast({
        title: 'Success',
        description: 'Note deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        newNoteContent,
        editingNote,
        loadNotes,
        handleCreateNote,
        handleUpdateNote,
        handleDeleteNote,
        setNewNoteContent,
        setEditingNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
