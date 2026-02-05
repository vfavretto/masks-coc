import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Eye, EyeOff, Tag, BookOpen, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotesAPI, Note } from '@/services/userApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await NotesAPI.getMyNotes();
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setVisibility('private');
    setTags('');
    setEditingNote(null);
  };

  const openNewNote = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setVisibility(note.visibility);
    setTags(note.tags.join(', '));
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        visibility,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      if (editingNote) {
        const updated = await NotesAPI.updateNote(editingNote.id, noteData);
        setNotes(notes.map(n => n.id === updated.id ? updated : n));
      } else {
        const created = await NotesAPI.createNote(noteData);
        setNotes([created, ...notes]);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;

    try {
      await NotesAPI.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-[MedievalSharp] text-primary">Investigation Notes</h1>
          <p className="text-muted-foreground font-serif italic mt-1">
            "Document the unknowable, before it consumes you."
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewNote} className="gap-2 font-[MedievalSharp]">
              <Plus className="w-4 h-4" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0c0c0c] border-primary/30 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-[MedievalSharp] text-primary">
                {editingNote ? 'Edit Note' : 'New Note'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                  className="bg-black/50 border-primary/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your notes here..."
                  className="bg-black/50 border-primary/30 min-h-[200px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Visibility</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={visibility === 'private' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVisibility('private')}
                      className="flex-1 gap-2"
                    >
                      <EyeOff className="w-4 h-4" />
                      Private
                    </Button>
                    <Button
                      type="button"
                      variant={visibility === 'public' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVisibility('public')}
                      className="flex-1 gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Public
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Tags (comma-separated)</label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="clue, cairo, artifact"
                    className="bg-black/50 border-primary/30"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-primary/10">
                <Button onClick={handleSave} disabled={isSaving} className="flex-1 gap-2">
                  {isSaving ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingNote ? 'Update Note' : 'Create Note'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notes.length === 0 ? (
        <Card className="bg-black/40 border-primary/20">
          <CardContent className="py-12 text-center">
            <BookOpen className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-xl font-[MedievalSharp] text-muted-foreground mb-2">No Notes Yet</h3>
            <p className="text-muted-foreground/70 font-serif">
              Start documenting your investigation findings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="bg-black/50 border-primary/20 hover:border-primary/40 transition-colors group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-[MedievalSharp] text-primary line-clamp-1">
                    {note.title}
                  </CardTitle>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditNote(note)}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => handleDelete(note.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {note.visibility === 'private' ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  <span>{formatDate(note.createdAt)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-serif text-sm line-clamp-3 mb-3">
                  {note.content}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="secondary" className="text-[10px]">
                        +{note.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
