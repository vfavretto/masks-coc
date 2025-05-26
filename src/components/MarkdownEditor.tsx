import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Edit3, Bold, Italic, List, Link } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  className?: string;
  readOnly?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your text here...",
  label,
  rows = 6,
  className = "",
  readOnly = false
}) => {
  const [isPreview, setIsPreview] = useState(readOnly);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = '') => {
    if (readOnly || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Se for readOnly, sempre mostrar preview
  const showPreview = readOnly || isPreview;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-gray-300 mb-2">{label}</label>
      )}
      
      {/* Toolbar - só mostrar se não for readOnly */}
      {!readOnly && (
        <div className="flex items-center gap-2 p-2 bg-black/20 border border-primary/10 rounded-t-lg">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`p-2 rounded transition-colors ${
              isPreview 
                ? 'bg-primary/20 text-primary' 
                : 'text-gray-400 hover:text-primary hover:bg-primary/10'
            }`}
            title={isPreview ? "Edit" : "Preview"}
          >
            {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          {!isPreview && (
            <>
              <div className="w-px h-6 bg-gray-600" />
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*')}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('\n- ')}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                title="List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('[', '](url)')}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                title="Link"
              >
                <Link className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Editor/Preview */}
      <div className={`border border-primary/20 bg-black/30 ${readOnly ? 'rounded-lg' : 'rounded-b-lg'}`}>
        {showPreview ? (
          <div className="p-4 min-h-[150px] prose prose-invert prose-primary max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-3 text-gray-300 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="text-primary font-semibold">{children}</strong>,
                em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-3 text-gray-300 last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-3 text-gray-300 last:mb-0">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ children, href }) => (
                  <a href={href} className="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                h1: ({ children }) => <h1 className="text-2xl font-bold text-primary mb-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold text-primary mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-medium text-primary mb-2">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/50 pl-4 italic text-gray-400 mb-3">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-800 px-2 py-1 rounded text-sm text-gray-200">
                    {children}
                  </code>
                ),
              }}
            >
              {value || (readOnly ? '*No content*' : '*No content to preview*')}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-transparent border-none rounded-b-lg p-4 text-white resize-none focus:outline-none focus:ring-0"
            readOnly={readOnly}
          />
        )}
      </div>
      
      {!readOnly && !isPreview && (
        <div className="text-xs text-gray-500 mt-1">
          Supports **bold**, *italic*, lists, and [links](url). Use the preview button to see formatted text.
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor; 