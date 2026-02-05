import { SessionFormData, Clue, Item } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save } from 'lucide-react';
import MarkdownEditor from '@/components/MarkdownEditor';

interface SessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: SessionFormData;
  editingSession: { id: string; title: string } | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  updateFormField: <K extends keyof SessionFormData>(field: K, value: SessionFormData[K]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  addClue: () => void;
  updateClue: (index: number, field: keyof Clue, value: string) => void;
  removeClue: (index: number) => void;
  addItem: () => void;
  updateItem: (index: number, field: keyof Item, value: string) => void;
  removeItem: (index: number) => void;
}

export function SessionForm({
  isOpen,
  onClose,
  formData,
  editingSession,
  loading,
  onSubmit,
  updateFormField,
  addTag,
  removeTag,
  addClue,
  updateClue,
  removeClue,
  addItem,
  updateItem,
  removeItem,
}: SessionFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">
            {editingSession ? `Edit ${editingSession.title}` : 'Create New Session'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-foreground mb-2">Title</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormField('title', e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-foreground mb-2">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => updateFormField('date', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">Location</label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => updateFormField('location', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <MarkdownEditor
              value={formData.summary}
              onChange={(value) => updateFormField('summary', value)}
              placeholder="Brief summary of the session..."
              label="Summary"
              rows={4}
            />
          </div>

          <div>
            <MarkdownEditor
              value={formData.details}
              onChange={(value) => updateFormField('details', value)}
              placeholder="Detailed notes about the session..."
              label="Details"
              rows={8}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-foreground mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="default" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-destructive hover:text-destructive/80"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add tag..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const tag = e.currentTarget.value.trim();
                    if (tag) {
                      addTag(tag);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  const tag = input.value.trim();
                  if (tag) {
                    addTag(tag);
                    input.value = '';
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-foreground mb-2">Image URL (optional)</label>
            <Input
              type="text"
              value={formData.images[0] || ''}
              onChange={(e) => updateFormField('images', e.target.value ? [e.target.value] : [])}
              placeholder="https://..."
            />
          </div>

          {/* Clues Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-primary">Discovered Clues</h3>
              <Button type="button" variant="outline" size="sm" onClick={addClue}>
                <Plus className="w-4 h-4 mr-2" />
                Add Clue
              </Button>
            </div>
            
            {formData.clues.map((clue, index) => (
              <div key={clue.id || index} className="mb-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="grid grid-cols-12 gap-3 mb-3">
                  <div className="col-span-6">
                    <label className="block text-muted-foreground text-sm mb-1">Name *</label>
                    <Input
                      type="text"
                      value={clue.name}
                      onChange={(e) => updateClue(index, 'name', e.target.value)}
                      placeholder="Clue name"
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-muted-foreground text-sm mb-1">Type</label>
                    <select
                      value={clue.type}
                      onChange={(e) => updateClue(index, 'type', e.target.value)}
                      className="w-full bg-input border border-border rounded-md p-2 text-foreground h-10"
                      required
                    >
                      <option value="evidence">Evidence</option>
                      <option value="document">Document</option>
                      <option value="witness">Witness</option>
                      <option value="location">Location</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-muted-foreground text-sm mb-1">Tag</label>
                    <Input
                      type="text"
                      value={clue.tag || ''}
                      onChange={(e) => updateClue(index, 'tag', e.target.value)}
                      placeholder="Tag"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeClue(index)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-muted-foreground text-sm mb-1">Location</label>
                    <Input
                      type="text"
                      value={clue.location || ''}
                      onChange={(e) => updateClue(index, 'location', e.target.value)}
                      placeholder="Where was it found?"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground text-sm mb-1">Image URL</label>
                    <Input
                      type="text"
                      value={clue.image || ''}
                      onChange={(e) => updateClue(index, 'image', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <MarkdownEditor
                    value={clue.description}
                    onChange={(value) => updateClue(index, 'description', value)}
                    placeholder="Describe the clue..."
                    label="Description"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Items Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-primary">Collected Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            {formData.items.map((item, index) => (
              <div key={item.id || index} className="mb-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="grid grid-cols-12 gap-3 mb-3">
                  <div className="col-span-5">
                    <label className="block text-muted-foreground text-sm mb-1">Name *</label>
                    <Input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="Item name"
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-muted-foreground text-sm mb-1">Type</label>
                    <select
                      value={item.type}
                      onChange={(e) => updateItem(index, 'type', e.target.value)}
                      className="w-full bg-input border border-border rounded-md p-2 text-foreground h-10"
                      required
                    >
                      <option value="weapon">Weapon</option>
                      <option value="tool">Tool</option>
                      <option value="book">Book</option>
                      <option value="key">Key</option>
                      <option value="artifact">Artifact</option>
                    </select>
                  </div>
                  <div className="col-span-4 flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="hover:text-destructive ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <MarkdownEditor
                    value={item.description}
                    onChange={(value) => updateItem(index, 'description', value)}
                    placeholder="Describe the item..."
                    label="Description"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : editingSession ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
