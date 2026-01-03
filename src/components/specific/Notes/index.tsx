'use client';

import { formatDistanceToNow } from 'date-fns';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
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
import { useNotesRedux } from '@/hooks/useNotesRedux';
import { cn } from '@/lib/utils';
import { Note } from '@/store/slices/notesSlice';

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
  } = useNotesRedux();

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
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Notes</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your personal notes and reminders
            </CardDescription>
          </div>
          <Button
            onClick={handleCreate}
            size="sm"
            className="gap-1.5"
            disabled={!newNoteContent.trim()}
            data-testid="create-note-btn"
          >
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Start typing a new note..."
            className="min-h-[100px] resize-none"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCreate();
              }
            }}
            data-testid="new-note-textarea"
          />
        </div>

        <div className="space-y-4">
          {notes.length === 0 ? (
            <div
              className="text-center p-8 rounded-lg border border-dashed border-border"
              data-testid="empty-state"
            >
              <p className="text-muted-foreground">
                No notes yet. Start by adding your first note above!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    'group relative p-4 rounded-lg border transition-colors',
                    'hover:bg-accent/50',
                    editingNote?.id === note.id &&
                      'ring-2 ring-ring ring-offset-2'
                  )}
                >
                  {editingNote?.id === note.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editingNote.content}
                        onChange={(e) =>
                          setEditingNote((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  content: e.target.value,
                                  updatedAt: new Date(),
                                }
                              : null
                          )
                        }
                        className="min-h-[120px] text-base"
                        data-testid="edit-note-textarea"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingNote(null)}
                          data-testid="cancel-edit-btn"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(note)}
                          data-testid="save-note-btn"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p
                        className="whitespace-pre-wrap text-foreground"
                        data-testid="note-content"
                      >
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Last edited:{' '}
                          {formatDistanceToNow(new Date(note.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingNote(note)}
                            data-testid="edit-note-btn"
                            title="Edit note"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit note</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => {
                              if (
                                confirm(
                                  'Are you sure you want to delete this note?'
                                )
                              ) {
                                handleDeleteNote(note.id);
                              }
                            }}
                            data-testid="delete-note-btn"
                            title="Delete note"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete note</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
