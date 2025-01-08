import React from 'react';
import { useStore } from '../context/StoreContext';
import { X } from 'lucide-react';
import { SessionNote } from '../types';

interface SessionFormProps {
  onClose: () => void;
  initialData?: Partial<SessionNote>;
}

const SessionForm: React.FC<SessionFormProps> = ({ onClose, initialData }) => {
  const { addSession, updateSession, tags } = useStore();
  const [formData, setFormData] = React.useState({
    title: initialData?.title || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    location: initialData?.location || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    tags: initialData?.tags || [],
    images: initialData?.images || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData?.id) {
      updateSession(initialData.id, formData);
    } else {
      addSession(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl border border-primary/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-[MedievalSharp] text-primary">
            {initialData ? 'Edit Session' : 'New Session'}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-primary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-black/30 border border-primary/20 rounded-lg px-4 py-2 text-gray-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full bg-black/30 border border-primary/20 rounded-lg px-4 py-2 text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-black/30 border border-primary/20 rounded-lg px-4 py-2 text-gray-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Summary</label>
            <textarea
              value={formData.summary}
              onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              className="w-full bg-black/30 border border-primary/20 rounded-lg px-4 py-2 text-gray-200 h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
            <textarea
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full bg-black/30 border border-primary/20 rounded-lg px-4 py-2 text-gray-200 h-48"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      tags: prev.tags.includes(tag.name)
                        ? prev.tags.filter((t: string) => t !== tag.name)
                        : [...prev.tags, tag.name]
                    }));
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.tags.includes(tag.name)
                      ? 'bg-primary/20 border-primary'
                      : 'bg-black/30 border-primary/20'
                  } border`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              {initialData ? 'Update' : 'Create'} Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionForm;