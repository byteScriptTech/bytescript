'use client';

import { formatDistanceToNow } from 'date-fns';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useNotes } from '@/context/NotesContext';
import type { EditableNote } from '@/context/NotesContext';
import { Note } from '@/lib/firebase/notes';

export function Notes(): React.JSX.Element {
  const {
    notes,
    newNoteContent,
    editingNote,
    handleCreateNote,
    handleUpdateNote,
    handleDeleteNote,
    setNewNoteContent,
    setEditingNote,
  } = useNotes();

  const handleCreate = async () => {
    if (!newNoteContent.trim()) return;
    await handleCreateNote();
    setNewNoteContent('');
  };

  const handleUpdate = async (note: Note) => {
    if (!editingNote) return;
    await handleUpdateNote(note);
    setEditingNote(null);
  };

  return (
    <Card x-chunk="dashboard-07-chunk-1" className="bg-white rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Notes
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Quick notes and reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4 space-y-4">
        <div className="flex flex-col gap-2 w-full">
          <Textarea
            placeholder="Write a new note..."
            className="w-full"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            data-testid="new-note-textarea"
          />
          <Button
            onClick={handleCreate}
            className="p-2"
            data-testid="create-note-btn"
          >
            <Plus className="h-4 text-white" />
          </Button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center text-gray-500" data-testid="empty-state">
            No notes available. Start by adding one!
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`bg-gray-100 p-3 rounded-md shadow-sm transition-colors ${
                  editingNote?.id === note.id
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-200'
                }`}
              >
                {editingNote?.id === note.id ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={note.content}
                      onChange={(e) =>
                        setEditingNote((prev: EditableNote | null) =>
                          prev
                            ? {
                                ...prev,
                                content: e.target.value,
                                updatedAt: new Date(),
                              }
                            : null
                        )
                      }
                      className="min-h-[100px]"
                      data-testid="edit-note-textarea"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdate(note)}
                        className="p-2 rounded-full bg-blue-50 hover:bg-blue-100"
                        data-testid="save-note-btn"
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        onClick={() => setEditingNote(null)}
                        className="p-2 rounded-full bg-gray-50 hover:bg-gray-100"
                        data-testid="cancel-edit-btn"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p
                      className="text-gray-700 text-sm font-medium"
                      data-testid="note-content"
                    >
                      &quot;{note.content}&quot;
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Last edited:{' '}
                        {formatDistanceToNow(new Date(note.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingNote(note)}
                          className="p-2 rounded-full bg-blue-50 hover:bg-blue"
                          data-testid="edit-note-btn"
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-2 rounded-full bg-red-600 hover:bg-red-800"
                          data-testid="delete-note-btn"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
