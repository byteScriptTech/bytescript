import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import { useNotesRedux } from '@/hooks/useNotesRedux';

import { Notes } from './index';

jest.mock('@/hooks/useNotesRedux', () => ({
  useNotesRedux: jest.fn(),
}));

jest.mock('@/hooks/useAuthRedux', () => ({
  useAuthRedux: jest.fn(() => ({ currentUser: { uid: 'user1' } })),
}));

describe('Notes Component', () => {
  let mockHandleCreateNote: jest.Mock;
  let mockHandleUpdateNote: jest.Mock;
  let mockHandleDeleteNote: jest.Mock;
  let mockSetNewNoteContent: jest.Mock;
  let mockSetEditingNote: jest.Mock;

  const getBaseProps = (overrides = {}) => ({
    notes: [],
    newNoteContent: '',
    editingNote: null,
    handleCreateNote: mockHandleCreateNote,
    handleUpdateNote: mockHandleUpdateNote,
    handleDeleteNote: mockHandleDeleteNote,
    setNewNoteContent: mockSetNewNoteContent,
    setEditingNote: mockSetEditingNote,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleCreateNote = jest.fn();
    mockHandleUpdateNote = jest.fn();
    mockHandleDeleteNote = jest.fn();
    mockSetNewNoteContent = jest.fn();
    mockSetEditingNote = jest.fn();
  });

  const renderComponent = () =>
    render(
      <>
        <Notes />
      </>
    );

  it('renders textarea and create button', () => {
    (useNotesRedux as jest.Mock).mockReturnValue(getBaseProps());
    renderComponent();

    expect(screen.getByTestId('new-note-textarea')).toBeInTheDocument();
    expect(screen.getByTestId('create-note-btn')).toBeInTheDocument();
  });

  it('shows empty state when no notes exist', () => {
    (useNotesRedux as jest.Mock).mockReturnValue(getBaseProps());
    renderComponent();

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('calls setNewNoteContent on typing', () => {
    (useNotesRedux as jest.Mock).mockReturnValue(getBaseProps());
    renderComponent();

    fireEvent.change(screen.getByTestId('new-note-textarea'), {
      target: { value: 'Hello' },
    });

    expect(mockSetNewNoteContent).toHaveBeenCalledWith('Hello');
  });

  it('creates a new note and resets input', async () => {
    mockHandleCreateNote.mockResolvedValue(undefined);

    (useNotesRedux as jest.Mock).mockReturnValue(
      getBaseProps({ newNoteContent: 'abc' })
    );

    renderComponent();

    fireEvent.click(screen.getByTestId('create-note-btn'));
    await Promise.resolve();

    expect(mockHandleCreateNote).toHaveBeenCalled();
    expect(mockSetNewNoteContent).toHaveBeenCalledWith('');
  });

  it('displays note with edit and delete buttons', () => {
    // Mock window.confirm to return true by default
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    const note = {
      id: '1',
      content: 'Test note',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (useNotesRedux as jest.Mock).mockReturnValue(getBaseProps({ notes: [note] }));
    renderComponent();

    // Test note content is displayed
    expect(screen.getByTestId('note-content')).toHaveTextContent('Test note');

    // Test delete functionality
    fireEvent.click(screen.getByTestId('delete-note-btn'));
    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this note?'
    );
    expect(mockHandleDeleteNote).toHaveBeenCalledWith('1');

    // Test edit functionality
    fireEvent.click(screen.getByTestId('edit-note-btn'));
    expect(mockSetEditingNote).toHaveBeenCalledWith(note);

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('does not delete note when confirmation is cancelled', () => {
    // Mock window.confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => false);

    const note = {
      id: '1',
      content: 'Test note',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (useNotesRedux as jest.Mock).mockReturnValue(getBaseProps({ notes: [note] }));
    renderComponent();

    // Click delete but cancel the confirmation
    fireEvent.click(screen.getByTestId('delete-note-btn'));
    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this note?'
    );
    expect(mockHandleDeleteNote).not.toHaveBeenCalled();

    // Restore original confirm
    window.confirm = originalConfirm;
  });
});
