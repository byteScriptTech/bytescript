import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { notesService } from '@/lib/firebase/notes';

import { NotesProvider, useNotes } from './NotesContext';

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));
// Mock notesService
jest.mock('@/lib/firebase/notes', () => ({
  notesService: {
    getNotes: jest.fn(),
    createNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
  },
}));

describe('NotesContext', () => {
  const mockNotes = [
    { id: '1', content: 'A', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', content: 'B', createdAt: new Date(), updatedAt: new Date() },
  ];
  const toast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ currentUser: { uid: 'uid1' } });
    (useToast as jest.Mock).mockReturnValue({ toast });
  });

  const TestLoader = () => {
    const { notes } = useNotes();
    return <div data-testid="count">{notes.length}</div>;
  };

  it('loads notes on mount', async () => {
    (notesService.getNotes as jest.Mock).mockResolvedValue(mockNotes);

    render(
      <NotesProvider>
        <TestLoader />
      </NotesProvider>
    );

    await waitFor(() => {
      expect(notesService.getNotes).toHaveBeenCalledWith('uid1');
      expect(screen.getByTestId('count')).toHaveTextContent('2');
    });
  });

  it('creates note and calls toast on success', async () => {
    (notesService.getNotes as jest.Mock).mockResolvedValue([]);
    (notesService.createNote as jest.Mock).mockResolvedValue({
      id: '3',
      content: 'C',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Expose create and setter
    const TestCreator = () => {
      const { setNewNoteContent, handleCreateNote, notes } = useNotes();
      return (
        <>
          <button
            onClick={() => setNewNoteContent('New content')}
            data-testid="set"
          >
            Set
          </button>
          <button onClick={() => handleCreateNote()} data-testid="create">
            Create
          </button>
          <div data-testid="count2">{notes.length}</div>
        </>
      );
    };

    render(
      <NotesProvider>
        <TestCreator />
      </NotesProvider>
    );

    // set content then create
    fireEvent.click(screen.getByTestId('set'));
    await act(async () => {
      fireEvent.click(screen.getByTestId('create'));
    });

    await waitFor(() => {
      expect(notesService.createNote).toHaveBeenCalledWith(
        'New content',
        'uid1'
      );
      expect(toast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Note created successfully',
      });
      expect(screen.getByTestId('count2')).toHaveTextContent('1');
    });
  });

  it('updates note and calls toast', async () => {
    (notesService.getNotes as jest.Mock).mockResolvedValue(mockNotes);
    (notesService.updateNote as jest.Mock).mockResolvedValue(undefined);

    const TestUpdater = () => {
      const { handleUpdateNote } = useNotes();
      return (
        <button
          onClick={() => handleUpdateNote(mockNotes[0])}
          data-testid="update"
        >
          Update
        </button>
      );
    };

    render(
      <NotesProvider>
        <TestUpdater />
      </NotesProvider>
    );

    fireEvent.click(screen.getByTestId('update'));
    expect(notesService.updateNote).toHaveBeenCalledWith('uid1', '1', 'A');
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Note updated successfully',
        variant: 'default',
      });
    });
  });

  it('deletes note and calls toast', async () => {
    (notesService.getNotes as jest.Mock).mockResolvedValue(mockNotes);
    (notesService.deleteNote as jest.Mock).mockResolvedValue(undefined);

    const TestDeleter = () => {
      const { handleDeleteNote } = useNotes();
      return (
        <button onClick={() => handleDeleteNote('1')} data-testid="del">
          Delete
        </button>
      );
    };

    render(
      <NotesProvider>
        <TestDeleter />
      </NotesProvider>
    );

    fireEvent.click(screen.getByTestId('del'));
    expect(notesService.deleteNote).toHaveBeenCalledWith('uid1', '1');
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Note deleted successfully',
        variant: 'default',
      });
    });
  });
});
