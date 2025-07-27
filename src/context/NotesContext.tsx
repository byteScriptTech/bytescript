import { Timestamp } from 'firebase/firestore';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<EditableNote>(null);

  const { currentUser } = useAuth();

  const loadNotes = useCallback(async () => {
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
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes');
    }
  }, [currentUser?.uid]);

  // Load notes when the component mounts or when currentUser changes
  useEffect(() => {
    if (currentUser) {
      loadNotes();
    } else {
      setNotes([]);
    }
  }, [currentUser, loadNotes]);

  const handleCreateNote = useCallback(async () => {
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
      toast.success('Note created successfully!');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note. Please try again.');
    }
  }, [currentUser?.uid, newNoteContent]);

  const handleUpdateNote = useCallback(
    async (note: Note) => {
      try {
        if (!currentUser?.uid) {
          throw new Error('User not authenticated');
        }
        await notesService.updateNote(currentUser.uid, note.id, note.content);
        setNotes((prev: Note[]) => {
          return prev.map((n: Note) => (n.id === note.id ? note : n));
        });
        setEditingNote(null);
        toast.success('Note updated successfully!');
      } catch (error) {
        console.error('Error updating note:', error);
        toast.error('Failed to update note. Please try again.');
      }
    },
    [currentUser?.uid]
  );

  const handleDeleteNote = useCallback(
    async (id: string) => {
      try {
        if (!currentUser?.uid) {
          throw new Error('User not authenticated');
        }
        await notesService.deleteNote(currentUser.uid, id);
        setNotes((prev: Note[]) => {
          return prev.filter((note: Note) => note.id !== id);
        });
        toast.success('Note deleted successfully!');
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note. Please try again.');
      }
    },
    [currentUser?.uid]
  );

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
